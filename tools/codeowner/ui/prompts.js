const inquirer = require("inquirer");
const { 
  extractAllTeams, 
  readCodeowners, 
  updateCodeownersWithMultipleOwners,
  findOwnerForPath 
} = require("../utils/codeowners");
const { getSelectedItems, clearSelection } = require("../core/selection");
const { displayOwnershipUpdate, displayOperationResult, displayWarning } = require("./display");

/**
 * Shows current owners for selected items
 */
function displayCurrentOwnership(selectedItems, patterns) {
  console.log(`\n📋 Current owners for selected items:`);
  
  selectedItems.forEach((item, index) => {
    const itemType = item.isFile ? "📄" : "📁";
    let pattern;
    if (item.isFile) {
      pattern = "/" + item.path.replace(/^\/+/, '').replace(/\\/g, '/');
    } else {
      pattern = "/" + item.path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\\/g, '/') + "/**";
    }
    
    const owners = findOwnerForPath(patterns, pattern);
    const ownersList = owners ? owners.join(', ') : 'No owners';
    
    console.log(`   ${index + 1}. ${itemType} ${item.path}`);
    console.log(`      Pattern: ${pattern}`);
    console.log(`      Owners: ${ownersList}`);
  });
}

/**
 * Select ownership management mode
 */
async function selectOwnershipMode() {
  const { mode } = await inquirer.prompt({
    type: "list",
    name: "mode",
    message: "Select ownership management mode:",
    choices: [
      { name: "🔄 Replace all owners (classic mode)", value: "REPLACE" },
      { name: "➕ Add owners to existing ones", value: "ADD" },
      { name: "➖ Remove specific owners", value: "REMOVE" },
      { name: "🗑️  Remove all owners", value: "CLEAR" },
      { name: "❌ Cancel operation", value: "CANCEL" }
    ]
  });
  
  return mode;
}

/**
 * Select owners with multiple selection support
 */
async function selectMultipleOwners(existingTeams, currentOwners = []) {
  const choices = existingTeams.map(team => ({
    name: team,
    value: team,
    checked: currentOwners.includes(team)
  }));

  choices.push(
    new inquirer.Separator(),
    { name: "Add new team", value: "NEW_TEAM" }
  );

  const { selectedOwners } = await inquirer.prompt({
    type: "checkbox",
    name: "selectedOwners",
    message: "Select owners (space - select/deselect, enter - confirm):",
    choices: choices
  });

  // Handle adding new team
  if (selectedOwners.includes("NEW_TEAM")) {
    const index = selectedOwners.indexOf("NEW_TEAM");
    selectedOwners.splice(index, 1);

    const { newTeam } = await inquirer.prompt({
      type: "input",
      name: "newTeam",
      message: "Enter new team (e.g., @DevExpress/new-team):",
      validate: (input) => {
        if (!input.trim()) return "Team name cannot be empty";
        if (!input.startsWith('@')) return "Team name must start with @";
        return true;
      }
    });
    
    selectedOwners.push(newTeam.trim());
  }

  return selectedOwners;
}

/**
 * Select owner for multiple items with multiple owners support
 */
async function selectOwnerForMultipleItems() {
  const selectedItems = getSelectedItems();
  
  if (selectedItems.length === 0) {
    displayWarning("No selected items to apply owner!");
    return;
  }

  try {
    // Get current teams
    const patterns = readCodeowners();
    const existingTeams = extractAllTeams(patterns);

    displayOwnershipUpdate(selectedItems);
    displayCurrentOwnership(selectedItems, patterns);

    // Select working mode
    const mode = await selectOwnershipMode();
    
    if (mode === "CANCEL") {
      console.log("\n🔄 Operation cancelled");
      return;
    }

    let finalOwners = [];

    switch (mode) {
      case "REPLACE":
        finalOwners = await selectMultipleOwners(existingTeams);
        if (finalOwners.length === 0) {
          console.log("\n⚠️  No owners selected. Operation cancelled.");
          return;
        }
        await updateCodeownersWithMultipleOwners(selectedItems, finalOwners, 'replace');
        break;

      case "ADD":
        finalOwners = await selectMultipleOwners(existingTeams);
        if (finalOwners.length === 0) {
          console.log("\n⚠️  No owners selected to add. Operation cancelled.");
          return;
        }
        await updateCodeownersWithMultipleOwners(selectedItems, finalOwners, 'add');
        break;

      case "REMOVE":
        // Get all current owners for selected items
        const allCurrentOwners = new Set();
        selectedItems.forEach(item => {
          let pattern;
          if (item.isFile) {
            pattern = "/" + item.path.replace(/^\/+/, '').replace(/\\/g, '/');
          } else {
            pattern = "/" + item.path.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\\/g, '/') + "/**";
          }
          const owners = findOwnerForPath(patterns, pattern);
          if (owners) {
            owners.forEach(owner => allCurrentOwners.add(owner));
          }
        });

        if (allCurrentOwners.size === 0) {
          console.log("\n⚠️  Selected items have no owners to remove.");
          return;
        }

        finalOwners = await selectMultipleOwners(Array.from(allCurrentOwners));
        if (finalOwners.length === 0) {
          console.log("\n⚠️  No owners selected to remove. Operation cancelled.");
          return;
        }
        await updateCodeownersWithMultipleOwners(selectedItems, finalOwners, 'remove');
        break;

      case "CLEAR":
        const { confirmClear } = await inquirer.prompt({
          type: "confirm",
          name: "confirmClear",
          message: "Are you sure you want to remove ALL owners for selected items?",
          default: false
        });
        
        if (confirmClear) {
          await updateCodeownersWithMultipleOwners(selectedItems, [], 'replace');
        } else {
          console.log("\n🔄 Operation cancelled");
          return;
        }
        break;
    }

    displayOperationResult(`Owner update completed for ${selectedItems.length} items!`);
    
    // Clear selection
    clearSelection();
    
  } catch (error) {
    console.error(`\n❌ Error updating CODEOWNERS: ${error.message}`);
    console.error(error.stack);
  }
}

/**
 * Prompt for exit confirmation
 */
async function confirmExit() {
  const { shouldExit } = await inquirer.prompt({
    type: "confirm",
    name: "shouldExit",
    message: "Are you sure you want to exit?",
    default: false
  });
  
  return shouldExit;
}

/**
 * Prompt for selecting root directory
 */
async function selectRootDirectory(availableDirs) {
  const { rootDir } = await inquirer.prompt({
    type: "list",
    name: "rootDir",
    message: "Select root directory:",
    choices: availableDirs
  });
  
  return rootDir;
}

module.exports = {
  selectOwnerForMultipleItems,
  confirmExit,
  selectRootDirectory
};

module.exports = {
  selectOwnerForMultipleItems,
  confirmExit,
  selectRootDirectory
};