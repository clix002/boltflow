import type { CatalogOption, CatalogSlug } from "@scrum-board/shared/schemas";
import { CATALOG_REGISTRY } from "./catalog.constants";

export const catalogService = {
	getBySlug(slug: CatalogSlug): CatalogOption[] {
		return [...CATALOG_REGISTRY[slug]];
	},
};
