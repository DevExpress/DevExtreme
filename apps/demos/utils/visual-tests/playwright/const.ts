import { DEFAULT_THEME_NAME } from '../helpers/theme-utils';

export const SERVER_PORT = 20080;

export const BASE_URL = `http://127.0.0.1:${SERVER_PORT}`;

export const VIEWPORT = { width: 1000, height: 800 };

export const THEME = process.env.THEME || DEFAULT_THEME_NAME;
