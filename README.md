# MediQueue Client

MediQueue Client is a responsive online tutor-booking application built with Next.js, React, HeroUI and Better Auth.

Students can discover tutors, view tutor details, book learning sessions and manage their bookings. Authenticated users can also add, update and delete their own tutor profiles.

This project uses **JavaScript and JSX only**. No TypeScript is used.

## Live Website

- Client: https://website-mediqueue-online-tutor-book-alpha.vercel.app
- Server: https://website-mediqueue-server-next-js.vercel.app

## Main Features

- Responsive Next.js user interface
- HeroUI components
- Tailwind CSS styling
- Animated three-slide banner
- Light and dark themes
- Featured tutors section
- Tutor search by name
- Subject and date filtering
- Tutor-details page
- Better Auth email/password authentication
- Google social login
- Protected private routes
- Add Tutor form
- ImgBB image upload
- Tutor photo URL support
- View, update and delete owned tutors
- Book tutor sessions
- View and cancel personal bookings
- Unique session-token display
- Toast notifications
- Loaders and empty states
- Custom 404 page
- Responsive navbar and footer

## Technologies

- Next.js 16
- React 19
- JavaScript
- JSX
- HeroUI 3
- Tailwind CSS 4
- Better Auth
- MongoDB
- Next Themes
- React Hot Toast
- Lucide React

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.js
│   ├── add-tutor/
│   ├── login/
│   ├── my-bookings/
│   ├── my-tutors/
│   ├── profile/
│   ├── register/
│   ├── tutors/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AuthShell.jsx
│   ├── Footer.jsx
│   ├── HomePage.jsx
│   ├── Navbar.jsx
│   ├── RouteTitle.jsx
│   ├── SessionTokenSync.jsx
│   ├── ThemeToggle.jsx
│   ├── TutorCard.jsx
│   └── UserAvatar.jsx
└── lib/
    ├── api.js
    ├── auth.js
    └── auth-client.js
```

## Environment Variables

Create `.env.local` in the client project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-at-least-32-random-characters

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
DB_NAME=mediqueue

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
```

Never upload `.env.local` to GitHub.

## Installation

```bash
npm install
```

## Run Locally

Start the Express server on port `5000`, and then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Commands

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Google OAuth Setup

Create an OAuth 2.0 Client ID in Google Cloud Console.

Choose:

```text
Application type: Web application
```

### Authorized JavaScript Origins

```text
http://localhost:3000
https://website-mediqueue-online-tutor-book-alpha.vercel.app
```

### Authorized Redirect URIs

```text
http://localhost:3000/api/auth/callback/google
https://website-mediqueue-online-tutor-book-alpha.vercel.app/api/auth/callback/google
```

The Google Client ID and Client Secret must come from the same OAuth Web Application.

## Authentication Flow

1. The user logs in through Better Auth.
2. Better Auth stores the user and session in MongoDB.
3. The Better Auth JWT plugin generates an access token.
4. The client retrieves the token using `authClient.token()`.
5. Protected requests include the token:

```text
Authorization: Bearer JWT_TOKEN
```

6. The Express server verifies the token using the Better Auth JWKS endpoint.

## Authentication Endpoints

```text
http://localhost:3000/api/auth/get-session
http://localhost:3000/api/auth/token
http://localhost:3000/api/auth/jwks
```

## Application Routes

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Tutors | `/tutors` | Public |
| Tutor Details | `/tutors/:id` | Private |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Add Tutor | `/add-tutor` | Private |
| My Tutors | `/my-tutors` | Private |
| My Bookings | `/my-bookings` | Private |
| Profile | `/profile` | Private |

## Production Variables

Add these variables to the client Vercel project:

```env
NEXT_PUBLIC_API_URL=https://website-mediqueue-server-next-js.vercel.app/api

NEXT_PUBLIC_APP_URL=https://website-mediqueue-online-tutor-book-alpha.vercel.app

BETTER_AUTH_URL=https://website-mediqueue-online-tutor-book-alpha.vercel.app

BETTER_AUTH_SECRET=your-secure-production-secret

MONGODB_URI=your-mongodb-atlas-uri
DB_NAME=mediqueue

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
```

Do not add trailing `/` to the application URLs.

Redeploy after changing environment variables.

## Common Problems

### Google `redirect_uri_mismatch`

Confirm Google Cloud contains this exact callback:

```text
https://website-mediqueue-online-tutor-book-alpha.vercel.app/api/auth/callback/google
```

### Google `invalid_code`

Check that:

- Client ID and Client Secret belong to the same OAuth Web Application
- `BETTER_AUTH_URL` contains the deployed client URL
- Environment values contain no quotes or extra spaces
- The client was redeployed after adding environment variables
- Login is tested from a fresh InPrivate window

### Protected API returns `401`

Check that:

- `/api/auth/get-session` returns a user
- `/api/auth/token` returns a JWT
- The server JWKS URL is correct
- Server issuer and audience match the client URL
- The request contains an Authorization header

### Booking button is disabled

Check that:

- The user is logged in
- Tutor slots are greater than zero
- Session start date is today or earlier

### Styles are missing

Confirm `src/app/globals.css` contains:

```css
@import "tailwindcss";
@import "@heroui/styles";
```

## Validation

```bash
npm run lint
npm run build
```

## Security

- MongoDB credentials remain server-side
- Google Client Secret remains server-side
- Better Auth Secret remains server-side
- Only `NEXT_PUBLIC_` values are exposed to browser code
- Private API requests require JWT authentication
- `.env.local` is excluded from GitHub

## License

Created for educational and assignment purposes.