# Report Maps - Aplikasi Ringkasan

## 📱 Deskripsi Aplikasi

**Report Maps** adalah aplikasi mobile berbasis React Native/Expo yang memungkinkan pengguna untuk membuat dan melihat laporan lokasi pada peta interaktif. Aplikasi ini menggunakan MapLibre untuk menampilkan peta dengan dukungan tema gelap dan terang, serta fitur autentikasi lengkap untuk manajemen pengguna.

<video width="320" height="240" controls>
  <source src="video_trashpin.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## 🎯 Fitur Utama

### 1. **Autentikasi & Manajemen Pengguna**

- Login dengan username dan password
- Registrasi pengguna baru (signup)
- Social media login (UI ready)
- Manajemen profil pengguna
- Edit profil dengan foto
- Logout
- Token-based authentication dengan refresh token
- Secure storage untuk token menggunakan Expo SecureStore

### 2. **Peta Interaktif**

- Peta interaktif menggunakan MapLibre
- Dukungan tema gelap dan terang
- Marker/lokasi laporan di peta
- Animasi kamera saat navigasi ke marker
- Current location tracking (dengan permission)
- Custom map styles (light & dark)

### 3. **Manajemen Laporan**

- Buat laporan baru dengan koordinat GPS
- Tambahkan foto ke laporan
- Lihat detail laporan dalam bottom sheet
- Filter laporan (semua laporan / hanya laporan user)
- Pencarian laporan berdasarkan judul dan deskripsi
- Statistik laporan (total & laporan user)
- Hapus laporan

### 4. **UI/UX Features**

- Dark/Light theme dengan system preference
- Bottom sheet untuk detail marker
- Toast notifications untuk feedback
- Loading modals
- Confirmation modals
- Haptic feedback
- Animasi dengan Reanimated
- Parallax scroll view
- Search bar dengan clear button
- Floating Action Button (FAB) untuk create report

## 🛠️ Teknologi & Dependencies

### Core Framework

- **Expo** ~54.0.27
- **React** 19.1.0
- **React Native** 0.81.5
- **Expo Router** ~6.0.17 (file-based routing)

### State Management

- **Zustand** ^5.0.9 - untuk state management lokal (reports store)
- **TanStack React Query** ^5.90.12 - untuk server state management

### Maps & Location

- **@maplibre/maplibre-react-native** ^10.4.2 - peta interaktif
- **expo-location** ~19.0.8 - akses lokasi GPS

### UI Components

- **@gorhom/bottom-sheet** ^5.2.8 - bottom sheet modal
- **expo-haptics** ~15.0.8 - haptic feedback
- **expo-image** ~3.0.11 - optimasi gambar
- **expo-image-picker** ~17.0.9 - picker foto
- **expo-linear-gradient** ~15.0.8 - gradient backgrounds
- **react-native-reanimated** ~4.1.1 - animasi
- **react-native-gesture-handler** ~2.28.0 - gesture handling

### Storage & Security

- **expo-secure-store** ~15.0.8 - secure token storage
- **@react-native-async-storage/async-storage** ^2.2.0 - local storage

### Networking

- **axios** ^1.13.2 - HTTP client
- **DummyJSON API** - backend API untuk autentikasi

### Navigation

- **@react-navigation/native** ^7.1.8
- **@react-navigation/bottom-tabs** ^7.4.0

## 📁 Struktur Project

```
report-maps/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout dengan providers
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
│   │   ├── client.ts           # Axios instance dengan interceptors
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── user.service.ts     # User service
│   │   ├── types.ts            # TypeScript types
│   │   └── index.ts
│   ├── hooks/                   # Custom hooks
│   │   └── use-auth.ts         # Auth hooks dengan React Query
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

## 🔐 Autentikasi

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

- Access token dan refresh token disimpan di Expo SecureStore
- Automatic token injection ke request headers via Axios interceptor
- Auto logout saat token expired (401 response)

## 🗺️ Fitur Peta

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
- Camera animation saat marker dipilih
- Custom map styles untuk light & dark mode
- Point annotations untuk markers

## 🎨 Theme System

Aplikasi mendukung 3 mode tema:

- **Light** - Tema terang
- **Dark** - Tema gelap
- **System** - Mengikuti preferensi sistem

Theme preference disimpan di AsyncStorage dan persist across app restarts.

## 📊 State Management

### Zustand Store (Reports)

- `userReports`: Array laporan yang dibuat user
- `addReport()`: Tambah laporan baru
- `removeReport()`: Hapus laporan
- `clearReports()`: Clear semua laporan

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

## 🔧 Konfigurasi

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

## 📝 Catatan Pengembangan

1. **DummyJSON API**: API ini adalah mock API, user yang didaftarkan via signup tidak bisa langsung login. Gunakan test credentials untuk login.

2. **Marker Data**: Sample markers disimpan di `assets/data/markers.json`. User reports disimpan di Zustand store (in-memory, tidak persist).

3. **Map Styles**: Custom map styles disimpan di `assets/mapstyle/` dengan format JSON.

4. **Type Safety**: Aplikasi menggunakan TypeScript dengan strict typing untuk semua API calls dan components.

5. **Error Handling**: Semua API calls memiliki error handling dengan toast notifications untuk user feedback.

## 🔄 Alur Aplikasi

1. **App Launch** → Check authentication status
2. **Not Authenticated** → Redirect ke `/login`
3. **Authenticated** → Redirect ke `/home`
4. **Home Screen** → Tampilkan peta dengan markers
5. **Create Report** → FAB → Form → Tambah marker ke peta
6. **View Report** → Tap marker → Bottom sheet dengan detail
7. **Profile** → Edit profile, logout

---

**Dibuat dengan ❤️ menggunakan Expo & React Native**
