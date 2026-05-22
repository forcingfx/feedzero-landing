#!/usr/bin/env node
/**
 * Compatibility shim. The site build now lives in build.mjs:
 *
 *   node build.mjs
 *
 * Running `node build-releases.mjs` keeps working — it delegates to the
 * unified build so old muscle memory still rebuilds everything (releases.xml
 * plus every page). The release-note renderers moved to lib/releases.mjs.
 */

import { buildAll } from "./build.mjs";

await buildAll();
