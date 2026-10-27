# ScrumBoard

Tablero Kanban colaborativo (estilo Jira/Trello).

**Stack:** Bun + Hono.js + PostgreSQL + Prisma + React 19 + Tailwind v4 + shadcn/ui + dnd-kit

## Proyecto

Parte del roadmap de 22 proyectos full stack. Cada proyecto es atómico e independiente.

## Inicio

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

Configura `DATABASE_URL`, `JWT_SECRET` y `REFRESH_SECRET` en `apps/api/.env` con
valores propios y distintos antes de `bun install`. El `postinstall` genera el
cliente Prisma y necesita `DATABASE_URL`.

`TRUST_PROXY` queda en `false` por defecto. Actívalo solo si la API está detrás
de un proxy confiable que añade `X-Forwarded-For` y bloquea el acceso directo al
servidor de origen.

## Scripts

```bash
bun install      # Instala dependencias y genera el cliente Prisma
bun run dev      # Levanta api + web
bun run build    # Build de producción
bun run lint     # Biome check
bun run format   # Biome format + lint
```
# scrum-board
