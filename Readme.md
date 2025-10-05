Perfect! Here's a comprehensive README documentation for the frontend:

```markdown
# QR Auth App - Frontend Documentation

A modern React Native mobile application built with Expo, featuring JWT authentication, password reset with email verification, and auto-refreshing QR codes with smooth animations.

## 📱 Screenshots & Design

![Color Scheme](./assets/color-scheme.jpg)

**Design Features:**
- Modern gradient backgrounds (Cyan & Orange)
- Smooth fade animations
- WhatsApp-style QR code transitions
- Material Design inspired components
- Responsive layouts for all screen sizes

---

## 🚀 Features

### ✅ Authentication System
- **User Registration** with validation
- **Login/Logout** with JWT tokens
- **Forgot Password** with email verification codes
- **Auto-logout** on token expiration
- Secure token storage using Expo SecureStore

### ✅ QR Code Management
- **Auto-refresh** every 60 seconds
- **Manual refresh** with pull-to-refresh
- **Smooth fade animations** during transitions
- **UUID display** with countdown timer
- Real-time updates from backend

### ✅ Modern UI/UX
- Gradient backgrounds with brand colors
- Smooth animations and transitions
- Loading states and error handling
- Form validation with helpful messages
- Responsive design for all devices

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | Latest | Cross-platform mobile framework |
| **Expo** | SDK 54.0.0 | Development platform |
| **React Navigation** | v6 | Navigation library |
| **Axios** | Latest | HTTP client |
| **Expo SecureStore** | Latest | Secure token storage |
| **Expo LinearGradient** | Latest | Gradient backgrounds |
| **react-native-qrcode-svg** | Latest | QR code generation |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Button.js              # Reusable gradient button component
│   ├── Input.js               # Modern input field with validation
│   ├── ErrorMessage.js        # Alert/error display component
│   └── Loader.js              # Loading spinner with gradient
│
├── context/
│   └── AuthContext.js         # Global auth state management
│
├── navigation/
│   ├── AuthStack.js           # Navigation for unauthenticated users
│   ├── AppStack.js            # Navigation for authenticated users
│   └── RootNavigator.js       # Main navigation controller
│
├── screens/
│   ├── SplashScreen.js        # Initial loading screen
│   ├── LoginScreen.js         # User login
│   ├── RegisterScreen.js      # User registration
│   ├── ForgotPasswordScreen.js # Request password reset
│   ├── VerifyCodeScreen.js    # Enter 6-digit code
│   ├── ResetPasswordScreen.js # Create new password
│   └── HomeScreen.js          # QR code display
│
├── styles/
│   └── theme.js               # Centralized colors, spacing, shadows
│
├── utils/
│   ├── api.js                 # API functions (Axios)
│   ├── config.js              # API endpoints & app config
│   ├── storage.js             # SecureStore helpers
│   └── useAxiosInterceptor.js # Axios + Auth integration
│
└── App.js                     # Root component
```

---

## 🎨 Color Palette

```
// Primary Colors (Cyan)
primary: '#00B6EC'
primaryLight: '#01FFFF'
primaryDark: '#0088CC'

// Accent Colors (Orange)
accent: '#FA9836'
accentLight: '#FFB853'
accentDark: '#EA6400'

// Neutral Colors
white: '#FFFFFF'
offWhite: '#E0FFFF'
lightGray: '#F5F5F5'
darkGray: '#666666'
black: '#333333'
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Step 1: Clone & Install

```
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Step 2: Install Required Packages

```
# Install Expo packages
npx expo install expo-linear-gradient expo-secure-store

# Install navigation
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# Install other dependencies
npm install axios react-native-qrcode-svg
```

### Step 3: Configure Backend URL

Update `src/utils/config.js`:

```
export const API_CONFIG = {
  // For iOS Simulator
  BASE_URL: 'http://localhost:4000/api',
  
  // For Android Emulator
  // BASE_URL: 'http://10.0.2.2:4000/api',
  
  // For Physical Device (replace with your IP)
  // BASE_URL: 'http://192.168.1.100:4000/api',
  
  TIMEOUT: 10000,
};
```

**Finding Your IP Address:**
```
# Windows
ipconfig

# Mac/Linux
ifconfig | grep inet
```

### Step 4: Start Development Server

```
# Start Expo
npx expo start

# Or with cache clear
npx expo start -c
```

### Step 5: Run on Device/Simulator

- **iOS:** Press `i` in terminal or scan QR code with Camera app
- **Android:** Press `a` in terminal or scan QR code with Expo Go app
- **Web:** Press `w` in terminal

---

## 📱 Screen Flow

### Authentication Flow
```
SplashScreen (checks token)
    ↓
    ├─→ LoginScreen
    │   ├─→ RegisterScreen
    │   └─→ ForgotPasswordScreen
    │       └─→ VerifyCodeScreen
    │           └─→ ResetPasswordScreen
    │               └─→ HomeScreen (auto-login)
    │
    └─→ HomeScreen (if authenticated)
```

