import { Router } from "itty-router";
import { withContent, withParams } from "itty-router-extras";
import { createCors } from "itty-cors";
import * as controller from "./controller";

const { preflight, corsify } = createCors({
  methods: ["GET", "POST", "DELETE"],
  origins: ["*"] 
});

// Create router
const router = Router();

// Define main routes
router
  .all("*", preflight)
  .get("/paste/:id", withParams, controller.getPaste)
  .delete("/paste/:id", withParams, controller.deletePaste)
  .post("/paste", withContent, controller.createNewPaste)
  .all("*", controller.missingHandler);

export { router, corsify };