// Global array for storing selected items
let selectedItems = [];

/**
 * Checks if item is selected
 */
function isItemSelected(itemPath) {
  return selectedItems.some(item => item.path === itemPath);
}

/**
 * Toggles item selection
 */
function toggleItemSelection(itemPath, isFile) {
  // Validate input parameters
  if (!itemPath || typeof itemPath !== 'string' || itemPath.trim() === '') {
    console.log(`\n⚠️  Invalid path for selection: ${itemPath}`);
    return;
  }

  // Normalize path
  const normalizedPath = itemPath.trim();
  
  const existingIndex = selectedItems.findIndex(item => item.path === normalizedPath);
  
  if (existingIndex >= 0) {
    // Item already selected, remove it
    selectedItems.splice(existingIndex, 1);
    console.log(`\n🔄 Item ${normalizedPath} removed from selection`);
  } else {
    // Item not selected, add it
    selectedItems.push({ path: normalizedPath, isFile: Boolean(isFile) });
    console.log(`\n✅ Item ${normalizedPath} added to selection`);
  }
}

/**
 * Gets list of selected items
 */
function getSelectedItems() {
  return [...selectedItems];
}

/**
 * Clears selection
 */
function clearSelection() {
  selectedItems = [];
}

/**
 * Adds item to selection if not already selected
 */
function addToSelection(itemPath, isFile) {
  if (!isItemSelected(itemPath)) {
    selectedItems.push({ path: itemPath, isFile });
  }
}

/**
 * Removes item from selection
 */
function removeFromSelection(itemPath) {
  const existingIndex = selectedItems.findIndex(item => item.path === itemPath);
  if (existingIndex >= 0) {
    selectedItems.splice(existingIndex, 1);
  }
}

/**
 * Gets count of selected items
 */
function getSelectionCount() {
  return selectedItems.length;
}

module.exports = {
  isItemSelected,
  toggleItemSelection,
  getSelectedItems,
  clearSelection,
  addToSelection,
  removeFromSelection,
  getSelectionCount
};