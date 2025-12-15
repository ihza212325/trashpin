# Report Maps - Application Summary

## 📱 Application Description

**Report Maps** is a mobile application based on React Native/Expo that allows users to create and view location reports on an interactive map. The application uses MapLibre to display maps with dark and light theme support, as well as complete authentication features for user management.

[![Watch the video](https://img.youtube.com/vi/Q3SvXT2QD9o/maxresdefault.jpg)](https://youtu.be/Q3SvXT2QD9o)

## 🎯 Main Features

### 1. **Authentication & User Management**

- Login with username and password
- New user registration (signup)
- Social media login (UI ready)
- User profile management
- Edit profile with photo
- Logout
- Token-based authentication with refresh token
- Secure storage for tokens using Expo SecureStore

### 2. **Interactive Map**

- Interactive map using MapLibre
- Dark and light theme support
- Markers/report locations on the map
- Camera animation when navigating to marker
- Current location tracking (with permission)
- Custom map styles (light & dark)

### 3. **Report Management**

- Create new report with GPS coordinates
- Add photos to reports
- View report details in bottom sheet
- Filter reports (all reports / user reports only)
- Search reports by title and description
- Report statistics (total & user reports)
- Delete reports

### 4. **UI/UX Features**

- Dark/Light theme with system preference
- Bottom sheet for marker details
- Toast notifications for feedback
- Loading modals
- Confirmation modals
- Haptic feedback
- Animations with Reanimated
- Parallax scroll view
- Search bar with clear button
- Floating Action Button (FAB) for creating reports

## 🛠️ Technology & Dependencies

### Core Framework

- **Expo** ~54.0.27
- **React** 19.1.0
- **React Native** 0.81.5
- **Expo Router** ~6.0.17 (file-based routing)

### State Management

- **Zustand** ^5.0.9 - for local state management (reports store)
- **TanStack React Query** ^5.90.12 - for server state management

### Maps & Location

- **@maplibre/maplibre-react-native** ^10.4.2 - interactive map
- **expo-location** ~19.0.8 - GPS location access

### UI Components

- **@gorhom/bottom-sheet** ^5.2.8 - bottom sheet modal
- **expo-haptics** ~15.0.8 - haptic feedback
- **expo-image** ~3.0.11 - image optimization
- **expo-image-picker** ~17.0.9 - photo picker
- **expo-linear-gradient** ~15.0.8 - gradient backgrounds
- **react-native-reanimated** ~4.1.1 - animations
- **react-native-gesture-handler** ~2.28.0 - gesture handling

### Storage & Security

- **expo-secure-store** ~15.0.8 - secure token storage
- **@react-native-async-storage/async-storage** ^2.2.0 - local storage

### Networking

- **axios** ^1.13.2 - HTTP client
- **DummyJSON API** - backend API for authentication

### Navigation

- **@react-navigation/native** ^7.1.8
- **@react-navigation/bottom-tabs** ^7.4.0

## 📁 Project Structure

```
report-maps/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                # Entry point (auth check & redirect)
│   ├── login/                   # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Login screen
│   │   ├── signup.tsx           # Signup screen
│   │   └── components/
│   │       └── SocialMediaLogin.tsx
│   └── home/                    # Main app screens
│       ├── _layout.tsx
│       ├── index.tsx            # Home/Map screen
│       └── profile.tsx          # Profile screen
│
├── components/                   # Reusable components
│   ├── home/                    # Home screen components
│   │   ├── create-report-fab.tsx
│   │   ├── current-location-button.tsx
│   │   ├── filter-toggle.tsx
│   │   ├── info-panel.tsx
│   │   ├── marker-bottom-sheet.tsx
│   │   ├── search-bar.tsx
│   │   └── stats-card.tsx
│   ├── profile/                 # Profile components
│   │   ├── edit-profile-modal.tsx
│   │   └── index.tsx
│   ├── ui/                      # UI primitives
│   │   ├── confirmation-modal.tsx
│   │   ├── loading-modal.tsx
│   │   └── toast.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── parallax-scroll-view.tsx
│
├── lib/                         # Core business logic
│   ├── api/                     # API services
│   │   ├── client.ts           # Axios instance with interceptors
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── user.service.ts     # User service
│   │   ├── types.ts            # TypeScript types
│   │   └── index.ts
│   ├── hooks/                   # Custom hooks
│   │   └── use-auth.ts         # Auth hooks with React Query
│   ├── providers/              # Context providers
│   │   └── query-provider.tsx  # React Query provider
│   └── stores/                  # Zustand stores
│       └── reports-store.ts    # Reports state management
│
├── contexts/                     # React contexts
│   └── theme-context.tsx       # Theme management
│
├── hooks/                       # App-level hooks
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── use-toast.tsx
│
├── constants/                   # Constants
│   └── theme.ts
│
├── assets/                      # Static assets
│   ├── data/
│   │   └── markers.json        # Sample marker data
│   ├── images/                 # App icons & images
│   └── mapstyle/               # Map style configurations
│       ├── mapstyle.json       # Light theme map style
│       └── mapstyleDark.json  # Dark theme map style
│
└── scripts/                     # Utility scripts
    └── reset-project.js
```

## 🔐 Authentication

### Test Credentials

```
Username: emilys
Password: emilyspass
```

### API Endpoint

- **Base URL**: `https://dummyjson.com`
- **Login**: `POST /auth/login`
- **Signup**: `POST /users/add`
- **Refresh Token**: `POST /auth/refresh`

### Token Management

- Access token and refresh token stored in Expo SecureStore
- Automatic token injection to request headers via Axios interceptor
- Auto logout when token expires (401 response)

## 🗺️ Map Features

### Marker Data Structure

```typescript
interface MarkerData {
  id: number;
  coordinates: [number, number]; // [longitude, latitude]
  title: string;
  description: string;
  photos: string[];
}
```

### Map Features

- Default center: Jakarta (106.8456, -6.2088)
- Zoom level: 10 (city view) / 15 (detail view)
- Camera animation when marker is selected
- Custom map styles for light & dark mode
- Point annotations for markers

## 🎨 Theme System

The application supports 3 theme modes:

- **Light** - Light theme
- **Dark** - Dark theme
- **System** - Follows system preference

Theme preference is stored in AsyncStorage and persists across app restarts.

## 📊 State Management

### Zustand Store (Reports)

- `userReports`: Array of reports created by user
- `addReport()`: Add new report
- `removeReport()`: Remove report
- `clearReports()`: Clear all reports

### React Query (Server State)

- Authentication state
- User data
- API mutations (login, logout, signup)

## 🚀 Scripts

```bash

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Lint code
npm run lint

# Reset project (move starter code to app-example)
npm run reset-project
```

## 📱 Platform Support

- ✅ iOS (supports tablet)
- ✅ Android (edge-to-edge enabled)
- ✅ Web (static output)

## 🔧 Configuration

### App Configuration (`app.json`)

- **Bundle ID (iOS)**: `com.browncat2123.reportmaps`
- **Package (Android)**: `com.browncat2123.reportmaps`
- **Scheme**: `reportmaps`
- **New Architecture**: Enabled
- **React Compiler**: Enabled

### Permissions

- Location (coarse & fine)
- Camera
- Photo library

## 📝 Development Notes

1. **DummyJSON API**: This API is a mock API, users registered via signup cannot login immediately. Use test credentials to login.

2. **Marker Data**: Sample markers are stored in `assets/data/markers.json`. User reports are stored in Zustand store (in-memory, not persisted).

3. **Map Styles**: Custom map styles are stored in `assets/mapstyle/` in JSON format.

4. **Type Safety**: The application uses TypeScript with strict typing for all API calls and components.

5. **Error Handling**: All API calls have error handling with toast notifications for user feedback.

## 🔄 Application Flow

1. **App Launch** → Check authentication status
2. **Not Authenticated** → Redirect to `/login`
3. **Authenticated** → Redirect to `/home`
4. **Home Screen** → Display map with markers
5. **Create Report** → FAB → Form → Add marker to map
6. **View Report** → Tap marker → Bottom sheet with details
7. **Profile** → Edit profile, logout

---

**Made with ❤️ using Expo & React Native**
