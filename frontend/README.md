# Styler - Hair Salon Booking Platform (MERN Stack)

A modern, full-stack hair salon booking platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### User Features
- User registration and authentication with JWT
- Browse available services (Gents & Ladies)
- View styler profiles and specializations
- Book appointments with preferred styler and time slot
- View appointment history and status
- Manage user profile

### Admin Features
- Admin dashboard with statistics
- Manage users (view, block/unblock)
- Manage stylers (add, edit, delete)
- Manage services (add, edit, delete, pricing)
- View and manage all appointments
- Update appointment status

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with **Mongoose** ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Redis** - Caching (optional)

## 📁 Project Structure

```
Styler/
├── client/                 # React frontend
│   ├── public/
│   │   └── images/        # Static images
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   └── booking/
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/       # React Context
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Backend/               # Express backend
│   ├── config/           # Configuration files
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Middleware functions
│   ├── index.js          # Entry point
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Styler
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**

   Create `.env` file in the Backend directory:
   ```env
   PORT=9168
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   REDIS_URL=your_redis_url (optional)
   ```

   Create `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:9168
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run server
   ```
   Server will run on `http://localhost:9168`

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   - User Interface: `http://localhost:5173`
   - Admin Login: `http://localhost:5173/admin/login`

## 📱 API Endpoints

### User Routes (`/user`)
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile
- `PUT /user/update` - Update user profile
- `GET /user/appointments` - Get user appointments
- `POST /user/appointments` - Create new appointment

### Admin Routes (`/admin`)
- `POST /admin/login` - Admin login
- `GET /admin/users` - Get all users
- `POST /admin/block` - Block/unblock user
- `GET /admin/stylers` - Get all stylers
- `POST /admin/stylers` - Add new styler
- `PUT /admin/stylers/:id` - Update styler
- `DELETE /admin/stylers/:id` - Delete styler
- `GET /admin/services` - Get all services
- `POST /admin/services` - Add new service
- `PUT /admin/services/:id` - Update service
- `DELETE /admin/services/:id` - Delete service
- `GET /admin/appointments` - Get all appointments
- `PUT /admin/appointments/:id` - Update appointment status

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Gradient Themes** - Purple gradient for users, blue for admin
- **Smooth Animations** - Hover effects and transitions
- **Protected Routes** - Authentication-based navigation
- **Loading States** - Animated loader with scissors icon
- **Error Handling** - User-friendly error messages

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token is generated and stored in localStorage
3. Token is attached to all API requests via Axios interceptor
4. Protected routes verify authentication before rendering
5. Admin routes additionally check for admin role

## 👥 Authors

- [@Shanukajain](https://github.com/shanukajain)
- [@chandan1506](https://github.com/chandan1506)
- [@SoumyaAdhya007](https://github.com/SoumyaAdhya007)
- [@Chetan-bhagat](https://github.com/Chetan-bhagat)
- [@ankitsingh711](https://github.com/ankitsingh711)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙌 Show Your Support

Give a ⭐ if you like this project!

---

**Note**: This is a migrated version of the original Styler project, now using modern React with Vite instead of vanilla JavaScript.
