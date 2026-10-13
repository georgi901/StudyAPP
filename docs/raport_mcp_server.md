# Report on Using AI to Develop the MCP Server Component

During the project, we used AI as a support tool while developing the **MCP Server** component. This component connects *StudyAPP* to an AI agent and gives the agent access to selected backend capabilities through a well-defined set of tools.

## 1. Understanding the Model Context Protocol

AI helped us understand the **Model Context Protocol** and how it can be integrated into a web application. MCP exposes selected application functions to an AI agent, so the agent can interact with the application through controlled interfaces rather than unrestricted backend access.

## 2. Separating Responsibilities

The MCP server is divided into two main components:

- `viewer_server.py` handles read-only operations such as listing folders, reading files and viewing flashcard decks.
- `creator_server.py` handles write operations such as creating files, folders and flashcards.

This separation improves organization, makes permissions easier to reason about and keeps the component maintainable.

## 3. Exposing Functions as MCP Tools

Functions are marked with the `@mcp.tool()` decorator, which makes them available to the AI agent. Each tool represents one explicit action that the agent is allowed to perform. The agent can therefore call only the operations exposed by the MCP server.

The MCP servers communicate with the Django backend through HTTP requests to existing API endpoints. The asynchronous `httpx` library is used for these requests. This design keeps the main business logic in the backend and avoids duplicating data storage in the MCP layer.

## 4. The Role of `main.py`

The `main.py` module combines the `viewer` and `creator` servers into a FastAPI application and exposes them through separate endpoints. It acts as an **aggregator**, bringing multiple MCP servers together behind a single access point.

The component uses **SSE** (*Server-Sent Events*) as its transport. SSE enables communication over HTTP and makes the MCP server easier to connect to external tools and AI platforms.

## 5. The Role of ngrok in Testing

Because the MCP server runs locally, external services cannot access it directly. Ngrok exposes the local server through a temporary public URL, which is useful for testing MCP endpoints and verifying external access.

## 6. Documentation and Development Support

AI was also used to document the component and explain how its files, tools and communication flow fit into the application architecture. It helped us understand new concepts faster, review the organization of the implementation and write clearer technical documentation.

AI did not replace the development process. It was used as a support tool for clarification, organization and documentation.

## Conclusion

The resulting MCP component allows *StudyAPP* to communicate with an AI agent through well-defined tools. The agent can access or modify selected study resources while the core business logic remains in the Django backend.
