export interface Env {
  STASH_KV: KVNamespace;
}

import { router, corsify } from "./routes";
import { errorHandler } from "./controller";

export default {
  async fetch(
    request: Request,
    env: Env
    // ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env).catch(errorHandler).then(corsify);
  },
};
