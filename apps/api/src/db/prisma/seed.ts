import { prisma } from "@/db/connections";
import { BoltStatus, Priority, PrStatus } from "@/db/prisma/generated/client";
import avatarsCatalog from "@/modules/catalog/avatars.json";
import {
	bold,
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

	const existingDemo = await prisma.user.findUnique({
		where: { email: "demo@example.com" },
		select: { id: true, githubToken: true },
	});

	await prisma.comment.deleteMany();
	await prisma.task.deleteMany();
	await prisma.column.deleteMany();
	await prisma.bolt.deleteMany();
	await prisma.unit.deleteMany();
	await prisma.board.deleteMany();
	await prisma.user.deleteMany();

	console.log("Existing database cleared.");

	const defaultPassword = await Bun.password.hash("password123");

	const demoUser = await prisma.user.create({
		data: {
			...(existingDemo?.id ? { id: existingDemo.id } : {}),
			email: "demo@example.com",
			name: "Clix",
			password: defaultPassword,
			avatarUrl: avatarsCatalog[0]?.value,
			githubToken:
				existingDemo?.githubToken ?? process.env.GITHUB_TOKEN ?? null,
		},
	});

	const aiAgent = await prisma.user.create({
		data: {
			email: "agent@example.com",
			name: "Code Agent",
			password: defaultPassword,
			avatarUrl: avatarsCatalog[1]?.value,
		},
	});

	const john = await prisma.user.create({
		data: {
			email: "john@example.com",
			name: "John Doe",
			password: defaultPassword,
			avatarUrl: avatarsCatalog[2]?.value,
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
			defaultBranch: "staging",
			ownerId: demoUser.id,
		},
	});

	// 2. Crear las Units of Work (cada Unit es dueña de sus propias columnas, bolts y tareas)
	const [unitCore, unitGitHub, unitUi, unitCli] = await Promise.all([
		prisma.unit.create({
			data: {
				name: "Core & Schema",
				description:
					"Modelos Prisma (Unit, Bolt), CI y esquemas Zod compartidos",
				color: "#8b5cf6",
				branchName: "feature/unit-subboard-01",
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.unit.create({
			data: {
				name: "GitHub Sync",
				description: "Integración Octokit REST API, ramas y Pull Requests",
				color: "#10b981",
				branchName: "feature/board-detail-03",
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.unit.create({
			data: {
				name: "UI Sidebar & Drawer",
				description:
					"BoardDetailSidebar, Kanban, Table y BlockNote Spec Drawer",
				color: "#3b82f6",
				branchName: "feature/board-detail-02",
				boardId: mainProjectBoard.id,
			},
		}),
		prisma.unit.create({
			data: {
				name: "CLI Agent",
				description:
					"Herramienta CLI para que agentes IA operen desde terminal",
				color: "#f59e0b",
				branchName: "clinton/board-02",
				boardId: mainProjectBoard.id,
			},
		}),
	]);

	// 3. Crear los Bolts por cada Unit
	const [coreBolt1, coreBolt2, ghBolt1, ghBolt2, uiBolt1, uiBolt2, cliBolt1] =
		await Promise.all([
			prisma.bolt.create({
				data: {
					name: "Bolt #1: Monorepo & Schema",
					goal: "Fundación Prisma, Zod compartido y migraciones relacionales",
					status: BoltStatus.COMPLETED,
					unitId: unitCore.id,
				},
			}),
			prisma.bolt.create({
				data: {
					name: "Bolt #2: Unit Sub-Boards & CI",
					goal: "Jerarquía Board -> Unit -> Column -> Task y GitHub Actions CI",
					status: BoltStatus.ACTIVE,
					unitId: unitCore.id,
				},
			}),
			prisma.bolt.create({
				data: {
					name: "Bolt #1: Octokit & Effect",
					goal: "Conectar Octokit con clix002/boltflow y crear ramas desde UI",
					status: BoltStatus.COMPLETED,
					unitId: unitGitHub.id,
				},
			}),
			prisma.bolt.create({
				data: {
					name: "Bolt #2: GitHub Webhooks",
					goal: "Sincronización automática de PRs y merges mediante HMAC",
					status: BoltStatus.ACTIVE,
					unitId: unitGitHub.id,
				},
			}),
			prisma.bolt.create({
				data: {
					name: "Bolt #1: Kanban, DnD & Spec Drawer",
					goal: "Drag & Drop canónico, BlockNote Drawer y sonidos Web Audio",
					status: BoltStatus.COMPLETED,
					unitId: unitUi.id,
				},
			}),
			prisma.bolt.create({
				data: {
					name: "Bolt #2: Sidebar Units, Bolts & Marketing",
					goal: "CRUD de Units/Bolts en Sidebar y estructura de Marketing Page",
					status: BoltStatus.ACTIVE,
					unitId: unitUi.id,
				},
			}),
			prisma.bolt.create({
				data: {
					name: "Bolt #1: Terminal Agent CLI",
					goal: "Comandos boltflow task list/spec/start/pr para agentes IA",
					status: BoltStatus.PLANNED,
					unitId: unitCli.id,
				},
			}),
		]);

	// 4. Columnas y Tareas de Unit 1: Core & Schema
	await Promise.all([
		prisma.column.create({
			data: {
				name: "1. Elaboration (Spec)",
				order: 0,
				unitId: unitCore.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "2. Ready for Bolt",
				order: 1,
				unitId: unitCore.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "3. Constructing",
				order: 2,
				unitId: unitCore.id,
				tasks: {
					create: [
						{
							title:
								"Rediseñar jerarquía Board -> Unit -> Column -> Task en Prisma",
							description: serializeSeedBlocks([
								h2("Arquitectura de Sub-Tableros por Unit"),
								p(
									text("Cada "),
									bold("Unit of Work"),
									text(" es dueña directa de sus propias "),
									code("Column[]"),
									text(" y "),
									code("Bolt[]"),
									text(", eliminando campos opcionales e improvisaciones."),
								),
								todo(
									true,
									text("Migrar relación de "),
									code("Column.unitId"),
									text(" y "),
									code("Bolt.unitId"),
									text("."),
								),
								todo(
									true,
									text(
										"Inicializar las 5 Gates automáticamente al crear cada Unit.",
									),
								),
							]),
							order: 0,
							priority: Priority.URGENT,
							boltId: coreBolt2.id,
							branchName: "feature/unit-subboard-01",
							prStatus: PrStatus.DRAFT,
							assignees: {
								connect: [{ id: demoUser.id }, { id: aiAgent.id }],
							},
						},
					],
				},
			},
		}),
		prisma.column.create({
			data: {
				name: "4. PR Review",
				order: 3,
				unitId: unitCore.id,
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
							]),
							order: 0,
							priority: Priority.HIGH,
							boltId: coreBolt2.id,
							branchName: "feature/model-01",
							prStatus: PrStatus.OPEN,
							assignees: {
								connect: [{ id: demoUser.id }, { id: aiAgent.id }],
							},
						},
					],
				},
			},
		}),
		prisma.column.create({
			data: {
				name: "5. Merged",
				order: 4,
				unitId: unitCore.id,
				tasks: {
					create: [
						{
							title:
								"Módulo genérico de Catálogos (GET /catalogs/:slug) y Avatares SVG",
							description: serializeSeedBlocks([
								h2("Lookup / Catalog Pattern"),
								p(
									text(
										"Centralizar listas de opciones y los 8 avatares SVG en ",
									),
									code("apps/api/src/modules/catalog/"),
									text(" sin depender de llamadas externas a DiceBear."),
								),
								todo(true, text("Endpoint tipado con Zod y tests unitarios.")),
							]),
							order: 0,
							priority: Priority.HIGH,
							boltId: coreBolt2.id,
							branchName: "feature/unit-subboard-01",
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
							]),
							order: 1,
							priority: Priority.MEDIUM,
							boltId: coreBolt1.id,
							branchName: "feature/auth-04",
							prStatus: PrStatus.MERGED,
							assignees: { connect: [{ id: john.id }] },
						},
					],
				},
			},
		}),
	]);

	// 5. Columnas y Tareas de Unit 2: GitHub Sync
	await Promise.all([
		prisma.column.create({
			data: {
				name: "1. Elaboration (Spec)",
				order: 0,
				unitId: unitGitHub.id,
				tasks: {
					create: [
						{
							title: "Webhook HMAC para mover cards al hacer PR / Merge",
							description: serializeSeedBlocks([
								h2("Sincronización Automática GitHub -> Unit Board"),
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
										[
											"pull_request.closed (merged=true)",
											"5. Merged",
											"MERGED",
										],
									],
								),
							]),
							order: 0,
							priority: Priority.HIGH,
							boltId: ghBolt2.id,
							assignees: { connect: [{ id: aiAgent.id }] },
						},
					],
				},
			},
		}),
		prisma.column.create({
			data: {
				name: "2. Ready for Bolt",
				order: 1,
				unitId: unitGitHub.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "3. Constructing",
				order: 2,
				unitId: unitGitHub.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "4. PR Review",
				order: 3,
				unitId: unitGitHub.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "5. Merged",
				order: 4,
				unitId: unitGitHub.id,
				tasks: {
					create: [
						{
							title:
								"Integrar Octokit + Effect para listar y crear ramas por Board",
							description: serializeSeedBlocks([
								h2("Servicio GitHub Tipado con Effect v4 & Octokit"),
								p(
									text("Consumir la REST API de GitHub mediante "),
									code("octokit"),
									text(" y controlar errores con "),
									code("Effect.fn"),
									text(" y "),
									code("Schema.TaggedError"),
									text("."),
								),
							]),
							order: 0,
							priority: Priority.HIGH,
							boltId: ghBolt1.id,
							branchName: "feature/board-detail-01",
							prStatus: PrStatus.MERGED,
							assignees: { connect: [{ id: aiAgent.id }] },
						},
						{
							title:
								"Selector y creador de ramas GitHub en Units y Spec Drawer",
							description: serializeSeedBlocks([
								h2("Gestión de Ramas desde UI"),
								p(
									text("Vincular o crear ramas remotas en "),
									code("clix002/boltflow"),
									text(" tanto a nivel de Unit como de Task."),
								),
							]),
							order: 1,
							priority: Priority.HIGH,
							boltId: ghBolt1.id,
							branchName: "feature/board-detail-01",
							prStatus: PrStatus.MERGED,
							assignees: {
								connect: [{ id: demoUser.id }, { id: aiAgent.id }],
							},
						},
					],
				},
			},
		}),
	]);

	// 6. Columnas y Tareas de Unit 3: UI Sidebar & Drawer
	await Promise.all([
		prisma.column.create({
			data: {
				name: "1. Elaboration (Spec)",
				order: 0,
				unitId: unitUi.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "2. Ready for Bolt",
				order: 1,
				unitId: unitUi.id,
				tasks: {
					create: [
						{
							title: "Secciones interactivas de la Marketing Landing Page (/)",
							description: serializeSeedBlocks([
								h2("Marketing Page en /"),
								p(
									text(
										"Construir las secciones de producto en la ruta pública ",
									),
									code("/"),
									text(" mostrando el flujo AI-DLC de BoltFlow."),
								),
							]),
							order: 0,
							priority: Priority.MEDIUM,
							boltId: uiBolt2.id,
							assignees: { connect: [{ id: demoUser.id }] },
						},
					],
				},
			},
		}),
		prisma.column.create({
			data: {
				name: "3. Constructing",
				order: 2,
				unitId: unitUi.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "4. PR Review",
				order: 3,
				unitId: unitUi.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "5. Merged",
				order: 4,
				unitId: unitUi.id,
				tasks: {
					create: [
						{
							title: "CRUD de Units of Work y Bolts desde el Sidebar",
							description: serializeSeedBlocks([
								h2("Gestión de Units y Bolts en la Interfaz"),
								p(
									text("Crear, editar y eliminar "),
									bold("Units"),
									text(" y "),
									bold("Bolts"),
									text(" directamente desde "),
									code("BoardDetailSidebar"),
									text(" usando primitivas estandarizadas."),
								),
							]),
							order: 0,
							priority: Priority.URGENT,
							boltId: uiBolt2.id,
							branchName: "feature/board-detail-02",
							prStatus: PrStatus.MERGED,
							assignees: {
								connect: [{ id: demoUser.id }, { id: aiAgent.id }],
							},
						},
						{
							title: "Drawer estilo Notion con BlockNote (@blocknote/shadcn)",
							description: serializeSeedBlocks([
								h2("Spec Editor Rico en Bloques"),
								p(
									text(
										"Panel lateral expandible (50% a 100%) con soporte para Slash Commands, tablas, checklists y código.",
									),
								),
							]),
							order: 1,
							priority: Priority.HIGH,
							boltId: uiBolt1.id,
							branchName: "feature/board-detail-02",
							prStatus: PrStatus.MERGED,
							assignees: {
								connect: [{ id: demoUser.id }, { id: aiAgent.id }],
							},
						},
						{
							title:
								"Drag & Drop canónico con @dnd-kit/react + Sonidos Web Audio",
							description: serializeSeedBlocks([
								h2("Drag & Drop Unificado"),
								p(
									text("Soporte multi-columna en Kanban y Tabla con "),
									code("AudioContext"),
									text(" para feedback táctil."),
								),
							]),
							order: 2,
							priority: Priority.HIGH,
							boltId: uiBolt1.id,
							branchName: "feature/board-01",
							prStatus: PrStatus.MERGED,
							assignees: { connect: [{ id: demoUser.id }] },
						},
					],
				},
			},
		}),
	]);

	// 7. Columnas y Tareas de Unit 4: CLI Agent
	await Promise.all([
		prisma.column.create({
			data: {
				name: "1. Elaboration (Spec)",
				order: 0,
				unitId: unitCli.id,
				tasks: {
					create: [
						{
							title: "Crear paquete CLI para Agentes en Terminal",
							description: serializeSeedBlocks([
								h2("Intent & Spec"),
								p(
									text(
										"Permitir que un agente de IA en terminal opere el tablero de una Unit directamente desde ",
									),
									code("packages/cli"),
									text("."),
								),
								h3("Comandos del CLI"),
								table(
									["Comando", "Endpoint Backend", "Acción en la Unit"],
									[
										[
											"boltflow task list",
											"GET /boards/:id",
											"Lista las tareas de la Unit y Bolt activo",
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
							]),
							order: 0,
							priority: Priority.HIGH,
							boltId: cliBolt1.id,
							assignees: {
								connect: [{ id: demoUser.id }, { id: aiAgent.id }],
							},
						},
					],
				},
			},
		}),
		prisma.column.create({
			data: {
				name: "2. Ready for Bolt",
				order: 1,
				unitId: unitCli.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "3. Constructing",
				order: 2,
				unitId: unitCli.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "4. PR Review",
				order: 3,
				unitId: unitCli.id,
			},
		}),
		prisma.column.create({
			data: {
				name: "5. Merged",
				order: 4,
				unitId: unitCli.id,
			},
		}),
	]);

	console.log(`Created main board: "${mainProjectBoard.name}" with 4 Units`);
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
