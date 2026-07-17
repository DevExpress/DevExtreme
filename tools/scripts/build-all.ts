/**
 * @deprecated Use `pnpm nx all:build workflows` (or `-c internal`).
 * Kept as a thin env-aware wrapper for any remaining direct callers.
 */
import sh from 'shelljs';

sh.set('-e');

const configuration = sh.env.BUILD_INTERNAL_PACKAGE === 'true' ? ' -c internal' : '';
sh.exec(`pnpm exec nx all:build workflows${configuration}`);
