# JIRAO Backend API - Simplified Version

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Setup**
   - Install MySQL server
   - Create database and user
   - Run the SQL schema: `mysql -u your_username -p < database_schema.sql`
   - Update database credentials in `main.py`

3. **Configuration**
   - Update database connection details in `main.py` (lines 18-23)
   - No authentication needed - simplified version

4. **Run the Server**
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once running, visit:
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Schema

The database includes these tables:
- `users` - User accounts (guests, hosts, admins)
- `spaces` - Room and parking space listings
- `interests` - User interest in spaces
- `reports` - User reports
- `pending_hosts` - Host applications awaiting approval

## Implementation Notes

All API functions are created as reference templates. You need to implement:

1. **Database Operations** - Complete the SQL queries for each endpoint
2. **Request/Response Handling** - Get data from request body and return proper JSON
3. **Error Handling** - Add proper error responses
4. **Business Logic** - Implement the specific logic for each endpoint

Each function includes detailed comments about:
- What data it receives (request format)
- What data to return (response format)  
- Logic to implement (step-by-step instructions)

## No Authentication Required

This simplified version doesn't use:
- Password hashing
- JWT tokens
- Pydantic models
- Complex authentication

Just simple database operations and JSON responses.