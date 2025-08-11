from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import json

app = FastAPI(title="JIRAO API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    """
    Create and return a MySQL database connection.
    Configure your database credentials here.
    """
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='jirao_db',
            user='root',
            password=''
        )
        return connection
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# AUTH ENDPOINTS

@app.get("/api/test")
async def test():
    conn = get_db_connection()

    cursor = conn.cursor()
    return {"message": "Hello, World!"}

    cursor.close()
    conn.close()

@app.post("/api/auth/login")
async def login(request: Request):
    """
    User login endpoint.
    
    RECEIVES (from request body):
    {
        "email": "string",
        "password": "string"
    }
    
    YOU NEED TO RETURN:
    {
        "user": {
            "id": 1,
            "username": "john_guest",
            "email": "john@example.com",
            "role": "guest",  # 'guest', 'host', 'admin'
            "status": "active",  # 'active', 'banned', 'pending'
            "date_joined": "2024-01-15T10:30:00Z"
        },
        "token": "simple_token_123"  # Just return any string as token
    }
    
    LOGIC TO IMPLEMENT:
    1. Get email and password from request body
    2. Check if user exists in database: SELECT * FROM users WHERE email = ?
    3. Return user info and a simple token (no real authentication needed)
    4. If user not found, raise HTTPException(status_code=401, detail="Invalid credentials")
    """
    # TODO: Implement login logic
    try:
        # 1. Parse JSON body
        data = await request.json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password required")

        # 2. Connect to MySQL
        connection = get_db_connection(); 
        cursor = connection.cursor(dictionary=True)

        # 3. Query user
        query = """
        SELECT id, username, email, role, status, date_joined
        FROM users
        WHERE email = %s AND password = %s
        """
        cursor.execute(query, (email, password))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Ivalid credentials")

        if user["status"] == "banned": 
            raise HTTPException(status_code=401, detail="User is Banned")


        # 4. Format datetime for JSON
        if isinstance(user["date_joined"], datetime):
            user["date_joined"] = user["date_joined"].isoformat() + "Z"

        # 5. Return user info and a simple token
        return {
            "user": user,
            "token": ""
        }

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()



@app.post("/api/auth/register")
async def register(request: Request):
    """
    User registration endpoint.
    
    RECEIVES (from request body):
    {
        "username": "string",
        "email": "string", 
        "password": "string",
        "role": "guest"  # 'guest' or 'host'
        phone: "string" , 
        nid_number: "string" # will be present only if role is host 

    }
    
    YOU NEED TO RETURN:
    For guests: Same as login response
    For hosts: Raise HTTPException(status_code=400, detail="Host application submitted. Please wait for admin approval.")
    
    LOGIC TO IMPLEMENT:
    1. Get data from request body
    2. Check if username/email already exists: SELECT * FROM users WHERE username = ? OR email = ?
    3. If role is 'host', insert into pending_hosts table and raise error
    4. If role is 'guest', insert into users table: INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, 'active')
    5. Return user info and token
    """
    # TODO: Implement registration logic
    

    try:
        # 1. Parse JSON body
        data = await request.json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")
        phone = data.get("phone")
        # accept either "nid" or "nid_number" from client
        nid = data.get("nid") or data.get("nid_number")

        # Basic validation
        if not username or not email or not password or not role:
            raise HTTPException(status_code=400, detail="Missing required fields")
        if role not in ("guest", "host"):
            raise HTTPException(status_code=400, detail="Invalid role")

        # 2. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 3. Check if username/email already exists in users
        check_users_q = "SELECT id FROM users WHERE username = %s OR email = %s"
        cursor.execute(check_users_q, (username, email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # 3b. Also check pending_hosts to avoid duplicate host applications
        cursor.execute("SELECT id FROM pending_hosts WHERE username = %s OR email = %s", (username, email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Pending host application already exists for this username/email")

        # 4. If host -> insert into pending_hosts and raise the required HTTPException
        if role == "host":
            if not nid:
                raise HTTPException(status_code=400, detail="NID is required for host registration")

            insert_pending_q = """
            INSERT INTO pending_hosts (username, email, password, phone, nid)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_pending_q, (username, email, password, phone, nid))
            connection.commit()

            # Per spec: respond by raising 400 with this message
            raise HTTPException(status_code=400, detail="Host application submitted. Please wait for admin approval.")

        # 5. If guest -> insert into users with status 'active'
        insert_guest_q = """
        INSERT INTO users (username, email, password, role, status, phone)
        VALUES (%s, %s, %s, 'guest', 'active', %s)
        """
        cursor.execute(insert_guest_q, (username, email, password, phone))
        connection.commit()
        user_id = cursor.lastrowid

        # 6. Fetch the inserted user to return
        cursor.execute("""
        SELECT id, username, email, role, status, date_joined, phone, nid
        FROM users
        WHERE id = %s
        """, (user_id,))
        user = cursor.fetchone()

        # 7. Format date_joined
        if user and isinstance(user.get("date_joined"), datetime):
            user["date_joined"] = user["date_joined"].isoformat() + "Z"

        # 8. Return guest info + token (simple token as requested)
        return {
            "user": user,
            "token": "simple_token_register"
        }

    except Error as e:
        # Database / connector errors
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.post("/api/auth/admin-login")
async def admin_login(request: Request):
    """
    Admin login endpoint.
    
    RECEIVES (from request body):
    {
        "username": "string",
        "password": "string"
    }
    
    YOU NEED TO RETURN:
    Same as regular login but only for admin users
    
    LOGIC TO IMPLEMENT:
    1. Get username and password from request body
    2. Check if user exists and role is 'admin': SELECT * FROM users WHERE username = ? AND role = 'admin'
    3. Check if status is not 'banned'
    4. Return user info and token
    """
    # TODO: Implement admin login logic
    

    try:
        # 1. Parse request body
        data = await request.json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise HTTPException(status_code=400, detail="Username and password required")

        # 2. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 3. Query admin user
        query = """
        SELECT id, username, email, role, status, date_joined
        FROM users
        WHERE username = %s AND password = %s AND role = 'admin'
        """
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid admin credentials")

        # 4. Check if not banned
        if user["status"] == "banned":
            raise HTTPException(status_code=403, detail="Admin account is banned")

        # 5. Format date
        if isinstance(user["date_joined"], datetime):
            user["date_joined"] = user["date_joined"].isoformat() + "Z"

        # 6. Return with token
        return {
            "user": user,
            "token": "simple_token_admin"
        }

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# SPACE ENDPOINTS

