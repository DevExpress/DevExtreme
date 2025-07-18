const { STATUS_COLORS } = require("../config/constants");
const { getSelectedItems } = require("../core/selection");

/**
 * Displays the team and status legend
 */
function displayTeamLegend(teamLegend) {
  console.log("\n=== TEAM LEGEND ===");
  Object.entries(teamLegend).forEach(([team, letter]) => {
    console.log(`${letter} - ${team}`);
  });

  console.log("\n=== STATUS LEGEND ===");
  console.log(`${STATUS_COLORS.OWNED}●${STATUS_COLORS.RESET} - owned by a team (or shows team letters)`);
  console.log(`${STATUS_COLORS.PARTIAL}●${STATUS_COLORS.RESET} - partially owned folder (contains owned files)`);
  console.log(`${STATUS_COLORS.UNOWNED}●${STATUS_COLORS.RESET} - unowned item`);
  console.log(`${STATUS_COLORS.SELECTED}●${STATUS_COLORS.RESET} - selected item`);

  console.log(`\n💡 Instructions:`);
  console.log(`   - Use arrow keys to navigate`);
  console.log(`   - Space: select/unselect file or folder`);
  console.log(`   - Enter: apply owner to selected items`);
  console.log(`   - 'O' after selection: show recent commits`);

  displaySelectedItems();
  console.log("");
}

/**
 * Displays the list of selected items
 */
function displaySelectedItems() {
  const selectedItems = getSelectedItems();

  if (selectedItems.length > 0) {
    console.log(`\n📋 Selected items: ${selectedItems.length}`);
    selectedItems.forEach((item, index) => {
      const itemType = item.isFile ? "📄" : "📁";
      console.log(`   ${index + 1}. ${itemType} ${item.path}`);
    });
  }
}

/**
 * Displays selected items when applying ownership
 */
function displayOwnershipUpdate(selectedItems) {
  console.log(`\n📋 Selected items: ${selectedItems.length}`);
  selectedItems.forEach((item, index) => {
    const itemType = item.isFile ? "📄" : "📁";
    console.log(`   ${index + 1}. ${itemType} ${item.path}`);
  });
}

/**
 * Formats ownership status for display
 */
function formatOwnershipStatus(ownershipInfo, isSelected = false) {
  const { status, owners, teamLetters } = ownershipInfo;
  let statusColor = STATUS_COLORS[status];

  if (isSelected) {
    statusColor = STATUS_COLORS.SELECTED;
  }

  const teamDisplay = teamLetters || '●';

  switch (status) {
    case 'OWNED':
      return ` ${statusColor}${teamDisplay}${STATUS_COLORS.RESET}`;
    case 'PARTIAL':
      return ` ${statusColor}${teamDisplay}${STATUS_COLORS.RESET}`;
    case 'UNOWNED':
      return ` ${statusColor}●${STATUS_COLORS.RESET}`;
    default:
      return ` ${statusColor}●${STATUS_COLORS.RESET}`;
  }
}

/**
 * Adds a selection marker to an item
 */
function addSelectionMarker(isSelected) {
  return isSelected ? `${STATUS_COLORS.SELECTED}✓${STATUS_COLORS.RESET} ` : "";
}

/**
 * Displays the result of an operation
 */
function displayOperationResult(message, isSuccess = true) {
  const icon = isSuccess ? "✅" : "❌";
  console.log(`\n${icon} ${message}`);
}

/**
 * Displays a warning message
 */
function displayWarning(message) {
  console.log(`\n⚠️  ${message}`);
}

/**
 * Displays an informational message
 */
function displayInfo(message) {
  console.log(`\n💡 ${message}`);
}

module.exports = {
  displayTeamLegend,
  displaySelectedItems,
  displayOwnershipUpdate,
  formatOwnershipStatus,
  addSelectionMarker,
  displayOperationResult,
  displayWarning,
  displayInfo
};
