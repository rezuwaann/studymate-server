# 📚 StudyMate — Find Your Perfect Study Partner

A full-stack MERN web platform designed to help students connect and collaborate for better learning outcomes. StudyMate enables users to find study partners based on subjects, learning preferences, and locations — making education more interactive, engaging, and goal-oriented.

## 🌐 Live Links

- **Client Side:** [https://studymate-client-seven.vercel.app](https://studymate-client-seven.vercel.app)
- **Server Side:** [https://studymate-server-sigma.vercel.app](https://studymate-server-sigma.vercel.app)

## 📁 Repositories

- **Client Repo:** [https://github.com/rezuwaann/Assignment-10](https://github.com/rezuwaann/Assignment-10)
- **Server Repo:** [https://github.com/rezuwaann/studymate-server](https://github.com/rezuwaann/studymate-server)

---

## ✨ Key Features

- 🔐 **Firebase Authentication** — Secure login and registration with Email/Password and Google OAuth. Private routes protect authenticated-only pages, and users stay logged in on reload.

- 🤝 **Study Partner Profiles** — Logged-in users can create, update, and delete their own study partner profiles with details like subject, study mode, availability, experience level, and location.

- 🔍 **Search & Sort on Find Partners Page** — Browse all available study partner profiles with search by subject and sort by experience level for a tailored discovery experience.

- 📬 **Partner Request System** — Send partner requests to other users, which increments the partner's connection count in real time using MongoDB's `$inc` operator, and logs the request to a separate collection.

- 📋 **My Connections Dashboard** — View all sent partner requests in a table format with full update and delete functionality, including a confirmation prompt before deletion and pre-filled update forms. Accessible at `/connections`.

- 🏠 **Dynamic Home Page** — Features a hero carousel with 3+ slides, a "Top Study Partners" section showing the highest-rated profiles fetched from MongoDB, a "How It Works" guide, and a Testimonials section.

- 📱 **Fully Responsive Design** — Optimized layout for mobile, tablet, and desktop with consistent card sizing, spacing, and typography across all pages.

- ⚡ **Smooth SPA Experience** — Built with React Router for seamless navigation with no full-page reloads, persistent Navbar and Footer, a custom 404 page, and a loading spinner during data fetches.

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React, React Router, Axios, Tailwind CSS |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB (Atlas)                         |
| Auth       | Firebase Authentication                 |
| Hosting    | Vercel (Client & Server)                |
| Notifications | React Toastify / SweetAlert2         |

---

## 📦 Main Pages & Routes

| Route               | Access     | Description                                      |
|---------------------|------------|--------------------------------------------------|
| `/`                 | Public     | Home page with hero slider and top partners      |
| `/findpartners`     | Public     | Browse and search all study partner profiles     |
| `/partner/:id`      | Private    | Detailed view of a single partner profile        |
| `/createaprofile`   | Private    | Create a new study partner profile               |
| `/connections`      | Private    | View, update, and delete your sent requests      |
| `/profile`          | Private    | View logged-in user's account information        |
| `/login`            | Public     | Login with email or Google                       |
| `/register`         | Public     | Register a new account                           |
| `/*`                | Public     | Custom 404 Not Found page                        |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project

### Client Setup
```bash
git clone https://github.com/rezuwaann/Assignment-10
cd Assignment-10
npm install
npm run dev
```

### Server Setup
```bash
git clone https://github.com/rezuwaann/studymate-server
cd studymate-server
npm install
node index.js
```

> Add your `.env` file with `MONGODB_URI` and Firebase config variables before running.

---

## 📌 Password Validation Rules

When registering, passwords must:
- Contain at least one **uppercase** letter
- Contain at least one **lowercase** letter
- Be at least **6 characters** long

