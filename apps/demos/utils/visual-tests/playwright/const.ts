import { DEFAULT_THEME_NAME } from '../helpers/theme-utils';

// The CSP run (pnpm run csp-check) serves the demos with a Content-Security-Policy header. It has
// its own port: a local run reuses a server that is already up, and the one of the screenshot run
// sends no policy.
export const CSP = process.env.CSP === 'true';

export const SERVER_PORT = CSP ? 20081 : 20080;

export const BASE_URL = `http://127.0.0.1:${SERVER_PORT}`;

export const VIEWPORT = { width: 1000, height: 800 };

export const ACCESSIBILITY_VIEWPORT = { width: 1200, height: 713 };

export const THEME = process.env.THEME || DEFAULT_THEME_NAME;
