# Employee Management System

A full-stack application for managing employee data with a React frontend and Node.js/Express backend.

## Features

- ✅ Add new employees
- ✅ View employee directory with sorting
- ✅ Display most common email domain
- ✅ Show users per company analytics
- ✅ Employee dashboard with insights
- ✅ RESTful API for employee operations
- ✅ MongoDB persistence
- ✅ Responsive UI with Tailwind CSS

## Project Structure

```
Project-ts/
├── src/                          # React frontend
│   ├── App.tsx                  # Main app component
│   ├── employeeForm.tsx         # Employee form component
│   ├── userDashboard.tsx        # Dashboard with analytics
│   ├── main.tsx
│   ├── index.css
│   └── App.css
├── Backend/                      # Node.js backend
│   ├── server.js                # Express server
│   ├── models/
│   │   └── employee.js          # MongoDB schema
│   ├── controllers/
│   │   └── employeeController.js # API logic
│   ├── routes/
│   │   └── employeeRoutes.js    # API routes
│   └── package.json
├── public/                       # Static files
├── package.json                  # Frontend dependencies
└── vite.config.ts               # Vite configuration
```

## Installation

### Frontend Setup

```bash
npm install
```

### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
```

## Running the Application

### Frontend (Development)

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend (Development)

```bash
cd Backend
npm run dev
```

The backend will run on `http://localhost:5000`

## Building

### Frontend Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Technologies Used

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- CORS

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /health` - Server health check

## Environment Variables

See `.env.example` in the Backend folder for required environment variables.

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
