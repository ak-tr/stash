export interface Env {
  STASH_KV: KVNamespace;
}

import { router } from "./routes";
import { errorHandler } from "./controller";
import corsify from "./routes";

export default {
  async fetch(
    request: Request,
    env: Env
    // ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env).catch(errorHandler).then(corsify);
  },
};
