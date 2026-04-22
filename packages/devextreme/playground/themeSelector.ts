import $ from 'jquery';
import '../js/ui/drop_down_button';
import '../js/ui/tabs';
import '../js/ui/list';

const themeKey = 'currentThemeId';

const themeLoaders = import.meta.glob('../artifacts/css/dx.*.css', { query: '?url', import: 'default' });

type Theme = {
  id: string;
  group: string;
  subgroup: string;
  display: string;
  isDark: boolean;
};

const KNOWN_GROUPS = ['fluent', 'material', 'generic'];
const GROUP_ORDER = ['Fluent', 'Material', 'Generic'];
const SUBGROUP_SUFFIX_ORDER = ['Light', 'Dark', 'Light Compact', 'Dark Compact', '', 'Compact'];

const DARK_GENERIC_NAMES = new Set(['dark', 'darkmoon', 'darkviolet', 'contrast']);

function capitalize(s: string): string {
  if (s === 'saas') return 'SaaS';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseTheme(id: string): Theme {
  const parts = id.split('.');
  const isKnown = KNOWN_GROUPS.includes(parts[0]);
  const group = isKnown ? capitalize(parts[0]) : 'Generic';
  const isCompact = parts.includes('compact');
  const isDark = group === 'Generic'
    ? DARK_GENERIC_NAMES.has(parts[0])
    : parts.includes('dark');
  let mode = '';
  if (group !== 'Generic') {
    if (parts.includes('light')) mode = 'Light';
    else if (parts.includes('dark')) mode = 'Dark';
  }
  const subgroup = [group, mode, isCompact ? 'Compact' : ''].filter(Boolean).join(' ');
  const display = parts
    .filter((p) => p !== 'compact')
    .map(capitalize)
    .join(' ');

  return { id, group, subgroup, display, isDark };
}

const themes: Theme[] = Object.keys(themeLoaders)
  .map((path) => path.match(/dx\.(.+)\.css$/)?.[1])
  .filter((name): name is string => Boolean(name) && name !== 'common')
  .map(parseTheme);

const groups = GROUP_ORDER.filter((g) => themes.some((t) => t.group === g));

function subgroupOrderKey(subgroup: string, group: string): number {
  const suffix = subgroup.replace(group, '').trim();
  const idx = SUBGROUP_SUFFIX_ORDER.indexOf(suffix);
  return idx === -1 ? SUBGROUP_SUFFIX_ORDER.length : idx;
}

function loadThemeCss(themeId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const oldLink = document.getElementById('theme-stylesheet');
    if (oldLink) oldLink.remove();

    const key = Object.keys(themeLoaders).find((p) => p.includes(`dx.${themeId}.css`));
    if (!key) {
      reject(new Error(`Theme not found: ${themeId}`));
      return;
    }

    (themeLoaders[key]() as Promise<string>).then((cssUrl) => {
      const link = document.createElement('link');
      link.id = 'theme-stylesheet';
      link.rel = 'stylesheet';
      link.href = cssUrl;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load theme: ${themeId}`));
      document.head.appendChild(link);
    }).catch(reject);
  });
}

const ICON_BASE_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/Content/Images/Themes';

function iconUrl(theme: Theme): string {
  const base = theme.id.replace(/\.compact$/, '');
  return `${ICON_BASE_URL}/${base}.svg`;
}

function buildItemTemplate(theme: Theme): JQuery {
  const $item = $('<div class="theme-selector-item">');
  $('<img class="theme-selector-icon" alt="" width="28" height="28">')
    .attr('src', iconUrl(theme))
    .appendTo($item);
  $('<span class="theme-selector-label">')
    .text(theme.display)
    .appendTo($item);
  return $item;
}

function getGroupedItems(group: string) {
  const filtered = themes.filter((t) => t.group === group);
  const subgroups = Array.from(new Set(filtered.map((t) => t.subgroup)))
    .sort((a, b) => subgroupOrderKey(a, group) - subgroupOrderKey(b, group));
  return subgroups.map((sg) => ({
    key: sg,
    items: filtered.filter((t) => t.subgroup === sg),
  }));
}

export function setupThemeSelector(containerId: string): Promise<void> {
  const $container = $(`#${containerId}`);
  if ($container.length === 0) return Promise.resolve();

  const initialThemeId = window.localStorage.getItem(themeKey)
    || themes.find((t) => t.id === 'fluent.blue.light')?.id
    || themes[0]?.id;

  if (!initialThemeId) return Promise.resolve();

  const initial = themes.find((t) => t.id === initialThemeId) ?? themes[0];

  let activeGroup = initial.group;
  let selectedThemeId = initial.id;

  const dropDownButtonInstance = $container.dxDropDownButton({
    text: initial.display,
    icon: undefined,
    showArrowIcon: true,
    dropDownOptions: {
      width: 360,
      height: 460,
      wrapperAttr: { class: 'theme-selector-popup' },
    },
    dropDownContentTemplate: (_data: unknown, container: HTMLElement) => {
      const $content = $('<div class="theme-selector-content">');
      const $tabs = $('<div class="theme-selector-tabs">').appendTo($content);
      const $list = $('<div class="theme-selector-list">').appendTo($content);

      const list = $list.dxList({
        items: getGroupedItems(activeGroup),
        grouped: true,
        selectionMode: 'single',
        selectedItemKeys: [selectedThemeId],
        keyExpr: 'id',
        height: '100%',
        scrollByContent: true,
        focusStateEnabled: false,
        itemTemplate: (data: Theme) => buildItemTemplate(data),
        groupTemplate: (data: { key: string }) => $('<div class="theme-selector-group-header">').text(data.key),
        onItemClick: (e) => {
          const theme = e.itemData as Theme;
          selectedThemeId = theme.id;
          activeGroup = theme.group;
          window.localStorage.setItem(themeKey, theme.id);
          loadThemeCss(theme.id).catch((err) => console.error(err));
          dropDownButtonInstance.option('text', theme.display);
          dropDownButtonInstance.close();
        },
      }).dxList('instance');

      $tabs.dxTabs({
        items: groups.map((g) => ({ text: g })),
        selectedIndex: groups.indexOf(activeGroup),
        scrollingEnabled: false,
        onItemClick: (e) => {
          activeGroup = (e.itemData as { text: string }).text;
          list.option('items', getGroupedItems(activeGroup));
          list.option('selectedItemKeys', [selectedThemeId]);
        },
      });

      $(container).append($content);
    },
  }).dxDropDownButton('instance');

  return loadThemeCss(initial.id);
}
