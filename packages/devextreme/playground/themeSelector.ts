const themeKey = 'currentThemeId';

const themeLoaders = import.meta.glob('../artifacts/css/dx.*.css', { query: '?url', import: 'default' });

const themeList = Object.keys(themeLoaders).map((path) => {
  const match = path.match(/dx\.(.+)\.css$/);
  return match ? match[1] : null;
}).filter(Boolean) as string[];

function groupThemes(themes: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  themes.forEach((theme) => {
    const [group] = theme.split('.');
    const groupName = group.charAt(0).toUpperCase() + group.slice(1);
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(theme);
  });
  return groups;
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

export function setupThemeSelector(containerId: string): Promise<void> {
  const select = document.querySelector<HTMLSelectElement>(`#${containerId}`);
  if (!select) return Promise.resolve();

  const grouped = groupThemes(themeList);
  Object.entries(grouped).forEach(([group, themes]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group;
    themes.forEach((theme) => {
      const option = document.createElement('option');
      option.value = theme;
      option.textContent = theme.replaceAll('.', ' ');
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });

  const savedTheme = window.localStorage.getItem(themeKey) || themeList[0];
  select.value = savedTheme;

  select.addEventListener('change', () => {
    const newTheme = select.value;
    window.localStorage.setItem(themeKey, newTheme);
    loadThemeCss(newTheme).catch((err) => console.error(err));
  });

  return loadThemeCss(savedTheme);
}
