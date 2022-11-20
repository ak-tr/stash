import { Router } from 'itty-router'
import { withContent } from "itty-router-extras";
import * as controller from "./controller";

// Create router
export const router = Router();

router.post("/paste", withContent, controller.createNewPaste);

router.all("*", controller.missingHandler)
