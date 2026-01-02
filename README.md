# Help Study Abroad - Frontend Technical Assessment

A modern, responsive admin dashboard built with Next.js, Material-UI (MUI), Zustand, and NextAuth for managing users and products using the DummyJSON API.

## Features

### Authentication
- ✅ Admin login page with MUI components
- ✅ NextAuth integration for authentication
- ✅ Zustand state management for auth state
- ✅ Token stored in Zustand and localStorage
- ✅ Protected dashboard routes
- ✅ Automatic redirect for authenticated/unauthenticated users

### Users Management
- ✅ Users list page with responsive MUI table
- ✅ Pagination (limit & skip based)
- ✅ Search functionality with debouncing
- ✅ Single user detail page with comprehensive information
- ✅ Displays: name, email, gender, phone, company

### Products Management
- ✅ Products list page with responsive MUI grid layout
- ✅ Pagination (limit & skip based)
- ✅ Search functionality
- ✅ Category filter dropdown
- ✅ Single product detail page with image carousel
- ✅ Displays: image, title, price, category, rating, reviews, specifications

### State Management (Zustand)
- ✅ Auth store with persistence
- ✅ Users store with caching
- ✅ Products store with caching
- ✅ Async actions for API calls
- ✅ Comprehensive documentation on why Zustand was chosen

### Performance Optimizations
- ✅ React.memo for component memoization
- ✅ useCallback for event handlers
- ✅ useMemo for computed values
- ✅ Client-side caching (5-minute TTL)
- ✅ API-side pagination

### UI/UX
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Material-UI components throughout
- ✅ Clean, modern layouts
- ✅ Loading states and error handling
- ✅ Smooth navigation and transitions

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Material-UI (MUI) v7** - UI component library
- **Zustand v5** - State management
- **NextAuth v4** - Authentication
- **DummyJSON API** - Backend data source

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd help-study-abroad
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

For development, you can use any random string for `NEXTAUTH_SECRET`. For production, use a secure random string.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

3. Login with DummyJSON credentials:
   - Username: `kminchelle` (or any valid DummyJSON username)
   - Password: `0lelplR` (or corresponding password)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
help-study-abroad/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth API route
│   ├── dashboard/
│   │   ├── layout.tsx                # Dashboard layout with navigation
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── users/
│   │   │   ├── page.tsx              # Users list
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Single user view
│   │   └── products/
│   │       ├── page.tsx              # Products list
│   │       └── [id]/
│   │           └── page.tsx          # Single product view
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page (redirects)
│   └── providers.tsx                 # MUI & NextAuth providers
├── store/
│   ├── authStore.ts                  # Authentication store
│   ├── usersStore.ts                 # Users data store
│   └── productsStore.ts              # Products data store
└── README.md
```

## State Management with Zustand

### Why Zustand?

Zustand was chosen for this project because:

1. **Simplicity**: Minimal boilerplate compared to Redux - no actions, reducers, or providers needed
2. **Small footprint**: ~1KB gzipped, perfect for small-medium apps
3. **Built-in async actions**: Native support for async operations without middleware
4. **TypeScript support**: Excellent type inference and type safety
5. **No provider hell**: Can be used without wrapping the app in providers
6. **DevTools**: Optional Redux DevTools integration for debugging
7. **Persistence**: Easy middleware for localStorage/sessionStorage

For this assessment, Zustand is ideal because:
- We need simple state management (auth, users, products)
- We want async API calls handled cleanly
- We want minimal setup overhead
- We need localStorage persistence for tokens

### Store Structure

- **authStore**: Manages authentication state, login/logout, token storage
- **usersStore**: Manages users list, search, pagination, caching
- **productsStore**: Manages products list, search, category filter, pagination, caching

## Caching Strategy

### Why Caching?

Client-side caching is implemented to:
1. **Reduce API calls**: Avoid redundant requests for the same data
2. **Improve performance**: Instant data display for cached results
3. **Better UX**: Faster page loads and smoother navigation
4. **Reduce server load**: Less strain on the DummyJSON API

### Implementation

- **Cache key format**: `"users:limit:skip"`, `"products:search:query"`, etc.
- **Cache expiration**: 5 minutes (300000ms)
- **Cache storage**: In-memory Zustand state
- **Cache invalidation**: Manual clear on logout or automatic expiration

Cache keys:
- Users list: `users:limit:skip`
- Users search: `users:search:query`
- Single user: `user:id`
- Products list: `products:limit:skip`
- Products search: `products:search:query`
- Products by category: `products:category:categoryName:limit:skip`
- Single product: `product:id`

## Performance Optimizations

### React.memo
- UserRow component memoized to prevent unnecessary re-renders
- ProductCard component memoized for list performance

### useCallback
- Event handlers (page change, category change) wrapped in useCallback
- Prevents function recreation on every render

### useMemo
- Computed values (totalPages) memoized
- Only recalculates when dependencies change

### API-Side Pagination
- Uses `limit` and `skip` parameters
- Only loads data for current page
- Reduces initial load time and memory usage

## API Endpoints Used

### Authentication
- `POST https://dummyjson.com/auth/login`

### Users
- `GET https://dummyjson.com/users?limit=10&skip=0`
- `GET https://dummyjson.com/users/search?q=...`
- `GET https://dummyjson.com/users/{id}`

### Products
- `GET https://dummyjson.com/products?limit=10&skip=0`
- `GET https://dummyjson.com/products/search?q=...`
- `GET https://dummyjson.com/products/category/{category}`
- `GET https://dummyjson.com/products/{id}`
- `GET https://dummyjson.com/products/categories`

## Testing the Application

### Login Credentials
You can use any valid DummyJSON credentials. Example:
- Username: `kminchelle`
- Password: `0lelplR`

Or create a new user via the DummyJSON API.

### Features to Test

1. **Authentication**
   - Login with valid credentials
   - Try invalid credentials
   - Logout functionality
   - Protected route access

2. **Users**
   - View users list
   - Pagination navigation
   - Search functionality
   - View single user details
   - Navigate back to users list

3. **Products**
   - View products grid
   - Pagination navigation
   - Search functionality
   - Category filtering
   - View single product details
   - Image carousel
   - Navigate back to products list

4. **Responsive Design**
   - Test on mobile (320px+)
   - Test on tablet (768px+)
   - Test on desktop (1024px+)

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set:
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - A secure random string

### Recommended Platforms

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## Known Limitations & Future Improvements

### Current Implementation
- ✅ All core features implemented
- ✅ Responsive design
- ✅ Performance optimizations
- ✅ Caching strategy
- ✅ Error handling

### Potential Enhancements
- Add unit tests (Jest, React Testing Library)
- Add E2E tests (Playwright, Cypress)
- Add loading skeletons instead of spinners
- Add infinite scroll option
- Add data export functionality
- Add user/product editing capabilities
- Add advanced filtering options
- Add dark mode toggle
- Add internationalization (i18n)

## License

This project was created for a technical assessment.

## Contact

For questions or issues, please refer to the repository issues section.
