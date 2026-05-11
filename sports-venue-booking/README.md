# Sports Venue Booking & Matchmaking Platform

A full-stack sports venue booking and player matchmaking platform built with **Next.js, Prisma, MongoDB, and Socket-based Chat**.

The platform allows users to:

- Discover sports venues
- Create & join matches
- Split booking costs
- Follow players
- Chat inside match rooms
- Manage venues as owners
- Moderate the platform as admins

---

# Tech Stack

| Technology | Usage |
|---|---|
| Next.js App Router | Frontend + Backend APIs |
| TypeScript | Application development |
| Prisma ORM | Database ORM |
| MongoDB | Database |
| JWT/Auth | Authentication |
| Socket.io | Real-time chat |
| Tailwind CSS | UI Styling |

---

# Features

## User Features

- User authentication
- Explore matches
- Join matches
- Split payment system
- Follow/unfollow users
- Notifications
- Real-time chat
- Match visibility (public/private)

---

## Venue Owner Features

- Add venues
- Manage venue slots
- View bookings
- Manage hosted matches
- Venue approval system

---

## Admin Features

- Approve venues
- Manage users
- View platform bookings
- Moderate venues

---

# Folder Structure

```bash
src/
├── app/
│   ├── api/
│   ├── components/
│   ├── dashboard/
│   ├── owner-dashboard/
│   ├── admin-dashboard/
│   ├── chats/
│   └── venue/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── socket.ts
│   └── sendNotification.ts
│
prisma/
├── schema.prisma
└── seed.js
```

---

# Database Schema Overview

## User Model

Stores all platform users.

| Field | Type | Description |
|---|---|---|
| id | ObjectId | Primary key |
| name | String | User name |
| email | String | Unique email |
| password | String | Hashed password |
| role | Role | USER / OWNER / ADMIN |
| profileImage | String | Optional profile image |
| bio | String | User bio |

---

## Venue Model

Stores sports venues.

| Field | Type |
|---|---|
| name | String |
| description | String |
| location | String |
| sport | String |
| pricePerHour | Float |
| approved | Boolean |

---

## Match Model

Represents sports matches.

| Field | Type |
|---|---|
| title | String |
| sport | String |
| visibility | PUBLIC / PRIVATE |
| status | OPEN / FULL / COMPLETED |
| maxPlayers | Int |
| currentPlayers | Int |
| totalPrice | Float |
| splitPrice | Float |

---

# Authentication

Authentication uses:

- JWT tokens
- Protected API routes
- Role-based access control

---

# API Documentation

# Authentication APIs

## Signup

### Endpoint

```http
POST /api/auth/signup
```

### Request Body

```json
{
  "name": "Advaith",
  "email": "advaith@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "message": "User created successfully"
}
```

---

## Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "advaith@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "role": "USER"
  }
}
```

---

# Venue APIs

## Create Venue

### Endpoint

```http
POST /api/owners/venue
```

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "Elite Turf",
  "description": "5v5 Football Turf",
  "location": "Bangalore",
  "sport": "Football",
  "pricePerHour": 2500,
  "images": []
}
```

---

## Get All Venues

### Endpoint

```http
GET /api/venues
```

---

## Get Venue By ID

### Endpoint

```http
GET /api/venues/:id
```

---

# Slot APIs

## Create Slot

### Endpoint

```http
POST /api/slots
```

### Request Body

```json
{
  "venueId": "venue_id",
  "startTime": "2026-05-11T10:00:00Z",
  "endTime": "2026-05-11T11:00:00Z"
}
```

---

## Get Slots

### Endpoint

```http
GET /api/slots
```

---

# Match APIs

## Create Match

### Endpoint

```http
POST /api/matches
```

### Request Body

```json
{
  "title": "Sunday Football",
  "sport": "Football",
  "visibility": "PUBLIC",
  "maxPlayers": 10,
  "venueId": "venue_id",
  "slotId": "slot_id",
  "totalPrice": 2000
}
```

### Logic

```txt
splitPrice = totalPrice / maxPlayers
```

---

## Explore Matches

### Endpoint

```http
GET /api/matches/explore
```

Returns:

- Public matches
- Open matches
- Upcoming matches

---

## Join Match

### Endpoint

```http
POST /api/matches/:id/join
```

### Features

- Adds participant
- Updates currentPlayers
- Updates match status if full
- Creates notifications

---

# Chat APIs

## Get Match Chat

### Endpoint

```http
GET /api/chat/:matchId
```

---

## Send Message

### Endpoint

```http
POST /api/chat/:matchId/send
```

### Request Body

```json
{
  "content": "Anyone bringing extra footballs?"
}
```

---

## Get Messages

### Endpoint

```http
GET /api/chat/:matchId/messages
```

---

# Follow APIs

## Follow User

### Endpoint

```http
POST /api/follow/:userId
```

### Features

- Follow/unfollow toggle
- Notification creation

---

# Notification APIs

## Get Notifications

### Endpoint

```http
GET /api/notifications
```

---

# Owner APIs

## Get Owner Venues

### Endpoint

```http
GET /api/owners/venue
```

---

## Get Owner Bookings

### Endpoint

```http
GET /api/owners/bookings
```

---

## Get Owner Matches

### Endpoint

```http
GET /api/owners/matches
```

---

# Admin APIs

## Get Pending Venues

### Endpoint

```http
GET /api/admin/pending-venues
```

---

## Approve Venue

### Endpoint

```http
POST /api/admin/approve
```

### Request Body

```json
{
  "venueId": "venue_id"
}
```

---

## Get All Users

### Endpoint

```http
GET /api/admin/users
```

---

# Real-Time Chat Architecture

```txt
User A
   ↓
Socket Emit
   ↓
Server
   ↓
Broadcast to Match Room
   ↓
User B Receives Message
```

---

# Notification System

Notifications are created for:

- Match joined
- Match cancelled
- User followed
- Match created

---

# Role-Based Access

| Role | Permissions |
|---|---|
| USER | Join matches, chat |
| OWNER | Manage venues |
| ADMIN | Full moderation |

---

# Environment Variables

Create a `.env` file.

```env
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
```

---

# Installation

## Clone Repository

```bash
git clone <repository_url>
```

---

## Install Dependencies

```bash
npm install
```

---

## Setup Prisma

```bash
npx prisma generate
npx prisma db push
```

---

## Seed Database

```bash
node prisma/seed.js
```

---

## Run Development Server

```bash
npm run dev
```

---

# Testing

The project includes API route tests.

```bash
npm run test
```

---

# Future Improvements

- Razorpay/Stripe integration
- Live match score tracking
- Tournament system
- AI player recommendations
- Geo-location nearby venues
- Push notifications
- Team creation