### Password Reset Flow
1. **ForgotPasswordScreen:** User enters email
2. **Backend sends 6-digit code** to email
3. **VerifyCodeScreen:** User enters code
4. **ResetPasswordScreen:** User creates new password
5. **Auto-login** with new credentials

---

## 🔐 Authentication

### Context API Usage

```
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { 
    user,           // Current user object
    isAuthenticated, // Boolean
    isLoading,      // Boolean
    login,          // Function
    register,       // Function
    logout,         // Function
  } = useAuth();
  
  // Use auth methods
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Navigation handled automatically
    }
  };
}
```

### Secure Storage

Tokens are stored securely using Expo SecureStore:

```
import * as SecureStore from 'expo-secure-store';

// Save token
await SecureStore.setItemAsync('auth_token', token);

// Get token
const token = await SecureStore.getItemAsync('auth_token');

// Delete token
await SecureStore.deleteItemAsync('auth_token');
```

### Automatic Token Handling

The `useAxiosInterceptor` hook automatically:
- ✅ Adds token to all API requests
- ✅ Logs out user on 401 errors
- ✅ Handles token expiration

---

## 🌐 API Integration

### Configuration

All API endpoints are defined in `src/utils/config.js`:

```
export const ENDPOINTS = {
  REGISTER: '/user/register',
  LOGIN: '/user/login',
  FORGOT_PASSWORD: '/user/forgot-password',
  VERIFY_RESET_CODE: '/user/verify-reset-code',
  RESET_PASSWORD: '/user/reset-password',
  GET_ME: '/user/me',
  GET_QR_CURRENT: '/qr/current',
  REFRESH_QR: '/qr/refresh',
};
```

### API Functions

All API calls return consistent format:

```
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: 'Error message' }
```

**Example Usage:**

```
import { login, getCurrentQR } from '../utils/api';

// Login
const result = await login('user@example.com', 'password123');
if (result.success) {
  console.log('User:', result.data.user);
  console.log('Token:', result.data.token);
}

// Get QR Code
const qrResult = await getCurrentQR();
if (qrResult.success) {
  console.log('QR UUID:', qrResult.data.uuid);
}
```

---

## 🎭 Components

### Button Component

```
import Button from '../components/Button';

<Button 
  title="Click Me"
  onPress={handlePress}
  loading={isLoading}
  variant="primary"  // primary, secondary, outline
  disabled={false}
/>
```

### Input Component

```
import Input from '../components/Input';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  keyboardType="email-address"
  error={errorMessage}
  secureTextEntry={false}
/>
```

### ErrorMessage Component

```
import ErrorMessage from '../components/ErrorMessage';

<ErrorMessage 
  message="Something went wrong"
  type="error"  // error, warning, info, success
  onRetry={retryFunction}
/>
```

---

## 🎨 Styling

### Using Theme

```
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
});
```

### LinearGradient

```
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/theme';

<LinearGradient
  colors={[colors.primaryLight, colors.primary]}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.gradient}
>
  {/* Content */}
</LinearGradient>
```

---

## 🔄 QR Code Feature

### Auto-Refresh

QR codes automatically refresh every 60 seconds:

```
useEffect(() => {
  // Refresh every 60 seconds
  const interval = setInterval(() => {
    refreshQRCode();
  }, 60000);

  return () => clearInterval(interval);
}, []);
```

### Fade Animation

Smooth WhatsApp-style transitions:

```
// Fade out
Animated.timing(fadeAnim, {
  toValue: 0,
  duration: 300,
  useNativeDriver: true,
}).start();

// Update data

// Fade in
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Network Error

**Problem:** `Network Error` or `Cannot connect to backend`

**Solution:**
```
// For physical device, use your computer's IP
// Find IP: ipconfig (Windows) or ifconfig (Mac/Linux)
BASE_URL: 'http://192.168.1.100:4000/api'

// Make sure phone and computer are on same WiFi
```

#### 2. Platform Not Found Error

**Problem:** `ReferenceError: Property 'Platform' doesn't exist`

**Solution:**
```
// Add Platform import
import { Platform } from 'react-native';
```

#### 3. SecureStore Error

**Problem:** `Invalid value provided to SecureStore`

**Solution:** Ensure all values are strings
```
// Correct
await SecureStore.setItemAsync('key', 'string_value');

// Wrong
await SecureStore.setItemAsync('key', { object: 'value' });
```

#### 4. Expo Not Starting

**Solution:**
```
# Clear cache
npx expo start -c

# Reset node modules
rm -rf node_modules
npm install
```

---

## 📦 Build for Production

### Android

```
# Create APK
eas build --platform android

# Or using Expo build service
expo build:android
```

### iOS

```
# Create IPA
eas build --platform ios

# Or using Expo build service
expo build:ios
```

---
