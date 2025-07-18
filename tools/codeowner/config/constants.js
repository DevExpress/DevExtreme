const path = require("path");

// Paths
const PROJECT_ROOT = path.resolve(__dirname, "../../../");
const CODEOWNERS_PATH = path.resolve(PROJECT_ROOT, ".github/CODEOWNERS");

// Ignored directories
const IGNORED_DIRS = [".git", "node_modules", ".idea", ".vscode", "dist", "out", "coverage"];

// Color codes for ownership status
const STATUS_COLORS = {
  OWNED: '\x1b[32m',      // green
  PARTIAL: '\x1b[33m',    // yellow
  UNOWNED: '\x1b[31m',    // red
  SELECTED: '\x1b[36m',   // cyan for selected items
  RESET: '\x1b[0m'        // reset color
};

// Alphabet for team legend creation
const LEGEND_ALPHABET = 'ADEGNTWXYZ';

// Git settings
const GIT_CONFIG = {
  DEFAULT_COMMIT_LIMIT: 20,
  LOG_FORMAT: "%h|%an|%ad|%s",
  DATE_FORMAT: "short"
};

module.exports = {
  PROJECT_ROOT,
  CODEOWNERS_PATH,
  IGNORED_DIRS,
  STATUS_COLORS,
  LEGEND_ALPHABET,
  GIT_CONFIG
};