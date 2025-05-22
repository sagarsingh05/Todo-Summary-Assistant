# Todo Summary Assistant

A full-stack application for managing to-do items with AI-powered summarization (using Cohere) and Slack integration.

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Axios for API calls

### Backend
- Node.js (Express)
- PostgreSQL (via Supabase)
- Axios for external API calls

### Integrations
- Cohere AI for summarization
- Slack Incoming Webhook

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database (Supabase recommended)
- Slack workspace with Incoming Webhook configured
- Cohere API key (free tier available)

---

## 📦 Backend Setup

1. Clone the repository
2. Navigate to the backend folder:
   ```bash
   cd todo-summary-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example`:

   ```env
   PORT=3001
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   COHERE_API_KEY=your_cohere_api_key
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

---

## 💻 Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd todo-summary-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:

   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

### Slack Integration
- Go to your Slack workspace settings
- Create a new **Incoming Webhook**
- Copy the Webhook URL and add it to your backend `.env` file as `SLACK_WEBHOOK_URL`

### Cohere AI Integration
- Sign up at [Cohere](https://cohere.com)
- Get your API key from the dashboard
- Add it to your backend `.env` as `COHERE_API_KEY`

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                          |
|--------|------------------|--------------------------------------|
| GET    | `/todos`         | Fetch all todos                      |
| POST   | `/todos`         | Add a new todo                       |
| DELETE | `/todos/:id`     | Delete a todo by ID                  |
| POST   | `/summarize`     | Summarize todos and send to Slack    |

---

## 🧱 Architecture Decisions

- **Supabase** for PostgreSQL hosting and simplified integration
- **REST API** backend with Express
- **React** with hooks for efficient state management
- **Vite** for blazing-fast frontend tooling
- **Cohere API** for natural language summarization
- Modular and clean folder structure for scalability

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
