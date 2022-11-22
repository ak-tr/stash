import { Router } from "itty-router";
import { withContent, withParams } from "itty-router-extras";
import { createCors } from "itty-cors";
import * as controller from "./controller";

const { preflight, corsify } = createCors({ origins: ["*"] });

// Create router
export const router = Router();
export default corsify;

// Define main routes
router
  .all("*", preflight)
  .get("/paste/:id", withParams, controller.getPaste)
  .post("/paste", withContent, controller.createNewPaste)
  .all("*", controller.missingHandler);
