## **🏡** Rentmate - AI-Powered Real Estate Matching Platform

## 📖 Overview

**Rentmate** is an AI-driven real estate platform designed to help users find the perfect apartment in Israel - faster, smarter, and more personalized than ever.
It uses AI-powered matching to analyze Yad2 listings alongside user preferences - including budget, rooms, and lifestyle needs - to deliver highly personalized results.

Powered by Gemini (Google Generative AI), Rentmate ranks apartments by relevance and explains why each match fits best, making the search experience simple, transparent, and efficient.

---

## 🎥 Demo Video

<a href="https://youtu.be/hd9tCDCIjXE" target="_blank">
  <img 
    src="frontend/public/Demo.png" 
    alt="Rentmate App Demo" 
    width="100%"
  />
</a>

---

## ✨ Key Features

### 🔐 User Authentication

* Secure JWT-based authentication flow
* Sign up, log in, and password reset via email
* Role-based access control (guest, user)

### 🤖 AI-Powered Apartment Matching 
* Gemini analyzes listings and user preferences to deliver tailored apartment recommendations
* Intelligent matching logic providessuggestions aligned with user needs.

### 📊 Ranking & Scoring
* Each apartment is assigned a matching score
* Detailed explanations help users understand why specific apartments best fit their requirements

### 🔍 Smart Search Filters
* Advanced filtering options by city, neighborhood, price, rooms, size, floor, and property type
* Enables fast, precise, and efficient apartment discovery

---

## 📂 Project Structure

```
rentmate-app/
├── backend/                        # Express backend application
│   ├── db/                         # Database connection and configuration
│   ├── models/                     # Sequelize models (User, Apartment, etc.)
│   ├── routes/                     # API route definitions
│   ├── services/                   # Business logic and integrations (AI, scraping)
│   ├── server.js                   # Application entry point
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables (ignored in Git)
│
├── frontend/                       # React frontend application
│   ├── public/                     # Static assets (index.html, icons, etc.)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # React context (e.g., authentication)
│   │   ├── pages/                  # Main application pages
│   │   ├── App.js                  # Root component
│   │   ├── index.js                # Application entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Frontend dependencies
│   ├── postcss.config.js           # PostCSS configuration
│   └── tailwind.config.js          # Tailwind CSS configuration
│
├── .gitignore                      # Git ignore file
└── README.md                       # Project documentation
```

---

## 🛠️ Technology Overview

### 🖥️ Backend

* **Node.js + Express** — RESTful API and server-side logic.
* **Sequelize** — ORM for database modeling and queries.
* **JWT Authentication** — Secure token-based user authentication.
* **Bcrypt.js** — Password hashing and security.

### 🗄️ Database

* **PostgreSQL** — Relational database for persistent storage.

### 🌐 Frontend

* **React** – Modern component-based UI framework.
* **React Router** – Client-side routing.
* **React Context** — Global state management (e.g., authentication).
* **Fetch API** — Native HTTP client for API communication.
* **Tailwind CSS + PostCSS** — Modern utility-first styling.

### 🤖 AI Integration

* **Gemini (Google Generative AI)** — Provides intelligent apartment matching, ranking, and explanations.

### 📩 Email Service

* **Nodemailer + Gmail SMTP** — Handles password reset links.

### 🐳 Infrastructure

* **dotenv** – Environment variable management
* **Git & GitHub** — Version control and collaboration.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rentmate-app
```

2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Create a `.env` file in the project root with:

```env
# === 🔐 Backend Auth ===
PORT=4000
JWT_SECRET=your_jwt_secret

# === 🗄️ Database ===
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/rentmate

# === 📩 Email ===
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# === 🧩 ZENROWS ===
ZENROWS_API_KEY=your_zenrows_key

# === 🤖 Google Service ===
GOOGLE_API_KEY=your_google_api_key
GEMINI_MODEL=gemini-2.5-flash

# === ☁️ Cloudinary (for image uploads) ===
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# === 📍 GOOGLE GEO ===
GOOGLE_GEO_API_KEY=your_geo_api_key

```

> ⚠️ **Important:** Do NOT commit the `.env` file to Git. Keep it private.

### ℹ️ Environment Variable Setup Instructions

#### 🔑 SECRET\_KEY

To generate a secure secret key for token encryption, run the following script:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output a random key in the terminal. Copy it and paste it in the `JWT_SECRET` field.

#### 🗄️ DATABASE\_URL

Provide the connection string to your PostgreSQL database. Example:

```
postgresql://postgres:yourpassword@localhost:5432/rentmate
```

Make sure the database exists and is accessible.

#### 📩 Gmail App Password

1. Go to [Google My Account](https://myaccount.google.com/)
2. Enable 2-Step Verification if not already enabled
3. Under 'Security', go to 'App Passwords'
4. Generate a new app password (e.g., for "Other" app: PlanNGo)
5. Copy the 16-digit code and paste it in `EMAIL_PASSWORD`

#### 🧩 ZENROWS_API_KEY

1. Go to [Zenrows](https://www.zenrows.com/)
2. Create an account or log in
3. Paste the domain - https://www.yad2.co.il
4. Select Codebase + JavaScript + HTTP Client
4. Go to Settings, Copy your API key and paste it into ZENROWS_API_KEY

#### ☁️ CLOUDINARY_CLOUD_NAME & CLOUDINARY_UPLOAD_PRESET
1. Go to [https://cloudinary.com/console](https://cloudinary.com/console) and log in to your account
2. Under the **Dashboard**, locate your **Cloud name** — copy it into `CLOUDINARY_CLOUD_NAME`
3. To create an upload preset:
   - Click **Go to API Keys > Upload > Add upload preset**
   - Set the name (e.g., `unsigned_preset`)
   - Set **Signing Mode** to `Unsigned`
   - Optionally choose a default upload folder
   - Click **Save**
4. Copy the name you chose into `CLOUDINARY_UPLOAD_PRESET`

#### 🤖 GOOGLE_API_KEY

1. Go to [AI Studio](https://aistudio.google.com/prompts/new_chat) and log in to your account
2. Click Get API Key
3. Click Create API Key
4. Choose Create API Key in new project
5. Copy the key and paste it into GOOGLE_API_KEY

#### 📍 GOOGLE GEO

1. Go to [Google Cloud](https://console.cloud.google.com/)
2. Create or select an existing Google Cloud project
3. Enable the Geocoding API and Distance Matrix API
4. Navigate to APIs & Services → Credentials
5. Click Create Credentials → API Key
6. Copy the generated key and paste it into GOOGLE_GEO_API_KEY

### 4. Run the Application

1. 🖥️ Start Backend

```bash
cd backend
npm install
node server.js
```

2. 🌐 In a new terminal, start Frontend

```bash
cd frontend
npm install
npm start
```

This will start:

✅ Backend (Express) - [http://localhost:4000](http://localhost:4000)

✅ Frontend (React) - [http://localhost:3000](http://localhost:3000)

---

## 🙌 Conclusion

Rentmate revolutionizes the apartment-hunting experience by combining real-time data from Yad2 with advanced AI capabilities.  It intelligently matches and ranks listings based on user preferences, turning the search process into a smart, simple, and personalized experience.

Feel free to contribute, report issues, or suggest enhancements.
