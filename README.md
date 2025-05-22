# Airbnb Clone - Full Stack Application

An Airbnb clone built with React (frontend) and Node.js/Express (backend). This application allows users to browse, search, and book accommodations, as well as list their own properties.

![Home Page](./client/src/assets/homepage.png)

## Features

### User Authentication
- User registration with secure password validation
- Login/logout functionality
- JWT-based authentication with secure cookie storage
- Protected routes and user sessions

### Property Management
- Add, edit, and delete property listings
- Upload multiple photos for properties
- Set property details (price, location, amenities, etc.)
- Property photo gallery with main photo selection

### Booking System
- Search properties
- View detailed property information
- Make bookings with date selection
- View booking history
- Booking validation and error handling

### User Interface
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Image galleries with modal view
- Clean, modern UI inspired by Airbnb

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Set Up MongoDB Atlas

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free" and create an account
3. Choose the **FREE** M0 tier (512MB storage)
4. Select your preferred cloud provider and region

### 2. Create Database and Get Connection String

#### 2.1. Create a Cluster:
- After account setup, create a new cluster
- Choose "Shared" (free tier)
- Keep default settings and click "Create Cluster"

#### 2.2 Create Database User:
- Go to "Database Access" in the left sidebar
- Click "Add New Database User"
- Choose "Password" authentication
- Create username and strong password
- Set user privileges to "Read and write to any database"
- Click "Add User"

#### 2.3 Whitelist IP Address:
- Go to "Network Access" in the left sidebar
- Click "Add IP Address"
- Click "Add Current IP Address" or "Allow Access from Anywhere" (0.0.0.0/0) for development
- Click "Confirm"

#### 2.4 Get Connection String:
- Go to "Clusters" and click "Connect"
- Choose "Connect your application"
- Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/phuoc-stack/Airbnb-Clone.git
   cd airbnb-clone
   ```

2. **Install backend dependencies**
   ```bash
   cd api
   yarn install
   ```

3. **Install backend dependencies**
   ```bash
   cd client
   yarn install
   ```

4. **Environment Setup: Create a .env file in the api directory:**
   ```bash
   # Replace with your actual MongoDB Atlas connection string
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name
   
   # Generate a secure JWT secret 
   JWT_SECRET=your_secure_jwt_secret_here
   ```

5. **Run the application backend**
   ```bash
   cd api
   yarn dev
   ```
   Server will run on `http://localhost:4001`

6. **Run the application frontend**
   ```bash
   cd client
   yarn dev
   ```
   Application will be available at `http://localhost:5173`

## 🙏 Acknowledgments

- Inspired by Airbnb's design and functionality
- Thanks to the React and Node.js communities
---

**Note**: This is a clone project for educational purposes. It is not affiliated with Airbnb, Inc.