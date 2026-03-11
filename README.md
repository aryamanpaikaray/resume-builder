# 📄 Resume Builder – MERN Stack

A full-stack Dynamic Resume Builder with:
- ✅ Dynamic multi-section form (add/remove entries)
- ✅ Live resume preview (A4 formatted)
- ✅ Time-controlled form access (20 minutes from deployment)
- ✅ PDF generation with password display
- ✅ Email resume with PDF attachment + password in body
- ✅ Print resume

---

## 📁 Project Structure

```
resume-builder/
├── backend/          ← Node.js / Express / MongoDB
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env.example
└── frontend/         ← React
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   └── utils/
    └── .env.example
```

---

## ⚙️ Backend Setup

### 1. Navigate & install
```bash
cd backend
npm install
```

### 2. Create `.env` file
Copy `.env.example` to `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/resumebuilder

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords. Generate a password for "Mail".

### 3. Start server
```bash
npm run dev      # development (with nodemon)
npm start        # production
```

The server auto-sets `deploymentTime` in MongoDB on first start.  
The form will be **disabled after 20 minutes** from this timestamp.

---

## ⚙️ Frontend Setup

### 1. Navigate & install
```bash
cd frontend
npm install
```

### 2. Create `.env` file
```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production (Vercel/Netlify), set this to your deployed backend URL.

### 3. Start app
```bash
npm start
```

---

## 🚀 Deployment

### Backend → Render / Railway / Heroku
- Set environment variables in the dashboard
- Entry point: `server.js`

### Frontend → Vercel / Netlify
- Build command: `npm run build`
- Publish directory: `build`
- Set `REACT_APP_API_URL` env var to your backend URL

---

## 🔐 PDF Password Format

Password is generated as: `FirstName-DDMMYYYY`

Example: Name = "Bikash Kumar", DOB = 1998-05-15  
→ Password = `Bikash-15051998`

The password is:
- Shown on screen after download
- Sent in the email body along with the PDF attachment

> **Note**: The PDF is not natively encrypted (PDFKit doesn't support it). The password is a display convention per the spec. For true PDF encryption, integrate `qpdf` CLI on the server.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config/access` | Check if form is still open |
| POST | `/api/resume` | Save resume (time-gated) |
| PUT | `/api/resume/:id` | Update resume (time-gated) |
| GET | `/api/resume/:id` | Get resume by ID |
| POST | `/api/resume/:id/download` | Download PDF (returns binary) |
| POST | `/api/resume/:id/email` | Send resume to email |
