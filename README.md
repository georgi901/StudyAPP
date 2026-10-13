# StudyAPP

**StudyAPP** is a web platform that brings together the tools students need for effective learning. It combines a Pomodoro timer with tasks and statistics, flashcards with personalized SVD-based recommendations, a file module with live Markdown editing and at-rest encryption, collaborative group study spaces and an integrated AI assistant that can read study materials, generate flashcards and summaries, and remember each student's learning preferences between sessions.

> Project developed by **Cristian Visan**, **Ioana Caramida** and **Georgiana Valentina Spataru**.

---

## Architecture

![Architecture diagram](docs/diagrama_arhitectura.png)

The application follows a client-server architecture with a REST API and an AI orchestration layer based on n8n and MCP. The frontend communicates with the backend through HTTP/JSON, while AI requests are sent to an n8n workflow through a webhook.

---

## Frontend

**Stack:** React 19, Vite, React Router 7, Vitest, ESLint

The frontend is a single-page application that communicates with the backend exclusively through HTTP/JSON. The Djoser authentication token is sent in the `Authorization` header for every request. Pomodoro timer state persists across page navigation through React Context.

---

## Backend

**Stack:** Django 6, Django REST Framework, Djoser + Token Auth, SQLite (development) / PostgreSQL (production)

**API endpoints:** `/api/auth/`, `/api/pomodoro/`, `/api/flashcards/`, `/api/filesystem/`, `/api/groups/`, `/api/activity/`, `/api/agents/`

### Database

![Database diagram](docs/diagrama_baza_de_date.png)

Tables are organized into functional modules (Pomodoro, Flashcards, FileTree, Groups and AI Agents), all connected to the central `User` table. The main relationships are OneToMany (User → sessions, decks and folders) and ManyToMany through join tables (`GroupDeck`, `GroupFile` and `UserGroup`).

---

## AI Agents

### n8n Workflow

![n8n workflow](docs/workflow_n8n.png)

The frontend sends the user's message to n8n through a webhook running in Docker on port 5678. The workflow is: Webhook → Edit Fields → AI Agent → Respond to Webhook. The agent uses an LLM through OpenRouter, persistent PostgreSQL memory and MCP tools through a specialized educational content sub-agent.

### AI Agent Prompts

The n8n workflow uses two custom agents:

**Main agent (Teaching Assistant)** receives the user's message and decides how to respond. It classifies intent (factual vs. conceptual), adapts explanations using `AgentMemory`, delegates content creation to the sub-agent, reads the user's files and decks through the Viewer Server, evaluates flashcard answers and records learning performance.

**Content Generator sub-agent** receives instructions from the main agent and creates educational content such as flashcard decks, individual cards and study files. It can infer missing titles, descriptions and questions from the requested topic and uses the Creator Server tools.

### MCP Servers (FastMCP, port 8001)

Two servers expose tools through the Model Context Protocol:

**Viewer Server** (read-only): `list_folders`, `read_file`, `view_deck`, `update_agent_memory`

**Creator Server** (write operations): `create_flashcard`, `create_folder`, `create_file`

The servers communicate with the backend through asynchronous `httpx` requests to existing endpoints. They do not store data separately; they act as an intermediary between the AI agent and the application API. `main.py` aggregates both servers into a FastAPI application exposed through SSE (Server-Sent Events). The personal chatbot accesses the user's resources, while the group chatbot is restricted to group resources.

### Token System

Users earn tokens through study activity (+1 point per correct flashcard answer and +1 point per completed Pomodoro cycle) and spend them on AI actions.

```text
available tokens = 2500 + points + (focus_seconds / 60) - consumed_tokens
```

`AgentMemory` stores AI observations about each student between sessions, including strong subjects, difficult subjects, notes and token consumption.

---

## Design Patterns

### Layered Architecture (Service Layer + Repository)

![Backend pattern](docs/diagrama_backend_pattern.png)

The backend separates responsibilities into layers:

