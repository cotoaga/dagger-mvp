# DAGGER Mini MVP 🗡️

Welcome to **DAGGER**—the Directed Acyclic Graph Generated Enlightenment Repository that transforms linear LLM chats into a navigable, multidimensional thought-space. Think of it as a web-browser for AI conversations, where you can branch subtopics, reconnect ideas, and manage complexity like a pro.

## 🌟 Live Demo

Try DAGGER now on Vercel: https://dagger-mvp.vercel.app/

For the latest updates, detailed documentation, and ways to contribute, visit our [Project Hub](INSERT NOTION URL HERE).

## 🚀 What is DAGGER?

DAGGER is a visual interface for creating and navigating AI conversations as a directed acyclic graph. Instead of a linear chat history, DAGGER lets you:

- Create main thread nodes that flow vertically (with the "+" button)
- Branch into sub-threads for exploring tangents (with the "#" button)
- Delete nodes and their descendants (with the "-" button)
- Eventually integrate with multiple LLMs for dynamic responses

## 🛠️ Technical Architecture

DAGGER follows a clean Model-View-Controller (MVC) architecture:

- **Models**: Data structures for nodes, edges, and graph relationships
- **Views**: Visualization with Cytoscape.js and HTML overlays
- **Controllers**: Layout management, event handling, and state persistence

## 🔧 Getting Started Locally

### Prerequisites

- A modern web browser
- Python 3 (for local server)
- Node.js and npm (for dependencies)

### Setup

1. Clone the repo:
    
    ```bash
    [ ]
    
    bash
    git clone https://github.com/cotoaga/dagger-mvp.git
    cd dagger-mvp
    
    ```
    
2. Install dependencies:
    
    ```bash
    [ ]
    
    bash
    npm install
    
    ```
    
3. Run locally:
    
    ```bash
    [ ]
    
    bash
    python3 -m http.server 8000
    
    ```
    
4. Open [http://localhost:8000](http://localhost:8000/) in your browser

## 📋 Features

- **MVC Architecture**: Clean separation of concerns for better maintainability
- **Dynamic Node Creation**: Add to main thread or create sub-threads
- **Node Deletion**: Remove nodes and their descendants
- **Custom Layout Engine**: Automatically positions nodes in a readable format
- **State Persistence**: Automatically saves your graph in localStorage
- **Responsive Design**: Works on various screen sizes

## 🔮 Roadmap

- LLM Integration with Claude, GPT, and Gemini
- Enhanced node metadata (timestamps, author, performance metrics)
- User authentication and profile management
- Multiple graph management
- Additional layout algorithms
- Collaborative editing

## 👥 Contributing

DAGGER is an open source project welcoming contributions of all kinds:

- Try it out and report issues
- Suggest new features
- Submit pull requests
- Share it with others who might find it useful

Join our community on Discord: https://discord.gg/ejkRQ5EF

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**. You're free to use, share, and adapt DAGGER for non-commercial purposes, as long as you give credit to **Kurt Cotoaga**.

For details, see https://creativecommons.org/licenses/by-nc/4.0/.

---

*DAGGER: Navigate the complexity of AI conversations with elegant graph visualization.*