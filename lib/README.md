# Authentication System - Quick Reference

## Test Credentials

```
Username: emilys
Password: emilyspass
```

## File Structure

```
lib/
├── api/
│   ├── client.ts           # Axios instance
│   ├── auth.service.ts     # Auth API methods
│   ├── types.ts            # TypeScript types
│   └── index.ts            # Exports
├── hooks/
│   └── use-auth.ts         # React Query hooks
└── providers/
    └── query-provider.tsx  # Query provider
```

## Usage

### Login

```tsx
const loginMutation = useLogin();

loginMutation.mutate({
  username: "emilys",
  password: "emilyspass",
  expiresInMins: 30,
});
```

### Logout

```tsx
const logoutMutation = useLogout();
logoutMutation.mutate();
```

### Check Auth

```tsx
const { data: user } = useCurrentUser();
const { data: isAuth } = useIsAuthenticated();
```

## API Endpoint

`POST https://dummyjson.com/auth/login`

## Features

✅ TypeScript type safety  
✅ Automatic token management  
✅ Request/response interceptors  
✅ Error handling  
✅ Loading states  
✅ Auto-navigation  
✅ Secure token storage