@app.get("/api/spaces")
async def get_spaces(location: str = None):
    """
    Get available spaces with optional location filter.
    
    RECEIVES (query parameters):
    - location: string (optional) - e.g., ?location=Manhattan
    
    YOU NEED TO RETURN:
    [
        {
            "id": 1,
            "owner_id": 2,
            "type": "room",  # 'room' or 'parking'
            "title": "Cozy Downtown Room",
            "location": "Downtown NYC",
            "rate_per_hour": 15.0,
            "description": "A comfortable room...",
            "availability": "available",  # should be 'available'
            "owner_name": "sarah_host",
            "dimensions": {"length": 20, "width": 10, "height": 8}  # only for parking, null for rooms
        }
    ]
    
    LOGIC TO IMPLEMENT:
    1. Query spaces where availability = 'available'
    2. If location provided, add WHERE location LIKE '%location%'
    3. Join with users table: SELECT s.*, u.username as owner_name FROM spaces s JOIN users u ON s.owner_id = u.id
    4. For parking spaces, parse dimensions JSON
    5. Return array of spaces
    """
    # TODO: Implement get spaces logic
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)

        base_query = """
            SELECT s.*, u.username AS owner_name
            FROM spaces s
            JOIN users u ON s.owner_id = u.id

        """
        params = ()

        if location:
            base_query += " AND s.location LIKE %s"
            params = ('%' + location + '%',)

        cursor.execute(base_query, params)
        spaces = cursor.fetchall()

        # Process dimensions JSON for parking spaces
        for space in spaces:
            if space["type"] == "parking" and space["dimensions"]:
                try:
                    space["dimensions"] = json.loads(space["dimensions"])
                except json.JSONDecodeError:
                    space["dimensions"] = None
            else:
                space["dimensions"] = None

        cursor.close()
        conn.close()

        return spaces

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/spaces/{space_id}")
async def get_space_by_id(space_id: int):
    """
    Get single space by ID.
    
    RECEIVES (path parameter):
    - space_id: int - from URL like /api/spaces/123
    
    YOU NEED TO RETURN:
    Same format as single space in get_spaces
    
    LOGIC TO IMPLEMENT:
    1. Query space by ID: SELECT s.*, u.username as owner_name FROM spaces s JOIN users u ON s.owner_id = u.id WHERE s.id = ?
    2. If not found, raise HTTPException(status_code=404, detail="Space not found")
    3. Return space object
    """
    # TODO: Implement get space by ID logic
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT s.*, u.username AS owner_name
            FROM spaces s
            JOIN users u ON s.owner_id = u.id
            WHERE s.id = %s
        """
        cursor.execute(query, (space_id,))
        space = cursor.fetchone()

        if not space:
            raise HTTPException(status_code=404, detail="Space not found")

        # Process dimensions JSON for parking spaces
        if space["type"] == "parking" and space["dimensions"]:
            try:
                space["dimensions"] = json.loads(space["dimensions"])
            except json.JSONDecodeError:
                space["dimensions"] = None
        else:
            space["dimensions"] = None

        cursor.close()
        conn.close()

        return space

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/spaces/host/{owner_id}")
async def get_host_spaces(owner_id: int):
    """
    Get all spaces owned by a host.
    
    RECEIVES (path parameter):
    - owner_id: int - from URL like /api/spaces/host/123
    
    YOU NEED TO RETURN:
    Array of spaces (same format as get_spaces) but including all availability statuses
    
    LOGIC TO IMPLEMENT:
    1. Query all spaces where owner_id matches: SELECT s.*, u.username as owner_name FROM spaces s JOIN users u ON s.owner_id = u.id WHERE s.owner_id = ?
    2. Return array of spaces
    """
    # TODO: Implement get host spaces logic
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT s.*, u.username AS owner_name
            FROM spaces s
            JOIN users u ON s.owner_id = u.id
            WHERE s.owner_id = %s
        """
        cursor.execute(query, (owner_id,))
        spaces = cursor.fetchall()

        # Process 'dimensions' JSON field
        for space in spaces:
            if space["type"] == "parking" and space["dimensions"]:
                try:
                    space["dimensions"] = json.loads(space["dimensions"])
                except json.JSONDecodeError:
                    space["dimensions"] = None
            else:
                space["dimensions"] = None

        cursor.close()
        conn.close()

        return spaces

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/spaces")
async def create_space(request: Request):
    """
    Create a new space.
    
    RECEIVES (from request body):
    {
        "type": "room",  # 'room' or 'parking'
        "title": "My Room",
        "location": "Manhattan",
        "rate_per_hour": 25.0,
        "description": "Nice room...",
        "availability": "available",
        "dimensions": {"length": 20, "width": 10, "height": 8}  # optional, only for parking
    }
    
    YOU NEED TO RETURN:
    {
        "id": 123,
        "owner_id": 2,
        "type": "room",
        "title": "My Room",
        "location": "Manhattan", 
        "rate_per_hour": 25.0,
        "description": "Nice room...",
        "availability": "available",
        "owner_name": "host_username",
        "dimensions": null  # or dimensions object for parking
    }
    
    LOGIC TO IMPLEMENT:
    1. Get data from request body
    2. Get owner_id from token/session (for now, you can hardcode or get from request)
    3. Insert new space: INSERT INTO spaces (owner_id, type, title, location, rate_per_hour, description, availability, dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    4. Get the created space with owner name
    5. Return the created space
    """
    # TODO: Implement create space logic
    
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    # Required fields validation (simple)
    required_fields = ["owner_id", "type", "title", "location", "rate_per_hour", "description", "availability"]
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=422, detail=f"Missing required field: {field}")

    owner_id = data["owner_id"]
    type_ = data["type"]
    title = data["title"]
    location = data["location"]
    rate_per_hour = data["rate_per_hour"]
    description = data["description"]
    availability = data["availability"]
    dimensions = data.get("dimensions")

    # Serialize dimensions if parking and dimensions present
    dimensions_json = None
    if type_ == "parking" and dimensions:
        try:
            dimensions_json = json.dumps(dimensions)
        except Exception:
            raise HTTPException(status_code=422, detail="Invalid dimensions format")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        insert_query = """
            INSERT INTO spaces
            (owner_id, type, title, location, rate_per_hour, description, availability, dimensions)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            owner_id, type_, title, location, rate_per_hour, description, availability, dimensions_json
        ))
        conn.commit()

        new_space_id = cursor.lastrowid

        select_query = """
            SELECT s.*, u.username AS owner_name
            FROM spaces s
            JOIN users u ON s.owner_id = u.id
            WHERE s.id = %s
        """
        cursor.execute(select_query, (new_space_id,))
        created_space = cursor.fetchone()

        # Process dimensions field
        if created_space["type"] == "parking" and created_space["dimensions"]:
            try:
                created_space["dimensions"] = json.loads(created_space["dimensions"])
            except Exception:
                created_space["dimensions"] = None
        else:
            created_space["dimensions"] = None

        cursor.close()
        conn.close()

        return created_space

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/spaces/{space_id}")
async def update_space(space_id: int, request: Request):
    """
    Update an existing space.
    
    RECEIVES (path parameter):
    - space_id: int - from URL like /api/spaces/123
    
    RECEIVES (from request body):
    {
        "title": "Updated Room Title",
        "location": "Updated Location",
        "rate_per_hour": 30.0,
        "description": "Updated description...",
        "dimensions": {"length": 25, "width": 12, "height": 9}  # optional, only for parking
    }
    
    YOU NEED TO RETURN:
    {
        "id": 123,
        "owner_id": 2,
        "type": "room",
        "title": "Updated Room Title",
        "location": "Updated Location",
        "rate_per_hour": 30.0,
        "description": "Updated description...",
        "availability": "available",
        "owner_name": "host_username",
        "dimensions": null  # or dimensions object for parking
    }
    
    LOGIC TO IMPLEMENT:
    1. Get space_id from URL parameter
    2. Get update data from request body
    3. Check if space exists: SELECT * FROM spaces WHERE id = ?
    4. Update space: UPDATE spaces SET title = ?, location = ?, rate_per_hour = ?, description = ?, dimensions = ? WHERE id = ?
    5. Get updated space with owner name
    6. Return updated space
    """
    # TODO: Implement update space logic
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    # Required update fields (dimensions is optional)
    required_fields = ["title", "location", "rate_per_hour", "description"]
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=422, detail=f"Missing required field: {field}")

    title = data["title"]
    location = data["location"]
    rate_per_hour = data["rate_per_hour"]
    description = data["description"]
    dimensions = data.get("dimensions")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)

        # Check if space exists
        cursor.execute("SELECT * FROM spaces WHERE id = %s", (space_id,))
        space = cursor.fetchone()
        if not space:
            raise HTTPException(status_code=404, detail="Space not found")

        # Prepare dimensions JSON (only if parking)
        dimensions_json = None
        if space["type"] == "parking" and dimensions:
            try:
                dimensions_json = json.dumps(dimensions)
            except Exception:
                raise HTTPException(status_code=422, detail="Invalid dimensions format")

        # Update query
        update_query = """
            UPDATE spaces
            SET title = %s,
                location = %s,
                rate_per_hour = %s,
                description = %s,
                dimensions = %s
            WHERE id = %s
        """
        cursor.execute(update_query, (
            title, location, rate_per_hour, description, dimensions_json, space_id
        ))
        conn.commit()

        # Fetch updated space with owner_name
        select_query = """
            SELECT s.*, u.username AS owner_name
            FROM spaces s
            JOIN users u ON s.owner_id = u.id
            WHERE s.id = %s
        """
        cursor.execute(select_query, (space_id,))
        updated_space = cursor.fetchone()

        # Deserialize dimensions if parking
        if updated_space["type"] == "parking" and updated_space["dimensions"]:
            try:
                updated_space["dimensions"] = json.loads(updated_space["dimensions"])
            except Exception:
                updated_space["dimensions"] = None
        else:
            updated_space["dimensions"] = None

        cursor.close()
        conn.close()

        return updated_space

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/spaces/{space_id}/availability")
async def update_space_availability(space_id: int, request: Request):
    """
    Update space availability.
    
    RECEIVES:
    - space_id: int (path parameter)
    - Request body: {"availability": "on_hold"}  # 'available', 'on_hold', 'not_available'
    
    YOU NEED TO RETURN:
    Updated space object (same format as create_space)
    
    LOGIC TO IMPLEMENT:
    1. Get availability from request body
    2. Update space: UPDATE spaces SET availability = ? WHERE id = ?
    3. Get updated space with owner name
    4. Return updated space
    """
    # TODO: Implement update availability logic
    
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    availability = data.get("availability")
    if availability not in ("available", "on_hold", "not_available"):
        raise HTTPException(status_code=422, detail="Invalid or missing availability value")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)

        # Check if space exists
        cursor.execute("SELECT * FROM spaces WHERE id = %s", (space_id,))
        space = cursor.fetchone()
        if not space:
            raise HTTPException(status_code=404, detail="Space not found")

        # Update availability
        cursor.execute(
            "UPDATE spaces SET availability = %s WHERE id = %s",
            (availability, space_id)
        )
        conn.commit()

        # Get updated space with owner_name
        select_query = """
            SELECT s.*, u.username AS owner_name
            FROM spaces s
            JOIN users u ON s.owner_id = u.id
            WHERE s.id = %s
        """
        cursor.execute(select_query, (space_id,))
        updated_space = cursor.fetchone()

        # Parse dimensions if parking
        if updated_space["type"] == "parking" and updated_space["dimensions"]:
            try:
                updated_space["dimensions"] = json.loads(updated_space["dimensions"])
            except Exception:
                updated_space["dimensions"] = None
        else:
            updated_space["dimensions"] = None

        cursor.close()
        conn.close()

        return updated_space

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# INTEREST ENDPOINTS

@app.post("/api/interests")
async def express_interest(request: Request):
    """
    Express interest in a space.
    
    RECEIVES (from request body):
    {
        "user_id: userId, 
        "space_id": 123,
        "hours_requested": 4  # optional - can be null/undefined
    }
    
    YOU NEED TO RETURN:
    {
        "id": 456,
        "user_id": 1,
        "space_id": 123,
        "hours_requested": 4,  # or null if not provided
        "status": "pending",
        "host_response_date": null,
        "timestamp": "2024-01-15T10:30:00Z",
        "user_name": "john_guest",
        "user_email": "john@example.com",
        "space_title": "Cozy Room",
        "space_location": "Manhattan",
        "space_rate": 15.0
    }
    
    LOGIC TO IMPLEMENT:
    1. Get space_id and hours_requested from request body
    2. Get user_id 
    3. Check if already interested: SELECT * FROM interests WHERE user_id = ? AND space_id = ?
    4. If exists, raise HTTPException(status_code=400, detail="Already interested")
    5. Insert interest: INSERT INTO interests (user_id, space_id, hours_requested, status) VALUES (?, ?, ?, 'pending')
    6. Get interest with user and space details using JOINs
    7. Return interest object
    """
    # TODO: Implement express interest logic
    try:
        # 1. Parse JSON body
        data = await request.json()
        user_id = data.get("user_id")
        space_id = data.get("space_id")
        hours_requested = data.get("hours_requested")

        if not user_id or not space_id:
            raise HTTPException(status_code=400, detail="user_id and space_id are required")

        # 2. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 3. Check if already interested
        check_query = """
        SELECT id FROM interests WHERE user_id = %s AND space_id = %s
        """
        cursor.execute(check_query, (user_id, space_id))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Already interested")

        # 4. Insert interest
        insert_query = """
        INSERT INTO interests (user_id, space_id, hours_requested, status)
        VALUES (%s, %s, %s, 'pending')
        """
        cursor.execute(insert_query, (user_id, space_id, hours_requested))
        connection.commit()
        interest_id = cursor.lastrowid

        # 5. Retrieve interest with user and space details
        select_query = """
        SELECT 
            i.id, 
            i.user_id, 
            i.space_id, 
            i.hours_requested,
            i.status,
            i.host_response_date,
            i.timestamp,
            u.username AS user_name,
            u.email AS user_email,
            s.title AS space_title,
            s.location AS space_location,
            s.rate_per_hour AS space_rate
        FROM interests i
        JOIN users u ON i.user_id = u.id
        JOIN spaces s ON i.space_id = s.id
        WHERE i.id = %s
        """
        cursor.execute(select_query, (interest_id,))
        interest = cursor.fetchone()

        # 6. Format datetime fields
        if isinstance(interest["timestamp"], datetime):
            interest["timestamp"] = interest["timestamp"].isoformat() + "Z"
        if interest["host_response_date"] and isinstance(interest["host_response_date"], datetime):
            interest["host_response_date"] = interest["host_response_date"].isoformat() + "Z"

        return interest

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/api/interests/user/{user_id}")
async def get_user_interests(user_id: int):
    """
    Get all interests for a user.
    
    RECEIVES (path parameter):
    - user_id: int
    
    YOU NEED TO RETURN:
    [
        {
            "id": 456,
            "user_id": 1,
            "space_id": 123,
            "hours_requested": 4,  # or null
            "status": "pending",
            "host_response_date": null,  # or timestamp string
            "timestamp": "2024-01-15T10:30:00Z",
            "space_title": "Cozy Room",
            "space_location": "Manhattan",
            "space_rate": 15.0
        }
    ]
    
    LOGIC TO IMPLEMENT:
    1. Query interests with space details: 
       SELECT i.*, s.title as space_title, s.location as space_location, s.rate_per_hour as space_rate
       FROM interests i JOIN spaces s ON i.space_id = s.id WHERE i.user_id = ?
    2. Return array of interests
    """
    # TODO: Implement get user interests logic
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT 
                i.id, i.user_id, i.space_id, i.hours_requested, i.status, i.host_response_date, i.timestamp,
                s.title AS space_title, s.location AS space_location, s.rate_per_hour AS space_rate
            FROM interests i
            JOIN spaces s ON i.space_id = s.id
            WHERE i.user_id = %s
        """
        cursor.execute(query, (user_id,))
        interests = cursor.fetchall()

        # Convert datetime fields to ISO format strings if present
        for interest in interests:
            if interest["host_response_date"]:
                interest["host_response_date"] = interest["host_response_date"].isoformat()
            if interest["timestamp"]:
                interest["timestamp"] = interest["timestamp"].isoformat()

        cursor.close()
        conn.close()

        return interests

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/interests/space/{space_id}")
async def get_space_interests(space_id: int):
    """
    Get all interests for a space.
    
    RECEIVES (path parameter):
    - space_id: int
    
    RETURNS:
    [
        {
            "id": 456,
            "user_id": 1,
            "space_id": 123,
            "hours_requested": 4,  # or null
            "status": "pending",
            "host_response_date": null,  # or timestamp string
            "timestamp": "2024-01-15T10:30:00Z",
            "user_name": "john_guest",
            "user_email": "john@example.com"
        }
    ]
    
    LOGIC:
    1. Query interests with user details:
       SELECT i.*, u.username as user_name, u.email as user_email
       FROM interests i JOIN users u ON i.user_id = u.id WHERE i.space_id = ?
    2. Return array of interests
    """
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 2. Query with JOIN
        query = """
        SELECT i.id, i.user_id, i.space_id, i.hours_requested, i.status, 
               i.host_response_date, i.timestamp,
               u.username AS user_name, u.email AS user_email
        FROM interests i
        JOIN users u ON i.user_id = u.id
        WHERE i.space_id = %s
        """
        cursor.execute(query, (space_id,))
        interests = cursor.fetchall()

        # 3. Format datetime fields
        for interest in interests:
            if isinstance(interest["timestamp"], datetime):
                interest["timestamp"] = interest["timestamp"].isoformat() + "Z"
            if isinstance(interest["host_response_date"], datetime):
                interest["host_response_date"] = interest["host_response_date"].isoformat() + "Z"  
            elif interest["host_response_date"] is None:
                interest["host_response_date"] = None

        return interests

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.put("/api/interests/{interest_id}/respond")
async def respond_to_interest(interest_id: int, request: Request):
    """
    Host responds to an interest (accept/reject).
    
    RECEIVES (path parameter):
    - interest_id: int
    
    RECEIVES (from request body):
    {
        "status": "accepted"  # or "rejected"
    }
    
    YOU NEED TO RETURN:
    {
        "id": 456,
        "user_id": 1,
        "space_id": 123,
        "hours_requested": 4,
        "status": "accepted",
        "host_response_date": "2024-01-15T11:30:00Z",
        "timestamp": "2024-01-15T10:30:00Z",
        "user_name": "john_guest",
        "user_email": "john@example.com",
        "space_title": "Cozy Room",
        "space_location": "Manhattan",
        "space_rate": 15.0
    }
    
    LOGIC TO IMPLEMENT:
    1. Get status from request body
    2. Update interest: UPDATE interests SET status = ?, host_response_date = NOW() WHERE id = ?
    3. Get updated interest with user and space details using JOINs
    4. Return updated interest object
    """
    # TODO: Implement respond to interest logic
    
    try:
        # 1. Parse JSON body
        data = await request.json()
        new_status = data.get("status")

        if new_status not in ["accepted", "rejected"]:
            raise HTTPException(status_code=400, detail="Invalid status value. Must be 'accepted' or 'rejected'.")

        # 2. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 3. Update interest
        update_query = """
        UPDATE interests
        SET status = %s, host_response_date = NOW()
        WHERE id = %s
        """
        cursor.execute(update_query, (new_status, interest_id))
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Interest not found")

        # 4. Fetch updated interest with user & space details
        select_query = """
        SELECT i.id, i.user_id, i.space_id, i.hours_requested, i.status,
               i.host_response_date, i.timestamp,
               u.username AS user_name, u.email AS user_email,
               s.title AS space_title, s.location AS space_location, s.rate_per_hour AS space_rate
        FROM interests i
        JOIN users u ON i.user_id = u.id
        JOIN spaces s ON i.space_id = s.id
        WHERE i.id = %s
        """
        cursor.execute(select_query, (interest_id,))
        updated_interest = cursor.fetchone()

        if not updated_interest:
            raise HTTPException(status_code=404, detail="Updated interest not found")

        # 5. Format datetime fields
        if isinstance(updated_interest["timestamp"], datetime):
            updated_interest["timestamp"] = updated_interest["timestamp"].isoformat() + "Z"
        if isinstance(updated_interest["host_response_date"], datetime):
            updated_interest["host_response_date"] = updated_interest["host_response_date"].isoformat() + "Z"
        elif updated_interest["host_response_date"] is None:
            updated_interest["host_response_date"] = None

        return updated_interest

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.delete("/api/interests/{interest_id}")
async def cancel_interest(interest_id: int):
    """
    Cancel an interest.
    """
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor()

        # 2. Delete interest
        delete_query = "DELETE FROM interests WHERE id = %s"
        cursor.execute(delete_query, (interest_id,))
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Interest not found")

        # 3. Return success message
        return {"message": "Interest cancelled successfully"}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


