const fs = require("fs");
const path = require("path");
const { PROJECT_ROOT, IGNORED_DIRS } = require("../config/constants");
const { findOwnerForPath } = require("../utils/codeowners");
const { getFolderStatus, getFileOwnershipInfo } = require("./ownershipLogic");
const { isItemSelected } = require("./selection");
const { formatOwnershipStatus, addSelectionMarker } = require("../ui/display");

/**
 * Builds a tree of files and folders for the interactive prompt
 */
function buildTreeForPrompt(dir, base = "", patterns, teamLegend) {
  const abs = path.join(PROJECT_ROOT, base, dir);
  const files = fs.readdirSync(abs);
  const children = [];
  const fileChildren = [];

  // First, gather all items
  for (const file of files) {
    if (IGNORED_DIRS.includes(file)) continue;
    const filePath = path.join(abs, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      children.push(buildTreeForPrompt(file, path.join(base, dir), patterns, teamLegend));
    } else {
      // Add files
      const absFilePath = path.join(abs, file);
      const repoRelativePath = path.relative(PROJECT_ROOT, absFilePath).replace(/\\/g, "/");

      const ownershipInfo = getFileOwnershipInfo(patterns, repoRelativePath, teamLegend);
      const isSelected = isItemSelected(repoRelativePath);

      const ownerStr = formatOwnershipStatus(ownershipInfo, isSelected);
      const selectionMark = addSelectionMarker(isSelected);

      fileChildren.push({
        value: repoRelativePath,
        name: selectionMark + file + ownerStr,
        children: undefined,
        isFile: true
      });
    }
  }

  // Sort folders by name
  children.sort((a, b) => a.name.localeCompare(b.name));

  // Sort files by name
  fileChildren.sort((a, b) => a.name.localeCompare(b.name));

  // Merge: folders first, then files
  const allChildren = [...children, ...fileChildren];

  // Determine ownership status of the current folder
  const relPath = path.join(base, dir).replace(/\\/g, "/");
  const normalizedPath = "/" + relPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const folderStatus = getFolderStatus(patterns, normalizedPath, teamLegend);

  // Check if the folder is selected
  const isSelected = isItemSelected(relPath);
  const ownerStr = formatOwnershipStatus(folderStatus, isSelected);
  const selectionMark = addSelectionMarker(isSelected);

  return {
    value: relPath,
    name: selectionMark + dir + "/" + ownerStr,
    children: allChildren.length > 0 ? allChildren : undefined,
    isFile: false
  };
}

/**
 * Builds root-level tree nodes for a given directory
 */
function buildRootTreeNodes(rootPath, rootArg, patterns, teamLegend) {
  const rootDirs = fs.readdirSync(rootPath).filter((f) => {
    const abs = path.join(rootPath, f);
    return fs.statSync(abs).isDirectory() && !IGNORED_DIRS.includes(f);
  });

  const treeNodes = rootDirs.map((dir) =>
    buildTreeForPrompt(dir, rootArg ? rootArg : "", patterns, teamLegend)
  );

  // Sort root folders by name
  treeNodes.sort((a, b) => a.name.localeCompare(b.name));

  return treeNodes;
}

module.exports = {
  buildTreeForPrompt,
  buildRootTreeNodes
};
