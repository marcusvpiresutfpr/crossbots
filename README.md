# Crossbots

Crossbots, a competitive robotics team from UTFPR.

## 🚀 How to Set Up

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Push schema and reset local DB (!! destructive !!)
npx prisma db push --force-reset

# 4. Seed development data
npm run seed
```

Create a `.env` file in the root directory with the following content:

```env
# JWT secret for signing tokens
AUTH_SECRET=crossbots_super_secret_jwt_key_2025_development_only_change_in_production_a1b2c3d4e5f6g7h8i9j0
```

## Problems with DB ?

You can force reset the database and re-seed it with development data:
Important: This will delete all existing data in the database.

```bash
# Force reset the database and re-seed
npx prisma db push --force-reset

# Re-generate Prisma client
npx prisma generate

# Re-seed the database
npm run seed
```

## 🛠️ Development

```bash
# Start the development server
npm run dev
```

Prisma studio can be used to manage the database visually in development:
You can convert you into a ADMIN or any other role in the database using Prisma Studio.

```bash
# Prisma Studio
npx prisma studio
```

## 📦 Build

```bash
# Build the application
npm run build
```
