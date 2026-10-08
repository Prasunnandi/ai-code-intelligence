# 🧠 AI Code Intelligence Assistant

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Inference_API-FFD21E?style=for-the-badge&logo=huggingface)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A professional full-stack web application that leverages Hugging Face LLMs to automatically review Pull Requests, catch bugs, and chat with developers about their code.**

[🚀 Live Demo](#) · [📖 Documentation](#architecture) · [🐛 Report Bug](https://github.com/Prasunnandi/ai-code-intelligence/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Automated PR Review** | Paste a Git diff to instantly receive a comprehensive code review focusing on bugs, vulnerabilities, and code quality. |
| 💬 **Interactive Code Chat** | Ask follow-up questions about the code diff and receive context-aware answers from the AI. |
| 🚀 **Hugging Face Inference API** | Powered by `Mistral-7B-Instruct-v0.2` via the free Hugging Face API — no costly OpenAI keys required. |
| 🛡️ **Network Resilient** | Gracefully handles local DNS blocks with explicit error messages guiding users to cloud deployment. |
| 💻 **Sleek Developer UI** | A dark-themed, professional web interface with dedicated chat layout and diff viewer. |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (HTML/JS)                    │
│          Dark Theme · Diff Viewer · Chat Interface          │
└───────────────────────────┬─────────────────────────────────┘
                            │ (REST API)
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────┐                       ┌────────────────┐
│ POST /api/review │                    │ POST /api/chat │
└──────┬────────┘                       └───────┬────────┘
       │                                        │
       └───────────────────┬────────────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │       Node.js Backend       │
            │   (Express, CORS, Axios)    │
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │   Hugging Face API (Cloud)  │
            │ Mistral-7B-Instruct-v0.2    │
            └─────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- A free [Hugging Face](https://huggingface.co) account and API Token

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Prasunnandi/ai-code-intelligence.git
cd ai-code-intelligence

# 2. Setup Backend
cd backend
npm install

# 3. Add Hugging Face Token
# Create a .env file inside the /backend directory:
echo "HF_TOKEN=hf_your_token_here" > .env

# 4. Start the Server
node server.js
```

Then open `frontend/index.html` in your web browser.

> ⚠️ **Notice for Local Testing:** If your local ISP or corporate network blocks access to `api-inference.huggingface.co` (common `ENOTFOUND` error), you will need to deploy the backend to a cloud provider to use the app.

---

## 📦 Project Structure

```text
ai-code-intelligence/
│
├── frontend/
│   ├── index.html          # Main UI layout
│   ├── styles.css          # Dark-mode styling and chat UI
│   └── app.js              # Frontend logic and API calls
│
├── backend/
│   ├── server.js           # Express server and API routes
│   ├── llmService.js       # Hugging Face integration logic
│   ├── package.json        # Node.js dependencies
│   └── .env.example        # Environment variables template
│
└── README.md
```

---

## ☁️ Deployment Guide

Because local networks sometimes block free AI APIs, deploying the backend to a free cloud service is highly recommended. 

### Deploying the Backend (Render)
1. Go to [Render.com](https://render.com) and sign in.
2. Click **New** → **Web Service** and link this GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Start Command** to `node server.js`.
5. Under Environment Variables, add your `HF_TOKEN`.
6. Click Deploy.

### Updating the Frontend
Once Render gives you a live backend URL (e.g., `https://ai-code-backend.onrender.com`):
1. Open `frontend/app.js`
2. Change the fetch URLs to point to your new backend:
   ```javascript
   const response = await fetch('https://ai-code-backend.onrender.com/api/review', { ... });
   ```
3. You can now host the `frontend/` folder anywhere (GitHub Pages, Netlify, Vercel) for a complete full-stack deployment!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Prasunnandi/ai-code-intelligence/issues).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Made with ❤️ using Node.js, Express & Hugging Face
</div>
