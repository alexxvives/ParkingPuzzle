# 🚀 Cómo Ejecutar Parking Puzzle

## ✅ Prerequisitos Completados
- ✓ Node.js instalado
- ✓ pnpm instalado
- ✓ Dependencias instaladas
- ✓ Tests pasando

## 📱 Opciones para Correr la App

### Opción 1: En tu teléfono con Expo Go (MÁS FÁCIL)

1. **Instala Expo Go en tu teléfono:**
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Inicia el servidor de desarrollo:**
   ```powershell
   pnpm start
   ```

3. **Escanea el QR code:**
   - iOS: Usa la app de Cámara nativa
   - Android: Usa la app Expo Go

4. **¡Juega!** La app se cargará en tu teléfono

### Opción 2: En Simulador iOS (solo macOS)

```powershell
pnpm ios
```

### Opción 3: En Emulador Android

1. **Instala Android Studio** si no lo tienes
2. **Crea un emulador** desde Android Studio
3. **Inicia el emulador**
4. Ejecuta:
   ```powershell
   pnpm android
   ```

## 🎮 Comandos Disponibles

```powershell
# Iniciar servidor de desarrollo
pnpm start

# Ejecutar tests
pnpm test

# Ejecutar tests en modo watch
pnpm test --watch

# Verificar TypeScript
npx tsc --noEmit

# Limpiar caché de Metro (si hay problemas)
pnpm start --clear
```

## 🔧 Solución de Problemas

### "Module not found" o errores de imports
```powershell
# Borra node_modules y reinstala
rm -r node_modules
pnpm install
```

### La app no se conecta al servidor
- Asegúrate de que tu teléfono y PC estén en la misma red WiFi
- Desactiva VPNs o firewalls temporalmente
- Prueba presionando `w` en la terminal para abrir en navegador web

### Cambios no se reflejan
```powershell
# Reinicia con caché limpia
pnpm start --clear
```

## 📝 Próximos Pasos

### Para Personalizar:

1. **Bundle ID**: Edita `app.json` y cambia:
   - `com.yourcompany.parkingpuzzle` → tu bundle ID

2. **Iconos**: Reemplaza los placeholders en `/assets/`
   - `icon.png` (1024x1024)
   - `splash.png` (2048x2048)
   - `adaptive-icon.png` (1024x1024)

3. **Colores**: Edita `src/theme/colors.ts`

4. **Niveles**: Añade más en `src/data/levels/`

### Para Publicar:

```powershell
# Instala EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configura tu proyecto
eas build:configure

# Build para iOS
eas build --platform ios

# Build para Android
eas build --platform android
```

## 🎨 Estructura de Archivos Creados

```
ParkingPuzzle/
├── app/                    # Pantallas
│   ├── _layout.tsx        # Layout principal
│   ├── index.tsx          # Home
│   ├── play.tsx           # Juego
│   ├── levels.tsx         # Selector de niveles
│   └── settings.tsx       # Configuración
├── src/
│   ├── components/        # Componentes UI
│   │   ├── Screen.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Grid.tsx
│   │   └── Vehicle.tsx
│   ├── logic/             # Motor del juego
│   │   ├── types.ts
│   │   ├── moveEngine.ts
│   │   ├── solver.ts
│   │   └── scoring.ts
│   ├── theme/             # Tema Nanogram
│   │   ├── colors.ts
│   │   └── typography.ts
│   └── data/              # Niveles
│       ├── index.ts
│       └── levels/
│           ├── easy.json      (3 niveles)
│           ├── medium.json    (3 niveles)
│           ├── hard.json      (2 niveles)
│           └── expert.json    (2 niveles)
├── tests/                 # Tests unitarios
│   ├── moveEngine.test.ts
│   └── solver.test.ts
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

## 📊 Estado del Proyecto

✅ **Completado:**
- Motor del juego (movimiento celda por celda)
- 10 niveles jugables
- UI minimalista estilo Nanogram
- Navegación entre pantallas
- Sistema de estrellas
- Tests unitarios
- Tema claro/oscuro
- TypeScript configurado

⏳ **Pendiente (funcionalidad avanzada):**
- Drag & drop interactivo (actualmente solo visual)
- Animaciones con Reanimated
- Persistencia con AsyncStorage
- Hints/Ayudas
- Daily Puzzle
- IAP / Ads (stubs listos)
- Zustand store (estructura lista)

## ❓ ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa que `pnpm start` corra sin errores
2. Verifica que tu teléfono esté en la misma red
3. Prueba `pnpm start --clear` para limpiar caché
4. Asegúrate de tener Expo Go instalado

---

**¡Ahora ejecuta `pnpm start` y empieza a jugar!** 🚗🎮
