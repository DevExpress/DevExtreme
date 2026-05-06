async (page) => {
  const sleep = (ms) => page.waitForTimeout(ms);
  const results = [];
  let pass = 0, fail = 0;

  function check(id, cond, msg) {
    if (cond) { results.push('  PASS ' + id); pass++; }
    else { results.push('  FAIL ' + id + (msg ? ': ' + msg : '')); fail++; }
  }

  async function pressKey(key) { await page.keyboard.press(key); await sleep(60); }
  async function reset() { await page.click('body'); await sleep(80); }
  async function countTabZero() {
    return page.evaluate(() => document.querySelectorAll('.dx-toolbar [tabindex="0"]').length);
  }
  async function getTabZeroEl() {
    return page.evaluate(() => document.querySelector('.dx-toolbar [tabindex="0"]') ?? null);
  }
  async function getActive() {
    return page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      cls: document.activeElement?.className ?? '',
      tabIndex: document.activeElement?.tabIndex,
      inToolbar: !!document.activeElement?.closest('.dx-toolbar')
    }));
  }
  async function getActiveId() {
    // Returns a unique identifier for which focusable item has tabIndex=0
    return page.evaluate(() => {
      const el = document.querySelector('.dx-toolbar [tabindex="0"]');
      if (!el) return null;
      return el.tagName + '|' + el.className.split(' ').sort().join(' ') + '|' + (el.id || el.getAttribute('aria-label') || el.closest('[id]')?.id || '');
    });
  }
  async function tabIntoToolbar() {
    await page.keyboard.press('Tab'); await sleep(120);
  }
  // Navigate to focusable item index n from Home (navigates exactly n ArrowRights)
  async function navToFI(n) {
    await pressKey('Home');
    for (let i = 0; i < n; i++) await pressKey('ArrowRight');
    await sleep(60);
  }

  // ═══ Detect focusable item types ═══════════════════════════════════════════
  // We navigate through the toolbar to find real focusable-item indices for each widget type.
  async function detectFocusableIndices() {
    await reset();
    await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
    await tabIntoToolbar();
    await pressKey('Home');

    let bgFI = -1, ddBtnFI = -1, sbFI = -1, tbFI = -1, tmplFI = -1;
    const total = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._getFocusableItems().length);

    for (let i = 0; i < total; i++) {
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const inBG = el.classList.contains('dx-buttongroup') || el.tagName === 'INPUT' && !!el.closest('.dx-buttongroup');
        const inDDB = !!el.closest('.dx-dropdownbutton');
        const isSB = el.tagName === 'INPUT' && !!el.closest('.dx-selectbox');
        // TextBox focus target is now the .dx-textbox container div (not the inner input)
        const isTB = el.classList.contains('dx-textbox') && !el.classList.contains('dx-selectbox');
        const isTmpl = el.classList.contains('dx-item-content');
        const isStandaloneBG = inBG && !inDDB && !isSB;
        return { isSB, isTB, isTmpl, isStandaloneBG, inDDB };
      });
      if (info) {
        if (ddBtnFI === -1 && info.inDDB) ddBtnFI = i;
        if (sbFI === -1 && info.isSB) sbFI = i;
        if (bgFI === -1 && info.isStandaloneBG) bgFI = i;
        if (tbFI === -1 && info.isTB) tbFI = i;
        if (tmplFI === -1 && info.isTmpl) tmplFI = i;
      }
      if (i < total - 1) await pressKey('ArrowRight');
    }
    return { bgFI, ddBtnFI, sbFI, tbFI, tmplFI, total };
  }

  const fi = await detectFocusableIndices();
  results.push(`  INFO indices: bg=${fi.bgFI} ddBtn=${fi.ddBtnFI} sb=${fi.sbFI} tb=${fi.tbFI} tmpl=${fi.tmplFI} total=${fi.total}`);

  // ═══ 1.1 Core Navigation ═══════════════════════════════════════════════════

  // AC-1.1.9: exactly one tabIndex=0 in toolbar at start
  { const n = await countTabZero(); check('AC-1.1.9', n === 1, `got ${n}`); }

  await reset();
  await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
  await tabIntoToolbar();

  // AC-1.1.1: focus is in toolbar
  { const a = await getActive(); check('AC-1.1.1', a.inToolbar, `active: ${a.tag}.${a.cls.split(' ')[0]}`); }

  // AC-1.1.9b: exactly 1 tabIndex=0 after tab-in
  { const n = await countTabZero(); check('AC-1.1.9b', n === 1, `${n} tab-zeros after Tab-in`); }

  // AC-1.1.3: → moves tabIndex=0 to a different element
  {
    await pressKey('Home');          // ensure we start at item 0
    const el0 = await getTabZeroEl();
    await pressKey('ArrowRight');
    const el1 = await getTabZeroEl();
    // Compare the actual element reference identity via document position
    const moved = await page.evaluate((before) => {
      const cur = document.querySelector('.dx-toolbar [tabindex="0"]');
      if (!cur) return false;
      const all = [...document.querySelectorAll('.dx-toolbar [tabindex="0"]')];
      if (all.length !== 1) return false;
      // Check that active element is NOW focused (not just tabIndex changed)
      return document.activeElement?.closest('.dx-toolbar') && document.activeElement !== null;
    }, el0);
    // Also check via focusable index
    const fi0 = await page.evaluate(() => {
      const inst = $(document.querySelector('#toolbar')).dxToolbar('instance');
      return inst._activeItemIndex;
    });
    check('AC-1.1.3', fi0 === 1, `activeItemIndex after →: ${fi0} (expected 1)`);
  }

  // AC-1.1.6: Home → first item
  {
    await pressKey('End'); await pressKey('Home');
    const isFirst = await page.evaluate(() => {
      const inst = $(document.querySelector('#toolbar')).dxToolbar('instance');
      return inst._activeItemIndex === 0;
    });
    check('AC-1.1.6', isFirst, 'activeItemIndex not 0 after Home');
  }

  // AC-1.1.7: End → last focusable item
  {
    await pressKey('End');
    const isLast = await page.evaluate(() => {
      const inst = $(document.querySelector('#toolbar')).dxToolbar('instance');
      const fi = inst._getFocusableItems();
      return inst._activeItemIndex === fi.length - 1;
    });
    check('AC-1.1.7', isLast, 'activeItemIndex not last after End');
  }

  // AC-1.1.4: → at last → no change
  {
    await pressKey('End');
    const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    await pressKey('ArrowRight');
    const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    check('AC-1.1.4', idx0 === idx1, `index changed from ${idx0} to ${idx1}`);
  }

  // AC-1.1.5: ← at first → no change
  {
    await pressKey('Home');
    const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    await pressKey('ArrowLeft');
    const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    check('AC-1.1.5', idx0 === idx1, `index changed from ${idx0} to ${idx1}`);
  }

  // AC-1.1.8: disabled item never in focusable list
  {
    const noDisabled = await page.evaluate(() => {
      const inst = $(document.querySelector('#toolbar')).dxToolbar('instance');
      const fis = inst._getFocusableItems();
      return fis.every($ft => !$ft.get(0)?.closest('.dx-state-disabled'));
    });
    check('AC-1.1.8', noDisabled, 'disabled item in focusable list');
  }

  // ═══ 1.2 Nested Widgets ════════════════════════════════════════════════════

  if (fi.bgFI >= 0) {
    await reset();
    await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
    await tabIntoToolbar();
    await navToFI(fi.bgFI);

    // AC-1.2.3: ↑/↓ on standalone BG stays in toolbar
    const a0 = await getActive();
    await pressKey('ArrowDown'); await sleep(100);
    const a1 = await getActive();
    check('AC-1.2.3', a0.inToolbar && a1.inToolbar, `focus left toolbar on ↓ (was ${a0.inToolbar}, now ${a1.inToolbar})`);

    // AC-1.2.4: ← moves to prev toolbar item (BG is not first)
    if (fi.bgFI > 0) {
      await navToFI(fi.bgFI);
      const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      await pressKey('ArrowLeft'); await sleep(80);
      const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.2.4', idx1 === fi.bgFI - 1, `← from BG: expected fi=${fi.bgFI-1}, got ${idx1}`);
    }

    // AC-1.2.5: → moves to next toolbar item (BG is not last)
    if (fi.bgFI < fi.total - 1) {
      await navToFI(fi.bgFI);
      const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      await pressKey('ArrowRight'); await sleep(80);
      const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.2.5', idx1 === fi.bgFI + 1, `→ from BG: expected fi=${fi.bgFI+1}, got ${idx1}`);
    }
  } else {
    results.push('  SKIP AC-1.2.3-5: no standalone ButtonGroup found');
  }

  if (fi.sbFI >= 0) {
    await reset();
    await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
    await tabIntoToolbar();
    await navToFI(fi.sbFI);

    // AC-1.2.15: ← on SelectBox (toolbar mode) → navigate toolbar
    if (fi.sbFI > 0) {
      const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      await pressKey('ArrowLeft'); await sleep(80);
      const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.2.15', idx1 === fi.sbFI - 1, `← on SB: expected fi=${fi.sbFI-1}, got ${idx1}`);
    }

    // Return to SelectBox
    await navToFI(fi.sbFI);

    // AC-1.2.11: Enter → list opens
    await pressKey('Enter'); await sleep(400);
    const listOpen = await page.evaluate(() => !!document.querySelector('.dx-dropdownlist-popup-wrapper .dx-list-item'));
    check('AC-1.2.11', listOpen, 'SelectBox list did not open on Enter');

    // AC-1.2.13: Esc closes list; then toolbar mode
    await pressKey('Escape'); await sleep(300);
    const listClosed = await page.evaluate(() => {
      const sb = document.querySelector('.dx-toolbar .dx-selectbox');
      return sb ? $(sb).dxSelectBox('instance').option('opened') === false : true;
    });
    check('AC-1.2.13a', listClosed, 'SelectBox list still open after Esc');
    if (fi.sbFI > 0) {
      await pressKey('ArrowLeft'); await sleep(80);
      const idx = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.2.13b', idx === fi.sbFI - 1, `← after Esc on SB: expected ${fi.sbFI-1}, got ${idx}`);
    }
  } else {
    results.push('  SKIP AC-1.2.11,13,15: no SelectBox found');
  }

  if (fi.tbFI >= 0) {
    await reset();
    await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
    await tabIntoToolbar();
    await navToFI(fi.tbFI);

    // AC-1.2.16: ← in toolbar mode → navigate off TextBox
    if (fi.tbFI > 0) {
      const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      await pressKey('ArrowLeft'); await sleep(80);
      const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.2.16', idx1 === fi.tbFI - 1, `← on TB: expected fi=${fi.tbFI-1}, got ${idx1}`);
    }

    // Return to TextBox
    await navToFI(fi.tbFI);

    // AC-1.2.17: Enter → edit mode; typing works
    await pressKey('Enter'); await sleep(80);
    await page.keyboard.type('Z'); await sleep(80);
    const val = await page.evaluate(() => document.querySelector('.dx-toolbar .dx-textbox:not(.dx-selectbox) input')?.value ?? '');
    check('AC-1.2.17', val.includes('Z'), `TextBox value after Enter+type: "${val}"`);

    // AC-1.2.18: Esc exits edit mode; ← navigates toolbar
    await page.evaluate(() => { const tb = document.querySelector('.dx-toolbar .dx-textbox:not(.dx-selectbox) input'); if (tb) tb.value = ''; });
    await pressKey('Escape'); await sleep(80);
    if (fi.tbFI > 0) {
      await pressKey('ArrowLeft'); await sleep(80);
      const idx = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.2.18', idx === fi.tbFI - 1, `← after Esc on TB: expected ${fi.tbFI-1}, got ${idx}`);
    }
  } else {
    results.push('  SKIP AC-1.2.16-18: no TextBox found');
  }

  // ═══ 1.3 Mouse vs. Keyboard Sync ══════════════════════════════════════════

  await reset();
  const clickTarget = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.dx-toolbar-items-container .dx-toolbar-item')]
      .filter(el => !el.classList.contains('dx-toolbar-item-invisible'));
    const item = items.find(it => it.querySelector('.dx-button:not(.dx-state-disabled)'));
    const btn = item?.querySelector('.dx-button');
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  });

  if (clickTarget) {
    await page.mouse.click(clickTarget.x, clickTarget.y); await sleep(150);

    // AC-1.3.1: exactly 1 tabIndex=0 after click
    const n = await countTabZero();
    check('AC-1.3.1', n === 1, `${n} tab-zeros after click`);
    const activeHas0 = await page.evaluate(() => document.activeElement?.tabIndex === 0 && !!document.activeElement?.closest('.dx-toolbar'));
    check('AC-1.3.1b', activeHas0, 'clicked item does not have tabIndex=0');

    // AC-1.3.3: → navigates from click position
    const idx0 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    await pressKey('ArrowRight'); await sleep(80);
    const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    check('AC-1.3.3', idx1 === idx0 + 1, `→ after click: expected ${idx0+1}, got ${idx1}`);

    // AC-1.3.4: ← moves back
    await pressKey('ArrowLeft'); await sleep(80);
    const idx2 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    check('AC-1.3.4', idx2 === idx0, `← did not return to clicked item: expected ${idx0}, got ${idx2}`);
  }

  // AC-1.3.5: Mouse click on TextBox → edit mode (type directly)
  if (fi.tbFI >= 0) {
    const tbPos = await page.evaluate(() => {
      const inp = document.querySelector('.dx-toolbar .dx-textbox:not(.dx-selectbox) input');
      if (!inp) return null;
      const r = inp.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    });
    if (tbPos) {
      await page.mouse.click(tbPos.x, tbPos.y); await sleep(150);
      await page.keyboard.type('W'); await sleep(80);
      const val = await page.evaluate(() => document.querySelector('.dx-toolbar .dx-textbox:not(.dx-selectbox) input')?.value ?? '');
      check('AC-1.3.5', val.includes('W'), `click+type on TextBox: value="${val}"`);
      await page.evaluate(() => { const tb = document.querySelector('.dx-toolbar .dx-textbox:not(.dx-selectbox) input'); if (tb) tb.value = ''; });
      await pressKey('Escape'); await sleep(80);
      if (fi.tbFI > 0) {
        await pressKey('ArrowLeft'); await sleep(80);
        const idx = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
        check('AC-1.3.6', idx === fi.tbFI - 1, `After Esc+← expected ${fi.tbFI-1}, got ${idx}`);
      }
    }
  }

  // ═══ 1.4 Template Items ═══════════════════════════════════════════════════

  if (fi.tmplFI >= 0) {
    await reset();
    await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
    await tabIntoToolbar();
    await navToFI(fi.tmplFI);

    // AC-1.4.3: template container is focused with tabIndex=0
    const containerActive = await page.evaluate(() =>
      document.activeElement?.classList.contains('dx-item-content') && document.activeElement?.tabIndex === 0
    );
    check('AC-1.4.3', containerActive, 'not on dx-item-content or tabIndex≠0');

    // AC-1.4.5: ← navigates toolbar, not into template
    if (fi.tmplFI > 0) {
      await pressKey('ArrowLeft'); await sleep(80);
      const idx = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.4.5', idx === fi.tmplFI - 1, `← from tmpl expected ${fi.tmplFI-1}, got ${idx}`);
    }

    // Return to template; test Enter
    await navToFI(fi.tmplFI);
    await pressKey('Enter'); await sleep(80);
    const inside = await page.evaluate(() => {
      const el = document.activeElement;
      return el && !el.classList.contains('dx-item-content') && !!el.closest('.dx-item-content');
    });
    check('AC-1.4.6', inside, 'Enter did not enter template');

    // AC-1.4.8: Esc → back to container
    await pressKey('Escape'); await sleep(80);
    const back = await page.evaluate(() => document.activeElement?.classList.contains('dx-item-content'));
    check('AC-1.4.8', back, 'Esc did not return to template container');

    // AC-1.4.5b: ← from container after Esc → navigate toolbar
    if (fi.tmplFI > 0) {
      await pressKey('ArrowLeft'); await sleep(80);
      const idx = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.4.5b', idx === fi.tmplFI - 1, `← after Esc from tmpl expected ${fi.tmplFI-1}, got ${idx}`);
    }
  } else {
    results.push('  SKIP AC-1.4.x: template item not found');
  }

  // ═══ 1.5.1 Disabled Items Skip ════════════════════════════════════════════

  await reset();
  await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
  await tabIntoToolbar();
  await pressKey('Home');

  // AC-1.5.1.1: no disabled item in focusable list
  {
    const noDisabled = await page.evaluate(() => {
      const inst = $(document.querySelector('#toolbar')).dxToolbar('instance');
      return inst._getFocusableItems().every($ft => !$ft.get(0)?.closest('.dx-state-disabled'));
    });
    check('AC-1.5.1.1', noDisabled, 'disabled item has tabIndex>=0');
  }

  // AC-1.5.1.2: → from first item skips disabled
  {
    await pressKey('ArrowRight'); await sleep(80);
    const onDisabled = await page.evaluate(() => !!document.activeElement?.closest('.dx-state-disabled'));
    check('AC-1.5.1.2', !onDisabled, '→ landed on disabled item');
  }

  // ═══ 1.5.2 Dynamic Item Removal ══════════════════════════════════════════

  await page.click('#btn-add-item'); await sleep(300);
  await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
  await tabIntoToolbar(); await sleep(100);

  // AC-1.5.2.1: exactly one tabIndex=0 after add
  { const n = await countTabZero(); check('AC-1.5.2.1', n === 1, `${n} tab-zeros after add`); }

  // AC-1.5.2.7: DOM order — dynamic item comes before Attach button
  const domOrder = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.dx-toolbar-items-container .dx-toolbar-item')]
      .filter(el => !el.classList.contains('dx-toolbar-item-invisible'));
    const dIdx = items.findIndex(it =>
      [...it.querySelectorAll('[title],[aria-label]')].some(e => (e.title || e.getAttribute('aria-label') || '').includes('Dynamic'))
    );
    const aIdx = items.findIndex(it =>
      [...it.querySelectorAll('[title],[aria-label]')].some(e => (e.title || e.getAttribute('aria-label') || '').includes('Attach'))
    );
    return { dIdx, aIdx, count: items.length };
  });
  if (domOrder.dIdx >= 0 && domOrder.aIdx >= 0) {
    check('AC-1.5.2.7', domOrder.dIdx < domOrder.aIdx,
      `dynamic(${domOrder.dIdx}) should come before attach(${domOrder.aIdx})`);
  } else {
    results.push(`  INFO AC-1.5.2.7: dynamic=${domOrder.dIdx}, attach=${domOrder.aIdx}`);
  }

  // Navigate to dynamic item by finding it via navigation
  await pressKey('Home');
  let dynFI = -1;
  const totalAfterAdd = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._getFocusableItems().length);
  for (let i = 0; i < totalAfterAdd; i++) {
    const isDynamic = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      return el.getAttribute('aria-label')?.includes('Dynamic') ||
             el.getAttribute('title')?.includes('Dynamic') ||
             el.closest('[title*="Dynamic"]') !== null ||
             el.closest('[aria-label*="Dynamic"]') !== null;
    });
    if (isDynamic) { dynFI = i; break; }
    if (i < totalAfterAdd - 1) await pressKey('ArrowRight');
  }
  results.push(`  INFO AC-1.5.2: dynamic item at focusable index ${dynFI}`);

  // Navigate to dynamic item position
  if (dynFI >= 0) {
    await navToFI(dynFI);
    const fiBeforeRemove = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);

    // Remove item
    await page.click('#btn-remove-item'); await sleep(300);
    await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
    await tabIntoToolbar(); await sleep(100);

    // AC-1.5.2-count: exactly 1 tab-zero after removal
    const n = await countTabZero();
    check('AC-1.5.2-count', n === 1, `${n} tab-zeros after remove`);

    // AC-1.5.2.4: anchor moved backward (to previous item)
    const fiAfter = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    check('AC-1.5.2.4', fiAfter >= 0 && fiAfter < fiBeforeRemove,
      `activeItemIndex: before=${fiBeforeRemove}, after=${fiAfter} (expected after < before)`);

    // AC-1.5.2.6: navigation still works after removal
    {
      const idx0 = fiAfter;
      await pressKey('ArrowRight'); await sleep(80);
      const idx1 = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
      check('AC-1.5.2.6', idx1 > idx0 || idx0 === fi.total - 1, `→ after removal: went from ${idx0} to ${idx1}`);
    }
  } else {
    results.push('  SKIP AC-1.5.2.4-6: could not find dynamic item via navigation');
    // Still remove for cleanup
    await page.click('#btn-remove-item'); await sleep(300);
  }

  // ═══ 1.6 Overflow Menu Keyboard Navigation ════════════════════════════════

  // Navigate to the overflow "More" button (last focusable item)
  await reset();
  await page.evaluate(() => { const r = document.querySelector('#resizable-container'); r.tabIndex = -1; r.focus(); });
  await tabIntoToolbar();
  await pressKey('End');  // jump to "More" button (last item)
  await sleep(80);

  const overflowFI = fi.total - 1;

  // AC-1.6.1: Enter on overflow → popup opens, focus inside list
  {
    await navToFI(overflowFI);
    await pressKey('Enter');
    await sleep(150);
    const popupOpen = await page.evaluate(() => {
      const btn = document.querySelector('.dx-toolbar-menu-container .dx-dropdownmenu-button');
      return btn?.getAttribute('aria-expanded') === 'true';
    });
    const focusInMenu = await page.evaluate(() => {
      const ae = document.activeElement;
      // Focus lands on the list's scrollview container or a list item.
      return !!ae?.closest('.dx-dropdownmenu-popup-wrapper');
    });
    check('AC-1.6.1', popupOpen && focusInMenu, `popupOpen=${popupOpen} focusInMenu=${focusInMenu}`);

    // Esc to clean up
    await pressKey('Escape'); await sleep(200);
  }

  // AC-1.6.3: Esc from menu → popup closed, focus on "More" button
  {
    await navToFI(overflowFI);
    await pressKey('Enter'); await sleep(150);
    await pressKey('Escape'); await sleep(200);
    // aria-expanded is updated synchronously on close (not animation-dependent).
    const popupGone = await page.evaluate(() => {
      const btn = document.querySelector('.dx-toolbar-menu-container .dx-dropdownmenu-button');
      return btn?.getAttribute('aria-expanded') === 'false';
    });
    const focusOnMore = await page.evaluate(() => {
      const ae = document.activeElement;
      return !!(ae && ae.closest('.dx-toolbar-menu-container'));
    });
    check('AC-1.6.3', popupGone && focusOnMore, `popupGone=${popupGone} focusOnMore=${focusOnMore}`);
  }

  // AC-1.6.6: Roving tabindex anchor is "More" button after Esc
  {
    const tabZeroCount = await countTabZero();
    const moreHasTabZero = await page.evaluate(() => {
      const el = document.querySelector('.dx-toolbar-menu-container [tabindex="0"]');
      return !!el;
    });
    check('AC-1.6.6', tabZeroCount === 1 && moreHasTabZero,
      `tabZeros=${tabZeroCount} moreHasTabZero=${moreHasTabZero}`);
  }

  // AC-1.6.7: ↓ on "More" → popup opens, focus inside list
  {
    await navToFI(overflowFI);
    await pressKey('ArrowDown'); await sleep(150);
    const popupOpen = await page.evaluate(() => {
      const btn = document.querySelector('.dx-toolbar-menu-container .dx-dropdownmenu-button');
      return btn?.getAttribute('aria-expanded') === 'true';
    });
    const focusInMenu = await page.evaluate(() => !!document.activeElement?.closest('.dx-dropdownmenu-popup-wrapper'));
    check('AC-1.6.7', popupOpen && focusInMenu, `popupOpen=${popupOpen} focusInMenu=${focusInMenu}`);
    await pressKey('Escape'); await sleep(200);
  }

  // AC-1.6.4: Item activation (Enter on first list item) → popup closes, focus on "More"
  {
    await navToFI(overflowFI);
    await pressKey('Enter'); await sleep(150);
    await pressKey('Enter'); await sleep(300);  // activate first menu item
    const popupGone = await page.evaluate(() => {
      const btn = document.querySelector('.dx-toolbar-menu-container .dx-dropdownmenu-button');
      return btn?.getAttribute('aria-expanded') === 'false';
    });
    const focusOnMore = await page.evaluate(() => !!document.activeElement?.closest('.dx-toolbar-menu-container'));
    check('AC-1.6.4', popupGone && focusOnMore, `popupGone=${popupGone} focusOnMore=${focusOnMore}`);
  }

  // AC-1.6.2: ↑/↓ navigate inside menu (dxList handles it); ← / → do NOT navigate toolbar
  {
    await navToFI(overflowFI);
    await pressKey('Enter'); await sleep(150);
    // Press ↓ — should move to second item (list handles it), not close menu
    await pressKey('ArrowDown'); await sleep(80);
    const stillOpen = await page.evaluate(() => {
      const btn = document.querySelector('.dx-toolbar-menu-container .dx-dropdownmenu-button');
      return btn?.getAttribute('aria-expanded') === 'true';
    });
    const focusOnSecond = await page.evaluate(() => {
      const ae = document.activeElement;
      const items = [...document.querySelectorAll(
        '.dx-dropdownmenu-popup-wrapper .dx-list-item:not(.dx-state-disabled) [tabindex="0"]'
      )];
      return items.length > 1 && ae === items[1];
    });
    // Press → — should NOT navigate toolbar (insideActiveItem guards it)
    const idxBefore = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    await pressKey('ArrowRight'); await sleep(80);
    const idxAfter = await page.evaluate(() => $(document.querySelector('#toolbar')).dxToolbar('instance')._activeItemIndex);
    check('AC-1.6.2', stillOpen && focusOnSecond && idxBefore === idxAfter,
      `stillOpen=${stillOpen} focusOnSecond=${focusOnSecond} toolbarIdxUnchanged=${idxBefore === idxAfter}`);
    await pressKey('Escape'); await sleep(200);
  }

  // ═══ Final report ══════════════════════════════════════════════════════════
  const output = results.join('\n') + `\n\nTotal: ${pass+fail} | PASS: ${pass} | FAIL: ${fail}`;
  return output;
}
