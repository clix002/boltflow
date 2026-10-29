import type { CatalogOption, CatalogSlug } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetCatalogQuery = (slug: CatalogSlug) => {
	return useQuery({
		queryKey: ["catalog", slug],
		queryFn: () => api.get<CatalogOption[]>(`/catalogs/${slug}`),
	});
};
