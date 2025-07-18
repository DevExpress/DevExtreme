const fs = require("fs");
const { CODEOWNERS_PATH } = require("../config/constants");

/**
 * Parses the CODEOWNERS file and returns an array of patterns with their owners
 */
function parseCodeownersWithOwners(codeownersContent) {
  return codeownersContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [pattern, ...owners] = line.split(/\s+/);
      return { pattern, owners };
    });
}

/**
 * Extracts all teams from the patterns
 */
function extractAllTeams(patterns) {
  const teams = new Set();
  patterns.forEach(({ owners }) => {
    owners.forEach(owner => {
      if (owner.startsWith('@')) {
        teams.add(owner);
      }
    });
  });
  return Array.from(teams).sort();
}

/**
 * Checks whether a path matches a pattern
 */
function matchPattern(pattern, filePath) {
  // Normalize path - remove leading slashes
  const normalizedPath = filePath.replace(/^\/+/, '');
  const normalizedPattern = pattern.replace(/^\/+/, '');

  // Handle different types of patterns
  if (normalizedPattern === "" || normalizedPattern === "/") {
    return normalizedPath === "" || normalizedPath.indexOf("/") === -1;
  }

  if (normalizedPattern.endsWith("/**")) {
    const base = normalizedPattern.slice(0, -3);
    return normalizedPath.startsWith(base + "/") || normalizedPath === base;
  }

  if (normalizedPattern.endsWith("/*")) {
    const base = normalizedPattern.slice(0, -2);
    return normalizedPath.startsWith(base + "/") &&
      !normalizedPath.slice(base.length + 1).includes("/");
  }

  if (normalizedPattern.endsWith("/")) {
    return normalizedPath.startsWith(normalizedPattern) ||
      normalizedPath === normalizedPattern.slice(0, -1);
  }

  return normalizedPath === normalizedPattern;
}

function findOwnerForPath(patterns, filePath) {
  let owners = null;
  let matchedPattern = null;
  let matchedPatternLength = -1;

  for (const { pattern, owners: o } of patterns) {
    const isMatch = matchPattern(pattern, filePath);
    if (isMatch) {
      if (pattern.length > matchedPatternLength) {
        owners = o;
        matchedPattern = pattern;
        matchedPatternLength = pattern.length;
      }
    }
  }

  return owners || null;
}

/**
 * Updates CODEOWNERS file for multiple items with support for multiple owners
 */
function updateCodeownersWithMultipleOwners(items, newOwners, mode = 'replace') {
  try {
    // Read current CODEOWNERS file
    const codeownersContent = fs.readFileSync(CODEOWNERS_PATH, "utf-8");
    let lines = codeownersContent.split("\n");

    // Create patterns for all selected items
    const patterns = items.map(item => {
      let pattern;
      if (item.isFile) {
        // For files use path as is
        pattern = "/" + item.path.replace(/^\/+/, '').replace(/\\/g, '/');
      } else {
        // For folders add /** at the end
        pattern = "/" + item.path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\\/g, '/') + "/**";
      }
      return { pattern, item };
    });

    console.log(`🔧 ${mode === 'replace' ? 'Replacing' : mode === 'add' ? 'Adding' : 'Removing'} owners for ${patterns.length} items:`);

    // Process each pattern
    patterns.forEach(({ pattern, item }) => {
      const itemType = item.isFile ? "📄" : "📁";

      // Find existing line for this pattern
      const existingLineIndex = lines.findIndex((line) => {
      const l = line.trim();
        if (!l || l.startsWith("#")) return false;
      const [p] = l.split(/\s+/);
        return p === pattern;
      });

      let currentOwners = [];
      if (existingLineIndex >= 0) {
        // Get current owners
        const existingLine = lines[existingLineIndex].trim();
        const [, ...owners] = existingLine.split(/\s+/);
        currentOwners = owners;
      }

      let finalOwners = [];

      switch (mode) {
        case 'replace':
          finalOwners = [...newOwners];
          break;
          
        case 'add':
          // Add new owners to existing ones, avoiding duplicates
          finalOwners = [...new Set([...currentOwners, ...newOwners])];
          break;
          
        case 'remove':
          // Remove specified owners from existing ones
          finalOwners = currentOwners.filter(owner => !newOwners.includes(owner));
          break;
      }

      // Remove old line if it exists
      if (existingLineIndex >= 0) {
        lines.splice(existingLineIndex, 1);
      }

      // Add new line only if there are owners
      if (finalOwners.length > 0) {
        const newLine = `${pattern} ${finalOwners.join(' ')}`;
        lines.push(newLine);
        console.log(`✅ ${itemType} ${item.path} -> ${pattern} now owned by: ${finalOwners.join(', ')}`);
    } else {
        console.log(`✅ ${itemType} ${item.path} -> ${pattern} owners removed`);
      }
      });

    // Remove empty lines at the end and ensure proper file ending
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }

    // Write updated file with proper ending
    const newContent = lines.join("\n") + (lines.length > 0 ? "\n" : "");
    fs.writeFileSync(CODEOWNERS_PATH, newContent, "utf-8");
    
    console.log(`✅ CODEOWNERS file successfully updated`);
    
  } catch (error) {
    console.error(`❌ Error writing to CODEOWNERS file: ${error.message}`);
    throw error;
  }
}

/**
 * Gets all owners for a given path
 */
function getAllOwnersForPath(patterns, filePath) {
  const owners = findOwnerForPath(patterns, filePath);
  return owners || [];
}

/**
 * Checks if path has a specific owner
 */
function hasOwner(patterns, filePath, ownerToCheck) {
  const owners = findOwnerForPath(patterns, filePath);
  return owners ? owners.includes(ownerToCheck) : false;
}

/**
 * Gets ownership statistics by teams
 */
function getOwnershipStats(patterns) {
  const stats = {};
  
  patterns.forEach(({ pattern, owners }) => {
    owners.forEach(owner => {
      if (owner.startsWith('@')) {
        if (!stats[owner]) {
          stats[owner] = { patterns: 0, files: [] };
        }
        stats[owner].patterns++;
        stats[owner].files.push(pattern);
      }
    });
  });
  
  return stats;
}

/**
 * Backward compatibility with original function
 */
function updateCodeownersForMultipleItems(items, newOwner) {
  const owners = newOwner ? [newOwner] : [];
  updateCodeownersWithMultipleOwners(items, owners, 'replace');
}

/**
 * Reads and parses CODEOWNERS file
 */
function readCodeowners() {
  try {
    const content = fs.readFileSync(CODEOWNERS_PATH, "utf-8");
    return parseCodeownersWithOwners(content);
  } catch (error) {
    throw new Error(`Error reading CODEOWNERS file: ${error.message}`);
  }
}

module.exports = {
  parseCodeownersWithOwners,
  extractAllTeams,
  matchPattern,
  findOwnerForPath,
  updateCodeownersForMultipleItems,
  updateCodeownersWithMultipleOwners,
  getAllOwnersForPath,
  hasOwner,
  getOwnershipStats,
  readCodeowners
};
