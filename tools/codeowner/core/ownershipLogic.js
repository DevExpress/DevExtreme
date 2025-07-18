const { LEGEND_ALPHABET } = require("../config/constants");
const { findOwnerForPath } = require("../utils/codeowners");

/**
 * Generates a legend mapping each team to a unique letter
 */
function generateTeamLegend(teams) {
  const legend = {};

  teams.forEach((team, index) => {
    let letter;
    if (index < LEGEND_ALPHABET.length) {
      letter = LEGEND_ALPHABET[index];
    } else {
      const firstLetter = LEGEND_ALPHABET[Math.floor(index / 26) - 1];
      const secondLetter = LEGEND_ALPHABET[index % 26];
      letter = firstLetter + secondLetter;
    }

    legend[team] = letter;
  });

  return legend;
}

/**
 * Determines the ownership status of a folder (owned, partially owned, unowned)
 */
function getFolderStatus(patterns, folderPath, teamLegend) {
  // Check if the folder has direct owners
  const directOwners = findOwnerForPath(patterns, folderPath);
  if (directOwners) {
    const teamLetters = directOwners
      .filter(owner => owner.startsWith('@'))
      .map(owner => teamLegend[owner])
      .filter(Boolean)
      .join('');
    return { status: 'OWNED', owners: directOwners, teamLetters };
  }

  // Collect all teams that own files within the folder
  const internalOwners = new Set();
  const normalizedFolder = folderPath.replace(/^\/+/, '').replace(/\/+$/, '');

  patterns.forEach(({ pattern, owners }) => {
    const normalizedPattern = pattern.replace(/^\/+/, '');

    // Check if the pattern targets something inside the folder
    if (
      normalizedPattern.startsWith(normalizedFolder + "/") &&
      normalizedPattern !== normalizedFolder + "/"
    ) {
      owners.forEach(owner => {
        if (owner.startsWith('@')) {
          internalOwners.add(owner);
        }
      });
    }
  });

  if (internalOwners.size > 0) {
    const teamLetters = Array.from(internalOwners)
      .map(owner => teamLegend[owner])
      .filter(Boolean)
      .join('');
    return { status: 'PARTIAL', owners: Array.from(internalOwners), teamLetters };
  }

  return { status: 'UNOWNED', owners: null, teamLetters: '' };
}

/**
 * Determines ownership information and status for a file
 */
function getFileOwnershipInfo(patterns, filePath, teamLegend) {
  const owners = findOwnerForPath(patterns, "/" + filePath);

  if (owners) {
    const teamLetters = owners
      .filter(owner => owner.startsWith('@'))
      .map(owner => teamLegend[owner])
      .filter(Boolean)
      .join('');
    
    const displayText = owners.length > 3 
      ? `${owners.length}👥` 
      : teamLetters || owners.slice(0, 2).join(',');
      
    return { 
      status: 'OWNED', 
      owners, 
      teamLetters: displayText,
      count: owners.length 
    };
  }

  return { status: 'UNOWNED', owners: null, teamLetters: '', count: 0 };
  }

function getFolderStatus(patterns, folderPath, teamLegend) {
  const directOwners = findOwnerForPath(patterns, folderPath);
  if (directOwners && directOwners.length > 0) {
    const teamLetters = directOwners
      .filter(owner => owner.startsWith('@'))
      .map(owner => teamLegend[owner])
      .filter(Boolean)
      .join('');
    
    const displayText = directOwners.length > 3 
      ? `${directOwners.length}👥` 
      : teamLetters || directOwners.slice(0, 2).join(',');
      
    return { 
      status: 'OWNED', 
      owners: directOwners, 
      teamLetters: displayText,
      count: directOwners.length 
    };
  }

  const internalOwners = new Set();
  const normalizedFolder = folderPath.replace(/^\/+/, '').replace(/\/+$/, '');

  patterns.forEach(({ pattern, owners }) => {
    const normalizedPattern = pattern.replace(/^\/+/, '');

    if (normalizedPattern.startsWith(normalizedFolder + "/") &&
      normalizedPattern !== normalizedFolder + "/") {
      owners.forEach(owner => {
        if (owner.startsWith('@')) {
          internalOwners.add(owner);
        }
      });
    }
  });

  if (internalOwners.size > 0) {
    const ownersArray = Array.from(internalOwners);
    const teamLetters = ownersArray
      .map(owner => teamLegend[owner])
      .filter(Boolean)
      .join('');
    
    const displayText = ownersArray.length > 3 
      ? `${ownersArray.length}👥` 
      : teamLetters || ownersArray.slice(0, 2).join(',');
      
    return { 
      status: 'PARTIAL', 
      owners: ownersArray, 
      teamLetters: displayText,
      count: ownersArray.length 
    };
  }

  return { status: 'UNOWNED', owners: null, teamLetters: '', count: 0 };
}

module.exports = {
  generateTeamLegend,
  getFolderStatus,
  getFileOwnershipInfo
};