@app.get("/api/interests/check/{space_id}/{user_id}")
async def check_user_interest(space_id: int, user_id: int):
    """
    Check if user has expressed interest in a space.
    
    RECEIVES (path parameters):
    - space_id: int
    - user_id: int
    
    YOU NEED TO RETURN:
    {"has_interest": true}  # or false
    
    LOGIC TO IMPLEMENT:
    1. Query if interest exists: SELECT COUNT(*) FROM interests WHERE user_id = ? AND space_id = ?
    2. Return boolean result
    """
    # TODO: Implement check user interest logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor()

        # 2. Query count
        query = """
        SELECT COUNT(*) 
        FROM interests 
        WHERE user_id = %s AND space_id = %s
        """
        cursor.execute(query, (user_id, space_id))
        (count,) = cursor.fetchone()

        # 3. Return boolean result
        return {"has_interest": count > 0}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
# REPORT ENDPOINTS

@app.post("/api/reports")
async def create_report(request: Request):
    """
    Create a new report.
    
    RECEIVES (from request body):
    {
        "reporter_id": 1,
        "reported_id": 123,
        "space_id": 456,  # optional
        "reason": "User was inappropriate"
    }
    
    YOU NEED TO RETURN:
    {
        "id": 789,
        "reporter_id": 1,
        "reported_id": 123,
        "reporter_role": "guest",
        "reported_role": "host",
        "reason": "User was inappropriate (Listing: Room Title)",
        "timestamp": "2024-01-15T10:30:00Z",
        "reporter_name": "john_guest",
        "reported_name": "bad_host",
        "reporter_email": "john@example.com",
        "reported_email": "bad@example.com"
    }
    
    LOGIC TO IMPLEMENT:
    1. Get reporter_id, reported_id, space_id, reason from request body
    2. Get reporter and reported user details from database
    3. Get reporter and reported user details
    4. If space_id provided, get space title and append to reason
    5. Insert report: INSERT INTO reports (reporter_id, reported_id, reporter_role, reported_role, reason, timestamp) VALUES (?, ?, ?, ?, ?, NOW())
    6. Return report with all user details
    """
    # TODO: Implement create report logic
    try:
        # 1. Parse request body
        data = await request.json()
        reporter_id = data.get("reporter_id")
        reported_id = data.get("reported_id")
        space_id = data.get("space_id")
        reason = data.get("reason")

        if not reporter_id or not reported_id or not reason:
            raise HTTPException(status_code=400, detail="reporter_id, reported_id, and reason are required")

        # 2. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 3. Get reporter details
        cursor.execute("SELECT id, username, email, role FROM users WHERE id = %s", (reporter_id,))
        reporter = cursor.fetchone()
        if not reporter:
            raise HTTPException(status_code=404, detail="Reporter not found")

        # 4. Get reported user details
        cursor.execute("SELECT id, username, email, role FROM users WHERE id = %s", (reported_id,))
        reported = cursor.fetchone()
        if not reported:
            raise HTTPException(status_code=404, detail="Reported user not found")

        # 5. Append space title to reason if space_id provided
        if space_id:
            cursor.execute("SELECT title FROM spaces WHERE id = %s", (space_id,))
            space = cursor.fetchone()
            if space:
                reason += f" (Listing: {space['title']})"

        # 6. Insert report
        insert_query = """
        INSERT INTO reports (reporter_id, reported_id, reporter_role, reported_role, reason, timestamp)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """
        cursor.execute(insert_query, (
            reporter_id,
            reported_id,
            reporter["role"],
            reported["role"],
            reason
        ))
        connection.commit()
        report_id = cursor.lastrowid

        # 7. Build return object
        new_report = {
            "id": report_id,
            "reporter_id": reporter_id,
            "reported_id": reported_id,
            "reporter_role": reporter["role"],
            "reported_role": reported["role"],
            "reason": reason,
            "timestamp": datetime.now().isoformat() + "Z",
            "reporter_name": reporter["username"],
            "reported_name": reported["username"],
            "reporter_email": reporter["email"],
            "reported_email": reported["email"]
        }

        return new_report

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/api/reports")
async def get_reports():
    """
    Get all reports (admin only).
    
    RECEIVES: Nothing
    
    YOU NEED TO RETURN:
    Array of reports (same format as create_report)
    
    LOGIC TO IMPLEMENT:
    1. Query all reports with user details using JOINs
    2. Return array of reports
    """
    # TODO: Implement get reports logic
    
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 2. Query reports with reporter & reported user details
        query = """
        SELECT
            r.id,
            r.reporter_id,
            r.reported_id,
            r.reporter_role,
            r.reported_role,
            r.reason,
            DATE_FORMAT(r.timestamp, '%Y-%m-%dT%H:%i:%sZ') AS timestamp,
            reporter.username AS reporter_name,
            reported.username AS reported_name,
            reporter.email AS reporter_email,
            reported.email AS reported_email
        FROM reports r
        JOIN users reporter ON r.reporter_id = reporter.id
        JOIN users reported ON r.reported_id = reported.id
        ORDER BY r.timestamp DESC
        """
        cursor.execute(query)
        reports = cursor.fetchall()

        return reports

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
    

