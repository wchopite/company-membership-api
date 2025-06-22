<p align="center">
  <img src="./docs/images/logo.svg" alt="Load Service Logo" width="400"/>
</p>

# 🚀 Company Membership API

A high-quality [NestJS](https://nestjs.com/) backend service implementing clean architecture with hexagonal pattern, ready to run in development environment with minimal setup.

---

## 📦 Requirements

### Essential
- [Node.js 22.x](https://nodejs.org/en) for local development
- [nvm](https://github.com/nvm-sh/nvm) for Node.js version management

### Recommended VS Code Extensions
- [SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) - View and query SQLite databases directly in VS Code
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Test API endpoints using the included `.http` files

> 💡 **Tip**: After installing SQLite Viewer, you can open `./data/db-companies.sqlite` directly in VS Code to inspect the database tables and data.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wchopite/company-membership-api.git
cd company-membership-api
```

### 2. Setup Node.js version

```bash
# Use the correct Node.js version
nvm use

# If you don't have Node.js 22.x installed
nvm install 22
nvm use 22
```

### 3. Install dependencies

```bash
npm install
```

### 4. Environment variables

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

### 5. Seed test data (optional)

Populate the database with test data for easier development:

```bash
npm run seed
```

This creates sample companies, memberships, and transactions with realistic dates for testing the endpoints.

---

## 💻 Running Locally

1. Start the API in development mode:

   ```bash
   npm run start:dev
   ```

2. The API will be available at: `http://localhost:3000/api`

> Make sure you've completed all the setup steps above, including `nvm use` and `npm install`.

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/companies/membership` | Register a new company membership |
| `GET` | `/companies/recent-memberships` | Get companies that joined in the last month |
| `GET` | `/companies/with-recent-transfers` | Get companies with transfers in the last month |

### Testing with REST Client

The project includes `.http` files for easy endpoint testing with VS Code REST Client extension:

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension
2. Open any `.http` file in the project
3. Click "Send Request" above any HTTP request

### Example Usage

```bash
# Register a new PYME company
curl -X POST http://localhost:3000/api/companies/membership \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Startup SRL",
    "cuit": "20-12345678-9",
    "type": "PYME"
  }'

# Get recent memberships
curl http://localhost:3000/api/companies/recent-memberships

# Get companies with recent transfers
curl http://localhost:3000/api/companies/with-recent-transfers
```

---

## ⚙️ Useful NPM Scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run start:dev`  | Start the app in development mode (watch) |
| `npm run build`      | Compile the app                           |
| `npm run start:prod` | Run compiled code                         |
| `npm run test`       | Run unit tests                            |
| `npm run lint`       | Run linter and auto-fix issues            |
| `npm run seed`       | Populate database with test data          |

---

## 🏗️ Architecture

This API follows **Hexagonal Architecture** (Clean Architecture) principles:

- **Domain Layer**: Contains business entities, value objects, and domain exceptions
- **Application Layer**: Contains use cases, DTOs, and application services
- **Infrastructure Layer**: Contains controllers, repositories, and external service implementations

### Project Structure

```
src/
├── contexts/
│   ├── company/
│   │   ├── domain/          # Entities, enums, exceptions
│   │   ├── application/     # Use cases, DTOs
│   │   └── infra/          # Controllers, repositories
│   └── transaction/
│       ├── domain/
│       ├── application/
│       └── infra/
└── shared/
    ├── database/           # Database configuration & seeding
    ├── logger/            # Logging utilities
    └── services/          # Shared services
```

---

## 🔮 Future Improvements

This section outlines potential enhancements that would make the API production-ready:

### 🛡️ Error Handling & Response Standardization

**Current State**: Basic exception handling
**Improvement**: Implement a global exception filter

```typescript
// Standardized error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid CUIT format",
    "details": {
      "field": "cuit",
      "value": "123456"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/companies/membership"
}
```

**Benefits**: Consistent error responses, better frontend integration, improved debugging

### 🔐 Authentication & Authorization

**Current State**: Open endpoints
**Improvement**: JWT-based authentication module

- **User Management**: Registration, login, profile management
- **JWT Guards**: Protect sensitive endpoints

**Example Protected Endpoints**:
```typescript
@UseGuards(JwtAuthGuard)
@Get('/companies/my-memberships')
getMyMemberships(@Request() req) {
  // Only authenticated users can see their own data
}
```

### 👥 User Management Module

**Current State**: No user context
**Improvement**: Complete user management system

- **User Profiles**: Link companies to specific users
- **Company Representatives**: Multiple users per company
- **Audit Trail**: Track who performed which actions
- **User Preferences**: Notification settings, language, etc.

### 📊 Enhanced Filtering & Pagination

**Current State**: Fixed 30-day lookback
**Improvement**: Flexible date filtering and pagination

```typescript
// Enhanced query parameters
GET /companies/recent-memberships?
  from=2024-01-01&
  to=2024-01-31&
  page=1&
  limit=20&
  sortBy=createdAt&
  order=desc
```

**Features**:
- Custom date ranges
- Pagination with configurable page sizes
- Sorting by multiple fields
- Advanced filtering (by company type, status, etc.)

### 📈 Monitoring & Observability

**Current State**: Basic logging
**Improvement**: Production-grade monitoring

- **Health Checks**: `/health` endpoint with database connectivity
- **Metrics**: Request duration, error rates, database query performance
- **Structured Logging**: JSON logs with correlation IDs
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

### 🔄 Data Validation & Serialization

**Current State**: Basic DTO validation
**Improvement**: Enhanced validation and response transformation

- **Request Validation**: Advanced CUIT validation, business rules
- **Response Serialization**: Consistent response transformation
- **Input Sanitization**: Prevent injection attacks
- **Rate Limiting**: Protect against abuse

### 🚀 Performance Optimizations

**Current State**: Basic database queries
**Improvement**: Production-grade performance

- **Database Indexing**: Optimize query performance
- **Caching**: Redis integration for frequently accessed data
- **Query Optimization**: Reduce N+1 problems, batch operations
- **Background Jobs**: Async processing for heavy operations

### 🧪 Testing Strategy

**Current State**: Minimal testing
**Improvement**: Comprehensive test coverage

- **Unit Tests**: Business logic and use cases
- **Integration Tests**: Database operations and API endpoints
- **E2E Tests**: Complete user flows
- **Contract Testing**: API contract validation

---

## ✨ Credits

This project is developed and maintained by **IT Patagonia Development Team** with 🧡.
