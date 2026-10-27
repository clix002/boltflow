import { compact, isString } from "es-toolkit";
import { z } from "zod";

export const CommaSeparatedArray = z.preprocess(
	(val) => (isString(val) ? compact(val.split(",").map((s) => s.trim())) : val),
	z.array(z.string()).optional(),
);