@app.get("/api/users/for-reporting/{current_user_id}/{target_role}")
async def get_users_for_reporting(current_user_id: int, target_role: str):
    """
    Get users that can be reported.
    
    RECEIVES (path parameters):
    - current_user_id: int
    - target_role: str ('host' or 'guest')
    
    YOU NEED TO RETURN:
    [
        {
            "id": 123,
            "username": "user123",
            "email": "user@example.com",
            "role": "host",
            "status": "active",
            "date_joined": "2024-01-15T10:30:00Z"
        }
    ]
    
    LOGIC TO IMPLEMENT:
    1. Query users: SELECT * FROM users WHERE role = ? AND id != ? AND status = 'active'
    2. Return array of users
    """
    # TODO: Implement get users for reporting logic
    
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 2. Query active users with given role, excluding current user
        query = """
        SELECT id, username, email, role, status, date_joined
        FROM users
        WHERE role = %s AND id != %s AND status = 'active'
        """
        cursor.execute(query, (target_role, current_user_id))
        users = cursor.fetchall()

        # 3. Format datetime for JSON
        for user in users:
            if isinstance(user["date_joined"], datetime):
                user["date_joined"] = user["date_joined"].isoformat() + "Z"

        return users

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
    

# ADMIN ENDPOINTS

@app.get("/api/admin/users")
async def get_all_users():
    """
    Get all users except admins.
    
    RECEIVES: Nothing
    
    YOU NEED TO RETURN:
    [
        {
            "id": 123,
            "username": "user123",
            "email": "user@example.com",
            "role": "guest",
            "status": "active",
            "date_joined": "2024-01-15T10:30:00Z"
        }
    ]
    
    LOGIC TO IMPLEMENT:
    1. Query all users: SELECT * FROM users WHERE role != 'admin'
    2. Return array of users
    """
    # TODO: Implement get all users logic
    
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 2. Query all users except admins
        query = """
        SELECT id, username, email, role, status, date_joined
        FROM users
        WHERE role != 'admin'
        """
        cursor.execute(query)
        users = cursor.fetchall()

        # 3. Format datetime for JSON
        for user in users:
            if isinstance(user["date_joined"], datetime):
                user["date_joined"] = user["date_joined"].isoformat() + "Z"

        # 4. Return users
        return users

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.put("/api/admin/users/{user_id}/ban")
async def ban_user(user_id: int):
    """
    Ban a user.
    
    RECEIVES (path parameter):
    - user_id: int
    
    YOU NEED TO RETURN:
    {"message": "User banned successfully"}
    
    LOGIC TO IMPLEMENT:
    1. Update user: UPDATE users SET status = 'banned' WHERE id = ?
    2. Return success message
    """
    # TODO: Implement ban user logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor()

        # 2. Update user status to 'banned'
        update_query = """
        UPDATE users
        SET status = 'banned'
        WHERE id = %s
        """
        cursor.execute(update_query, (user_id,))
        connection.commit()

        # 3. Check if any row was affected
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # 4. Return success message
        return {"message": "User banned successfully"}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.put("/api/admin/users/{user_id}/unban")
