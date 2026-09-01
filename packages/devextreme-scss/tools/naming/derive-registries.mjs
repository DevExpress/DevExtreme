/*
 * Regenerates tools/naming/registries.json — the single source of truth for the fluent-next
 * SCSS naming standard (scss/widgets/fluent-next/NAMING.md).
 *
 *   node tools/naming/derive-registries.mjs        # writes registries.json
 *   node tools/naming/derive-registries.mjs --check # fails if the committed file is stale
 *
 * Vocabularies that describe the design system (parts, states, sub-element anatomy) are DERIVED
 * from the token package, so they cannot drift from it. Judgment calls (component exceptions,
 * chassis dependents, rejected synonyms) live in OVERRIDES below and are reviewed as code.
 *
 * The component names come from the package's flat index rather than from generated output, so the
 * vocabulary survives the component tier no longer being emitted (it is an alias layer the theme
 * stopped reading) and the script needs no build to run.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const packageRoot = join(here, '..', '..');
const themeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const flatTokens = require.resolve('@devexpress/design-tokens-internal/tokens.flat.json');
const COMPONENT_TOKEN_SOURCE = 'components/core/theme/fluent';
const output = join(here, 'registries.json');

// ---------------------------------------------------------------------------------------------
// Judgment calls. Everything else in registries.json is derived.
// ---------------------------------------------------------------------------------------------

const OVERRIDES = {
  // folder -> component, only where kebab(folder) is not the component name
  components: {
    gridBase: 'grid', // shared grid chassis; matches the package's grid-cell / grid-row / grid-view family
    menuBase: 'menu', // shared chassis of menu / contextMenu / dropDownMenu
    icons: 'icon', // matches the package's icon-* family
  },

  /*
   * Folders that own no component: they are the system tier or bundle configuration.
   *
   * `typography/` is here rather than in `components` because there is no dxTypography widget: the
   * folder holds the theme's TYPE SCALE (xs…xl, heading-1…6) plus the `.dx-typography-*` utility
   * classes that publish it. Five folders read the scale, it describes no widget's anatomy, and
   * `typography` is a registered concern — the common/ criterion, satisfied without moving anything.
   * Moving the declarations into common/ was tried and reverted: it pulled common/ earlier in the
   * load order and shifted `--dx-line-height` inside its :root block, i.e. it changed the emitted CSS.
   */
  systemFolders: ['common', 'typography'],

  // System folders whose declarations join the --dx tier (published from <folder>/_public.scss
  // onto rootSelectors[folder]); grammar stays the systemConcerns path, not the component one.
  systemTier: ['common', 'typography'],

  // component -> folder that is allowed to declare it (O2: exactly one declaration home).
  // Only needed where more than one folder currently declares the component's variables.
  declarationHome: {
    grid: 'gridBase',
  },

  // O5: a chassis may be read by its dependents, and only for the chassis component's variables.
  // Dependents are widgets that literally render the chassis widget — not "whatever reads it today".
  chassis: {
    gridBase: {
      component: 'grid',
      dependents: ['dataGrid', 'treeList', 'pivotGrid', 'cardView'],
    },
    /*
     * The declaration home is `menu/`, not `menuBase/`: menu/ declares the whole $menu-* colour set
     * and menuBase/ consumes it (it declared exactly one name, which moved to menu/). The first
     * version of this registry had the direction backwards.
     */
    menu: {
      component: 'menu',
      dependents: ['menuBase', 'contextMenu', 'dropDownMenu'],
    },
    /*
     * Button is a chassis for its control metrics (height, icon size, icon margin): the dependents
     * below render real button affordances and must match Button pixel for pixel. The values used to
     * sit in the theme root, which hid the coupling — moving them here made it explicit.
     *
     * Watch the size of this list. If it keeps growing, that is evidence these three are not button
     * anatomy at all but global control metrics, and they belong in the `global` concern instead.
     */
    button: {
      component: 'button',
      /*
       * The exception is really per-READ, not per-folder: it applies when the reader paints the chassis
       * widget's OWN element. `buttonGroup` and `speedDialAction` ARE buttons; `scheduler` restyles a
       * real `.dx-button` in its dropdown-appointment block by feeding Button's text-mode palette into
       * `dx-button-flat-color-styling`, which is the same thing. `diagram` and `calendar` are NOT here:
       * they use Button's colours on SVG strokes and on calendar cells, i.e. on things that are not
       * buttons, and for those O4 applies — their own variable on the same token.
       *
       * The enforcer can only encode this per folder, so a folder goes in when its reads are of the
       * first kind, and this comment records which element justified it.
       */
      dependents: [
        'buttonGroup', 'chat', 'contextMenu', 'gridBase', 'htmlEditor', 'list', 'menu', 'menuBase',
        'pivotGrid', 'scheduler', 'speedDialAction', 'stepper', 'toolbar',
      ],
    },
    textEditor: {
      component: 'text-editor',
      /*
       * `gridBase` is in the list because a grid cell in edit mode IS a text editor: the grid has to
       * match the editor's input padding and the footprint of its invalid badge, or the cell jumps
       * when it turns into an editor.
       */
      dependents: [
        'textBox', 'textArea', 'numberBox', 'dateBox', 'dateRangeBox', 'selectBox',
        'autocomplete', 'lookup', 'tagBox', 'colorBox', 'dropDownBox', 'dropDownEditor',
        'dropDownList', 'gridBase',
      ],
    },
    /*
     * dropDownEditor is a base class in the widget hierarchy exactly as textEditor is — SelectBox,
     * Lookup, DateBox, ColorBox and TagBox all extend it — so the same reasoning applies. `gridBase`
     * is here for the same reason as above: a grid cell in edit mode renders a real drop-down editor.
     */
    dropDownEditor: {
      component: 'drop-down-editor',
      dependents: [
        'selectBox', 'lookup', 'dateBox', 'colorBox', 'dropDownBox', 'dropDownList', 'tagBox',
        'autocomplete', 'gridBase',
      ],
    },
  },

  /*
   * O4's counterpart: folder -> components it RENDERS, with the element that proves it. A read of a
   * component listed here is matching a widget the reader contains, not borrowing a value that
   * happened to look right. Everything not listed stays a violation.
   */
  embeds: {
    // .dx-toolbar-menu renders a real List; the toolbar's own buttons match its item height
    toolbar: ['list'],
    // .dx-scheduler-dropdown-appointments renders a List, the header a Toolbar, the appointment
    // tooltip a Tooltip, and the recurrence editor real radio groups
    scheduler: ['list', 'toolbar', 'tooltip', 'radio-group'],
    // the column chooser is a Popup, its message a menu item, the revert tooltip a validation message
    gridBase: ['popup', 'menu', 'validation'],
    // .dx-htmleditor-toolbar is a Toolbar, the image dialog a Popup with a FileUploader inside
    'html-editor': ['toolbar', 'popup', 'file-uploader', 'text-editor'],
    htmlEditor: ['toolbar', 'popup', 'file-uploader', 'text-editor'],
    // the confirmation dialog is a Popup, the message box a text editor
    chat: ['popup', 'text-editor'],
    // a fieldset field is whatever control it wraps: checkBox, switch, slider or a form label
    fieldset: ['check-box', 'switch', 'slider', 'form'],
    /*
     * List items render real check boxes and radio buttons in selection modes, and
     * `.dx-list-with-search` puts a real TextBox above them — the scroll area's height is computed
     * from that editor's min-height.
     */
    list: ['check-box', 'radio-button', 'text-editor'],
    // the colour box's drop-down content IS a ColorView
    colorBox: ['color-view'],
    // the field chooser's tree is a TreeView
    pivotGrid: ['tree-view'],
    // the pager sits inside the grid's chrome and aligns with its cell padding
    pagination: ['grid'],
    // gantt renders the grid's tree list on the left and form labels in its dialogs
    gantt: ['grid', 'form'],
    // a range slider is two slider handles
    rangeSlider: ['slider'],
    // .dx-scrollview wraps a Scrollable
    scrollView: ['scrollable'],
    // the validation message is positioned against the editor it belongs to
    validation: ['text-editor'],
    filterBuilder: ['text-editor'],
    // the file manager's toolbar is a Toolbar
    // …and it splits the dirs panel from the items view with a real Splitter, centring the
    // wrapper on the bar from that widget's own border and bar widths
    fileManager: ['toolbar', 'splitter-bar'],
    // the editor's spin buttons are real Buttons
    textEditor: ['button'],
  },

  /*
   * Wave F: where the emitted --dx-* component tier is DECLARED (the Blazor --dxbl- model: on the
   * component's root class, not in :root — per-instance overrides via the cascade, no :root bloat).
   * The default derivation is `.dx-<component-without-hyphens>`; an entry here overrides it, and
   * every selector is machine-gated against the built bundle (assertRootSelectorsExist).
   *
   * The root must be an ancestor-or-self of every box the component's variables paint. Two facts
   * decide the exceptions:
   *   - overlays render OUTSIDE the widget's source element (inside .dx-overlay-wrapper), so the
   *     widget class is not an ancestor of the painted boxes — the wrapper/content class is;
   *   - chassis variables are consumed wherever the chassis renders, so their scope is the shared
   *     runtime class when the hierarchy provides one (.dx-texteditor, .dx-menu-base), and the
   *     dependents' root list when it does not (grid).
   * Popup satellites of composite widgets are included where known (date-box wrapper, tag-box
   * popup); a consumption wave that converts a declaration must still prove its subject sits under
   * one of these roots (browser smoke) — grid's column-chooser-style satellites get added here when
   * that component's consumption wave lands.
   */
  rootSelectors: {
    // system tier: theme-wide values (system concerns of common/) live on the document root
    common: [':root'],
    /*
     * The drop-down editor's inner button is a dxButton whose root carries dx-button-normal +
     * dx-dropdowneditor-button but NOT dx-button (found by the F12 runtime reachability audit:
     * button variables did not reach .dx-button-content inside every dropdown editor).
     */
    button: ['.dx-button', '.dx-dropdowneditor-button'],
    // overlays: the painted boxes live under the overlay wrapper, not under the source element
    toast: ['.dx-toast-wrapper', '.dx-toast-stack'],
    tooltip: ['.dx-tooltip-wrapper'],
    popover: ['.dx-popover-wrapper'],
    'load-panel': ['.dx-loadpanel-content'],
    'action-sheet': ['.dx-actionsheet-popup-wrapper', '.dx-actionsheet-popover-wrapper'],
    'context-menu': ['.dx-context-menu'], // the overlay content itself carries the class
    'drop-down-list': ['.dx-dropdownlist-popup-wrapper'],
    'drop-down-menu': ['.dx-dropdownmenu-popup-wrapper'],
    'date-view': ['.dx-dateview-rollers'], // .dx-dateview exists only in JS; rollers is the styled root
    // same shape as date-view: .dx-colorview carries no rule, the container is the styled root and
    // the ancestor of every box the component paints (palette, scales, previews, controls)
    'color-view': ['.dx-colorview-container'],
    /*
     * Wave H satellites. dx-pager and dx-pagination are MUTUALLY EXCLUSIVE
     * (pagination/content.tsx, getClasses): the standalone widget gets dx-pagination, a grid's
     * pager runs in grid-compatibility mode and gets dx-pager instead — declaring on one leaves
     * the tier empty in the other, which is what emptied every grid pager in CI.
     */
    pagination: ['.dx-pagination', '.dx-pager'],
    /*
     * The header item travels: dragging it puts a COPY inside .dx-sortable-dragging in the viewport
     * (m_draggable/_createDragElement), and `.dx-sortable-dragging > .dx-cardview-header-item` paints
     * that copy. The item is the only element reading the tier there, so it carries its own scope.
     */
    /*
     * A tree item travels: applications wrap the widget in a dxSortable with
     * `filter: '.dx-treeview-item'` (the shipped TreeView drag-and-drop demos do), and the clone is
     * built in the viewport. The clone container is the scope — declaring on .dx-treeview-item would
     * repeat 33 properties on every node of every tree.
     */
    'tree-view': ['.dx-treeview', '.dx-sortable-dragging'],
    'card-view': ['.dx-cardview', '.dx-cardview-header-item',
      /*
       * The drop indicator of the header panel is a dxSortable placeholder: JS builds it in the
       * VIEWPORT and puts the cardView class on it, so `.dx-cardview-header-item-sort-indicator`
       * paints an element no widget root contains. Legacy paints it with literals and before the
       * tier it read `--dxds-*` from `:root` — both always resolved; the tier names did not, and
       * the 4px indicator disappeared from six screenshots.
       */
      '.dx-cardview-header-item-sort-indicator',
      // the column chooser is a popup: base paints its empty message and select-all item with
      // cardView's parameters
      '.dx-cardview-column-chooser-list', '.dx-cardview-column-chooser-plain'],
    // the delete-message confirmation popup lives outside .dx-chat
    chat: ['.dx-chat', '.dx-messagelist-context-menu-content', '.dx-chat-confirmation-popup-wrapper'],
    // the add-image dialog is a popup (and it renders a fileUploader of its own)
    'html-editor': ['.dx-htmleditor', '.dx-aidialog', '.dx-htmleditor-add-image-popup'],
    // the field and operation drop-downs are overlays
    'filter-builder': ['.dx-filterbuilder', '.dx-filterbuilder-overlay', '.dx-filterbuilder-operations'],
    // the list's context menu is overlay content
    list: ['.dx-list', '.dx-list-context-menucontent'],
    /*
     * .dx-pivotgrid-fields-container holds the clone while a field is dragged (in the field
     * chooser and in the field panel). It is created outside both roots, and in CI the dragged
     * field lost its background, border and shadow.
     */
    'pivot-grid': ['.dx-pivotgrid', '.dx-pivotgridfieldchooser', '.dx-pivotgrid-fields-container'],
    // dialogs, the context menu and the view switcher are popups
    'file-manager': ['.dx-filemanager', '.dx-filemanager-dialog-popup', '.dx-filemanager-context-menu',
      '.dx-filemanager-dialog-name-editor-popup', '.dx-filemanager-dialog-delete-item-popup',
      '.dx-filemanager-view-switcher-popup'],
    // the properties panel, the toolbox and the context toolbars are popups and floating panels
    diagram: ['.dx-diagram', '.dx-diagram-properties-popup', '.dx-diagram-toolbox-popup',
      '.dx-diagram-contextmenu', '.dx-diagram-context-toolbox', '.dx-diagram-floating-toolbar-container'],
    // wave H roots that are not `.dx-<component>`: an overlay renders outside its source element,
    // and two components paint a box whose class is not their own
    popup: ['.dx-popup-wrapper'],
    'speed-dial-action': ['.dx-fa-button'], // .dx-speeddialaction exists only in JS
    widget: ['.dx-surface'], // the one variable paints the theme surface itself
    /*
     * Portals (the wave F15 class): both widgets paint boxes the JS renders outside the widget
     * element — the appointment editor and the appointment tooltip for scheduler, the dialogs for
     * fileManager. Each class sits on the overlay WRAPPER, so it is an ancestor of the painted box.
     */
    scheduler: ['.dx-scheduler', '.dx-scheduler-appointment-popup',
      '.dx-scheduler-appointment-tooltip-wrapper',
      // the appointment tooltip and the collector render inside .dx-scheduler-overlay-panel, outside
      // the widget: without it the tooltip lost its marker, its title weight and its paddings
      '.dx-scheduler-overlay-panel'],
    'file-manager': ['.dx-filemanager', '.dx-filemanager-dialog-popup'],
    // the widget root of both exists only in JS; these are the styled roots that contain the boxes
    map: ['.dx-map-container'],
    'recurrence-editor': ['.dx-recurrence-repeat-on', '.dx-recurrence-button-group',
      '.dx-recurrence-numberbox-interval-wrapper', '.dx-recurrence-radiogroup-repeat-type',
      '.dx-recurrence-datebox-until-date', '.dx-recurrence-numberbox-repeat-count'],
    validation: ['.dx-invalid-message', '.dx-validationsummary'],
    overlay: ['.dx-overlay-wrapper'],
    // field widgets with a drop-down part: the field root plus the popup surface
    lookup: ['.dx-lookup', '.dx-lookup-popup-wrapper'],
    'select-box': ['.dx-selectbox', '.dx-selectbox-popup-wrapper'],
    'tag-box': ['.dx-tagbox', '.dx-tagbox-popup-wrapper'],
    'date-box': ['.dx-datebox', '.dx-datebox-wrapper'],
    'color-box': ['.dx-colorbox', '.dx-colorbox-overlay'],
    'drop-down-button': ['.dx-dropdownbutton', '.dx-dropdownbutton-popup-wrapper'],
    'drop-down-editor': ['.dx-dropdowneditor', '.dx-dropdowneditor-overlay'],
    /*
     * Chassis. .dx-menu-base sits on dxMenu's root, on every submenu overlay content (Submenu
     * extends ContextMenu, whose content carries the class) and on dxContextMenu's content, so one
     * class scopes the whole family. Known hole for the consumption wave: the decorative
     * .dx-context-menu-container-border / -content-delimiter boxes may sit OUTSIDE .dx-menu-base
     * inside the overlay — prove ancestry before converting those two declarations.
     */
    /*
     * The adaptive mode renders a TreeView inside an overlay whose content carries only
     * .dx-menu-adaptive-mode — no .dx-menu-base (found by the F14 runtime audit after the PR
     * screenshot failures: adaptive item metrics collapsed).
     */
    menu: ['.dx-menu-base', '.dx-menu-adaptive-mode'],
    /*
     * text-editor's shared runtime class covers every REAL editor, but the theme also paints
     * surfaces that reuse editor styling without the class (found by the F12 reachability audit,
     * reported live on htmlEditor): dxHtmlEditor's root carries only .dx-htmleditor while
     * textEditor/_index.scss styles .dx-htmleditor.dx-htmleditor-<stylingMode> with editor vars.
     */
    'text-editor': ['.dx-texteditor', '.dx-htmleditor'],
    /*
     * The grids paint their overlay satellites outside the grid element: the column chooser is a
     * Popup whose WRAPPER carries .dx-datagrid-column-chooser / .dx-treelist-column-chooser.
     */
    grid: ['.dx-datagrid', '.dx-treelist', '.dx-pivotgrid', '.dx-cardview',
      '.dx-datagrid-column-chooser', '.dx-treelist-column-chooser',
      // the header-filter popup wrapper is shared by all grids and lives outside them (F14)
      '.dx-header-filter-menu',
      /*
       * F15, from the second round of PR screenshots. The column drag preview is appended to the
       * SWATCH container (m_columns_resizing_reordering: element().appendTo(getSwatchContainer)),
       * so it is a sibling of the grid, not a descendant — its background, border and header
       * metrics came out unpainted. The AI assistant is a Popup whose wrapper carries
       * .dx-ai-chat .dx-aidialog (grid_core/ai_chat: wrapperAttr), likewise outside the grid.
       */
      '.dx-datagrid-drag-header', '.dx-treelist-drag-header', '.dx-ai-chat'],
    /*
     * The dragged clone is created as $('<div>').appendTo(container) — the container defaults to
     * the viewport — and the placeholder is inserted next to it, so both live outside .dx-sortable
     * (F15: the row drag preview lost its shadow). .dx-sortable-dragging rides the drag element in
     * both clone and no-clone modes, which is what `.dx-sortable-dragging > *` needs.
     */
    sortable: ['.dx-sortable', '.dx-sortable-dragging', '.dx-sortable-placeholder'],
    /*
     * Canonical fieldset markup is .dx-fieldset > .dx-field, but demos and apps also use
     * .dx-field standalone — the tier rides the field itself so both layouts resolve.
     */
    fieldset: ['.dx-fieldset', '.dx-field'],
    /*
     * Toolbar paints outside its own element (found by the wave-F5 reachability audit and its
     * browser smoke): .dx-toolbar-menu-section lives in the overflow-menu POPUP — desktop renders
     * it under .dx-dropdownmenu-popup-wrapper (verified live: the wrapper carries no toolbar
     * class), .dx-toolbar-menu-container is the other, mobile overflow surface the bundle styles;
     * .dx-toolbar-background is a styled legacy hook no code in this repo attaches (external
     * products may), so it carries the tier itself.
     */
    toolbar: ['.dx-toolbar', '.dx-dropdownmenu-popup-wrapper', '.dx-toolbar-menu-container',
      '.dx-toolbar-background'],
    // .dx-box exists only in JS; the only styled box is the item content
    box: ['.dx-box-item-content'],
    'splitter-bar': ['.dx-splitter-bar', '.dx-splitter-border'], // two disjoint styled roots
    // global utility painted on arbitrary elements (.dx-icon plus per-widget image boxes):
    // :root, the same place Blazor keeps its 24 cross-component names
    icon: [':root'],
    // the type scale is cross-component (chat, stepper and toolbar read it), so it lives on
    // :root like icon — the surface class .dx-theme-fluent-next-typography is opt-in and would
    // leave the borrowers outside the values they read
    typography: [':root'],
  },

  // System-tier concerns (common/). Each must map to a non-component token family.
  systemConcerns: [
    // Foundation values shared by the whole theme: icon size, base font size, border radius/width.
    // Named `global` after the package's own family (--dxds-global-border-radius-default,
    // --dxds-global-color-focus, --dxds-global-spacing-item-gap-*). The obvious alternatives —
    // `typography`, `icon`, `widget` — all collide with a component name.
    'global',
    /*
     * `palette` is the ONE concern whose names carry no part and no state, because the value is
     * deliberately role-free. `common/_index.scss` exposes a complete 4x3 matrix of utility classes
     * — accent / text / bg / border-color, each applied as `color`, as `background-color` + `fill`,
     * and as `border-color` (.dx-theme-accent-as-border-color and friends). Giving such a value a
     * part would make the name lie in two roles out of three, and giving each role its own value
     * would break the contract those classes advertise: "this exact colour, used as X".
     * Values that turned out to have a single real role are NOT here — they became role-honest
     * names instead (typography colour -> $global-content-rest, the badge colours -> the badge
     * concerns below).
     */
    'palette',
    // Cross-cutting decorations several widgets draw but none of them owns — same class of thing as
    // `focus-rect`: the invalid/valid validation badges, drawn by a mixin in common/ and used by the
    // editor family plus fieldset.
    'invalid-badge',
    'valid-badge',
    'focus-rect', // ds.$focus-rect-color-*
    'shadow', // ds.$color-shadow-* / ds.$box-shadow-*
    'typography', // ds.$font-* / ds.$line-height-*
    'separator', // ds.$separator-color
    'backdrop', // ds.$color-surface-backdrop-*
    'surface', // ds.$color-surface-neutral-*
    'state', // ds.$opacity-* for disabled/readonly conventions
    'motion',
  ],

  /*
   * Bundle configuration and theme identity: exempt from the component-prefix rule.
   * The first four are named by build/bundle-template.fluent-next.scss, which substitutes $COLOR,
   * $MODE and $SIZE into them (see GOTCHAS.md §5), so their spelling belongs to the build.
   * The $theme-marker-* trio is the theme's own: each holds one segment of the .dx-theme-marker
   * font-family that themes.current() parses at runtime. Only their VALUES reach that string, so
   * the names are free — they carry no component and are named after the thing they compose.
   */
  themeIdentity: [
    '$color', '$mode', '$size', '$accent',
    '$theme-marker-color', '$theme-marker-mode', '$theme-marker-size-postfix',
  ],

  // Folders exempt from the standard, with the reason recorded in NAMING.md.
  /*
   * Wave H (28.08.2026) emptied this list: cardView's BEM names were the last entry, and the
   * rename that removed them touched only this theme's copy — the shared `$cardview-*` parameters
   * of base keep their spelling and stay mirrors, so generic/material/fluent are untouched.
   */
  exemptFolders: {},

  // Segments the package puts in the part slot that are NOT parts: they are variant or state
  // words leaking into it (upstream defects, see DIVERGENCES.md). Excluded from PARTS.
  partExclude: [
    'default', 'selected', 'hidden', 'invalid', 'range', 'pre', 'group', 'none', 'alt',
    'inverted', 'edge', 'center', 'disable', 'static', 'dragged', 'transparent',
  ],

  // Parts the package lacks a clean name for, or that the derivation below cannot recover.
  partsAdd: [
    'outline', // outline-color of a focus ring; the package models it as the focus-rect component
    // The derivation keeps only the last segment of the part slot, so these two collapse to `icon`.
    // Both exist in the package (8 tokens each), e.g. menu-item-color-selected-start-icon-active.
    'start-icon',
    'end-icon',
    /*
     * An opacity that branches on $mode has to live in _colors.scss (the only file with $mode in
     * scope), so `opacity` is a part as well as a size slot — resolved by file, like `content`.
     */
    'opacity',
    // Shadow *colors*: the package keeps them in the semantic tier (color-shadow-ambient / -key)
    // and its component tokens spell them box-shadow-layer-N-color, which has no part slot at all.
    'shadow',
    // A drop shadow is two paint slots, not one: the ambient layer and the key layer carry different
    // colours (ds.$color-shadow-ambient / -key). `rejected.parts` already redirected the legacy
    // color1/color2 spelling here.
    'shadow-ambient',
    'shadow-key',
  ],

  // A button inside another widget is a nested component (anatomy rule 3), not a part.
  partsRemove: ['button'],

  /*
   * `rest` is not a word here: the design-tokens vocabulary spells the resting value with no
   * suffix at all (`$color-bg` next to `$color-bg-hovered`), and the theme follows it. `focused`
   * and `read-only` have no token counterpart — they are DOM states the token tier never models.
   */
  states: [
    'hovered', 'active', 'focused',
    'selected', 'selected-hovered', 'selected-active', 'selected-focused',
    'selected-disabled', // cardView: the applied header filter inside a disabled column item
    'disabled', 'read-only',
  ],

  modifiers: {
    // data-driven mode
    value: [
      'checked', 'unchecked', 'indeterminate', 'invalid', 'opened', 'expanded', 'collapsed',
      'empty', 'current', 'allday', 'recurrent', 'rtl', 'pending', 'modified', 'removed', 'alternation',
      // The DOM condition .dx-texteditor-with-label / .dx-texteditor-with-floating-label: an inner
      // label changes the input padding. It spans two labelMode values (static and floating), so no
      // single option value names it — the DOM class is the discoverable spelling.
      'with-label',
      // .dx-menu-item-has-icon: a menu item that reserves room for an icon
      'with-icon',
      // .dx-popup-title present: the content box loses the padding the title already provides
      'with-title',
      // Switch.value rendered as .dx-switch-on-value / -off-value, and the two label boxes inside
      'on', 'off',
      // RadioGroup.layout / Tabs.orientation and friends
      'horizontal', 'vertical',
      // .dx-device-phone: the phone-sized variant of a roller or item
      'phone',
      // Pagination.displayMode: 'compact' is what renders .dx-light-mode
      'compact',
      // Scheduler appointment variants: the short-layout flag and the duration steps behind
      // .dx-scheduler-appointment-has-resource / the 10..25-minute layouts
      'small', 'dragging', 'inverted', 'first-month', 'first-of-month', 'other-month',
      // calendar cell states drawn as classes, and the two htmlEditor overlay variants
      'contoured', 'faded', 'noimage', 'highlighted', 'dragged', 'legacy',
      // `.dx-calendar-other-view` — a cell belonging to the neighbouring month
      'other',
      // the two step appearances Stepper draws, and the two treeView border variants
      'base', 'accent', 'with-border', 'border-visible',
      // .dx-list-slide-menu-button-delete vs -menu
      'delete', 'menu',
      // Chat's secondary cancel button, pivotGrid's sorted field, and the two/three-group cells
      'secondary', 'sorted', 'two', 'three',
      // `:first-child` — a DOM position, used where the first cell or page needs its own metric
      'first-child', 'first',
      // `.dx-position-indicator-last` — the drop indicator after the last field
      'last',
      // the middle dot of Chat's typing indicator, which is larger than the outer two
      'center',
      // `.dx-filemanager-progress-box-without-close-button`, and the drawer panel's initial width
      'without-close-button', 'initial',
      // Chat's message-group alignment, FileUploader.showFileList and its cancel-button position,
      // and Form's labelLocation
      'alignment-start', 'alignment-end', 'show-file-list', 'position-end', 'position-start',
      'location-left', 'location-right',
      '10min', '15min', '20min', '25min', 'adaptive', 'transparent',
      // More DOM/device conditions that change geometry, same class as with-label:
      'touch-friendly', // .dx-device-touch-friendly
      'adaptive', // adaptive layout of date/color pickers
      'with-clear', // the editor also shows a clear button
    ],
    // `type` option. Both `danger` (Button.type) and `error` (Toast.type) are here because the
    // rule is "the value the API uses", and the two widgets spell the same intent differently.
    intent: ['normal', 'default', 'danger', 'error', 'success', 'warning', 'info'],
    // `stylingMode` / `labelMode` / `mode` options
    appearance: [
      'contained', 'outlined', 'text', 'filled', 'underlined', 'floating', 'static',
      'hidden', // .dx-…-border-hidden: the collapsed-border variant of a grid
      'with-icons', // command column that also shows icons
      'outside', // labelMode: 'outside'
      'basic', 'primary', 'secondary', // Tabs.stylingMode
      'thin', // the always-visible thin scrollbar variant base draws for showScrollbar
      // TabPanel.tabsPosition: which side the strip sits on decides which border faces the content.
      // The option value is used rather than a logical axis, because the side is a variant here, not
      // a property — and `left` under RTL is still the `left` value of the option.
      'top', 'bottom', 'left', 'right',
    ],
  },

  /*
   * Allowed slots in _sizes.scss: real CSS properties plus four abstract nouns (`size` = a square
   * width+height, `gap`, `offset`, `spacing`).
   *
   * This is a curated list, not the whole CSS spec, on purpose: `known-css-properties` is only a
   * transitive dependency of stylelint here, and adding it as a direct one would touch the shared
   * lockfile for a validation nicety. The list grows one entry at a time as components migrate, and
   * every addition is a reviewed diff — which is also what keeps physical axes out (`margin-left`
   * is a real CSS property but is deliberately absent, see the logical-axes rule in NAMING.md).
   */
  sizeSlots: [
    'size', 'gap', 'offset', 'spacing',
    /*
     * A one-dimensional decoration has a length and a thickness that map to width or height
     * depending on orientation — Tabs' selection indicator is set as `width` when the strip is
     * horizontal and as `height` when it is vertical, so a physical slot would lie in half the cases.
     * `min-size` is the square minimum of an element sized by min-width AND min-height together.
     */
    'length', 'thickness', 'min-size',
    // Chat lays its message rows out on a grid, and the theme owns the column template
    'grid-template-columns',
    'transition-duration', // the stepper animates its step marker; the theme owns the duration
    'padding', 'padding-inline', 'padding-block',
    'padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end',
    'margin', 'margin-inline', 'margin-block',
    'margin-inline-start', 'margin-inline-end', 'margin-block-start', 'margin-block-end',
    'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
    'border', 'border-width', 'border-radius', 'border-style',
    'border-block-start', 'border-block-end',
    'border-inline-start', 'border-inline-end',
    'border-start-start-radius', 'border-start-end-radius',
    'border-end-start-radius', 'border-end-end-radius',
    'border-block-start-width', 'border-block-end-width',
    'inset-block-start', 'inset-block-end', 'inset-inline-start', 'inset-inline-end',
    'inset-inline', 'inset-block',
    // the blur length of a box-shadow, when a theme needs it apart from the composite
    'box-shadow-blur',
    'border-inline-start-width', 'border-inline-end-width',
    'font-size', 'font-weight', 'font-family', 'line-height', 'letter-spacing',
    'text-transform', 'text-decoration',
    'opacity', 'box-shadow', 'outline', 'outline-offset', 'outline-width',
    'column-gap', 'row-gap', 'z-index', 'transition', 'transform', 'inset',
  ],

  /*
   * Physical spellings that are only rejected in the SLOT position, i.e. as the last segment. The same
   * words are legal variants earlier in a name (`$tabs-tab-top-border` is TabPanel's tabsPosition,
   * `$slider-label-bottom-padding-block-end` is the label position), so a global replacement would
   * corrupt them.
   */
  rejectedTrailing: {
    // the box-model longhands have to be listed too: without them the bare `top` below matches
    // `margin-top` and turns it into `margin-inset-block-start`
    'margin-top': 'margin-block-start',
    'margin-bottom': 'margin-block-end',
    'margin-left': 'margin-inline-start',
    'margin-right': 'margin-inline-end',
    'padding-top': 'padding-block-start',
    'padding-bottom': 'padding-block-end',
    'padding-left': 'padding-inline-start',
    'padding-right': 'padding-inline-end',
    top: 'inset-block-start',
    bottom: 'inset-block-end',
    left: 'inset-inline-start',
    right: 'inset-inline-end',
    'border-top': 'border-block-start',
    'border-bottom': 'border-block-end',
    'border-left': 'border-inline-start',
    'border-right': 'border-inline-end',
    'border-top-width': 'border-block-start-width',
    'border-bottom-width': 'border-block-end-width',
    'border-left-width': 'border-inline-start-width',
    'border-right-width': 'border-inline-end-width',
    'border-top-left-radius': 'border-start-start-radius',
    'border-top-right-radius': 'border-start-end-radius',
    'border-bottom-left-radius': 'border-end-start-radius',
    'border-bottom-right-radius': 'border-end-end-radius',
  },

  /*
   * Segments that name nothing and are simply dropped. `root` and `element` mean "the widget's own
   * box", which the grammar expresses by having no sub-element at all; `state` is the `.dx-state-*`
   * class whose meaning the state suffix already carries; `common` and `renovation` are grouping and
   * implementation words with no DOM counterpart (base's `$datagrid-common-*` family is the same
   * thing).
   */
  droppedSegments: ['root', 'state', 'common', 'renovation'],

  /*
   * Squashed compounds, applied before anything else: the legacy names spell nested widgets and
   * multi-word boxes without hyphens (`treeview-item`, `contextmenu`, `numberbox`), and every one of
   * them has a canonical hyphenated form the registry already knows. Normalising here keeps the
   * registry free of the non-canonical spellings.
   */
  rejectedSpellings: {
    treeview: 'tree-view',
    contextmenu: 'context-menu',
    fileuploader: 'file-uploader',
    filemanager: 'file-manager',
    numberbox: 'number-box',
    textbox: 'text-box',
    datebox: 'date-box',
    checkbox: 'checkbox',
    viewmode: 'view-mode',
    messagelist: 'message-list',
    messagebox: 'message-box',
    messagegroup: 'message-group',
    typingindicator: 'typing-indicator',
    filename: 'file-name',
    falename: 'file-name',
    boxshadow: 'box-shadow',
    dropzone: 'drop-zone',
    pagesizes: 'page-sizes',
    pageindex: 'page-index',
    grouppanel: 'group-panel',
    alldaypanel: 'all-day-panel',
    colorview: 'color-view',
    colorbox: 'color-box',
    radiogroup: 'radio-group',
    radiobutton: 'radio-button',
    tabpanel: 'tab-panel',
    loadindicator: 'load-indicator',
    scrollview: 'scroll-view',
    searchbox: 'search-box',
    holdmenu: 'hold-menu',
    menucontent: 'menu-content',
    aidialog: 'ai-dialog',
    progressbar: 'progress-bar',
    progressbox: 'progress-box',
    // squashed in the legacy pivotGrid names; the trailing `color` then resolves like any other
    totalcolor: 'total-color',
    grandtotalcolor: 'grand-total-color',
    pivotgridfieldchooser: 'field-chooser',
    htmleditor: 'html-editor',
    speeddialaction: 'speed-dial-action',
    buttongroup: 'button-group',
    dropdownbutton: 'drop-down-button',
    dropdownmenu: 'drop-down-menu',
    tooltipbutton: 'tooltip-button',
  },

  // old spelling -> canonical. Drives the codemod and the failure messages of the enforcer.
  rejected: {
    parts: {
      background: 'bg',
      'background-color': 'bg',
      bgcolor: 'bg',
      fill: 'bg',
      'fill-color': 'bg',
      'border-color': 'border',
      bordercolor: 'border',
      'text-color': 'content',
      foreground: 'content',
      fg: 'content',
      'icon-color': 'icon',
      'glyph-color': 'icon',
      'shadow-color': 'shadow',
      color1: 'shadow-ambient',
      color2: 'shadow-key',
      // the same two layers, spelled out in pivotGrid and gridBase
      'first-shadow-color': 'shadow-ambient',
      'second-shadow-color': 'shadow-key',
      'shader-bg': 'backdrop',
      scrim: 'backdrop',
      'divider-color': 'separator',
      'handle-bg': 'trigger',
      'left-icon': 'start-icon',
      'right-icon': 'end-icon',
    },
    // A variant word the CSS class spells with a `mode-` prefix; the option value is the canonical one.
    modifiers: {
      'mode-contained': 'contained',
      'mode-outlined': 'outlined',
      'mode-text': 'text',
    },
    states: {
      hover: 'hovered',
      focus: 'focused',
      pressed: 'active',
      activated: 'active',
      readonly: 'read-only',
      idle: 'rest',
      'selected-hover': 'selected-hovered',
    },
    properties: {
      'horizontal-padding': 'padding-inline',
      'side-padding': 'padding-inline',
      'padding-horizontal': 'padding-inline',
      'vertical-padding': 'padding-block',
      'padding-vertical': 'padding-block',
      'padding-start': 'padding-inline-start',
      'padding-end': 'padding-inline-end',
      'padding-left': 'padding-inline-start',
      'padding-right': 'padding-inline-end',
      'padding-top': 'padding-block-start',
      'padding-bottom': 'padding-block-end',
      'horizontal-margin': 'margin-inline',
      'vertical-margin': 'margin-block',
      'margin-left': 'margin-inline-start',
      'margin-right': 'margin-inline-end',
      'margin-top': 'margin-block-start',
      'margin-bottom': 'margin-block-end',
      paddings: 'padding',
      margins: 'margin',
      radius: 'border-radius',
      rounding: 'border-radius',
      'border-size': 'border-width',
      'min-heigth': 'min-height', // upstream typo
      'text-size': 'font-size',
      'text-weight': 'font-weight',
      shadow: 'box-shadow',
      dimension: 'size',
    },
  },

  // Components whose variables already follow the standard. Only these are checked strictly;
  // everything else is compared against the known-violations snapshot. Grows one batch at a time.
  migrated: [
    'toast', 'button', 'text-editor',
    'text-box', 'text-area', 'number-box', 'date-box', 'date-range-box', 'select-box',
    'lookup', 'tag-box', 'color-box', 'drop-down-editor', 'drop-down-list',
    'grid', 'data-grid', 'tree-list',
    // waves C11-C12, the finished tails
    'switch', 'date-view', 'gallery',
    'typography', 'toolbar', 'overlay', 'informer', 'scroll-view', 'context-menu', 'fieldset',
    'menu', 'progress-bar', 'load-indicator', 'drop-down-menu',
    // wave C9, the small folders
    'accordion', 'action-sheet', 'box', 'button-group', 'load-panel', 'tile-view', 'validation',
    'tooltip', 'radio-button', 'scrollable', 'drop-down-button', 'badge', 'card', 'icon', 'popover',
    'splitter', 'splitter-bar', 'sortable', 'tab-panel',
    // wave H (28.08.2026): the components the tier never reached — see RENAME_PROGRESS.md
    'color-view', 'calendar', 'check-box', 'drawer', 'filter-builder', 'form', 'html-editor',
    'list', 'popup', 'radio-group', 'speed-dial-action', 'time-view', 'tree-view', 'widget',
    'scheduler', 'file-manager', 'tabs',
    'chat', 'diagram', 'gantt', 'slider', 'stepper', 'pivot-grid', 'pagination', 'file-uploader',
    'map', 'recurrence-editor', 'card-view',
  ],

  /*
   * DOM anatomy per component, filled at the moment the component migrates (reviewed diff).
   */
  // Names must not collide with a state; colliding with a part is fine (see assertParseable).
  subElements: {
    // wave H: cardView anatomy, read off the base selectors when the folder migrated
    'card-view': [
      'card', 'cover', 'content', 'cell', 'field-value', 'field', 'header', 'selection-checkbox',
      'column-chooser', 'select-all-item', 'message', 'filter-panel', 'header-panel', 'dropzone',
      'item', 'header-filter', 'sort-index', 'sort-indicator', 'header-item', 'nodata-view',
      'icon-container', 'cards', 'divider', 'allowance', 'prohibition', 'link', 'icon', 'caption',
      'text',
    ],
    map: ['marker-tooltip'], // wave H
    toast: ['content', 'icon', 'item', 'stack'],
    // .dx-icon and .dx-button-text are real boxes inside a button; `icon` is also a part, which
    // is allowed — the grammar resolves it by position (see assertParseable).
    button: ['icon', 'text', 'content'],
    'text-box': ['search', 'search-bar', 'icon'],
    // Wave C9: the small folders. Every word below is a DOM box of that widget (.dx-accordion-item-title,
    // .dx-actionsheet-item, .dx-tile, .dx-radio-value-container, …), not a re-spelling of a part.
    accordion: ['title', 'body', 'item', 'icon'],
    'action-sheet': ['item'],
    box: ['item', 'content'],
    'button-group': ['item'],
    'load-panel': ['content'],
    'tile-view': ['tile', 'wrapper'],
    validation: ['message', 'summary', 'summary-item', 'overlay', 'content'],
    tooltip: ['overlay', 'content', 'popup', 'arrow'],
    popover: ['popup', 'title'],
    splitter: ['resize-handle', 'icon'],
    'splitter-bar': ['icon'],
    sortable: ['clone', 'source', 'placeholder', 'placeholder-inside'],
    'tab-panel': ['tabs'],
    icon: ['pulldown'],
    'radio-button': ['icon', 'dot', 'value-container'],
    scrollable: ['scroll', 'scrollbar'],
    'drop-down-button': ['action', 'toggle', 'spindown-icon', 'icon', 'item'],
    /*
     * Wave C10. Every word is a DOM box of that widget, read off its selectors — `.dx-checkbox-icon`,
     * `.dx-list-item-ghost-…`, `.dx-pager .dx-page`, `.dx-toolbar-label`, `.dx-treeview-node`, and so
     * on. Compounds (`group-header`, `nav-button`, `pull-down`) are one anatomy level, not two.
     */
    'check-box': ['icon', 'mark', 'arrow', 'arrow-icon', 'container'],
    // wave B7: .dx-switch-on and .dx-switch-off are the two labels the track slides between
    switch: ['handle', 'container', 'inner', 'label'],
    /*
     * `menu-items-container` sits next to `items-container` on purpose: base/_contextMenu.scss draws
     * `.dx-context-menu .dx-menu-items-container` with its own parameter, and contextMenu/_index.scss
     * draws the SAME element again with its own value, which wins on order. Two variables for one
     * padding, with different values — see DIVERGENCES.md.
     */
    'context-menu': ['item', 'items-container', 'menu-items-container', 'separator', 'content',
      'text'],
    'drop-down-menu': ['section', 'list', 'popup', 'content'],
    'date-view': ['roller', 'item', 'year', 'month', 'hours-colon'],
    'time-view': ['clock', 'digits', 'field', 'number-box', 'input', 'time-separator', 'spin',
      'format12',
      // wave B8: the hour and minute hands are boxes the clock positions on the dial
      'arrow'],
    fieldset: ['field', 'label', 'value', 'header', 'attention-icon', 'radio-group'],
    'radio-group': ['radio-button', 'collection', 'value-container'],
    'progress-bar': ['status', 'range', 'container', 'label'],
    menu: ['item', 'icon', 'text', 'separator', 'popup', 'tree-view', 'node', 'content', 'link'],
    slider: [
      // wave H: anatomy the folder needed to enter `migrated`
      'element', 'handle','bar', 'handle', 'inner', 'track', 'tooltip', 'label', 'wrapper'],
    gallery: ['indicator', 'indicator-item', 'nav-button', 'nav-arrow', 'nav-icon', 'item',
      'button'],
    list: [
      'item', 'group', 'group-header', 'header-indicator', 'hold-menu', 'ghost', 'menu-button',
      'next-button', 'delete-button', 'select-all', 'select-all-separator', 'search-box', 'message',
      'badge-container', 'slide-menu', 'slide-menu-button', 'context-menu', 'context-menu-content',
      'items', 'toggle-delete', 'response-wait', 'separator',
    ],
    toolbar: ['item', 'label', 'separator', 'section', 'menu', 'group', 'button', 'text',
      'text-editor'],
    // `indicator` is the selection strip: a pseudo-element, so it has anatomy but no class
    tabs: ['tab', 'item', 'icon', 'nav-button', 'content', 'badge', 'indicator'],
    'tree-view': [
      'item', 'item-element', 'node', 'checkbox', 'checkbox-container', 'container', 'toggle-item',
      'select-all-item', 'search-box', 'search-editor', 'load-indicator', 'spin', 'border',
      'control',
    ],
    popup: ['title', 'content', 'toolbar', 'toolbar-item', 'toolbar-label', 'dialog', 'message',
      'button'],
    pagination: ['page', 'page-size', 'page-index', 'pages-count', 'page-sizes', 'separator', 'nav-button',
      'navigate-button', 'nav', 'icon'],
    'scroll-view': ['pocket', 'pull-down', 'scroll-bottom', 'indicator', 'image', 'text', 'icon',
      'load-indicator'],
    // .dx-fa-button / .dx-fa-button-label are the real class names of the floating action button
    'speed-dial-action': ['main', 'button', 'label', 'fa-button', 'fa-button-label'],
    /*
     * Wave C16, the remaining composite widgets. Same rule as everywhere above: a word goes in only
     * if it is a DOM box of that widget. Words that turned out to be variants live in MODIFIERS, and
     * names carrying a physical `-left`/`-right` are left for the manual tail of each folder.
     */
    calendar: ['cell', 'header', 'week-day-header', 'week-number', 'week-number-cell', 'navigator',
      'footer-button', 'view', 'element'],
    chat: [
      // wave H: anatomy the folder needed to enter `migrated`
      'alert', 'alerts', 'button', 'confirmation-popup-content', 'confirmation-popup-toolbar',
      'content', 'edited', 'section', 'size', 'start', 'view-items',
      'message-list', 'message-box', 'message', 'day-header', 'empty-view', 'avatar', 'bubble',
      'file', 'file-name', 'file-container', 'files-container', 'suggestions', 'editing-preview',
      'caption', 'delete-button', 'cancel-button', 'context-menu', 'icon', 'box', 'container',
      'alert-list', 'prompt', 'textarea', 'toolbar', 'information', 'author-name', 'timestamp',
      'typing-indicator', 'circle', 'bubble', 'group',
      // wave B3: .dx-chat-messagebubble-image is a real <img> box inside a bubble
      'image'],
    'color-view': ['palette', 'palette-cell', 'hue-scale', 'hue-scale-cell', 'hue-scale-wrapper', 'alpha', 'controls',
      'container', 'label', 'handle', 'color-preview', 'preview', 'textbox', 'hex', 'overlay',
      'content-box', 'bg-box'],
    diagram: [
      // wave H: anatomy the folder needed to enter `migrated`
      'accordion-v', 'close-icon', 'closebutton', 'colorbutton', 'connection', 'connector', 'container', 'editor', 'editor-button', 'geometry-mark', 'h', 'input', 'input-button', 'input-image', 'items', 'large-editor', 'medium-editor', 'mobile', 'muted', 'properties-layout-icon', 'selection', 'separator', 'touchbar-item','toolbar', 'toolbar-icon', 'toolbar-wrapper', 'title-toolbar', 'toolbox',
      'context-toolbox', 'target', 'properties-panel', 'canvas', 'format', 'item', 'text', 'icon',
      'image-icon', 'button', 'popup', 'title', 'content', 'load-indicator', 'loading-indicator',
      'palette', 'color-view', 'hue-scale-cell', 'shape', 'selection-mark', 'input-container',
      'accordion-item'],
    'filter-builder': ['group', 'group-content', 'item', 'item-value', 'text', 'icon', 'action-icon',
      'plus', 'plus-icon', 'remove', 'remove-icon', 'field', 'operation', 'operator', 'tree-view',
      'tree-view-item',
      'tree-view-node', 'toggle', 'toggle-item-visibility', 'editor', 'range-separator',
      'scrollable'],
    form: ['field-item', 'field-required', 'field-mark', 'label', 'label-icon', 'group',
      'group-caption', 'group-content', 'help', 'help-text', 'mark', 'layout-manager', 'tabpanel',
      'multiview', 'item', 'content', 'row', 'switch', 'caption-icon', 'custom-caption-icon'],
    /*
     * gantt's own class names are abbreviated upstream and the abbreviations are not documented
     * anywhere: `.dx-gantt-hb` / `-vb` are the two splitters, `.dx-gantt-tm` / `-ti` the time marker
     * and time indicator, `.dx-gantt-tPrg` the progress bar. They are registered as they are spelled
     * in the DOM — inventing readable expansions would break the link to the selector.
     */
    gantt: [
      // wave H: anatomy the folder needed to enter `migrated`
      'arrow', 'dependency-successor', 'edit-frame', 'edit-successor-dependency-l', 'header-item',
      'items-container', 'milestone', 'notch', 'selection', 'successor',
      'task', 'task-res', 'task-title', 'task-progress', 'task-wrapper', 'task-edit-wrapper',
      'edit-progress',
      'parent-task', 'collapsable-row', 'splitter-bar', 'toolbar', 'toolbar-wrapper',
      'toolbar-separator', 'title', 'view', 'row', 'si', 'hb', 'vb', 'tm', 'ti'],
    'html-editor': ['toolbar', 'table', 'variable', 'mention', 'resize', 'resize-frame', 'cover',
      'uploader', 'file-uploader', 'input-wrapper', 'wrapper', 'ai-dialog', 'content', 'icon', 'item',
      'highlighted-row', 'code-block', 'placeholder', 'size-editor', 'add-image-dialog', 'separator',
      'tabs', 'selects', 'title'],
    'pivot-grid': ['area', 'area-field', 'fields-area-head', 'fields-area-head-cell', 'field-chooser',
      'field', 'fields', 'expand-icon', 'row', 'column', 'cell', 'last-cell', 'header', 'headers',
      'drag-header', 'total', 'grand-total', 'filter', 'sort', 'icon', 'chevron', 'chevron-icon',
      'container', 'popup', 'content', 'search', 'item', 'text', 'border', 'box', 'toolbar', 'button',
      'position-indicator', 'tree-view', 'tree-view-item', 'tree-view-node', 'tree-view-search',
      'drag', 'checkbox', 'field-chooser-field', 'field-area-box', 'header-filter', 'indicators',
      'data-area'],
    stepper: [
      // wave H: anatomy the folder needed to enter `migrated`
      'content', 'optional-mark','step', 'step-indicator', 'step-label', 'label', 'connector', 'value', 'icon', 'text',
      'item', 'container',
      // wave B3: the two box-shadow rings around the indicator — `ring` is the selection ring,
      // `halo` is the gap the indicator punches in the connector behind it
      'ring', 'halo'],
    'recurrence-editor': ['switch', 'repeat-end', 'item', 'container', 'label', 'until-date-box',
      'count-number-box', 'interval-number-box', 'number-box', 'button-group', 'radio-group'],
    /*
     * Wave C15, scheduler. Every word below is a `.dx-scheduler-*` DOM box (the legacy names were
     * built from those class names), with the compounds kept whole because that is how the class
     * reads: `.dx-scheduler-appointment-tooltip-buttons`, `.dx-scheduler-header-panel-cell`, … The
     * variant words that were mixed into the same position — `small`, the duration steps `10min`…
     * `25min`, `dragging`, `inverted`, `first-month`, `other-month` — are modifiers instead, and the
     * few names carrying a physical `-left`/`-right` are left for the manual tail.
     */
    scheduler: [
      'appointment', 'appointment-content', 'appointment-collector', 'appointment-tooltip',
      'appointment-popup', 'agenda', 'agenda-appointment', 'all-day-panel', 'all-day-table',
      'all-day-title', 'common-collector', 'cell', 'table-cell', 'date-table', 'date-table-cell',
      'time-panel', 'time-panel-cell', 'header', 'header-panel', 'header-panel-cell', 'header-day',
      'header-panel-time-cell', 'header-panel-day', 'group-header', 'group-header-table-cell',
      'group-separator', 'navigator', 'navigator-button', 'navigator-icon', 'toolbar', 'toolbar-item',
      'tooltip', 'tooltip-title', 'tooltip-date', 'tooltip-subject', 'tooltip-marker',
      'tooltip-content', 'tooltip-remove', 'workspace', 'workspace-month', 'workspace-info',
      'workspace-date-table-cell', 'workspace-month-cell', 'workspace-month-header',
      'workspace-month-timeline-time', 'timeline', 'timeline-date-table-cell', 'form', 'item',
      'icon', 'icon-container', 'title', 'details', 'short-content', 'subject', 'date', 'marker',
      'remove', 'strip', 'dropdown-button', 'dropdown-appointment', 'days-of-week-buttons',
      'repeat-end-item', 'all-day-item', 'month', 'recurrence', 'recurring', 'date-time-indicator',
      'separator', 'container', 'content', 'button', 'text', 'time', 'day', 'element', 'widget',
      'time-cell', 'cell-date', 'panel', 'body', 'layout', 'column', 'scrollable-content',
      'all-day-appointment', 'sidebar',
      'group', 'last-group-cell', 'views', 'views-empty-cell', 'views-time-panel', 'list',
      'list-item', 'reduced', 'drag-source', 'resizing', 'indicator', 'droppable-cell', 'overlay',
      'dd-appointment', 'start',
      'views-header', 'views-group-header', 'views-time-indicator', 'views-vertical-group',
      'resource-item', 'resource-value', 'virtual-row', 'empty-cell',
    ],
    /*
     * Wave C14, the file widgets. Compounds are one anatomy level: `progress-box` is
     * `.dx-filemanager-progress-box`, `thumbnails-item` is `.dx-filemanager-thumbnails-item` — the DOM
     * class of each is exactly the compound.
     */
    'file-manager': [
      // wave H: anatomy the 06.08 untangling gave base parameters, but the vocabulary never got
      'thumbnail', 'box', 'path-separator', 'dialog', 'dialog-name-editor',
      'i-cancel', 'text-item', 'drop-zone-placeholder', 'progress-bold', 'close', 'context-menu',
      'file-uploader',
      'toolbar', 'toolbar-separator', 'toolbar-separator-item', 'toolbar-viewmode', 'file-toolbar',
      'breadcrumbs', 'breadcrumbs-item', 'dirs-panel', 'dirs-tree-item', 'drawer-panel',
      'file-item', 'file-item-select', 'file-actions-button', 'details-view', 'checkbox-column',
      'thumbnails', 'thumbnails-item', 'thumbnails-view-port', 'custom-thumbnail', 'spacer',
      'progress-panel', 'progress-box', 'progress-title', 'progress-bar', 'close-button',
      'large-icon', 'view-mode-button', 'tree-view-item', 'drop-zone-placeholder',
      // wave B5: .dx-splitter-wrapper is a splitter box the file manager positions itself
      'splitter-wrapper',
      'cancel-button', 'notification', 'container', 'separator', 'content', 'item', 'menu-item',
      'popup', 'overlay', 'editor', 'button', 'icon', 'text', 'title', 'image', 'placeholder',
      'drop-zone',
    ],
    'file-uploader': [
      // wave H: anatomy the folder needed to enter `migrated`
      'line',
      'file', 'file-name', 'file-size', 'file-status-message', 'file-container', 'file-icon',
      'button', 'upload-button', 'cancel-button', 'progress-bar', 'status', 'message', 'label',
      'text', 'files-container', 'wrapper',
    ],
    /*
     * Wave C11 — the folder tails. `heading-N` and `xs…xl` are the steps of the type scale, an
     * enumerated entity, which the standard allows to carry an ordinal (NAMING.md, numeric segments);
     * the token package spells them the same way (font-size-heading-1, font-size-base-xs).
     */
    typography: ['heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6',
      'xs', 's', 'm', 'l', 'xl', 'link'],
    overlay: ['content'],
    informer: ['icon'],
    // `stop-N` are the three colours of one decorative gradient — again an enumerated entity.
    'load-indicator': ['segment', 'inner', 'sparkle', 'stop-1', 'stop-2', 'stop-3'],
    'text-area': ['content'],
    'number-box': ['spin', 'container', 'icon'],
    'date-box': [
      'overlay', 'item', 'popup', 'content', 'title', 'container', 'cell', 'button',
      'apply-button', 'input',
    ],
    'date-range-box': ['active-bar', 'custom-button', 'input'],
    'select-box': ['list'],
    lookup: ['field', 'search', 'arrow', 'popup', 'content'],
    'tag-box': ['tag', 'content', 'container', 'remove-button', 'select-all', 'list'],
    'color-box': ['preview', 'overlay', 'content', 'input', 'container', 'toolbar-item', 'icon'],
    'drop-down-editor': ['button', 'invalid-badge', 'list', 'icon'],
    grid: [
      'row', 'cell', 'header', 'group-row', 'master-detail', 'column-chooser', 'item', 'message',
      'ai-chat', 'drag-header', 'filter-row', 'filter-panel', 'summary', 'column-separator',
      'no-data', 'link', 'editor', 'search', 'chevron', 'icon', 'text-stub', 'selection',
      'draggable-column', 'header-filter', 'drop-highlight', 'text-link', 'icon-link',
      'checkbox', 'menu-item', 'context-menu', 'header-panel', 'group-panel', 'command', 'edit', 'edit-column',
      'select-column', 'icon-container', 'filter-operation',
      'adaptive-column', 'tree-view', 'node', 'select-all', 'sort-index', 'error-message', 'popup',
      'overlay', 'revert-button', 'validation', 'input', 'progress-bar', 'prompt-editor', 'after',
      'lines', 'title', 'ai', 'operation', 'list', 'button', 'content', 'text', 'header-row',
    ],
    // dataGrid's own deltas on top of the chassis: the group panel and the edit-form buttons.
    // `group-panel-item` and `block-separator` are compounds — one anatomy level each, not two.
    'data-grid': [
      'group-panel', 'group-panel-item', 'block-separator', 'sort', 'group-row', 'sticky-column',
      'cell', 'form-buttons', 'error-message', 'filter-panel',
    ],
    'tree-list': [
      'chevron', 'icon', 'expand', 'node', 'empty-space', 'sticky-column', 'cell', 'form-buttons',
      'error-message',
    ],
    'text-editor': [
      'input', 'label', 'line', 'button', 'clear-button', 'spin-button', 'custom-button',
      'icon-container', 'invalid-badge',
    ],
  },
};

