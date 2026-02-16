# User Creation Scripts

## Option 1: Use the Custom Create First User Endpoint (Recommended)

A custom endpoint has been created to make it easy to create your first admin user:

```bash
curl -X POST http://localhost:3000/api/create-first-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "karlvonluckwald@gmail.com",
    "password": "your-password-here",
    "name": "Karl von Luckwald"
  }'
```

**Note:** This only works if no users exist in the database. After the first user is created, you'll need to log in and create additional users through the admin panel.

## Option 2: Use the create-user.ts Script

First, install `tsx`:

```bash
pnpm add -D tsx
```

Then run:

```bash
pnpm tsx scripts/create-user.ts karlvonluckwald@gmail.com your-password "Karl von Luckwald" admin
```

## Option 3: Create User via Payload Admin Panel

1. If you already have one admin user, log in to `/admin`
2. Navigate to the Users collection
3. Click "Create New"
4. Fill in the email, password, name, and role
5. Save

## Option 4: Use Payload CLI (if available)

```bash
pnpm payload create:user
```

This will prompt you for user details interactively.
