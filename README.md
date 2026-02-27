# CineMatch AI 🎬

CineMatch AI is a modern, responsive web application that provides personalized movie recommendations powered by artificial intelligence.

## 🌟 Features

- **AI-Powered Discovery Engine**: Tell the AI your preferred genres, release years, maximum runtime, languages, and minimum ratings to receive highly curated movie recommendations.
- **Smart Search**: Real-time, debounced search functionality to quickly find specific titles.
- **Personalized Watchlist**: Save your favorite discoveries to a local watchlist for later viewing.
- **Beautiful UI/UX**: Designed with a sleek, dark-themed glassmorphism aesthetic, featuring smooth CSS entry and micro-animations for a premium feel.
- **Responsive Design**: Fully optimized for both desktop and mobile viewing.

## 🛠️ Tech Stack

This project is separated into a frontend Client and a backend Server.

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: Google Material Symbols

### Backend (Server)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Server**: Uvicorn
- **AI/ML**: `scikit-learn`, `pandas`, `numpy`, `joblib`
- **Integrations**: TMDB API integration via `requests`

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (for the Client)
- Python 3.8+ (for the Server)
- Obtain a [TMDB API Key](https://developer.themoviedb.org/docs/getting-started) (if the server requires it for live data fetching).

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Movie Recomendation Project"
   ```

2. **Setup the Backend (Server)**
   ```bash
   cd Server
   pip install -r requirements.txt
   
   # You may need to create a .env file here depending on your backend config
   # Example: TMDB_API_KEY=your_key_here
   
   uvicorn app.main:app --reload
   ```
   *The FastAPI server will typically run on `http://127.0.0.1:8000`.*

3. **Setup the Frontend (Client)**
   Open a new terminal window/tab:
   ```bash
   cd Client
   npm install
   
   # Create a .env file and point to your local API
   echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env
   
   npm run dev
   ```
   *The Vite development server will typically run on `http://localhost:5173`.*

## 📂 Project Structure

```
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Header, Footer, Hero, Toast, etc.)
│   │   ├── pages/          # Application routes (Home, Discover, Movies, Watchlist, etc.)
│   │   ├── utils/          # Utility functions (e.g., watchlist management)
│   │   ├── App.jsx         # Main application and routing logic
│   │   └── index.css       # Global styles and Tailwind custom animations
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js  # Tailwind configuration
│
└── Server/                 # Backend FastAPI application
    ├── app/
    │   ├── routers/        # API route definitions
    │   ├── models/         # Pydantic schemas and models
    │   └── utils/          # ML scripts and data processing utilities
    └── requirements.txt    # Python dependencies
```

## 🎨 UI Highlight

The frontend utilizes custom Tailwind v4 animations configured directly in `index.css` via the `@theme` directive, giving the application smooth entrance effects like `fade-in-up`, `slide-in-right`, and ambient `float` and `pulse` effects on elements like the background blobs.

## 📄 License
This project is licensed under the MIT License.
