# Balancia

A simple expense tracking application with Node.js backend and React frontend using local JSON file storage.

## Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```
The API will run on http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm start
```
The React app will run on http://localhost:3000

## Data Storage
- Uses JSON files in `backend/data/` directory for local storage
- No database setup required

## API Endpoints
- GET `/api` - Returns "API is running" message