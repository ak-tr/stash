import { Router } from 'itty-router'
import { withContent, withParams } from "itty-router-extras";
import * as controller from "./controller";

// Create router
export const router = Router();

// Define main routes
router
  .get("/paste/:id", withParams, controller.getPaste)
  .post("/paste", withContent, controller.createNewPaste);

// Define handler for missing/unknown routes
router.all("*", controller.missingHandler)
