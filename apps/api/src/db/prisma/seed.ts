import { prisma } from "@/db/connections";
import { BoltStatus, Priority, PrStatus } from "@/db/prisma/generated/client";
import {
	bold,
	bullet,
	code,
	h2,
	h3,
	p,
	serializeSeedBlocks,
	table,
	text,
	todo,
} from "./seed-blocks.utils";

const MAIN_BOARD_ID = "4ec3738b-039f-4b75-a93e-58ae5a1529a6";

async function main() {
	console.log("Starting database seeding...");

	await prisma.comment.deleteMany();
	await prisma.task.deleteMany();
	await prisma.column.deleteMany();
	await prisma.unit.deleteMany();
	await prisma.bolt.deleteMany();
	await prisma.board.deleteMany();
	await prisma.user.deleteMany();

	console.log("Existing database cleared.");

	const defaultPassword = await Bun.password.hash("password123");

	const demoUser = await prisma.user.create({
		data: {
			email: "demo@example.com",
			name: "Clix",
			password: defaultPassword,
			avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
		},
	});

	const aiAgent = await prisma.user.create({
		data: {
			email: "agent@example.com",
			name: "Code Agent",
			password: defaultPassword,
			avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=BoltFlow",
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

	console.log(
		"Created 3 users (demo@example.com, agent@example.com, john@example.com).",
	);

	// 1. Crear el Board principal conectado al repositorio real clix002/boltflow
	const mainProjectBoard = await prisma.board.create({
		data: {
			id: MAIN_BOARD_ID,
			name: "BoltFlow Workspace",
			githubRepo: "clix002/boltflow",
			defaultBranch: "main",
			ownerId: demoUser.id,
		},
	});

	// 2. Crear las Units of Work (Módulos DDD)
	const [unitCore, unitGitHub, unitUi, unitCli] = await Promise.all([
		prisma.unit.create({
			data: {
				name: "Core & Schema",
				description:
					"Modelos Prisma (Unit, Bolt), CI y esquemas Zod compartidos",
				color: "#8b5cf6",
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.unit.create({
			data: {
				name: "GitHub Sync",
				description: "Integración Octokit REST API, ramas y Pull Requests",
				color: "#10b981",
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.unit.create({
			data: {
				name: "UI Sidebar & Drawer",
				description:
					"BoardDetailSidebar, Kanban, Table y BlockNote Spec Drawer",
				color: "#3b82f6",
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.unit.create({
			data: {
				name: "CLI Agent",
				description:
					"Herramienta CLI para que agentes IA operen desde terminal",
				color: "#f59e0b",
				boardId: mainProjectBoard.id,
			},
		}),
	]);

	// 3. Crear los Bolts (Ciclos rápidos de horas/días)
	const [bolt1, bolt2, bolt3] = await Promise.all([
		prisma.bolt.create({
			data: {
				name: "Bolt #1: Core & Spec Drawer",
				goal: "Drag & Drop canónico, BlockNote Drawer y CRUD con sonidos",
				status: BoltStatus.COMPLETED,
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.bolt.create({
			data: {
				name: "Bolt #2: GitHub & Sidebar",
				goal: "Conectar Octokit con clix002/boltflow, Units, Bolts y ramas en vivo",
				status: BoltStatus.COMPLETED,
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.bolt.create({
			data: {
				name: "Bolt #3: Units CRUD, Webhooks & CLI",
				goal: "Gestión de Units/Bolts desde UI, Webhooks de GitHub y CLI para agentes",
				status: BoltStatus.ACTIVE,
				boardId: mainProjectBoard.id,
			},
		}),
	]);

	// 4. Crear las Columnas reflejando el estado real actual del proyecto
	await prisma.column.create({
		data: {
			name: "1. Elaboration (Spec)",
			order: 0,
			boardId: mainProjectBoard.id,
			tasks: {
				create: [
					{
						title: "Crear paquete CLI para Agentes en Terminal",
						description: serializeSeedBlocks([
							h2("Intent & Spec"),
							p(
								text(
									"Permitir que un agente de IA en terminal opere el tablero directamente desde ",
								),
								code("apps/cli"),
								text(" autenticándose con API Key."),
							),
							h3("Comandos del CLI"),
							table(
								["Comando", "Endpoint Backend", "Acción en el Board"],
								[
									[
										"boltflow task list",
										"GET /boards/:id",
										"Lista las tareas del Bolt activo",
									],
									[
										"boltflow task spec <id>",
										"GET /tasks/:id",
										"Descarga el Spec BlockNote en Markdown",
									],
									[
										"boltflow task start <id>",
										"POST /tasks/:id/branch",
										"Crea rama Git, hace checkout y mueve a Constructing",
									],
									[
										"boltflow task pr <id>",
										"PATCH /tasks/:id",
										"Abre PR en GitHub y mueve a PR Review",
									],
								],
							),
							h3("Criterios de Aceptación"),
							todo(
								false,
								text("Crear workspace "),
								code("packages/cli"),
								text(" con Bun."),
							),
							todo(
								false,
								text("Guardar token de sesión en "),
								code("~/.boltflow/config.json"),
								text("."),
							),
							todo(
								false,
								text("Ejecutar "),
								code("git switch -c <branch>"),
								text(" automáticamente al iniciar tarea."),
							),
						]),
						order: 0,
						priority: Priority.HIGH,
						unitId: unitCli.id,
						boltId: bolt3.id,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title: "Webhook HMAC para mover cards al hacer PR / Merge",
						description: serializeSeedBlocks([
							h2("Sincronización Automática GitHub -> Board"),
							p(
								text("Escuchar los eventos del repositorio "),
								bold("clix002/boltflow"),
								text(" en el endpoint "),
								code("POST /api/webhooks/github"),
								text(
									" para transicionar tareas entre columnas sin intervención manual.",
								),
							),
							h3("Matriz de Transición de Estados"),
							table(
								["Evento GitHub", "Columna Destino", "Estado PR"],
								[
									["create (ref_type: branch)", "3. Constructing", "DRAFT"],
									["pull_request.opened", "4. PR Review", "OPEN"],
									["pull_request.closed (merged=true)", "5. Merged", "MERGED"],
								],
							),
							h3("Seguridad & Checklist"),
							todo(
								false,
								text("Verificar firma HMAC-SHA256 con header "),
								code("X-Hub-Signature-256"),
								text("."),
							),
							todo(
								false,
								text("Buscar tarea por "),
								code("branchName"),
								text(" y actualizar "),
								code("prNumber"),
								text(" + "),
								code("prUrl"),
								text("."),
							),
						]),
						order: 1,
						priority: Priority.MEDIUM,
						unitId: unitGitHub.id,
						boltId: bolt3.id,
						assignees: { connect: [{ id: aiAgent.id }] },
					},
				],
			},
		},
	});

	await prisma.column.create({
		data: {
			name: "2. Ready for Bolt",
			order: 1,
			boardId: mainProjectBoard.id,
			tasks: {
				create: [
					{
						title: "CRUD de Units of Work y Bolts desde el Sidebar",
						description: serializeSeedBlocks([
							h2("Gestión de Units y Bolts en la Interfaz"),
							p(
								text("Permitir crear, editar y cambiar el estado de los "),
								bold("Bolts"),
								text(" (PLANNED, ACTIVE, COMPLETED) y las "),
								bold("Units of Work"),
								text(" (nombre, descripción, color) directamente desde "),
								code("BoardDetailSidebar"),
								text("."),
							),
							h3("Endpoints Requeridos"),
							table(
								["Método", "Ruta", "Descripción"],
								[
									[
										"POST",
										"/boards/:id/units",
										"Crear nueva Unit con color y descripción",
									],
									[
										"PATCH / DELETE",
										"/boards/:id/units/:unitId",
										"Actualizar o eliminar Unit",
									],
									[
										"POST",
										"/boards/:id/bolts",
										"Crear nuevo Bolt para el tablero",
									],
									[
										"PATCH / DELETE",
										"/boards/:id/bolts/:boltId",
										"Cambiar estado (ACTIVE / COMPLETED) o eliminar Bolt",
									],
								],
							),
							h3("Checklist"),
							todo(
								true,
								text("Endpoints Hono OpenAPI + validación Zod en "),
								code("@scrum-board/shared"),
								text("."),
							),
							todo(
								true,
								text("Tests de integración en "),
								code("apps/api"),
								text("."),
							),
							todo(
								true,
								text("Diálogos de creación/edición en el Sidebar izquierdo."),
							),
						]),
						order: 0,
						priority: Priority.URGENT,
						unitId: unitUi.id,
						boltId: bolt3.id,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title: "Suite de Tests de Integración para GitHub, Units y Bolts",
						description: serializeSeedBlocks([
							h2("Cobertura de Tests en CI"),
							p(
								text("Asegurar que cada feature nueva tenga su suite en "),
								code("apps/api/src/modules/**/__tests__/"),
								text(" ejecutada automáticamente en GitHub Actions."),
							),
							todo(
								true,
								text("Tests unitarios de "),
								code("github.utils.ts"),
								text(" y manejo de errores con "),
								code("Effect"),
								text("."),
							),
							todo(
								true,
								text("Tests de integración de filtros "),
								code("unitId"),
								text(", "),
								code("boltId"),
								text(" y "),
								code("branchName"),
								text(" en "),
								code("GET /boards/:id"),
								text("."),
							),
						]),
						order: 1,
						priority: Priority.HIGH,
						unitId: unitCore.id,
						boltId: bolt3.id,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
				],
			},
		},
	});

	await prisma.column.create({
		data: {
			name: "3. Constructing",
			order: 2,
			boardId: mainProjectBoard.id,
		},
	});

	await prisma.column.create({
		data: {
			name: "4. PR Review",
			order: 3,
			boardId: mainProjectBoard.id,
			tasks: {
				create: [
					{
						title:
							"Pipeline GitHub Actions CI (Lint, Typecheck & Postgres Tests)",
						description: serializeSeedBlocks([
							h2("Integración Continua en GitHub Actions"),
							p(
								text("Workflow "),
								code(".github/workflows/main.yml"),
								text(
									" con contenedor de servicio PostgreSQL 16, generación de Prisma Client, Biome Lint, TypeScript Check y Bun Test.",
								),
							),
							todo(
								true,
								text("Configurar servicio efímero "),
								code("postgres:16-alpine"),
								text("."),
							),
							todo(
								true,
								text("Generar cliente Prisma antes de "),
								code("bun run check-types"),
								text("."),
							),
							todo(
								true,
								text("Verificar ejecución exitosa en rama "),
								code("staging"),
								text("."),
							),
						]),
						order: 0,
						priority: Priority.HIGH,
						unitId: unitCore.id,
						boltId: bolt2.id,
						branchName: "staging",
						prStatus: PrStatus.OPEN,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
				],
			},
		},
	});

	await prisma.column.create({
		data: {
			name: "5. Merged",
			order: 4,
			boardId: mainProjectBoard.id,
			tasks: {
				create: [
					{
						title:
							"Construir BoardDetailSidebar con Bolts, Units y Ramas en vivo",
						description: serializeSeedBlocks([
							h2("Navegador Contextual en el Sidebar Izquierdo"),
							p(
								text(
									"Reemplazar el placeholder del sidebar por la navegación modular conectada por query params reactivos.",
								),
							),
							h3("Subcomponentes Modulares"),
							table(
								["Componente", "Responsabilidad", "Filtro URL"],
								[
									[
										"SidebarRepoBanner",
										"Estado de conexión con clix002/boltflow y rama base",
										"—",
									],
									[
										"SidebarBoltsGroup",
										"Ciclos rápidos (ACTIVE, PLANNED, COMPLETED)",
										"?boltId=...",
									],
									[
										"SidebarUnitsGroup",
										"Módulos con indicador de color",
										"?unitId=...",
									],
									[
										"SidebarBranchesGroup",
										"Ramas en tiempo real desde GitHub API",
										"?branchName=...",
									],
								],
							),
							h3("Criterios de Aceptación"),
							todo(
								true,
								text("Componentizar en carpeta "),
								code("board-detail-sidebar/"),
								text("."),
							),
							todo(
								true,
								text("Mostrar barra de filtros activos sobre el Kanban."),
							),
							todo(
								true,
								text("Envolver aplicación con "),
								code("TooltipProvider"),
								text("."),
							),
						]),
						order: 0,
						priority: Priority.URGENT,
						unitId: unitUi.id,
						boltId: bolt2.id,
						branchName: "feature/board-detail-01",
						prStatus: PrStatus.MERGED,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title:
							"Integrar Octokit + Effect para listar y crear ramas por Board",
						description: serializeSeedBlocks([
							h2("Servicio GitHub Tipado con Effect v4 & Octokit"),
							p(
								text("Consumir la REST API de GitHub mediante "),
								code("octokit"),
								text(" y controlar todos los errores de red/HTTP con "),
								code("Effect.fn"),
								text(" y "),
								code("Schema.TaggedError"),
								text("."),
							),
							h3("Errores de Dominio Tipados (github.errors.ts)"),
							table(
								["TaggedError", "Causa", "Respuesta Hono"],
								[
									[
										"InvalidBranchNameError",
										"Nombre de rama vacío o inválido",
										"400 Bad Request",
									],
									[
										"GitHubBranchNotFoundError",
										"404 en getBranch -> dispara createRef desde main",
										"Recuperación automática",
									],
									[
										"GitHubApiError",
										"Fallo de permisos, token o red con GitHub",
										"502 Bad Gateway",
									],
								],
							),
							h3("Verificación"),
							todo(
								true,
								text("Instalar "),
								code("octokit"),
								text(" y "),
								code("effect"),
								text(" en "),
								code("apps/api"),
								text("."),
							),
							todo(
								true,
								text("Eliminar bloques try/catch genéricos usando "),
								code("Effect.catchTag"),
								text("."),
							),
						]),
						order: 1,
						priority: Priority.HIGH,
						unitId: unitGitHub.id,
						boltId: bolt2.id,
						branchName: "feature/board-detail-01",
						prStatus: PrStatus.MERGED,
						assignees: { connect: [{ id: aiAgent.id }] },
					},
					{
						title: "Selector y creador de ramas GitHub dentro del Spec Drawer",
						description: serializeSeedBlocks([
							h2("Gestión de Ramas desde TaskDetailSheet"),
							p(
								text("Permitir vincular cualquier rama existente de "),
								code("clix002/boltflow"),
								text(
									" o crear una rama remota nueva en 1 clic desde la sección ",
								),
								bold("Properties"),
								text("."),
							),
							h3("Flujo de Creación"),
							bullet(
								text("Generar slug limpio con "),
								code("kebabCase(task.title)"),
								text(" de "),
								code("es-toolkit"),
								text("."),
							),
							bullet(
								text("Invocar "),
								code("POST /tasks/:id/branch"),
								text(" con "),
								code("createOnGitHub: true"),
								text("."),
							),
							h3("Checklist"),
							todo(true, text("Selector de ramas reales desde Octokit.")),
							todo(
								true,
								text("Botón 'Create branch on GitHub' con feedback de carga."),
							),
						]),
						order: 2,
						priority: Priority.HIGH,
						unitId: unitGitHub.id,
						boltId: bolt2.id,
						branchName: "feature/board-detail-01",
						prStatus: PrStatus.MERGED,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title: "Modelos Prisma: Unit, Bolt y campos GitHub en Board/Task",
						description: serializeSeedBlocks([
							h2("Esquema de Datos"),
							p(
								text("Evolucionar el modelo relacional en "),
								code("apps/api/src/db/prisma/schema/"),
								text(" y los esquemas Zod en "),
								code("@scrum-board/shared"),
								text("."),
							),
							h3("Entidades Incorporadas"),
							table(
								["Modelo", "Campos Clave", "Relación"],
								[
									["Board", "githubRepo, defaultBranch", "1:N con Unit y Bolt"],
									["Unit", "name, description, color", "1:N con Task"],
									[
										"Bolt",
										"name, goal, status (PLANNED | ACTIVE | COMPLETED)",
										"1:N con Task",
									],
									[
										"Task",
										"branchName, prNumber, prUrl, prStatus, unitId, boltId",
										"N:1 con Column, Unit, Bolt",
									],
								],
							),
							h3("Checklist"),
							todo(
								true,
								text("Migración Prisma "),
								code("20261029025846_add_aidlc_github"),
								text(" aplicada."),
							),
							todo(
								true,
								text("Validación Zod bidireccional en frontend y backend."),
							),
						]),
						order: 3,
						priority: Priority.URGENT,
						unitId: unitCore.id,
						boltId: bolt2.id,
						branchName: "feature/model-01",
						prStatus: PrStatus.MERGED,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title: "CRUD de Tasks + Sonidos Web Audio + Reglas AGENTS.md",
						description: serializeSeedBlocks([
							h2("Experiencia Táctil & Estándares de Ingeniería"),
							p(
								text(
									"Implementación completa de actualización y eliminación de tareas en Kanban, Tabla y Drawer, acompañada de síntesis de audio en tiempo real con ",
								),
								code("AudioContext"),
								text("."),
							),
							h3("Perfiles de Sonido (sound.utils.ts)"),
							table(
								["Acción", "Función", "Frecuencia / Carácter"],
								[
									[
										"Mover Card (DnD)",
										"playTaskMoveSound()",
										"180Hz -> 420Hz (Pop cálido ascendente)",
									],
									[
										"Crear Card",
										"playTaskCreateSound()",
										"523Hz (C5) -> 783Hz (G5) (Chime brillante)",
									],
									[
										"Eliminar Card",
										"playTaskDeleteSound()",
										"587Hz -> 493Hz / 440Hz -> 293Hz (Doble tono descendente)",
									],
								],
							),
							h3("Cumplimiento AGENTS.md"),
							todo(
								true,
								text(
									"Máximo 2 parámetros por función (objetos Input dedicados).",
								),
							),
							todo(
								true,
								text(
									"Cero strings mágicos ni casteos forzados (uso de cva + satisfies).",
								),
							),
						]),
						order: 4,
						priority: Priority.HIGH,
						unitId: unitUi.id,
						boltId: bolt1.id,
						branchName: "feature/board-detail-01",
						prStatus: PrStatus.MERGED,
						assignees: { connect: [{ id: demoUser.id }] },
					},
					{
						title: "Drawer estilo Notion con BlockNote (@blocknote/shadcn)",
						description: serializeSeedBlocks([
							h2("Spec Editor Rico en Bloques"),
							p(
								text(
									"Panel lateral expandible (50% a 100% del área de trabajo respetando el Sidebar) con soporte nativo para Slash Commands (",
								),
								code("/"),
								text("), tablas, checklists y código."),
							),
							todo(true, text("Autoguardado con debounce de 650ms.")),
							todo(
								true,
								text(
									"Integración de tema oscuro/claro con variables CSS de shadcn.",
								),
							),
						]),
						order: 5,
						priority: Priority.HIGH,
						unitId: unitUi.id,
						boltId: bolt1.id,
						branchName: "feature/board-detail-01",
						prStatus: PrStatus.MERGED,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title: "Drag & Drop canónico con @dnd-kit/react en Kanban y Tabla",
						description: serializeSeedBlocks([
							h2("Drag & Drop Unificado"),
							p(
								text("Extracción de "),
								code("createBoardDndHandlers"),
								text(" en "),
								code("dnd.utils.ts"),
								text(" utilizando "),
								code("move()"),
								text(" de "),
								code("@dnd-kit/helpers"),
								text("."),
							),
							todo(
								true,
								text("Soporte multi-columna en Kanban y vista Tabla."),
							),
							todo(
								true,
								text("Rollback optimista automático en caso de error de red."),
							),
						]),
						order: 6,
						priority: Priority.HIGH,
						unitId: unitUi.id,
						boltId: bolt1.id,
						branchName: "feature/board-01",
						prStatus: PrStatus.MERGED,
						assignees: {
							connect: [{ id: demoUser.id }, { id: aiAgent.id }],
						},
					},
					{
						title: "Setup Monorepo Turborepo + Hono OpenAPI + Auth JWT",
						description: serializeSeedBlocks([
							h2("Fundación del Monorepo"),
							p(
								text("Estructura base con "),
								code("@scrum-board/shared"),
								text(", "),
								code("apps/api"),
								text(" y "),
								code("apps/web"),
								text("."),
							),
							todo(
								true,
								text("Autenticación JWT con cookies HttpOnly y refresh token."),
							),
							todo(true, text("Documentación interactiva Scalar OpenAPI.")),
						]),
						order: 7,
						priority: Priority.MEDIUM,
						unitId: unitCore.id,
						boltId: bolt1.id,
						branchName: "feature/auth-04",
						prStatus: PrStatus.MERGED,
						assignees: { connect: [{ id: john.id }] },
					},
				],
			},
		},
	});

	console.log(`Created main board: "${mainProjectBoard.name}"`);
	console.log("Database seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error("Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
