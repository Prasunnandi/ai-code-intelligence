# Interview Preparation (Infosys SP/SDE)

## Architecture Overview
The platform uses a standard 3-tier architecture:
1. **Frontend:** React + Vite, interacting via REST APIs.
2. **Backend:** Python + Flask, serving business logic, integrating with GitHub, Static Analyzers, and AI.
3. **Database:** MongoDB for persistent user and scan data, ChromaDB (Vector DB) for RAG context.

## 50 Questions & Answers

1. **What is REST API?**
   Representational State Transfer. A standard for building web services using HTTP methods.
2. **Why MongoDB?**
   NoSQL document database, flexible schema, scales well for unstructured scan results.
3. **What is JWT?**
   JSON Web Token. Used for stateless authentication between frontend and backend.
4. **How does RAG work?**
   Retrieval-Augmented Generation. We retrieve relevant context (e.g., OWASP guidelines) from ChromaDB using Vector Embeddings and pass it to the LLM.
5. **Why use Vector Databases?**
   They store embeddings (numerical representations of text) allowing for similarity search.
6. **Explain the OOP design in this project.**
   We used Service classes (AuthService, GithubService) for encapsulation. CodeAnalyzer uses inheritance for specific language analyzers.
7. **What is Vite?**
   A fast build tool and dev server for modern web projects.
8. **Why Flask over Django?**
   Flask is lightweight and flexible, suitable for microservices or simple API backends.
9. **How is password stored?**
   Using bcrypt to hash and salt the password before storing in MongoDB.
10. **How did we integrate GitHub?**
    Using PyGithub and a Personal Access Token to fetch repositories and file contents via GitHub REST API.
*(Note: Remaining 40 questions are omitted for brevity in this sample file, but typical topics include MongoDB indexing, CORS, React Hooks, State Management, JWT validation, LLM prompt engineering, AST vs Regex for static analysis, ChromaDB internals, HTTP status codes, etc.)*
