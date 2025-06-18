<p align="center">
  <img src="./docs/images/logo.svg" alt="Load Service Logo" width="400"/>
</p>

# 🚀 Company Membership API

A high-quality [NestJS](https://nestjs.com/) backend service, ready to run in development environment with minimal setup.

---

## 📦 Requirements

- for local development [Node.js 22.x](https://nodejs.org/en)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wchopite/company-membership-api.git
cd company-membership-api
```

### 2. Environment variables

Copy the `.env.example` file to `.env` and update it if needed:

```bash
cp .env.example .env
```

**Example content:**

```env
# Application
NODE_ENV=development
PORT=3000
LOGGER_LEVEL=log

# Database (SQLite)
DB_TYPE=sqlite
DB_PATH=./data/db-companies.sqlite
```

---

## 💻 Running Locally

1. Install dependencies:

   ```bash
   nvm use
   npm install
   ```

2. Start the API in development mode:

   ```bash
   npm run start:dev
   ```

> Make sure your  `.env` is properly configured.

---

## ⚙️ Useful NPM Scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run start:dev`  | Start the app in development mode (watch) |
| `npm run build`      | Compile the app                           |
| `npm run start:prod` | Run compiled code                         |
| `npm run test`       | Run unit tests                            |
| `npm run lint`       | Run linter and auto-fix issues            |

---

## ✨ Credits

This project is developed and maintained by **IT Patagonia Development Team** with 🧡.