// ---------------------------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------------------------

const kebab = (folder) => folder.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const listFolders = (dir) => readdirSync(dir)
  .filter((entry) => statSync(join(dir, entry)).isDirectory())
  .sort();

const sortedUnique = (values) => [...new Set(values)].sort();

const stripState = (name, states) => {
  // longest match first, so `selected-hovered` wins over `selected`
  const ordered = [...states].sort((a, b) => b.length - a.length);
  for (const state of ordered) {
    if (name.endsWith(`-${state}`)) return { base: name.slice(0, -state.length - 1), state };
  }
  return { base: name, state: null };
};

const deriveFromTokens = (states) => {
  const { tokens } = JSON.parse(readFileSync(flatTokens, 'utf8'));
  const names = Object.keys(tokens)
    .filter((key) => key.startsWith(`${COMPONENT_TOKEN_SOURCE}:`))
    .map((key) => key.slice(key.indexOf(':') + 1).replace(/\//g, '-'));

  const parts = new Set();
  const packageElementPaths = new Set();

  names.forEach((name) => {
    const { base } = stripState(name, states);
    const marker = base.indexOf('-color-');
    if (marker === -1) return;
    const elementPath = base.slice(0, marker);
    const tail = base.slice(marker + '-color-'.length);
    packageElementPaths.add(elementPath);
    if (tail) parts.add(tail.split('-').pop());
  });

  return {
    tokenCount: names.length,
    parts: [...parts],
    packageElementPaths: [...packageElementPaths].sort(),
  };
};

/*
 * The grammar is positional, so the vocabularies do NOT all have to be disjoint:
 *
 *   $<component>(-<sub-element>)*(-<modifier>)*-<slot>(-<state>)
 *
 * Parsing is right-to-left with longest-match: the trailing state, then the slot, then the middle.
 * That resolves the overlaps that do exist on purpose — `text` is both a part (text color) and an
 * appearance modifier (stylingMode: 'text'), and `separator`/`backdrop`/`shadow` are both parts and
 * system concerns:
 *
 *   $button-text-bg-rest   -> modifier `text`  + slot `bg`      (slot is the position before state)
 *   $button-text-rest      -> slot `text`                        (no modifier present)
 *   $separator-border-rest -> concern `separator` + slot `border` (concern is the first segment)
 *   $button-separator-rest -> component `button` + slot `separator`
 *
 * Only overlaps between vocabularies competing for the SAME position are fatal, and there are two:
 *
 *   1. STATES ∩ PARTS = ∅       — the trailing state is matched first, so a part that is also a
 *      state word would be eaten as the state and the slot would go missing
 *   2. SUB_ELEMENTS ∩ STATES = ∅ — same reason, from the other side
 *
 * A sub-element that is also a PART or a MODIFIER is fine, and `toast` proves it: the DOM element is
 * `.dx-toast-content`, so `content` is both the name of that box and the part meaning "text colour".
 *
 *   $toast-content-padding-block  -> sub-element `content` + slot `padding-block`
 *   $toast-content-rest           -> slot `content` (the slot is mandatory and sits before the state)
 *
 * Both parse. Requiring sub-elements to avoid part names would have forced `body` on an element the
 * DOM calls `content`, which costs findability for no decidability gain. (This is the second time the
 * instinct "make all the vocabularies disjoint" turned out to be too strong — see NAMING.md.)
 */
const assertParseable = (parts, states, modifiers, subElements) => {
  const clash = (a, b) => a.filter((value) => b.includes(value));

  const stateParts = clash(states, parts);
  if (stateParts.length) {
    throw new Error(`STATES and PARTS overlap, the grammar would be undecidable: ${stateParts}`);
  }

  Object.entries(subElements).forEach(([component, names]) => {
    const bad = clash(names, states);
    if (bad.length) {
      throw new Error(`sub-elements of ${component} collide with a state name: ${bad}`);
    }
  });
};

/*
 * The typo gate for rootSelectors: every class the emitter will declare on must exist in the built
 * bundle. Hard requirement when REGENERATING (regeneration is a curated act — build first); --check
 * still works without a build (byte comparison; the committed content already passed the gate).
 */
const assertRootSelectorsExist = (rootSelectors) => {
  const bundle = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');
  try {
    statSync(bundle);
  } catch {
    if (process.argv.includes('--check')) {
      process.stderr.write('note: built bundle absent — rootSelectors gate skipped for --check\n');
      return;
    }
    throw new Error(`rootSelectors gate needs the built bundle at ${bundle} — build the theme first`);
  }
  const classes = new Set(
    [...readFileSync(bundle, 'utf8').matchAll(/\.(dx-[a-z0-9-]+)/g)].map((match) => match[1]),
  );
  Object.entries(rootSelectors).forEach(([component, selectors]) => {
    selectors.forEach((selector) => {
      if (selector === ':root') return;
      if (!/^\.dx-[a-z0-9-]+$/.test(selector)) {
        throw new Error(`rootSelectors[${component}]: "${selector}" is not a single .dx-* class or :root`);
      }
      if (!classes.has(selector.slice(1))) {
        throw new Error(`rootSelectors[${component}]: "${selector}" does not occur in the built bundle`);
      }
    });
  });
};

const build = () => {
  const folders = listFolders(themeDir);
  /*
   * The PACKAGE's own state vocabulary, used only to strip a trailing state off a token name
   * while deriving parts. It is not our grammar: the package's component tier still spells the
   * resting value `-rest` (300 of its 732 names), so `rest` has to be strippable here even when
   * our own names leave it implicit — otherwise `rest` is read as the part and the real parts
   * (backdrop, grip, scrim, thumb, veil) vanish.
   */
  const derived = deriveFromTokens([...OVERRIDES.states, 'rest']);

  const parts = sortedUnique([
    ...derived.parts.filter((part) => !OVERRIDES.partExclude.includes(part)),
    ...OVERRIDES.partsAdd,
  ]).filter((part) => !OVERRIDES.partsRemove.includes(part));

  const components = {};
  folders.forEach((folder) => {
    if (OVERRIDES.systemFolders.includes(folder)) return;
    components[folder] = OVERRIDES.components[folder] ?? kebab(folder);
  });

  // component -> owning folder; explicit overrides win, otherwise the only folder mapping to it
  const declarationHome = {};
  Object.entries(components).forEach(([folder, component]) => {
    declarationHome[component] = OVERRIDES.declarationHome[component] ?? folder;
  });

  const subElements = OVERRIDES.subElements;
  assertParseable(parts, OVERRIDES.states, OVERRIDES.modifiers, subElements);

  // Wave F: emission scope per migrated component — explicit override or the derived widget class
  const rootSelectors = {};
  [...OVERRIDES.migrated, ...OVERRIDES.systemTier].forEach((component) => {
    rootSelectors[component] = OVERRIDES.rootSelectors[component]
      ?? [`.dx-${component.replace(/-/g, '')}`];
  });
  const orphanRoots = Object.keys(OVERRIDES.rootSelectors)
    .filter((component) => !OVERRIDES.migrated.includes(component)
      && !OVERRIDES.systemTier.includes(component));
  if (orphanRoots.length) {
    throw new Error(`rootSelectors for non-migrated components: ${orphanRoots.join(', ')}`);
  }
  assertRootSelectorsExist(rootSelectors);

  return {
    $comment: 'GENERATED by tools/naming/derive-registries.mjs — do not edit by hand. '
      + 'Judgment calls live in OVERRIDES in that script; vocabularies are derived from the '
      + '@devexpress/design-tokens-internal package and from the theme folder layout.',
    parseRule: '$<component>(-<sub-element>)*(-<modifier>)*-<slot>(-<state>) — parsed right-to-left '
      + 'with longest match. Overlaps between vocabularies competing for DIFFERENT positions are '
      + 'intentional and resolved positionally; see assertParseable() in the generator for the two '
      + 'overlaps that are forbidden.',
    derivedFrom: {
      componentTokens: `@devexpress/design-tokens-internal → ${COMPONENT_TOKEN_SOURCE}`,
      componentTokenCount: derived.tokenCount,
      themeFolders: folders.length,
    },
    components,
    declarationHome,
    systemFolders: OVERRIDES.systemFolders,
    systemTier: OVERRIDES.systemTier,
    systemConcerns: [...OVERRIDES.systemConcerns].sort(),
    chassis: OVERRIDES.chassis,
    rootSelectors,
    themeIdentity: OVERRIDES.themeIdentity,
    exemptFolders: OVERRIDES.exemptFolders,
    parts,
    states: OVERRIDES.states,
    modifiers: OVERRIDES.modifiers,
    sizeSlots: OVERRIDES.sizeSlots,
    rejected: OVERRIDES.rejected,
    embeds: OVERRIDES.embeds,
    rejectedTrailing: OVERRIDES.rejectedTrailing,
    rejectedSpellings: OVERRIDES.rejectedSpellings,
    droppedSegments: OVERRIDES.droppedSegments,
    subElements,
    packageElementPaths: derived.packageElementPaths,
    migrated: OVERRIDES.migrated,
  };
};

const serialized = `${JSON.stringify(build(), null, 2)}\n`;

if (process.argv.includes('--check')) {
  const committed = readFileSync(output, 'utf8');
  if (committed !== serialized) {
    process.stderr.write('registries.json is stale — run node tools/naming/derive-registries.mjs\n');
    process.exit(1);
  }
  process.stdout.write('registries.json is up to date\n');
} else {
  writeFileSync(output, serialized);
  process.stdout.write(`wrote ${output}\n`);
}
