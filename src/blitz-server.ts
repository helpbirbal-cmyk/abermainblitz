// src/blitz-server.ts
import { setupBlitzServer } from "@blitzjs/next";
export const { gSSP, gSP, api: rpcApi } = setupBlitzServer({
  plugins: [], // Add your plugins here
});
