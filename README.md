# 🧠 AI Model Inventory Manager - Server

---

## 📘 Overview

This is the **server-side** of the AI Model Inventory Manager, built with **Node.js**, **Express.js**, **MongoDB**, and **Firebase Admin SDK**.  
It provides **RESTful APIs** for managing AI model data and secures sensitive routes using **Firebase token verification**.

Users can perform CRUD operations, purchase models, and view their data through client-side requests.

---

## 🚀 Key Features

- ⚙️ **RESTful API Endpoints** for all CRUD operations.  
- 🔐 **Firebase Admin SDK Authorization** to verify tokens for protected routes.  
- 🧾 **Model Purchase System** using MongoDB `$inc` operator for real-time count updates.  
- 🗂️ **MongoDB Integration** with environment-secured credentials.  
- 🚫 **Protected Update/Delete** — only model creators can modify or delete entries.  
- 🌍 **Hosted on Vercel** with proper CORS configuration for Netlify/Firebase client hosting.  
- 🧠 **Schema Design** optimized for AI model metadata management.

---

## 🧩 Tech Stack

| Category    | Technology                |
|------------|---------------------------|
| Runtime     | Node.js                   |
| Framework   | Express.js                |
| Database    | MongoDB Atlas             |
| Auth       | Firebase Admin SDK         |
| Hosting     | Vercel                    |
| Environment| dotenv                    |

---

## 🛡️ Security Notes

- Uses **environment variables** for credentials.  
- Uses **Firebase Admin SDK** for verifying user tokens.  
- Only the **creator** can update or delete a model.  
- **CORS** configured for your client domain (Netlify / Firebase).  

---

## 💻 Installation

Follow these steps to run the server locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Tanzeem74/AI-Inventory-Model-Server.git
cd AI-Inventory-Model-Server
