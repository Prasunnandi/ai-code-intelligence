import os
import jwt
import bcrypt
import re
import datetime
from pymongo import MongoClient
import requests
from github import Github
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
import chromadb
from chromadb.config import Settings

# Auth
class AuthService:
    def __init__(self, db, secret_key="secret"):
        self.db = db
        self.secret_key = secret_key

    def register(self, username, password):
        if self.db.users.find_one({"username": username}):
            return {"error": "User already exists"}, 400
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.db.users.insert_one({"username": username, "password": hashed})
        return {"message": "User registered successfully"}, 201

    def login(self, username, password):
        user = self.db.users.find_one({"username": username})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            token = jwt.encode({"user": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, self.secret_key, algorithm="HS256")
            return {"token": token}, 200
        return {"error": "Invalid credentials"}, 401

# GitHub
class GithubService:
    def __init__(self, token):
        self.g = Github(token)
    
    def get_repos(self):
        return [{"name": r.name, "full_name": r.full_name} for r in self.g.get_user().get_repos()]
    
    def get_files(self, repo_name, branch="main"):
        repo = self.g.get_repo(repo_name)
        contents = repo.get_contents("")
        files = []
        while contents:
            file_content = contents.pop(0)
            if file_content.type == "dir":
                contents.extend(repo.get_contents(file_content.path))
            else:
                files.append(file_content.path)
        return files

    def get_file_content(self, repo_name, path):
        repo = self.g.get_repo(repo_name)
        return repo.get_contents(path).decoded_content.decode('utf-8')

# Static Analysis
class CodeAnalyzer:
    def analyze(self, code, filename):
        pass

class PythonAnalyzer(CodeAnalyzer):
    def analyze(self, code, filename):
        findings = []
        if re.search(r'password\s*=\s*[\'"][^\'"]+[\'"]', code):
            findings.append({"type": "secret", "message": "Hardcoded password found"})
        if re.search(r'exec\(', code):
            findings.append({"type": "bug", "message": "Avoid using exec()"})
        return findings

class JSAnalyzer(CodeAnalyzer):
    def analyze(self, code, filename):
        findings = []
        if re.search(r'console\.log', code):
            findings.append({"type": "smell", "message": "console.log left in code"})
        return findings

def get_analyzer(filename):
    if filename.endswith(".py"):
        return PythonAnalyzer()
    elif filename.endswith(".js"):
        return JSAnalyzer()
    return CodeAnalyzer()

# RAG Service
class RAGService:
    def __init__(self):
        self.client = chromadb.Client()
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.collection = self.client.get_or_create_collection("secure_coding")

    def query(self, text):
        results = self.collection.query(query_embeddings=self.embeddings.embed_documents([text]), n_results=1)
        if results['documents'] and results['documents'][0]:
            return results['documents'][0][0]
        return ""

# AI Review Service
class AIReviewService:
    def __init__(self, groq_api_key):
        self.llm = ChatGroq(temperature=0, groq_api_key=groq_api_key, model_name="llama3-8b-8192")
        self.rag = RAGService()

    def review(self, code, findings):
        context = self.rag.query("secure coding practices for this code")
        prompt = f"Review this code.\nFindings: {findings}\nGuidelines: {context}\nCode:\n{code}\nReturn JSON with 'summary', 'severity', 'suggestions'."
        res = self.llm.invoke(prompt)
        return res.content