async def unban_user(user_id: int):
    """
    Unban a user.
    
    RECEIVES (path parameter):
    - user_id: int
    
    YOU NEED TO RETURN:
    {"message": "User unbanned successfully"}
    
    LOGIC TO IMPLEMENT:
    1. Update user: UPDATE users SET status = 'active' WHERE id = ?
    2. Return success message
    """
    # TODO: Implement unban user logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor()

        # 2. Update user status to 'active'
        update_query = """
        UPDATE users
        SET status = 'active'
        WHERE id = %s
        """
        cursor.execute(update_query, (user_id,))
        connection.commit()

        # 3. Check if user was found and updated
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # 4. Return success message
        return {"message": "User unbanned successfully"}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: int):
    """
    Delete a user and all related data.
    
    RECEIVES (path parameter):
    - user_id: int
    
    YOU NEED TO RETURN:
    {"message": "User deleted successfully"}
    
    LOGIC TO IMPLEMENT:
    1. Delete user: DELETE FROM users WHERE id = ?
    2. Related data will be deleted automatically due to foreign key constraints
    3. Return success message
    """
    # TODO: Implement delete user logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor()

        # 2. Delete user (related data will be auto-deleted due to ON DELETE CASCADE)
        delete_query = """
        DELETE FROM users WHERE id = %s
        """
        cursor.execute(delete_query, (user_id,))
        connection.commit()

        # 3. Check if user existed
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # 4. Return success message
        return {"message": "User deleted successfully"}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/api/admin/pending-hosts")
