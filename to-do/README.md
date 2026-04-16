This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🚀 Todo Application (Full-Stack)

A full-stack Todo application built using **Next.js, TypeScript, and MongoDB Atlas** with user authentication and complete CRUD functionality.

---

## 📌 Features

- 🔐 User Authentication (Signup & Login)
- ✅ Create, Read, Update, Delete Todos
- 📅 Deadline Tracking with “Days Left” Calculation
- ✔️ Mark Todo as Completed / Undo
- 🔒 Protected Routes (Login Required)
- 🚪 Logout Functionality
- 🎨 Clean and Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Node.js

### Database
- MongoDB Atlas
- Mongoose

---

## 🏗️ Project Structure
```bash
app/
├── login/
├── signup/
├── api/
│ ├── todos/
│ ├── login/
│ └── signup/

models/
├── Todo.ts
└── User.ts

lib/
└── mongodb.ts
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/signup` → Register user
- `POST /api/login` → Login user

### Todos
- `GET /api/todos` → Fetch all todos
- `POST /api/todos` → Create todo
- `PUT /api/todos` → Update todo (complete/undo)
- `DELETE /api/todos` → Delete todo

---

## 🗄️ Database Schema

### User
```json
{
  "email": "string",
  "password": "string"
}
```
### Todo
```json
{
  "title": "string",
  "deadline": "date",
  "completed": "boolean"
}
```

### ⚙️ Setup Instructions
   1️⃣ Clone the repository
 ```
git clone https://github.com/your-username/todo-app.git
cd todo-app
```
  2️⃣ Install dependencies
  ```
npm install
```

3️⃣ Setup environment variables

  Create a .env.local file:
  ```
  MONGODB_URI=your_mongodb_connection_string
  ```
4️⃣ Run the development server
```
npm run dev
```
5️⃣ Open in browser
```
http://localhost:3000
```
### 🔐 Authentication Flow
- User signs up
- User logs in
- Credentials are validated
- Access to Todo dashboard is granted
- Unauthorized users are redirected to login

