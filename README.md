# kafy-ts-backend

This is the backend service for the Kafy app, built using Express, TypeScript, and Supabase. It handles authentication, user profiles, menu, and favorites.
This is a personal practice project.

# TECHNOLOGIES:

1. Supabase
2. NodeJs and express
3. Typescript
4. cors
5. dotenv
6. Nodemon

# INSTALLATION:

1. Clone the repository:
   git clone https://github.com/yourusername/kafy-ts-backend.git
   cd kafy-ts-backend
2. run npm install to install dependencies

# SET UP .env FILE

Create .env file at the root of the project and set the following variables

PORT - for development
SUPABASE_PROJ_URL
SUPABASE_ANON_KEY

# RUNNING THE PROJECT

## PRODUCTION:

## DEVELOPMENT:

1. npm run dev

# USAGE:

1. Sign-up: /auth/signup
2. Sign-in: /auth/signin
3. Profile: /profile
4. Menu: /menu
5. Favorites: /favorites

# ENDPOINTS:

## 1. AUTH

- **POST** `/auth/signup` - Sign up a new user (requires email, password, first name, and last name).
- **POST** `/auth/signin` - Sign in an existing user (requires email and password).
- **POST** `/auth/signout` - Sign out the user.

## 2. Profile

- **GET** `/profile` - Get authenticated user's profile.

## 3. Menu

- **GET** `/menu` - Get/Fetch all available menu items.

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
