import { createRouter } from "@/lib/openapi";
import { rateLimit } from "@/middlewares/rate-limit";
import {
	loginHandler,
	logoutHandler,
	meHandler,
	refreshHandler,
	registerHandler,
} from "./auth.handlers";
import {
	loginRoute,
	logoutRoute,
	meRoute,
	refreshRoute,
	registerRoute,
} from "./auth.routes";

const authRouter = createRouter();

authRouter.use("/login", rateLimit);
authRouter.use("/register", rateLimit);

authRouter.openapi(registerRoute, registerHandler);
authRouter.openapi(loginRoute, loginHandler);
authRouter.openapi(refreshRoute, refreshHandler);
authRouter.openapi(logoutRoute, logoutHandler);
authRouter.openapi(meRoute, meHandler);

export default authRouter;
