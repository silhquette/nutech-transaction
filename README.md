# 🚀 Nutech Transaction API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
```
Hey There! 🙌
⭐️ Star this repo if you find it useful!
```

## 🌟 Introduction

**Nutech Transaction API** adalah sistem backend untuk mengelola transaksi topup dan pembayaran sederhana. Project ini dibuat sebagai bagian dari technical test di **Nutech Integrasi**.

API ini menyediakan fitur-fitur:
- 🔐 Authentication & Authorization (JWT)
- 👤 User Profile Management
- 💰 Balance Management & Topup
- 💳 Payment Transactions
- 📊 Transaction History
- 🎫 Service & Banner Management

## 💡 Tech Stack

### Core Technologies
- **Runtime**: Node.js v23.11.1
- **Language**: TypeScript 5.9
- **Framework**: Express.js 5.1
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.19

### Key Libraries
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **API Documentation**: Swagger UI + OpenAPI
- **Logging**: Pino
- **Security**: Helmet, CORS
- **Rate Limiting**: express-rate-limit

### Development Tools
- **Build Tool**: tsup + TypeScript Compiler
- **Code Quality**: Biome (Formatter & Linter)
- **Testing**: Vitest + Supertest
- **Dev Server**: tsx with watch mode
- **Deployment**: Docker + Railway

## 🏗️ Architecture

Project ini menggunakan **HMVC (Hierarchical Model-View-Controller)** pattern dengan **Repository-Service-Controller** layer:
```
src/api/{module}/
├── {module}Model.ts       # Zod schemas & type definitions
├── {module}Repository.ts  # Database queries (Prisma raw SQL)
├── {module}Service.ts     # Business logic
├── {module}Controller.ts  # Request handlers
└── {module}Router.ts      # Route definitions + OpenAPI spec
```

### Design Principles
- ✅ **Separation of Concerns**: Setiap layer memiliki tanggung jawab yang jelas
- ✅ **Raw SQL Queries**: Menggunakan Prisma `$queryRaw` untuk kontrol penuh
- ✅ **Type Safety**: Full TypeScript dengan Zod validation
- ✅ **Dependency Injection**: Repository dapat di-inject untuk testing
- ✅ **Consistent API Response**: Unified response format dengan `ServiceResponse`

## 🚀 Getting Started

### Prerequisites

- Node.js v23.11.1 atau lebih tinggi
- PostgreSQL database (atau gunakan Neon)
- pnpm (recommended) atau npm

### Step-by-Step Setup

#### Step 1: 📥 Clone Repository
```bash
git clone https://github.com/your-username/nutech-transaction.git
cd nutech-transaction
```

#### Step 2: 📦 Install Dependencies
```bash
pnpm install
# or
npm install
```

#### Step 3: ⚙️ Environment Configuration

Buat file `.env` di root project:
```env
# Server
NODE_ENV=development
HOST=localhost
PORT=8080

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nutech_db?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
COMMON_RATE_LIMIT_WINDOW_MS=900000
COMMON_RATE_LIMIT_MAX_REQUESTS=20
```

#### Step 4: 🗄️ Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

#### Step 5: 🏃‍♂️ Run the Project

**Development Mode:**
```bash
pnpm start:dev
```

**Production Mode:**
```bash
# Build
pnpm build

# Start
pnpm start:prod
```

Server akan berjalan di `http://localhost:8080`

#### Step 6: 📖 API Documentation

Buka browser dan akses:
```
http://localhost:8080/swagger
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t nutech-transaction .
```

### Run Container
```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_SECRET="your_jwt_secret" \
  nutech-transaction
```

### Deploy to Railway

1. Connect GitHub repository ke Railway
2. Set environment variables di Railway dashboard
3. Railway akan auto-deploy setiap kali push ke branch `main`

## 📁 Project Structure
```
nutech-transaction/
├── prisma/
│   ├── migrations/         # Database migrations
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── api/               # API modules
│   │   ├── auth/          # Authentication (login, register)
│   │   ├── profile/       # User profile management
│   │   ├── transaction/   # Topup, payment, history
│   │   ├── banner/        # Banner management
│   │   ├── service/       # Service management
│   │   └── user/          # User CRUD (admin)
│   ├── api-docs/          # OpenAPI/Swagger configuration
│   ├── common/
│   │   ├── middleware/    # Express middlewares
│   │   ├── models/        # Shared models (ServiceResponse)
│   │   └── utils/         # Utilities (envConfig, validation)
│   ├── index.ts           # Application entry point
│   └── server.ts          # Express app setup
├── .env.template          # Environment variables template
├── Dockerfile             # Docker configuration
├── package.json
├── prisma.config.ts       # Prisma configuration
├── tsconfig.json          # TypeScript configuration
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /registration` - Register new user
- `POST /login` - Login and get JWT token

### Profile
- `GET /profile` - Get user profile
- `PUT /profile/update` - Update profile
- `PUT /profile/image` - Upload profile image

### Transaction
- `GET /balance` - Get user balance
- `POST /topup` - Top up balance
- `POST /transaction` - Create payment transaction
- `GET /transaction/history` - Get transaction history

### Public
- `GET /banner` - Get all banners
- `GET /service` - Get all services

### Admin (User Management)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

## 🧪 Testing
```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Helmet for HTTP headers security
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Environment variable validation

## 📝 Code Quality
```bash
# Check and format code
pnpm check
```

Project menggunakan **Biome** untuk:
- Code formatting
- Linting
- Import sorting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Muzakki Abdillah**
- Technical Test for Nutech Integrasi
- Year: 2025

## 🙏 Acknowledgments

- Original boilerplate by [Edwin Hernandez](https://github.com/edwinhern/express-typescript)
- Nutech Integrasi for the technical test opportunity

---

🎉 **Happy Coding!**

If you have any questions or feedback, please open an issue or reach out!