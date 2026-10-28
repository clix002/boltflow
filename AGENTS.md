# Reglas de Ingeniería y Buenas Prácticas del Proyecto

Este documento define los estándares arquitectónicos y de código obligatorios para el proyecto `scrum-board`. Todo desarrollo y refactorización debe regirse estrictamente por estas directrices.

---

## 1. Límite de Parámetros y Tipos Input Dedicados (Regla de $\le$ 2 argumentos)
- **Prohibido:** Funciones o métodos con más de 2 argumentos posicionales (ej. `moveTask(id, userId, sourceCol, targetCol, order)`).
- **Obligatorio:** 
  - Si una operación requiere 3 o más parámetros, o recibe combinaciones como `(id, userId, data)`, se **debe** encapsular en un tipo de entrada explícito (ej. `MoveTaskInput`, `UpdateTaskInput`, `MoveTaskParams`).
  - Beneficios: APIs desacopladas del orden posicional, refactorizaciones seguras y firma limpia.

---

## 2. Cláusulas de Guarda y Lógica Declarativa (No pirámides de `if/else`)
- **Cláusulas de Guarda (*Early Returns*):** Manejar errores, validaciones y casos límite al inicio de la función retornando inmediatamente.
- **Sin anidamiento excesivo:** Nunca colocar árboles profundos de `if/else` dentro de bloques críticos como transacciones de base de datos (`prisma.$transaction`).
- **Operaciones declarativas:** Extraer el cálculo condicional complejo a generadores de operaciones o matrices declarativas (ej. `getMoveShiftOperations`) que devuelvan listas de acciones a ejecutar.

---

## 3. Funciones Puras y Utilidades Desacopladas (`.utils.ts`)
- **Lógica de dominio pura:** Los cálculos de ordenamiento, resolución de posiciones, arrastre (*drag & drop*) y transformaciones de datos deben residir en utilidades puras y comprobables (ej. `dnd.utils.ts`, `task.reorder.ts`).
- **Eficiencia y memoria:**
  - Evitar asignaciones redundantes en memoria como `board.columns.flatMap(c => c.tasks).find(...)` en cada ciclo de render.
  - Implementar funciones puras con recorridos directos y cortocircuito temprano (`return` inmediato al encontrar el elemento).
  - No crear estructuras pesadas (`Map`, `Set`) dentro de `useMemo` si una búsqueda lineal simple o función utilitaria es más ligera y directa.

---

## 4. Tipado Estricto y Uso de `satisfies` (Cero strings libres o hacks de tipo)
- **Variantes de Componentes:** Nunca tipar variantes como strings sueltos (`"overlay" | "dragging"`). Utilizar `cva` y derivar el tipo con `VariantProps<typeof componentVariants>`.
- **Integración con ORM/Frameworks:** Usar el operador `satisfies` con los tipos nativos generados (ej. `satisfies Prisma.TaskUpdateManyArgs[]`) para garantizar validación en tiempo de compilación sin perder la inferencia estricta.
- **Sin type assertions descuidadas:** Prohibido el uso de `as any` o casteo forzado `as MyType` para silenciar errores del compilador.
- **Separación Limpia de Componentes:** Prohibidos hacks como `ref={isOverlay ? undefined : ref}`. Separar componentes puramente presentacionales de sus wrappers interactivos/sortables.

---

## 5. Diagnosticar la Raíz, No Parchar Superficialmente
- **Cero parches rápidos:** Si faltan datos o un tipo no encaja, no se debe "acomodar a la fuerza" en la vista. Se debe diagnosticar el flujo completo desde el modelo de datos, la API o los esquemas compartidos (`@scrum-board/shared`), y corregir el problema en su origen.
- **Validación Bidireccional:** Todo endpoint debe tener su esquema Zod correspondiente tanto en backend como frontend para evitar discrepancias en tiempo de ejecución.
