export const SEED_INLINE_TYPE = {
	TEXT: "text",
} as const;

export const SEED_BLOCK_TYPE = {
	HEADING: "heading",
	PARAGRAPH: "paragraph",
	BULLET_LIST_ITEM: "bulletListItem",
	CHECK_LIST_ITEM: "checkListItem",
	TABLE: "table",
} as const;

export const SEED_TABLE_CONTENT_TYPE = "tableContent" as const;

export type SeedInlineContent =
	| string
	| {
			type: typeof SEED_INLINE_TYPE.TEXT;
			text: string;
			styles?: {
				bold?: boolean;
				italic?: boolean;
				code?: boolean;
			};
	  };

export type SeedTableRow = {
	cells: string[];
};

export type SeedBlock =
	| {
			type: typeof SEED_BLOCK_TYPE.HEADING;
			props: { level: 1 | 2 | 3 };
			content: SeedInlineContent[];
	  }
	| {
			type: typeof SEED_BLOCK_TYPE.PARAGRAPH;
			content: SeedInlineContent[];
	  }
	| {
			type: typeof SEED_BLOCK_TYPE.BULLET_LIST_ITEM;
			content: SeedInlineContent[];
	  }
	| {
			type: typeof SEED_BLOCK_TYPE.CHECK_LIST_ITEM;
			props: { checked: boolean };
			content: SeedInlineContent[];
	  }
	| {
			type: typeof SEED_BLOCK_TYPE.TABLE;
			content: {
				type: typeof SEED_TABLE_CONTENT_TYPE;
				headerRows?: number;
				rows: SeedTableRow[];
			};
	  };

export const text = (value: string): SeedInlineContent => ({
	type: SEED_INLINE_TYPE.TEXT,
	text: value,
});

export const bold = (value: string): SeedInlineContent => ({
	type: SEED_INLINE_TYPE.TEXT,
	text: value,
	styles: { bold: true },
});

export const code = (value: string): SeedInlineContent => ({
	type: SEED_INLINE_TYPE.TEXT,
	text: value,
	styles: { code: true },
});

export const h2 = (title: string): SeedBlock => ({
	type: SEED_BLOCK_TYPE.HEADING,
	props: { level: 2 },
	content: [text(title)],
});

export const h3 = (title: string): SeedBlock => ({
	type: SEED_BLOCK_TYPE.HEADING,
	props: { level: 3 },
	content: [text(title)],
});

export const p = (...content: SeedInlineContent[]): SeedBlock => ({
	type: SEED_BLOCK_TYPE.PARAGRAPH,
	content,
});

export const bullet = (...content: SeedInlineContent[]): SeedBlock => ({
	type: SEED_BLOCK_TYPE.BULLET_LIST_ITEM,
	content,
});

export const todo = (
	checked: boolean,
	...content: SeedInlineContent[]
): SeedBlock => ({
	type: SEED_BLOCK_TYPE.CHECK_LIST_ITEM,
	props: { checked },
	content,
});

export const table = (headers: string[], rows: string[][]): SeedBlock => ({
	type: SEED_BLOCK_TYPE.TABLE,
	content: {
		type: SEED_TABLE_CONTENT_TYPE,
		headerRows: 1,
		rows: [
			{ cells: headers },
			...rows.map((cells) => ({
				cells,
			})),
		],
	},
});

export const serializeSeedBlocks = (blocks: SeedBlock[]): string =>
	JSON.stringify(blocks);
