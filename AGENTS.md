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
- **Lógica de dominio pura:** Los cálculos de ordenamiento, resolución de posiciones, arrastre (*drag & drop*), serialización de bloques y transformaciones de valores para controles UI (`toOptionalSelectValue` / `fromOptionalSelectValue`) deben residir en utilidades puras y comprobables (`.utils.ts`).
- **No reinventar utilidades existentes:** Antes de escribir cadenas de expresiones regulares (`.replace(...)`) o helpers manuales, verificar si `es-toolkit` ya provee la función (`kebabCase`, `debounce`, `uniq`, `xor`, `pick`, `isEqual`).
- **Eficiencia y memoria:**
  - Evitar asignaciones redundantes en memoria como `board.columns.flatMap(c => c.tasks).find(...)` en cada ciclo de render.
  - Implementar funciones puras con recorridos directos y cortocircuito temprano (`return` inmediato al encontrar el elemento).
  - No crear estructuras pesadas (`Map`, `Set`) dentro de `useMemo` si una búsqueda lineal simple o función utilitaria es más ligera y directa.

---

## 4. Tipado Estricto y Uso de `satisfies` (Cero strings libres o hacks de tipo)
- **Cero Strings Mágicos:** Prohibido comparar o asignar strings literales sueltos en la lógica (`block.type !== "heading"`, `status === "ACTIVE"`, `const NONE_OPTION = "__none__"` dentro de un componente). Definir diccionarios constantes con `as const` (`BLOCK_TYPE.HEADING`, `BOLT_STATUS.ACTIVE`) y validar su exhaustividad con `satisfies`.
- **Variantes de Componentes:** Nunca tipar variantes como strings sueltos (`"overlay" | "dragging"`). Utilizar `cva` y derivar el tipo con `VariantProps<typeof componentVariants>`.
- **Integración con ORM/Frameworks:** Usar el operador `satisfies` con los tipos nativos generados (ej. `satisfies Prisma.TaskUpdateManyArgs[]`) para garantizar validación en tiempo de compilación sin perder la inferencia estricta.
- **Sin type assertions descuidadas:** Prohibido el uso de `as any` o casteo forzado `as MyType` para silenciar errores del compilador.
- **Separación Limpia de Componentes:** Prohibidos hacks como `ref={isOverlay ? undefined : ref}`. Separar componentes puramente presentacionales de sus wrappers interactivos/sortables.

---

## 5. Diagnosticar la Raíz, No Parchar Superficialmente
- **Cero parches rápidos:** Si faltan datos o un tipo no encaja, no se debe "acomodar a la fuerza" en la vista. Se debe diagnosticar el flujo completo desde el modelo de datos, la API o los esquemas compartidos (`@scrum-board/shared`), y corregir el problema en su origen.
- **Validación Bidireccional:** Todo endpoint debe tener su esquema Zod correspondiente tanto en backend como frontend para evitar discrepancias en tiempo de ejecución.

---

## 6. Control de Errores Tipados con `Effect` (Prohibidos `try/catch` ciegos)
- **Prohibido:** Bloques `try/catch` mudos o genéricos que silencian excepciones o asumen falsamente la causa de un fallo (ej. asumir que cualquier error de Octokit/red es un `404 Not Found`).
- **Obligatorio en Integraciones Externas y Dominio Complejo (`apps/api`):**
  - Modelar los errores esperados con `Schema.TaggedError` de `effect` en un archivo dedicado (`*.errors.ts`, ej. `GitHubBranchNotFoundError`, `GitHubApiError`, `InvalidBranchNameError`).
  - Encapsular llamadas asíncronas falibles con `Effect.fn` y `Effect.tryPromise`, recuperándose explícitamente por etiqueta con `Effect.catchTag` / `Effect.catchTags`.
  - Ejecutar `Effect.runPromise` únicamente en la frontera del servicio hacia Hono, traduciendo los errores etiquetados no recuperables a `HTTPException`.

---

## 7. Modularización por Carpetas de Feature y Cero Archivos Puente Redundantes
- **Componentización Obligatoria:** Ningún componente de vista o panel complejo (ej. `board-detail-sidebar/`, `task-detail-sheet/`) debe concentrar múltiples secciones en un archivo monolítico. Debe dividirse en una subcarpeta dentro de su `feature/<modulo>/components/` con subcomponentes pequeños de responsabilidad única y un `index.tsx`.
- **Prohibidos los archivos puente redundantes:** Al convertir un componente `mi-componente.tsx` en una carpeta `mi-componente/`, **eliminar** el archivo plano `mi-componente.tsx` y exponer la API pública desde `mi-componente/index.tsx`. Nunca dejar un archivo suelto que haga `export { X } from "./x/x"`.
- **Respetar configuraciones centrales:** No hardcodear opciones como `staleTime` en hooks individuales de React Query si ya están gobernadas por la instancia central en `lib/react-query.ts`, salvo requerimiento explícito de negocio.
- **Cero Emojis en UI, Seeds o Código:** Prohibido usar emojis en componentes, textos de interfaz, logs o datos de seed. Para iconografía visual utilizar exclusivamente componentes de `lucide-react` o SVGs.
