# Django REST Framework User Management API

A comprehensive Django REST Framework project with JWT authentication, MySQL database, and user management APIs.

## Features

- **Custom User Model** extending AbstractUser with comprehensive fields
- **JWT Authentication** using djangorestframework-simplejwt
- **MySQL Database** integration
- **Role-based Access Control** (Admin, Candidat, Recruteur)
- **RESTful APIs** for authentication and user management
- **Admin Panel** for user management
- **File Upload Support** for profile photos and CVs

## Requirements

- Python 3.8+
- MySQL 5.7+
- Django 4.2.7
- Django REST Framework 3.14.0

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user_management
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Setup**
   - Create MySQL database:
     ```sql
     CREATE DATABASE user_management_db;
     ```
   - Copy environment file:
     ```bash
     copy .env.example .env
     ```
   - Update `.env` with your database credentials

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication APIs

#### 1. Register User
- **URL**: `POST /api/register/`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "fullname": "John Doe",
    "role": "Candidat",
    "phone_number": "+1234567890",
    "birthdate": "1990-01-01",
    "gender": "M",
    "address": "123 Main St, City, Country",
    "skills": "Python, Django, JavaScript",
    "annees_experience": 5,
    "bio": "Experienced developer",
    "website": "https://johndoe.com",
    "portfolio_url": "https://portfolio.johndoe.com",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "github_url": "https://github.com/johndoe",
    "languages": [
      {"language": "English", "proficiency": "Native"},
      {"language": "French", "proficiency": "Intermediate"}
    ],
    "social_links": [
      {"platform": "Twitter", "url": "https://twitter.com/johndoe"}
    ]
  }
  ```

#### 2. Login User
- **URL**: `POST /api/login/`
- **Description**: Login and get JWT tokens
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

#### 3. Refresh Token
- **URL**: `POST /api/token/refresh/`
- **Description**: Refresh JWT access token
- **Body**:
  ```json
  {
    "refresh": "your-refresh-token"
  }
  ```

### Profile APIs (Authenticated Users)

#### 4. Get Own Profile
- **URL**: `GET /api/profile/`
- **Description**: Get current user's profile
- **Headers**: `Authorization: Bearer <access-token>`

#### 5. Update Own Profile
- **URL**: `PUT /api/profile/`
- **Description**: Update current user's profile
- **Headers**: `Authorization: Bearer <access-token>`
- **Body**: Same as registration (partial updates allowed)

### Admin APIs (Admin Users Only)

#### 6. List All Users
- **URL**: `GET /api/users/`
- **Description**: Get list of all users (paginated)
- **Headers**: `Authorization: Bearer <admin-access-token>`

#### 7. Get User by ID
- **URL**: `GET /api/users/{id}/`
- **Description**: Get specific user details
- **Headers**: `Authorization: Bearer <admin-access-token>`

#### 8. Update User by ID
- **URL**: `PUT /api/users/{id}/`
- **Description**: Update any user (admin only)
- **Headers**: `Authorization: Bearer <admin-access-token>`
- **Body**: User data to update

#### 9. Delete User by ID
- **URL**: `DELETE /api/users/{id}/`
- **Description**: Delete a user
- **Headers**: `Authorization: Bearer <admin-access-token>`

## User Model Fields

### Required Fields
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `fullname`: Full name
- `role`: Admin, Candidat, or Recruteur
- `phone_number`: Phone number with validation

### Optional Fields
- `photo_profile`: Profile photo upload
- `birthdate`: Date of birth
- `gender`: M/F/O
- `address`: Full address
- `skills`: Comma-separated skills
- `annees_experience`: Years of experience
- `bio`: Biography
- `website`: Personal website
- `portfolio_url`: Portfolio URL
- `linkedin_url`: LinkedIn profile
- `github_url`: GitHub profile
- `cv`: CV file upload
- `resume_text`: Parsed CV text for search
- `projects`: JSON field for projects/achievements

### Related Models
- `Language`: User languages with proficiency levels
- `SocialLink`: Additional social media links

## Testing with Postman

1. **Import the collection**: Create a new Postman collection
2. **Set base URL**: `http://localhost:8000/api`
3. **Authentication**: 
   - Register a new user or login
   - Copy the access token from response
   - Add to Authorization header: `Bearer <token>`

### Sample Postman Requests

#### Register Admin User
```json
POST /api/register/
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123456",
  "password_confirm": "admin123456",
  "fullname": "System Administrator",
  "role": "Admin"
}
```

#### Login
```json
POST /api/login/
{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

## Project Structure

```
user_management/
├── manage.py
├── requirements.txt
├── .env.example
├── README.md
├── user_management/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── accounts/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── migrations/
        └── __init__.py
```

## Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=user_management_db
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_HOST=localhost
DB_PORT=3306

## Optional - Google Gemini / Generative API (alternative to Git/Azure model)
You can configure the project to use a Google Gemini (Generative Language) API key instead of the Git/Azure model. Do NOT paste your real API key into shared places (commits, issue trackers, chat).

Add the following to your `.env` (replace the placeholder with your real key locally):

```env
# Google Gemini API key (keep secret)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
# Optional: model name (example: text-bison-001)
GEMINI_MODEL=text-bison-001

# Optional: fallback Azure/Git endpoint and model
AI_INFERENCE_ENDPOINT=https://models.github.ai/inference
AI_MODEL=openai/gpt-5
```

PowerShell (temporary for current session):

```powershell
$env:GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'
```

Notes:
- The `/api/ai/chat/` endpoint requires authentication (JWT). The frontend will send messages to this endpoint only when the user is logged in.
- If `GEMINI_API_KEY` is present, the server will attempt to call the Google Generative Language REST API and return the generated reply. Otherwise it falls back to the configured Git/Azure endpoint.
- If you accidentally posted a real API key publicly (for example in a chat or issue), rotate the key immediately.
```

## Security Features

- JWT token-based authentication
- Password validation
- Role-based permissions
- CORS configuration
- File upload validation
- SQL injection protection

## Development

- **Admin Panel**: Access at `http://localhost:8000/admin/`
- **API Documentation**: All endpoints return JSON responses
- **Error Handling**: Comprehensive error messages
- **Validation**: Input validation on all endpoints

## Production Deployment

1. Set `DEBUG=False` in environment
2. Configure proper database settings
3. Set up static file serving
4. Configure CORS for your domain
5. Use environment variables for sensitive data

## Support

For issues and questions, please check the code comments and Django documentation.


admin2@example.com
admin123456
Ri
gantassiahlem@gmail.com
recruteur2025
Ri
Candidat1@yopmail.com
candidat2025
13:47
Vous avez envoyé
Vous avez envoyé
Jit ntasti tohet ena 😂🤦‍♂️
Ri
Tohet???
Ri
Hhhh
Vous avez envoyé
Vous avez envoyé
Vous avez envoyé
Vous avez envoyé
Chnowa bath thouli tawa
Ri
Components/Interviews/InterviewScheduler.jsx
Ri
Formulaire mtaa entretien
Ri
Ri
