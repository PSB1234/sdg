# 🛡️ SDGFinance – Secure Role-Based Lead Management with AI-Powered Prioritization

## 🚀 Problem Statement
Banks face challenges in managing leads across multiple user roles (Processing Centres, Nodal Officers, Higher Authorities) without a unified, secure system.  
Current processes lack robust role-based permissions, audit logging, and actionable insights, hampering accountability, transparency, and efficiency.  

---

## 💡 Our Solution
We built **SDGFinance**, a **secure role-based lead management system** with:
- **Customer Mobile App (Flutter)**  
- **Bank Officials Web Portal (Next.js)**  
- **Backend (Node.js + Express)** with AI/LLM integration  

Our system ensures secure access, lead prioritization, real-time tracking, and actionable insights for both customers and bank officials.  

---

## 🔑 Features

### 🛡️ Security & Access
- **Role-Based Access Control (RBAC):** Clearly defined roles for Processing Centres, Nodal Officers, and Higher Authorities.  
- **Audit Logging:** End-to-end tracking of all user actions for compliance and transparency.  

### 📊 Lead Management
- Centralized module to **add, update, assign, and monitor leads**.  
- **Lead Status Tracking:** Officers can update the process stage (missing docs, pending verification, approved, etc.).  
- **Notifications:** Customers receive alerts/reminders if documents are missing or the process requires action.  

### 📈 Dashboards & Reporting
- **Interactive dashboards** with role-specific insights.  
- **One-click data export** (Excel/CSV) for reporting & analysis.  

### 🤖 AI-Powered Features
- **LLM-Powered Lead Prioritization:**  
  - Lead details (profile, product type, location, credit score trends, history) are analyzed by an LLM.  
  - LLM assigns a **Lead Priority Score**.  
- **Smart Assignment:** Leads are auto-prioritized and assigned to the most suitable officer.  
- **Predictive Insights:** Detects high-risk leads (drop-offs) and suggests nudges like reminders or personalized outreach.  

---

## 🛠️ Tech Stack

### Frontend
- **Mobile App:** Flutter (for customers)  
- **Web App:** Next.js (for bank officials)  

### Backend
- **Server:** Node.js + Express  
- **Database:** MongoDB
- **Authentication & RBAC:** JWT-based  

### AI/LLM Integration
- LLM model (OpenAI / Gemini / custom – replace with your choice) used for **priority scoring & predictive insights**.  

---

## 🏗️ Architecture

1. **Customer App (Flutter):**  
   Customers can register, upload documents, and track lead/application status.  

2. **Bank Officer Web Portal (Next.js):**  
   Officers manage leads, assign tasks, send notifications, and view dashboards.  

3. **Backend (Node.js + Express):**  
   Centralized APIs for authentication, RBAC, lead management, audit logging, and data export.  

4. **AI Engine (LLM):**  
   Processes lead attributes → Generates **Lead Priority Score** → Returns to officers’ dashboard.  

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** 
- **pnpm** 
- **Flutter** 
- **MongoDB** 
- **Git**

### 🚀 Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/PSB1234/sdg.git
cd sdg
```

#### 2. Backend Setup
```bash
cd backend
pnpm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string and other configurations

# Start the backend server
pnpm start
```

#### 3. Web Application Setup
```bash
cd ../web
pnpm install

# Create environment file
cp .env.example .env
# Configure your environment variables (API endpoints, etc.)

# Start the development server
pnpm dev
```

#### 4. Mobile Application Setup
```bash
cd ../codeishack

# Get Flutter dependencies
flutter pub get

# For Android
flutter run

# For iOS (macOS only)
flutter run -d ios


# IMPORTANT: Update API endpoints in Flutter code
# change the base URL to your local backend:
# Replace existing API URLs with: http://localhost:5000/api
# Or replace with your backend server IP address 🙇

```

### 🔧 Development Workflow

1. **Start Backend:** `cd backend && pnpm start`
2. **Start Web App:** `cd web && pnpm dev`
3. **Run Mobile App:** `cd codeishack && flutter run`

### 📦 Production Deployment

#### Backend
```bash
cd backend
pnpm build
pnpm start:prod
```

#### Web Application
```bash
cd web
pnpm build
pnpm start
```

#### Mobile Application
```bash
cd codeishack
flutter build apk --release  # For Android
flutter build ios --release  # For iOS
```
### 📊 Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `sdgfinance`
3. The application will automatically create required collections on first run
