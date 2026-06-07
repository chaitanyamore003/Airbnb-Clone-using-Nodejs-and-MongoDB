# Airbnb Clone using Node.js & MongoDB

A full-stack Airbnb-inspired web application built with **Node.js, Express, MongoDB, EJS, Tailwind CSS, Cloudinary, and MongoDB Atlas**. Users can browse properties, manage favourites and bookings, while hosts can create, edit, and manage their own property listings.

## Live Demo

🌐 **Live Application:**
[Airbnb Clone Live Demo](https://airbnb-clone-using-nodejs-and-mongodb.onrender.com/)

## Features

### Authentication & Authorization

* User registration and login
* Password hashing using bcrypt
* Session-based authentication
* Guest and Host roles
* Protected routes for authenticated users
* Authorization checks to ensure hosts can only manage their own properties

### Property Management

* Add new property listings
* Edit existing listings
* Delete listings
* Property details page
* Cloudinary image uploads
* Ownership tracking for every property

### Guest Features

* Browse all available properties
* View detailed property information
* Add properties to favourites
* Remove properties from favourites
* Book properties
* View booked properties
* Cancel bookings

### Host Features

* Manage only properties owned by the logged-in host
* Secure edit and delete operations
* Automatic cleanup of favourites and bookings when a property is deleted

### Security

* Helmet security middleware
* Content Security Policy (CSP)
* Express Session authentication
* Password hashing with bcrypt
* Input validation using Express Validator
* Protected routes and authorization checks

### Error Handling

* Custom 404 page
* Custom 500 page
* Global error handling middleware
* Form validation feedback

### Deployment Ready

* MongoDB Atlas database
* Cloudinary image storage
* GitHub version control
* Render deployment

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Frontend

* EJS
* Tailwind CSS

### Authentication & Security

* Express Session
* bcryptjs
* Helmet

### File Uploads

* Multer
* Cloudinary
* Multer Storage Cloudinary

### Validation

* Express Validator

### Deployment

* Render
* MongoDB Atlas
* Cloudinary

---

## Database Design

### User Schema

```javascript
{
  firstName,
  lastName,
  email,
  password,
  userType,
  favourites: [Home],
  bookings: [Home]
}
```

### Home Schema

```javascript
{
  name,
  price,
  location,
  rating,
  photo,
  description,
  owner
}
```

---

## Project Structure

```text
airbnb_mongoose/
│
├── config/
│   └── cloudinary.js
│
├── controller/
│   ├── authController.js
│   ├── hostController.js
│   ├── storeController.js
│   └── errors.js
│
├── middleware/
│   ├── isAuth.js
│   └── upload.js
│
├── models/
│   ├── home.js
│   └── user.js
│
├── public/
│   ├── images/
│   └── output.css
│
├── routes/
│   ├── authRouter.js
│   ├── hostRouter.js
│   └── storeRouter.js
│
├── views/
│   ├── auth/
│   ├── host/
│   ├── partials/
│   └── store/
│
├── utils/
│   └── pathUtils.js
│
├── app.js
├── package.json
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/chaitanyamore003/Airbnb-Clone-using-Nodejs-and-MongoDB.git

cd Airbnb-Clone-using-Nodejs-and-MongoDB
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create a `.env` file in the root directory.

```env
MONGODB_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### Build Tailwind CSS

```bash
npm run build:css
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## Key Learning Outcomes

This project demonstrates:

* MVC Architecture
* RESTful Routing
* Session-Based Authentication
* MongoDB Relationships using References
* Authorization & Ownership Checks
* File Uploads with Cloudinary
* Input Validation
* Error Handling
* Deployment of Full-Stack Applications
* Security Best Practices in Express Applications

---

## Future Improvements

* Search and filtering functionality
* Property categories
* Multiple property images
* User profile management
* Booking dates and availability system
* Payment gateway integration
* Reviews and ratings by users
* Admin dashboard
* Email verification and password reset

---

## Screenshots

Add screenshots of:

* Home Page
* Property Details Page
* Login & Signup
* Host Dashboard
* Add Property Form
* Favourites Page
* Bookings Page

---

## Author

**Chaitanya More**

* GitHub: [chaitanyamore003 GitHub Profile](https://github.com/chaitanyamore003?utm_source=chatgpt.com)

---

## License

This project is developed for learning and educational purposes.
