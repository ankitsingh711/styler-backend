# Styler - Hair Salon Booking Platform

<div align="center">
  <img width="250" height="150" alt="Styler Logo" src="./client/public/images/stylerLogo.png">
  <h2>A modern hair salon booking platform built with the MERN stack</h2>
</div>

---

## 🚀 Tech Stack

### Frontend
- **React.js** with **Vite** - Fast, modern UI development
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **CSS Modules** - Component-scoped styling

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Redis** - Caching (optional)

---

## ✨ Features

### For Customers
- 👤 User registration and authentication
- 💇 Browse gents and ladies grooming services
- 📅 Book appointments with preferred stylers
- 🕐 Select date and time slots
- 📋 View appointment history and status
- 👨‍💼 Manage user profile

### For Administrators
- 📊 Dashboard with statistics
- 👥 Manage users (view, block/unblock)
- ✂️ Manage stylers (add, edit, delete)
- 💼 Manage services (CRUD operations)
- 📆 View and manage all appointments
- 🔄 Update appointment status

---

## 📁 Project Structure

```
Styler/
├── client/                 # React frontend application
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth)
│   │   ├── services/      # API service layer
│   │   └── utils/         # Constants and helpers
│   └── package.json
│
├── Backend/               # Express.js backend
│   ├── config/           # Database and config
│   ├── Model/            # Mongoose models
│   ├── Routers/          # API routes
│   ├── Middleware/       # Auth & validation
│   └── package.json
│
└── Frontend-old/         # Legacy vanilla JS (archived)
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js** v14 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

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

   Create `Backend/.env`:
   ```env
   PORT=9168
   CLIENT_URL=http://localhost:5173
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:9168
   ```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd Backend
npm run server
```
Server runs at: `http://localhost:9168`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Access Points
- **User App**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login

---

## 🎨 Design Highlights

- **Modern Gradient Themes**
  - User interface: Purple gradient (`#667eea` → `#764ba2`)
  - Admin interface: Blue gradient (`#1e3c72` → `#2a5298`)

- **Responsive Design**
  - Mobile-first approach
  - Hamburger menu for mobile
  - Optimized for all screen sizes

- **Smooth UX**
  - Loading animations
  - Hover effects and transitions
  - Protected routes
  - Error handling

---

## 📱 API Endpoints

### User Routes (`/user`)
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile
- `GET /user/appointments` - Get user appointments
- `POST /user/appointments` - Create appointment

### Admin Routes (`/admin`)
- `POST /admin/login` - Admin login
- `GET /admin/users` - Get all users
- `GET /admin/stylers` - Get all stylers
- `GET /admin/services` - Get all services
- `GET /admin/appointments` - Get all appointments

*For complete API documentation, see [client/README.md](./client/README.md)*

---

## 📸 Screenshots

### User Interface
- Landing page with services showcase
- Appointment booking form
- User profile and appointment history

### Admin Panel
- Dashboard with statistics
- User, styler, and service management
- Appointment tracking

---

## 🛠️ Development

### Frontend Development
```bash
cd client
npm run dev    # Start dev server
npm run build  # Build for production
```

### Backend Development
```bash
cd Backend
npm run server  # Start with nodemon (auto-reload)
```

---

## 🎯 Migration from Vanilla JS

This project was successfully migrated from vanilla HTML/CSS/JavaScript to the MERN stack:

**Before**: 10 HTML files, 12 JavaScript files, 10 CSS files
**After**: Modern React components, centralized state, API services

**Benefits**:
- ✅ Component reusability
- ✅ Better code organization
- ✅ Centralized state management
- ✅ Fast development with Vite
- ✅ Type-safe API calls
- ✅ Modern tooling and HMR

---

## 👥 Contributors

- [@Shanukajain](https://github.com/shanukajain)
- [@chandan1506](https://github.com/chandan1506)
- [@SoumyaAdhya007](https://github.com/SoumyaAdhya007)
- [@Chetan-bhagat](https://github.com/Chetan-bhagat)
- [@ankitsingh711](https://github.com/ankitsingh711)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Show Your Support

Give a ⭐ if you like this project!

---

**Note**: The old vanilla JavaScript implementation has been archived in the `Frontend-old` directory for reference.