async def get_pending_hosts():
    """
    Get all pending host applications.
    
    RECEIVES: Nothing
    
    YOU NEED TO RETURN:
    [
        {
            "id": 123,
            "username": "pending_host",
            "email": "host@example.com",
            "nid": "string",
            "phone": "string" , 
            "date_applied": "2024-01-15T10:30:00Z"
        }
    ]
    
    LOGIC TO IMPLEMENT:
    1. Query all pending hosts: SELECT * FROM pending_hosts
    2. Return array of pending hosts
    """
    # TODO: Implement get pending hosts logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 2. Query all pending hosts
        query = """
        SELECT id, username, email, nid, phone, date_applied
        FROM pending_hosts
        """
        cursor.execute(query)
        pending_hosts = cursor.fetchall()

        # 3. Format datetime fields
        for host in pending_hosts:
            if isinstance(host["date_applied"], datetime):
                host["date_applied"] = host["date_applied"].isoformat() + "Z"

        # 4. Return list
        return pending_hosts

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.post("/api/admin/approve-host/{pending_host_id}")
async def approve_host(pending_host_id: int):
    """
    Approve a pending host application.
    
    RECEIVES (path parameter):
    - pending_host_id: int
    
    YOU NEED TO RETURN:
    {"message": "Host approved successfully"}
    
    LOGIC TO IMPLEMENT:
    1. Get pending host data: SELECT * FROM pending_hosts WHERE id = ?
    2. Insert into users table: INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, 'host', 'active')
    3. Delete from pending_hosts: DELETE FROM pending_hosts WHERE id = ?
    4. Return success message
    """
    # TODO: Implement approve host logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 2. Get pending host
        cursor.execute("SELECT * FROM pending_hosts WHERE id = %s", (pending_host_id,))
        pending_host = cursor.fetchone()

        if not pending_host:
            raise HTTPException(status_code=404, detail="Pending host not found")

        # 3. Insert into users
        insert_query = """
            INSERT INTO users (username, email, password, role, status, nid, phone)
            VALUES (%s, %s, %s, 'host', 'active', %s, %s)
        """
        cursor.execute(insert_query, (
            pending_host["username"],
            pending_host["email"],
            pending_host["password"],
            pending_host["nid"], 
            pending_host["phone"],
        ))
        connection.commit()

        # 4. Delete from pending_hosts
        cursor.execute("DELETE FROM pending_hosts WHERE id = %s", (pending_host_id,))
        connection.commit()

        return {"message": "Host approved successfully"}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.delete("/api/admin/reject-host/{pending_host_id}")
async def reject_host(pending_host_id: int):
    """
    Reject a pending host application.
    
    RECEIVES (path parameter):
    - pending_host_id: int
    
    YOU NEED TO RETURN:
    {"message": "Host application rejected"}
    
    LOGIC TO IMPLEMENT:
    1. Delete from pending_hosts: DELETE FROM pending_hosts WHERE id = ?
    2. Return success message
    """
    # TODO: Implement reject host logic
    try:
        # 1. Connect to MySQL
        connection = get_db_connection()
        cursor = connection.cursor()

        # 2. Delete pending host
        cursor.execute("DELETE FROM pending_hosts WHERE id = %s", (pending_host_id,))
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Pending host not found")

        # 3. Return success message
        return {"message": "Host application rejected"}

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)