# 🚗 Parking Puzzle

A minimalist puzzle game inspired by Nanogram.com. Move vehicles to get the red car out!

## 📱 Quick Start

### Prerequisites
- Node.js v18+ 
- pnpm (recommended) or npm
- Expo Go app on your phone, OR
- iOS Simulator (macOS) / Android Emulator

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm start
```

### Running the App

After running `pnpm start`, you'll see a QR code in the terminal.

**On your phone:**
1. Install **Expo Go** from App Store / Play Store
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)

**On simulator:**
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator (requires Android Studio)

## 🎮 How to Play

- **Objective**: Move vehicles to get the red car to the exit
- **Controls**: Drag vehicles horizontally or vertically
- **Goal**: Complete levels in the fewest moves possible
- **Stars**: Earn up to 3 stars based on efficiency

## 🏗️ Project Structure

```
/app                    # Screens (expo-router)
  index.tsx            # Home screen
  play.tsx             # Game board
  levels.tsx           # Level selector
  settings.tsx         # Settings
  
/src
  /components          # Reusable UI components
  /logic               # Game engine
    moveEngine.ts      # Movement validation
    solver.ts          # BFS solver
    scoring.ts         # Star calculation
    types.ts           # TypeScript types
  /theme               # Colors & typography
  /data                # Level definitions
    /levels
      easy.json
      medium.json
      hard.json
      expert.json

/tests                 # Unit tests
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## 📦 Building for Production

### iOS

```bash
# Create a production build
npx eas build --platform ios

# For App Store submission
npx eas submit --platform ios
```

### Android

```bash
# Create a production build
npx eas build --platform android

# For Play Store submission
npx eas submit --platform android
```

**Note**: You'll need to configure `eas.json` and update the bundle identifiers in `app.json`:
- iOS: Change `com.yourcompany.parkingpuzzle` to your bundle ID
- Android: Change package name

## 🎨 Design

The app follows a minimalist aesthetic inspired by Nanogram:
- Clean, spacious layouts
- Soft shadows and rounded corners
- Azul primary color (#2E9BFF)
- Light/dark theme support

## 📝 License

Private project - All rights reserved

## 🚀 Future Features

- [ ] Daily puzzles
- [ ] Cloud save sync
- [ ] Level editor
- [ ] Achievements
- [ ] Custom vehicle skins
- [ ] Multiplayer challenges

---

Made with ❤️ using Expo + React Native + TypeScript
