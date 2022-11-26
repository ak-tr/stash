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
  .get("/stash/:id/raw", withParams, controller.getPasteAsRaw)
  .get("/stash/:id", withParams, controller.getPaste)
  .delete("/stash/:id", withParams, controller.deletePaste)
  .post("/stash", withContent, controller.createNewPaste)
  .all("*", controller.missingHandler);

export { router, corsify };