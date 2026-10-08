from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import functools
import jwt
from services import AuthService, GithubService, get_analyzer, AIReviewService

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['code-intel']

SECRET_KEY = "secret"
auth_service = AuthService(db, SECRET_KEY)
groq_key = os.environ.get("GROQ_API_KEY", "")
ai_service = AIReviewService(groq_key) if groq_key else None

def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    res, code = auth_service.register(data.get('username'), data.get('password'))
    return jsonify(res), code

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    res, code = auth_service.login(data.get('username'), data.get('password'))
    return jsonify(res), code

@app.route('/api/github/repositories', methods=['GET'])
@token_required
def get_repos(current_user):
    token = request.headers.get('Github-Token')
    if not token: return jsonify({"error": "No github token"}), 400
    gh = GithubService(token)
    return jsonify(gh.get_repos()), 200

@app.route('/api/github/files', methods=['GET'])
@token_required
def get_files(current_user):
    token = request.headers.get('Github-Token')
    repo = request.args.get('repo')
    gh = GithubService(token)
    return jsonify(gh.get_files(repo)), 200

@app.route('/api/scans', methods=['POST'])
@token_required
def scan(current_user):
    token = request.headers.get('Github-Token')
    data = request.json
    repo = data.get('repo')
    path = data.get('path')
    
    gh = GithubService(token)
    code = gh.get_file_content(repo, path)
    
    analyzer = get_analyzer(path)
    findings = analyzer.analyze(code, path)
    
    ai_review = {}
    if ai_service:
        try:
            ai_review = ai_service.review(code, findings)
        except Exception as e:
            ai_review = {"error": str(e)}
            
    scan_result = {
        "user": current_user,
        "repo": repo,
        "path": path,
        "findings": findings,
        "ai_review": ai_review
    }
    db.scans.insert_one(scan_result)
    scan_result['_id'] = str(scan_result['_id'])
    
    return jsonify(scan_result), 200

@app.route('/api/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    scans = list(db.scans.find({"user": current_user}))
    for s in scans:
        s['_id'] = str(s['_id'])
    return jsonify(scans), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
