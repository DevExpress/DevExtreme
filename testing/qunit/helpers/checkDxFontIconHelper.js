
export const DX_ICON_EXPORT_SELECTED_CONTENT_CODE = 61549; // .dx-font-icon("\f06d")
export const DX_ICON_XLSX_FILE_CONTENT_CODE = 61719; // .dx-font-icon("\f117")

export function checkDxFontIcon(assert, dxIconSelector, expectedIconCode) {
    const GENERIC_BASE_ICON_SIZE = 18;

    const iconBeforeElementStyle = getComputedStyle(document.querySelector(dxIconSelector), ':before');
    assert.strictEqual(iconBeforeElementStyle.content.charCodeAt(1), expectedIconCode, `icon code (${dxIconSelector})`);
    const iconElementStyle = getComputedStyle(document.querySelector(dxIconSelector));
    assert.strictEqual(iconElementStyle.width, GENERIC_BASE_ICON_SIZE + 'px', `icon element width (${dxIconSelector})`);
    assert.strictEqual(iconElementStyle.height, GENERIC_BASE_ICON_SIZE + 'px', `icon element height (${dxIconSelector})`);
}

