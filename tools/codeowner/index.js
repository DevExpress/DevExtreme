#!/usr/bin/env node
const path = require("path");
const { PROJECT_ROOT, CODEOWNERS_PATH } = require("./config/constants");
const { checkCodeownersExists, checkDirectoryExists } = require("./utils/fileSystem");
const { readCodeowners, extractAllTeams } = require("./utils/codeowners");
const { generateTeamLegend } = require("./core/ownershipLogic");
const { buildRootTreeNodes } = require("./core/treeBuilder");
const { 
  getSelectedItems, 
  clearSelection, 
  addToSelection, 
  getSelectionCount 
} = require("./core/selection");
const { displayTeamLegend, displayOperationResult, displayWarning } = require("./ui/display");
const { selectOwnerForMultipleItems } = require("./ui/prompts");
const { 
  handleTreeNavigation, 
  filterSelectedFolders, 
  hasSpecialCommands 
} = require("./ui/navigation");

/**
 * Parse command line arguments
 */
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  let rootArg = null;
  
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--root" || args[i] === "--from") && args[i + 1]) {
      rootArg = args[i + 1];
      break;
    }
  }
  
  return { rootArg };
}

/**
 * Environment and input validation
 */
function validateEnvironment(rootArg) {
  // Check CODEOWNERS file exists
  if (!checkCodeownersExists()) {
    console.error(`❌ CODEOWNERS file not found at: ${CODEOWNERS_PATH}`);
    process.exit(1);
  }

  // Determine root folder
  const rootPath = rootArg ? path.resolve(PROJECT_ROOT, rootArg) : PROJECT_ROOT;

  // Check root folder exists
  if (!checkDirectoryExists(rootPath)) {
    console.error(`❌ Specified root folder not found: ${rootPath}`);
    process.exit(1);
  }

  return rootPath;
}

/**
 * Handle user selection in main loop
 */
async function handleUserSelection(selectedFolders, rootPath, rootArg) {
  try {
    // Ensure selectedFolders is always an array
    if (!Array.isArray(selectedFolders)) {
      selectedFolders = selectedFolders ? [selectedFolders] : [];
    }

    // Filter empty or invalid values
    selectedFolders = selectedFolders.filter(folder => 
      folder && typeof folder === 'string' && folder.trim() !== ''
    );

    if (selectedFolders.length === 0) {
      // If nothing selected, just continue
      return { shouldContinue: true };
    }

    const commands = hasSpecialCommands(selectedFolders);
    
    // Check special commands
    if (commands.hasExit) {
      console.log("\n👋 Goodbye!");
      return { shouldExit: true };
    }
    
    if (commands.hasClearSelection) {
      clearSelection();
      displayOperationResult("Selection cleared", true);
      return { shouldContinue: true };
    }
    
    if (commands.hasApplyOwner) {
      await selectOwnerForMultipleItems();
      return { shouldContinue: true };
    }

    // Handle selected paths if they're not special commands
    const foldersToAssign = filterSelectedFolders(selectedFolders);

    if (foldersToAssign.length > 0) {
      // Add items to selection
      for (const selectedFolder of foldersToAssign) {
        try {
          const absolutePath = path.resolve(PROJECT_ROOT, selectedFolder);
          const { isFile, exists } = require("./utils/fileSystem").getItemInfo(absolutePath);
          
          if (exists) {
            addToSelection(selectedFolder, isFile);
          } else {
            console.log(`\n⚠️  Skipping non-existent path: ${selectedFolder}`);
          }
        } catch (error) {
          console.log(`\n⚠️  Error processing path "${selectedFolder}": ${error.message}`);
        }
      }

      await selectOwnerForMultipleItems();
    }

    return { shouldContinue: true };
  } catch (error) {
    console.error(`\n❌ Error handling user selection: ${error.message}`);
    return { shouldContinue: true }; // Continue working despite error
  }
}

/**
 * Main application function
 */
async function main() {
  try {
    console.log("🚀 Starting CODEOWNERS Manager...\n");

    // Parse command line arguments
    const { rootArg } = parseCommandLineArgs();

    // Validate environment
    const rootPath = validateEnvironment(rootArg);

    // Main loop - continue working until user chooses to exit
    while (true) {
      try {
        // Re-read CODEOWNERS for pattern updates
        const updatedPatterns = readCodeowners();
        const updatedTeams = extractAllTeams(updatedPatterns);
        const updatedTeamLegend = generateTeamLegend(updatedTeams);

        // Show legend
        displayTeamLegend(updatedTeamLegend);

        // Build tree for prompt
        const treeNodes = buildRootTreeNodes(rootPath, rootArg, updatedPatterns, updatedTeamLegend);

        if (treeNodes.length === 0) {
          displayWarning("No subfolders found in specified directory to display.");
          break;
        }

        // Interactive selection through tree
        const selectedFolders = await handleTreeNavigation(treeNodes);

        // Handle user selection
        const result = await handleUserSelection(selectedFolders, rootPath, rootArg);

        if (result.shouldExit) {
          break;
        }

        console.log("\n" + "=".repeat(50));
        
      } catch (error) {
        console.error(`❌ Error in main loop: ${error.message}`);
        console.error(error.stack);
        
        // Show current state information
        if (getSelectionCount() > 0) {
          console.log(`\n📋 Selected items: ${getSelectionCount()}`);
          console.log("Selection preserved, you can continue working.");
        }
        
        // Continue working
        console.log("\n" + "=".repeat(50));
      }
    }
  } catch (error) {
    console.error(`❌ Critical error: ${error.message}`);
    process.exit(1);
  }
}

// Run application
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }