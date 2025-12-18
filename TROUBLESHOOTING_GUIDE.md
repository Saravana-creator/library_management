# Troubleshooting Guide - MERN Library Management System

## Issues Fixed

### 1. React Router Future Flag Warnings ✅
**Problem**: Warnings about `v7_startTransition` and `v7_relativeSplatPath` not being suppressed.

**Root Cause**: Using `Router` alias instead of `BrowserRouter` component. The future flags only work on `BrowserRouter`.

**Solution**: 
- Changed `import { BrowserRouter as Router }` to `import { BrowserRouter }`
- Replaced all `<Router future={{...}}>` with `<BrowserRouter future={{...}}>`
- Applied future flags to all three BrowserRouter instances in App.jsx

**Files Modified**: `frontend/src/App.jsx`

---

### 2. Librarian Routes Not Working (Books, Requests, Overdue, Penalties)
**Problem**: API calls failing when clicking librarian navigation buttons.

**Root Cause**: Multiple potential issues:
1. Backend routes registered correctly but frontend components may have incorrect API endpoints
2. Authentication middleware properly configured
3. Component exports/imports verified

**Verification Checklist**:

#### Backend Routes ✅
- `/api/librarian/pending-requests` → `getPendingRequests`
- `/api/librarian/overdue-students` → `monitorOverdueStudents`
- `/api/librarian/student-penalties` → `viewStudentPenalties`
- `/api/books` → `getBooks`, `createBook`, `updateBook`, `deleteBook`

#### Frontend Components ✅
- `LibrarianRequests` - calls `/librarian/pending-requests`
- `OverdueStudents` - calls `/librarian/overdue-students`
- `StudentPenalties` - calls `/librarian/student-penalties`
- All components properly exported as named exports

#### Authentication ✅
- Middleware: `authenticate` properly imported as named export
- All routes use `authenticate` middleware
- JWT token stored in localStorage and sent in Authorization header
- Axios interceptor adds Bearer token to all requests

---

## Setup Instructions

### 1. Start MongoDB
Ensure MongoDB is running on your system.

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed  # Populate initial data (admin/password123)
npm start     # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start     # Runs on http://localhost:3000
```

---

## Testing the System

### Librarian Login
- **Username**: admin
- **Password**: password123

### Student Registration
- Create a new account with email and password
- Fill in all required fields (name, student ID, department, semester, phone)

### API Health Check
```bash
curl http://localhost:5000/api/health
# Expected: { "status": "Server is running" }
```

---

## Debugging Steps

### If Librarian Routes Still Don't Work:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Network tab
   - Click on a librarian navigation button
   - Look for failed API requests
   - Check the response for error details

2. **Check Backend Logs**
   - Look for error messages in terminal where backend is running
   - Verify authentication middleware is being called

3. **Verify Token**
   - Open DevTools Console
   - Run: `localStorage.getItem('token')`
   - Should return a JWT token string

4. **Test API Directly**
   ```bash
   # Get token first from login
   curl -X GET http://localhost:5000/api/librarian/pending-requests \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### If React Router Warnings Persist:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend dev server
3. Verify App.jsx uses `BrowserRouter` not `Router`
4. Check that future flags are on BrowserRouter: `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}`

---

## File Structure Verification

```
backend/
├── middleware/auth.js ✅ (exports { authenticate })
├── routes/
│   ├── librarian.js ✅ (uses { authenticate })
│   ├── books.js ✅ (uses { authenticate })
│   └── ...
├── controllers/
│   ├── librarianController.js ✅ (uses req.user.id)
│   ├── bookController.js ✅
│   └── ...
└── server.js ✅ (all routes registered)

frontend/src/
├── App.jsx ✅ (uses BrowserRouter with future flags)
├── LibrarianComponents.jsx ✅ (named exports)
├── StudentComponents.jsx ✅ (named exports)
└── index.js ✅
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token in localStorage, verify JWT_SECRET in .env |
| CORS errors | Verify backend CORS config allows localhost:3000 |
| Books not loading | Ensure books have status='active' in database |
| Components not rendering | Check named exports in LibrarianComponents.jsx |
| API calls failing | Check Authorization header in Network tab |

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Next Steps

1. Verify all services are running
2. Test librarian login with admin/password123
3. Navigate through all librarian routes
4. Check browser console for any errors
5. If issues persist, check backend logs for detailed error messages
