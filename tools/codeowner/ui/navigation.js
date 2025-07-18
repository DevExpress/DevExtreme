const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
inquirer.registerPrompt("tree", require("inquirer-tree-prompt"));

const { PROJECT_ROOT } = require("../config/constants");
const { toggleItemSelection } = require("../core/selection");

/**
 * Safe handling of space key press for item selection
 */
function handleSpaceKeyPress(folder) {
  // Check that folder is defined and is a string
  if (!folder || typeof folder !== 'string' || folder.trim() === '') {
    console.log(`\n💡 Select an item from the list to add to selection`);
    return false;
  }

  // Check that it's not a service command
  const serviceCommands = ["EXIT", "CLEAR_SELECTION", "APPLY_OWNER"];
  if (serviceCommands.includes(folder)) {
    console.log(`\n💡 To execute "${folder}" command press Enter`);
    return false;
  }

  try {
    // Check file/folder existence
    const fullPath = path.join(PROJECT_ROOT, folder);
    if (!fs.existsSync(fullPath)) {
      console.log(`\n⚠️  Path not found: ${folder}`);
      return false;
    }

    // Determine item type
    const stats = fs.statSync(fullPath);
    const isFile = stats.isFile();
    
    // Toggle selection
    toggleItemSelection(folder, isFile);
    return true; // Prevent menu closing
    
  } catch (error) {
    console.log(`\n⚠️  Error processing selection "${folder}": ${error.message}`);
    return false;
  }
}

/**
 * Tree navigation handling
 */
async function handleTreeNavigation(treeNodes) {
  // Create custom prompt for key handling
  const choices = [
    ...treeNodes,
    { name: "🔄 Clear selection", value: "CLEAR_SELECTION" },
    { name: "✅ Apply owner to selected items", value: "APPLY_OWNER" },
    { name: "🚪 Exit program", value: "EXIT" }
  ];

  try {
    const { folder } = await inquirer.prompt([
      {
        pageSize: 20,
        type: "tree",
        name: "folder",
        message: "Select folder/file (Space - select, Enter - apply owner):",
        tree: choices,
        multiple: true,
        keypress: (key, folder) => {
          if (key && key.name === 'space') {
            return handleSpaceKeyPress(folder);
          }
          return false;
        }
      },
    ]);

    return folder;
  } catch (error) {
    console.log(`\n⚠️  Navigation error: ${error.message}`);
    // Return safe value
    return "EXIT";
  }
}

/**
 * Handle special navigation commands
 */
function handleNavigationCommand(command) {
  switch (command) {
    case "EXIT":
      return { action: "exit" };
    case "CLEAR_SELECTION":
      return { action: "clearSelection" };
    case "APPLY_OWNER":
      return { action: "applyOwner" };
    default:
      return { action: "select", value: command };
  }
}

/**
 * Filter selected items, excluding special commands
 */
function filterSelectedFolders(selectedFolders) {
  if (!Array.isArray(selectedFolders)) {
    selectedFolders = [selectedFolders];
  }
  
  return selectedFolders.filter(item =>
    item !== "EXIT" && item !== "CLEAR_SELECTION" && item !== "APPLY_OWNER"
  );
}

/**
 * Check if selection contains special commands
 */
function hasSpecialCommands(selectedFolders) {
  if (!Array.isArray(selectedFolders)) {
    selectedFolders = [selectedFolders];
  }
  
  return {
    hasExit: selectedFolders.includes("EXIT"),
    hasClearSelection: selectedFolders.includes("CLEAR_SELECTION"),
    hasApplyOwner: selectedFolders.includes("APPLY_OWNER")
  };
}

module.exports = {
  handleTreeNavigation,
  handleNavigationCommand,
  filterSelectedFolders,
  hasSpecialCommands,
  handleSpaceKeyPress
};