```text
URL Router → View → Serializer → Service / Selector → Model → Database
```

Views coordinate request flow, serializers validate and convert data, services contain write logic, selectors contain read queries and models define the database schema through Django ORM.

### Other Patterns

- **Token-based Authentication:** every request includes an authentication token in the header.
- **Observer (React Context):** Pomodoro state persists across navigation and consumer components update automatically.
- **Singleton (n8n Webhook):** one webhook endpoint handles chatbot requests and routes them to the appropriate context.
- **MCP Tool Pattern:** AI agents access application data only through explicitly defined read and write tools.

---

## Development Process

### Source Control

The project uses feature and bug-fix branches with pull requests and review before merging into `main`. Branches follow conventions such as `feat/...`, `fix/...` and issue-related names.

### Automated Tests

GitHub Actions runs parallel jobs on every push and pull request to `main`:

- **Linting:** Ruff (Python) and ESLint (JavaScript)
- **Backend:** separate pytest suites for authentication, flashcards, groups, filesystem and Pomodoro/activity
- **Frontend:** Vitest tests for hooks, components and utilities

### Bug Tracking

Bugs were reported as GitHub Issues, implemented in dedicated branches and resolved through pull requests. Examples include the AI webhook not triggering for flashcard answers, incorrect token calculations, group file-pool issues and missing token consumption for MCP calls.

---

## Use of AI During Development

AI tools, including ChatGPT and Claude, were used as development support rather than as a replacement for implementation. Generated code was reviewed and adapted manually to the project's context.

The main areas of use were:

- understanding MCP, SSE, asynchronous HTTP communication, n8n configuration and SVD recommendations;
- guided learning for the Rust encryption component;
- reviewing architectural decisions such as Viewer/Creator and Services/Selectors separation;
- debugging Django tracebacks and refactoring logic into services and selectors;
- generating initial serializers, views, tests and AI-agent prompts;
- writing clear technical documentation.

---

## Team Contributions

### Cristian Visan

- **FileTree:** folder and file CRUD, live Markdown editor with preview, Markdown-to-PDF conversion and ChaCha20-Poly1305 at-rest encryption;
- **Flashcard recommendations:** SVD applied to daily deck success rates over the previous 90 days;
- **Groups:** group interface, shared flashcard pool and shared file pool;
- **n8n workflow:** AI-agent integration, Docker workflow configuration and study-focused prompt;
- **Token system:** token consumption and token-formula fixes.

### Ioana Caramida

- **Authentication:** Djoser token authentication, protected routes and authentication error handling;
- **Flashcards:** deck and card creation, flip-based review, known/unknown marking and session persistence;
- **Groups (backend):** `UserGroup`, `GroupDeck` and `GroupFile` models, permissions and resource-sharing logic;
- **MCP servers:** `viewer_server.py` and `creator_server.py`, HTTP communication through `httpx` and SSE exposure;
- **Automated tests and CI/CD:** GitHub Actions, pytest, Vitest, Ruff and ESLint.

### Georgiana Valentina Spataru

- **Pomodoro:** configurable timer, task management, browser notifications, session history, cross-page persistence through React Context, backend models and API;
- **Dashboard:** personalized greeting, productivity statistics, shortcuts and monthly goals;
- **Activity and tokens:** monthly activity aggregation, token calculations, daily trends and personal/group reports;
- **Global chatbot UI:** resizable and collapsible chatbot panel available throughout the application, with real-time token-budget display and group-resource restrictions;
- **Home page:** animated SVG logo and module summary cards.

All three team members contributed to module integration, database structure and testing.

---

## Running the Project

```bash
# Backend
source .venv/bin/activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver 8080

# Frontend
cd frontend
npm install
npm run dev

# MCP (optional, required for AI tools)
cd backend/MCP_server
python viewer_server.py
python creator_server.py

# n8n (optional, required for the chatbot)
cd Docker/n8n
docker compose up -d
```
