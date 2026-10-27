import { prisma } from "@/db/connections";
import { Priority } from "@/db/prisma/generated/client";

async function main() {
	console.log("🌱 Starting database seeding...");

	// Limpiar datos existentes en orden inverso de relaciones
	await prisma.comment.deleteMany();
	await prisma.task.deleteMany();
	await prisma.column.deleteMany();
	await prisma.board.deleteMany();
	await prisma.user.deleteMany();

	console.log("🧹 Existing database cleared.");

	const defaultPassword = await Bun.password.hash("password123");

	// 1. Crear Usuarios
	const demoUser = await prisma.user.create({
		data: {
			email: "demo@example.com",
			name: "Demo User",
			password: defaultPassword,
			avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
		},
	});

	const john = await prisma.user.create({
		data: {
			email: "john@example.com",
			name: "John Doe",
			password: defaultPassword,
			avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
		},
	});

	const jane = await prisma.user.create({
		data: {
			email: "jane@example.com",
			name: "Jane Smith",
			password: defaultPassword,
			avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
		},
	});

	console.log(
		"👤 Created 3 users (demo@example.com, john@example.com, jane@example.com).",
	);

	// 2. Tablero 1: Sprint 24 - Plataforma Web
	const board1 = await prisma.board.create({
		data: {
			name: "🚀 Sprint 24 - Plataforma Web",
			ownerId: demoUser.id,
			columns: {
				create: [
					{
						name: "To Do",
						order: 0,
						tasks: {
							create: [
								{
									title: "Diseñar flujo de onboarding",
									description:
										"Crear wireframes interactivos y validar pasos de bienvenida con el equipo de producto.",
									order: 0,
									priority: Priority.HIGH,
									assignees: {
										connect: [{ id: demoUser.id }, { id: jane.id }],
									},
								},
								{
									title: "Configurar alertas en Sentry",
									description:
										"Integrar Sentry en backend Hono y frontend React para capturar excepciones no controladas.",
									order: 1,
									priority: Priority.MEDIUM,
									assignees: { connect: [{ id: john.id }] },
								},
								{
									title: "Auditoría de dependencias y seguridad",
									description:
										"Revisar vulnerabilidades con `bun pm audit` y actualizar librerías con parches críticos.",
									order: 2,
									priority: Priority.LOW,
								},
							],
						},
					},
					{
						name: "In Progress",
						order: 1,
						tasks: {
							create: [
								{
									title: "Implementar filtros avanzados en tabla",
									description:
										"Permitir filtrado dinámico por asignados, prioridad y búsqueda en texto en BoardTableView.",
									order: 0,
									priority: Priority.HIGH,
									assignees: { connect: [{ id: demoUser.id }] },
								},
								{
									title: "Refactorizar autenticación y manejo de sesión",
									description:
										"Asegurar renovación transparente con Refresh Tokens en cookies HttpOnly seguras.",
									order: 1,
									priority: Priority.URGENT,
									assignees: {
										connect: [{ id: demoUser.id }, { id: john.id }],
									},
								},
							],
						},
					},
					{
						name: "In Review",
						order: 2,
						tasks: {
							create: [
								{
									title: "Pruebas end-to-end de registro y login",
									description:
										"Verificar validaciones de formularios con Zod y persistencia correcta en base de datos.",
									order: 0,
									priority: Priority.MEDIUM,
									assignees: { connect: [{ id: jane.id }] },
								},
								{
									title: "Revisión de accesibilidad y contrastes",
									description:
										"Garantizar cumplimiento de WCAG AA en modo oscuro y claro.",
									order: 1,
									priority: Priority.LOW,
									assignees: { connect: [{ id: demoUser.id }] },
								},
							],
						},
					},
					{
						name: "Done",
						order: 3,
						tasks: {
							create: [
								{
									title: "Setup de Turborepo y Vite con Tailwind v4",
									description:
										"Configuración inicial del monorepo, tooling de Biome y alias de TypeScript.",
									order: 0,
									priority: Priority.MEDIUM,
									assignees: { connect: [{ id: demoUser.id }] },
								},
								{
									title: "Migración a Prisma 7 y esquemas modulares",
									description:
										"Dividir modelos en archivos .prisma individuales con adapter nativo de PostgreSQL.",
									order: 1,
									priority: Priority.HIGH,
									assignees: { connect: [{ id: john.id }] },
								},
							],
						},
					},
				],
			},
		},
	});

	// 3. Tablero 2: App Móvil & API
	const board2 = await prisma.board.create({
		data: {
			name: "📱 App Móvil & API",
			ownerId: demoUser.id,
			columns: {
				create: [
					{
						name: "Backlog",
						order: 0,
						tasks: {
							create: [
								{
									title: "Investigar soporte offline con SQLite",
									description:
										"Evaluar sincronización bidireccional entre cliente móvil y servidor Hono.",
									order: 0,
									priority: Priority.MEDIUM,
									assignees: { connect: [{ id: jane.id }] },
								},
								{
									title: "Push notifications con Firebase FCM",
									description:
										"Configurar envío de notificaciones automáticas al asignar tareas a un usuario.",
									order: 1,
									priority: Priority.HIGH,
									assignees: { connect: [{ id: demoUser.id }] },
								},
							],
						},
					},
					{
						name: "Sprint Backlog",
						order: 1,
						tasks: {
							create: [
								{
									title: "Diseño UI kit en Figma",
									description:
										"Componentes nativos adaptados para iOS y Android siguiendo Material You y Human Interface.",
									order: 0,
									priority: Priority.URGENT,
									assignees: { connect: [{ id: jane.id }] },
								},
							],
						},
					},
					{
						name: "In Development",
						order: 2,
						tasks: {
							create: [
								{
									title: "Setup base de React Native / Expo",
									description:
										"Inicializar proyecto con Expo Router y consumo del paquete @scrum-board/shared.",
									order: 0,
									priority: Priority.HIGH,
									assignees: {
										connect: [{ id: demoUser.id }, { id: john.id }],
									},
								},
							],
						},
					},
					{
						name: "Released",
						order: 3,
						tasks: {
							create: [
								{
									title: "Definición de endpoints OpenAPI v1",
									description:
										"Documentar rutas de boards, columnas y tareas con Scalar UI.",
									order: 0,
									priority: Priority.LOW,
									assignees: { connect: [{ id: john.id }] },
								},
							],
						},
					},
				],
			},
		},
	});

	// 4. Tablero 3: Bugs & Mantenimiento
	const board3 = await prisma.board.create({
		data: {
			name: "🐛 Bugs & Mantenimiento",
			ownerId: demoUser.id,
			columns: {
				create: [
					{
						name: "Reportados",
						order: 0,
						tasks: {
							create: [
								{
									title: "Fallo de scroll horizontal en Kanban en Safari iOS",
									description:
										"El contenedor de columnas se traba al deslizar rápidamente en pantallas táctiles.",
									order: 0,
									priority: Priority.HIGH,
									assignees: { connect: [{ id: demoUser.id }] },
								},
								{
									title: "Timeout intermitente al filtrar por múltiples tags",
									description:
										"Optimizar query en PostgreSQL agregando índices en columnas frecuentes.",
									order: 1,
									priority: Priority.MEDIUM,
									assignees: { connect: [{ id: john.id }] },
								},
							],
						},
					},
					{
						name: "Investigando",
						order: 1,
						tasks: {
							create: [
								{
									title:
										"Token refresh loop cuando expira la sesión de usuario",
									description:
										"Si el refresh token expira, la UI intenta reintentar 5 veces antes de redirigir a /login.",
									order: 0,
									priority: Priority.URGENT,
									assignees: {
										connect: [{ id: demoUser.id }, { id: jane.id }],
									},
								},
							],
						},
					},
					{
						name: "Resueltos",
						order: 2,
						tasks: {
							create: [
								{
									title: "Padding incorrecto en el diálogo de crear columna",
									description:
										"Corregido espaciado en botones de acción y campo de texto.",
									order: 0,
									priority: Priority.LOW,
									assignees: { connect: [{ id: jane.id }] },
								},
							],
						},
					},
				],
			},
		},
	});

	console.log(
		`📋 Created 3 boards: "${board1.name}", "${board2.name}", "${board3.name}".`,
	);
	console.log("✅ Database seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error("❌ Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
