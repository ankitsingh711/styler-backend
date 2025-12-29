# Styler API Documentation

## 📚 Documentation Files

This directory contains comprehensive API documentation for the Styler Backend platform.

### Files Included

1. **`swagger.yaml`** - OpenAPI 3.0 Specification
   - Complete API schema
   - All endpoints documented
   - Request/response examples
   - Authentication details
   - **Use with SwaggerHub or Swagger Editor**

2. **`Styler-API.postman_collection.json`** - Postman Collection
   - All 52+ endpoints ready to test
   - Auto-variable extraction (tokens, IDs)
   - Pre-configured request bodies
   - Environment variables setup
   - Test scripts included

## 🚀 Quick Start

### Using SwaggerHub

1. Go to [SwaggerHub](https://app.swaggerhub.com/)
2. Click "Create New" → "Import and Document API"
3. Upload `swagger.yaml`
4. View interactive documentation

### Using Swagger Editor (Local)

```bash
# Using Docker
docker run -p 8080:8080 swaggerapi/swagger-editor

# Open browser to http://localhost:8080
# Copy contents of swagger.yaml and paste in editor
```

### Using Postman

1. Open Postman
2. Click "Import" button
3. Select `Styler-API.postman_collection.json`
4. Collection will be imported with all endpoints

## 📝 Postman Collection Features

### Auto-Variable Extraction 
The collection automatically extracts and stores:
- `access_token` - JWT token from login/register
- `refresh_token` - Refresh token
- `user_id` - Current user ID
- `salon_id` - Created salon ID
- `appointment_id` - Created appointment ID
- `barber_id` - Created barber ID

### Environment Variables
Default values:
- `base_url`: `http://localhost:9168/api/v1`

### Test Flow

**Recommended Testing Order:**

1. **Authentication**
   - Register User → automatically saves `access_token`
   - Or Login → saves tokens
   
2. **Create Salon** (as salon owner)
   - Register Salon → saves `salon_id`
   - Add Services
   - Update Operating Hours

3. **Book Appointment**
   - Search Nearby Salons
   - Check Availability
   - Book Appointment → saves `appointment_id`

4. **Process Payment**
   - Initiate Payment
   - (Complete payment on Razorpay frontend)
   - Verify Payment

5. **Submit Review**
   - Submit Review (after appointment completed)

6. **Barber Flow**
   - Register as Barber → saves `barber_id`
   - Update Availability
   - Get Pending (as salon owner)
   - Approve/Reject Barber

## 🔐 Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
```

The collection automatically handles this using the `{{access_token}}` variable.

## 📊 API Modules

### 🔐 Authentication (6 endpoints)
- Register, Login, Logout
- Token refresh
- Password management

### 🏪 Salons (12 endpoints)
- CRUD operations
- **Geospatial search**
- Service management
- Operating hours

### 📅 Appointments (9 endpoints)
- Booking with availability check
- Status management
- Statistics

### 💳 Payments (6 endpoints)
- **Razorpay integration**
- Payment verification
- Refunds

### ⭐ Reviews (5 endpoints)
- Multi-dimensional ratings
- Review submission
- Rating aggregation

### 💈 Barbers (9 endpoints)
- Registration & approval
- Availability management
- Document uploads

## 🧪 Testing Tips

1. **Start with Authentication**: Always login first to get access token
2. **Use Auto-Variables**: Collection automatically saves IDs from responses
3. **Follow the Flow**: Test in the order: Auth → Salon → Appointment → Payment → Review
4. **Check Responses**: Look for auto-extracted variables in "Test Results" tab
5. **Environment**: Can create different environments (dev, staging, prod)

## 📖 Example API Calls

### Search Nearby Salons
```http
GET /salons/nearby?latitude=28.6139&longitude=77.2090&radius=10
```

### Book Appointment
```json
POST /appointments
{
  "salonId": "{{salon_id}}",
  "serviceIds": ["service1", "service2"],
  "scheduledAt": "2024-02-15T14:00:00.000Z"
}
```

### Submit Review
```json
POST /reviews
{
  "appointmentId": "{{appointment_id}}",
  "rating": 5,
  "comment": "Excellent service!",
  "serviceQuality": 5,
  "punctuality": 5,
  "cleanliness": 5,
  "valueForMoney": 4
}
```

## 🔗 Additional Resources

- [OpenAPI Specification](swagger.yaml)
- [Postman Collection](Styler-API.postman_collection.json)
- [API Base URL](http://localhost:9168/api/v1)

---

**Happy Testing! 🚀**
