const themeKey = 'currentThemeId';
const ICON_BASE = 'https://js.devexpress.com/Demos/WidgetsGallery/Content/Images/Themes';
const KNOWN_GROUPS = ['fluent', 'material', 'generic'];
const GROUP_ORDER = ['Fluent', 'Material', 'Generic'];
const DARK_GENERIC = new Set(['dark', 'darkmoon', 'darkviolet', 'contrast']);

const themeLoaders = import.meta.glob('../artifacts/css/dx.*.css', { query: '?url', import: 'default' });

type Theme = { id: string; group: string; subgroup: string; display: string };

function capitalize(s: string): string {
  if (s === 'saas') return 'SaaS';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseTheme(id: string): Theme {
  const parts = id.split('.');
  const isKnown = KNOWN_GROUPS.includes(parts[0]);
  const group = isKnown ? capitalize(parts[0]) : 'Generic';
  const isCompact = parts.includes('compact');
  let mode = '';
  if (group !== 'Generic') {
    if (parts.includes('light')) mode = 'Light';
    else if (parts.includes('dark')) mode = 'Dark';
  } else {
    mode = DARK_GENERIC.has(parts[0]) ? 'Dark' : 'Light';
  }
  const subgroup = [group, mode, isCompact ? 'Compact' : ''].filter(Boolean).join(' ');
  const display = parts.filter((p) => p !== 'compact').map(capitalize).join(' ');
  return { id, group, subgroup, display };
}

const SUBGROUP_ORDER = ['Light', 'Dark', 'Light Compact', 'Dark Compact', 'Compact'];

function subgroupSortKey(subgroup: string, group: string): number {
  const suffix = subgroup.replace(group, '').trim();
  const idx = SUBGROUP_ORDER.indexOf(suffix);
  return idx === -1 ? SUBGROUP_ORDER.length : idx;
}

const themes: Theme[] = Object.keys(themeLoaders)
  .map((path) => path.match(/dx\.(.+)\.css$/)?.[1])
  .filter((name): name is string => Boolean(name) && name !== 'common')
  .map(parseTheme);

const groups = GROUP_ORDER.filter((g) => themes.some((t) => t.group === g));

function iconUrl(id: string): string {
  return `${ICON_BASE}/${id.replace(/\.compact$/, '')}.svg`;
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
      link.onload = (): void => resolve();
      link.onerror = (): void => reject(new Error(`Failed to load theme: ${themeId}`));
      document.head.appendChild(link);
    }).catch(reject);
  });
}

function getGroupedItems(group: string): Array<{ key: string; items: Theme[] }> {
  const filtered = themes.filter((t) => t.group === group);
  const subgroups = Array.from(new Set(filtered.map((t) => t.subgroup)))
    .sort((a, b) => subgroupSortKey(a, group) - subgroupSortKey(b, group));
  return subgroups.map((sg) => ({
    key: sg,
    items: filtered.filter((t) => t.subgroup === sg),
  }));
}

function renderSelector(
  container: HTMLElement,
  selectedId: string,
  activeGroup: string,
  onSelect: (id: string, group: string) => void,
): void {
  container.innerHTML = '';

  const btn = document.createElement('button');
  btn.className = 'ts-btn';
  btn.innerHTML = `<img class="ts-btn-icon" src="${iconUrl(selectedId)}" alt="">`
    + `<span>${themes.find((t) => t.id === selectedId)?.display ?? selectedId}</span>`
    + '<span class="ts-btn-arrow"></span>';
  container.appendChild(btn);

  const popup = document.createElement('div');
  popup.className = 'ts-popup';

  const tabs = document.createElement('div');
  tabs.className = 'ts-tabs';
  groups.forEach((g) => {
    const tab = document.createElement('button');
    tab.className = `ts-tab${g === activeGroup ? ' active' : ''}`;
    tab.textContent = g;
    tab.onclick = (e): void => {
      e.stopPropagation();
      activeGroup = g;
      renderList();
      tabs.querySelectorAll('.ts-tab').forEach((t) => t.classList.toggle('active', t.textContent === g));
    };
    tabs.appendChild(tab);
  });
  popup.appendChild(tabs);

  const list = document.createElement('div');
  list.className = 'ts-list';
  popup.appendChild(list);
  container.appendChild(popup);

  function renderList(): void {
    list.innerHTML = '';
    getGroupedItems(activeGroup).forEach(({ key, items }) => {
      const h = document.createElement('div');
      h.className = 'ts-group-header';
      h.textContent = key;
      list.appendChild(h);

      items.forEach((theme) => {
        const item = document.createElement('button');
        item.className = `ts-item${theme.id === selectedId ? ' selected' : ''}`;
        item.innerHTML = `<img class="ts-item-icon" src="${iconUrl(theme.id)}" alt="">`
          + `<span>${theme.display}</span>`;
        item.onclick = (e): void => {
          e.stopPropagation();
          onSelect(theme.id, theme.group);
        };
        list.appendChild(item);
      });
    });
  }
  renderList();

  btn.onclick = (): void => container.classList.toggle('open');
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) container.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') container.classList.remove('open');
  });
}

export function setupThemeSelector(containerId: string): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) return Promise.resolve();

  const initialId = window.localStorage.getItem(themeKey)
    || themes.find((t) => t.id === 'fluent.blue.light')?.id
    || themes[0]?.id;

  if (!initialId) return Promise.resolve();

  let selectedId = initialId;
  let activeGroup = themes.find((t) => t.id === selectedId)?.group ?? groups[0];

  function refresh(): void {
    renderSelector(container, selectedId, activeGroup, (id, group) => {
      selectedId = id;
      activeGroup = group;
      window.localStorage.setItem(themeKey, id);
      loadThemeCss(id).catch((err) => console.error(err));
      refresh();
    });
  }

  refresh();
  return loadThemeCss(initialId);
}
