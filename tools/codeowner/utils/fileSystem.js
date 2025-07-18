const fs = require("fs");
const path = require("path");
const { PROJECT_ROOT, CODEOWNERS_PATH } = require("../config/constants");

/**
 * Checks if the CODEOWNERS file exists
 */
function checkCodeownersExists() {
  return fs.existsSync(CODEOWNERS_PATH);
}

/**
 * Checks if a directory exists
 */
function checkDirectoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Checks if a path is a file
 */
function isFile(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a path is a directory
 */
function isDirectory(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Resolves an absolute path relative to the project root
 */
function getAbsolutePath(relativePath) {
  return path.resolve(PROJECT_ROOT, relativePath);
}

/**
 * Gets a relative path from the project root
 */
function getRelativePath(absolutePath) {
  return path.relative(PROJECT_ROOT, absolutePath);
}

/**
 * Normalizes a path (removes redundant slashes, replaces backslashes with forward slashes)
 */
function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
}

/**
 * Reads the contents of a directory with filtering
 */
function readDirectoryContents(dirPath, ignoredItems = []) {
  try {
    return fs.readdirSync(dirPath).filter(item => !ignoredItems.includes(item));
  } catch (error) {
    throw new Error(`Failed to read directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Gets info about a file or directory
 */
function getItemInfo(itemPath) {
  try {
    const stats = fs.statSync(itemPath);
    return {
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      mtime: stats.mtime,
      exists: true
    };
  } catch (error) {
    return {
      isFile: false,
      isDirectory: false,
      size: 0,
      mtime: null,
      exists: false,
      error: error.message
    };
  }
}

/**
 * Creates a directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Safely writes a file (creates the directory if needed)
 */
function safeWriteFile(filePath, content, encoding = 'utf8') {
  const dir = path.dirname(filePath);
  ensureDirectoryExists(dir);
  fs.writeFileSync(filePath, content, encoding);
}

module.exports = {
  checkCodeownersExists,
  checkDirectoryExists,
  isFile,
  isDirectory,
  getAbsolutePath,
  getRelativePath,
  normalizePath,
  readDirectoryContents,
  getItemInfo,
  ensureDirectoryExists,
  safeWriteFile
};
