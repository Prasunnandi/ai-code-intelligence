from langchain_huggingface import HuggingFaceEmbeddings
import chromadb
from chromadb.config import Settings

docs = [
    "OWASP Top 10: Injection. Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query.",
    "OWASP Top 10: Broken Authentication. Application functions related to authentication and session management are often implemented incorrectly.",
    "OWASP Top 10: Sensitive Data Exposure. Many web applications and APIs do not properly protect sensitive data, such as financial, healthcare, and PII.",
    "Secure Coding Guideline: Do not hardcode passwords or secrets in the source code.",
    "Secure Coding Guideline: Avoid using eval() or exec() with untrusted user input."
]

def seed():
    client = chromadb.Client()
    collection = client.get_or_create_collection("secure_coding")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    docs_embeddings = embeddings.embed_documents(docs)
    
    ids = [str(i) for i in range(len(docs))]
    collection.add(
        embeddings=docs_embeddings,
        documents=docs,
        ids=ids
    )
    print("Seeded RAG knowledge base.")

if __name__ == "__main__":
    seed()
