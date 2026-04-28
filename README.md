# Mini Investment Platform - Frontend

## Architecture Overview

This is a React-based frontend for a cross-border investment platform using CDN-hosted React (no build step required).

## Project Structure

```
frontend/
├── public/
│   └── index.html    # Single-page application
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── services/   # API service
│   ├── context/    # React context
│   ├── App.js      # Main app component
│   └── index.js    # Entry point
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Technology Stack

- **UI Library**: React 18 (via CDN)
- **Styling**: Tailwind CSS (via CDN)
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API

## Features

### Public Routes
- **Signup Page**: User onboarding with form validation
  - Name, Email, Phone Number
  - Nationality, Domicile

### Private Routes
- **Dashboard Page**: Main user interface
  - User profile display
  - KYC/AML verification status
  - Investor accreditation status
  - Bank account linking
  - Investment form and history

## User Flow

1. **Sign Up**: User creates account with personal details
2. **KYC Verification**: User initiates identity verification
3. **Accreditation**: User verifies investor accreditation status (requires KYC first)
4. **Bank Linking**: User links bank account (requires accreditation)
5. **Investment**: User makes investment from linked bank account

## UI Components

- **Header**: Navigation with user info and logout
- **StatusCard**: Displays verification status with action buttons
- **LoadingSpinner**: Loading indicator
- **SignupForm**: User registration form
- **Dashboard**: Main user dashboard with all features

## State Management

- React Context API for global state
- LocalStorage for user persistence
- Loading and error states

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## API Configuration

The frontend connects to the backend at `http://localhost:5000/api`. Update the `API_BASE_URL` constant in `index.html` if your backend runs on a different port.

## API Key

The frontend includes a default API key. Update the `API_KEY` constant in `index.html` to match your backend configuration.

## Trade-offs & Assumptions

1. **No Build Step**: Uses CDN-hosted React/Babel for simplicity
2. **Single HTML File**: All components inline for easy deployment
3. **Basic Styling**: Tailwind CSS via CDN
4. **No Real Authentication**: Uses localStorage for session persistence
5. **Mock Balance**: Bank balance randomly generated

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
