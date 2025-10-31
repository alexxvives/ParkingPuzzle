# 🐛 Debugging Instructions for AI Assistant

## **READ THIS AT EVERY PROMPT DURING DEBUGGING SESSIONS**

When the user reports a bug or unexpected behavior, follow this systematic approach:

---

## 1️⃣ **First Response - Information Gathering**

**ALWAYS ask for these diagnostics:**

```
Por favor, ayúdame a entender qué está pasando:

1. **¿Qué ves en pantalla?** (describe o screenshot)
2. **¿Qué esperabas que pasara?**
3. **¿Hay algún error visible?** (pantalla roja, yellow box)

Luego, abre las herramientas de debugging:

📱 **En tu iPhone:**
   - Shake el teléfono
   - Selecciona "Open JS Debugger"
   - Ve a Chrome → Console tab
   - Copia y pégame cualquier mensaje rojo o amarillo

💻 **En la terminal donde corre Metro:**
   - Mira si hay algún error (texto rojo)
   - Copia y pégame las últimas 20 líneas

🔍 **Para problemas de UI/Layout:**
   - Shake → Toggle Element Inspector
   - Toca el elemento problemático
   - Dime: "Qué estilos tiene aplicados? (width, height, position, etc.)"
```

---

## 2️⃣ **Systematic Debugging - Add Instrumentation**

Based on the type of issue, **ADD CONSOLE.LOGS** to the relevant code:

### **UI/Layout Issues**
```typescript
// Add to the component with the problem
useEffect(() => {
  console.log('🎨 Component rendered with:', { 
    cellSize, 
    gridSize: level.size,
    difficulty 
  });
}, [cellSize, level.size, difficulty]);
```

### **State/Props Issues**
```typescript
// Add to state setters
setVehicles((prev) => {
  console.log('🚗 Previous vehicles:', prev);
  const updated = /* ... */;
  console.log('🚗 Updated vehicles:', updated);
  return updated;
});
```

### **Gesture/Interaction Issues**
```typescript
const panGesture = Gesture.Pan()
  .onStart(() => console.log('👆 Gesture START'))
  .onUpdate((e) => console.log('👆 Translation:', e.translationX, e.translationY))
  .onEnd(() => console.log('👆 Gesture END'));
```

### **Logic/Calculation Issues**
```typescript
// Add before/after critical calculations
console.log('⚙️ Input:', inputValue);
const result = calculateSomething(inputValue);
console.log('⚙️ Output:', result);
```

---

## 3️⃣ **Ask User to Execute and Report**

**After adding logs, tell the user:**

```
He añadido algunos console.log para diagnosticar el problema.

1. Guarda el archivo (el Fast Refresh debería actualizarlo automáticamente)
2. Si no se actualiza, Shake → Reload
3. Reproduce el problema de nuevo
4. Mira la Chrome Console (JS Debugger)
5. Copia y pégame TODOS los mensajes que aparezcan (especialmente los que empiezan con 🎨 🚗 👆 ⚙️)
```

---

## 4️⃣ **Performance Issues**

**If user reports lag, freezing, or slow animations:**

```
Vamos a medir el rendimiento:

1. Shake → Toggle Performance Monitor
2. Interactúa con la app (mueve coches, navega, etc.)
3. Dime:
   - ¿FPS está por debajo de 50?
   - ¿RAM sube constantemente?
   - ¿JS thread está en rojo?

También en Chrome DevTools:
1. Ve a la pestaña "Performance"
2. Click en Record (●)
3. Reproduce el problema
4. Stop recording
5. Dime si hay algún pico grande o función que tarde mucho
```

---

## 5️⃣ **Network/Data Issues**

**If issue involves loading data, API calls, or AsyncStorage:**

```
En Chrome DevTools:
1. Ve a la pestaña "Network"
2. Reproduce el problema
3. Dime:
   - ¿Aparecen requests?
   - ¿Alguna falla (rojo)?
   - ¿Qué response tienen?

Para AsyncStorage:
1. Ve a "Application" tab
2. Busca "Storage" en el sidebar
3. Dime qué keys/values ves
```

---

## 6️⃣ **Common Patterns to Check**

### **Grid not visible or wrong size?**
- Check cellSize calculation
- Check if level.size is correct
- Check if Grid component receives props

### **Vehicles not moving or glitching?**
- Check panGesture onUpdate logs
- Check calculateMaxMovement return value
- Check collision detection in canMove

### **State not updating?**
- Check if setState is inside useCallback deps
- Check if state update is async
- Use React DevTools to inspect state

### **TypeScript errors?**
- Run `npx tsc --noEmit` to see all errors
- Check if types match between components
- Verify JSON data structure matches Level type

---

## 7️⃣ **Resolution Verification**

**After fixing, ask user to confirm:**

```
¿Funciona ahora? Por favor verifica:
1. El comportamiento original que fallaba
2. Que no haya nuevos errores en Console
3. Que el Performance Monitor se vea bien (si era performance issue)

Si funciona, voy a limpiar los console.log de debugging.
```

---

## 8️⃣ **Clean Up**

**Once fixed, REMOVE all debugging logs:**
- Search for `console.log` in modified files
- Remove instrumentation code
- Keep only essential logs (errors, warnings)

---

## ⚠️ **CRITICAL RULES**

1. **NEVER assume** what's happening without user data
2. **ALWAYS add logs** before guessing the fix
3. **ASK for Chrome Console output** - it's the most valuable info
4. **One issue at a time** - don't overwhelm with multiple debugging requests
5. **Verify the fix** - ask user to confirm before moving on

---

## 🎯 **Quick Reference - What Tool for What**

| Issue Type | Tool to Use |
|------------|-------------|
| UI not displaying | Element Inspector + console.log styles |
| Component not rendering | React DevTools + console.log in render |
| State not updating | React DevTools + console.log in setState |
| Gesture not working | console.log in gesture handlers |
| Performance lag | Performance Monitor + Chrome Profiler |
| Logic error | console.log inputs/outputs + Breakpoints |
| TypeScript error | `npx tsc --noEmit` |
| Crash/Red screen | Metro terminal + Stack trace |
| Data not loading | Network tab + console.log |

---

## 📋 **Template Response for Bug Reports**

```markdown
Entiendo el problema. Vamos a diagnosticarlo sistemáticamente.

**Paso 1: Información básica**
[Ask user for screen state, expected behavior, visible errors]

**Paso 2: Instrumentación**
[Add console.logs to relevant code sections]

**Paso 3: Recolección de datos**
[Ask user to check Chrome Console, Metro terminal, Element Inspector]

**Paso 4: Análisis**
[Once user provides data, analyze and propose fix]

**Paso 5: Verificación**
[After fix, ask user to confirm and check for side effects]
```

---

**END OF DEBUGGING INSTRUCTIONS**
