const themeKey = 'currentThemeId';

const themeLoaders = import.meta.glob('../artifacts/css/dx.*.css', { as: 'url' });

const themeList = Object.keys(themeLoaders).map((path) => {
  const match = path.match(/dx\.(.+)\.css$/);
  return match ? match[1] : null;
}).filter(Boolean) as string[];

function groupThemes(themes: string[]) {
  const groups: Record<string, string[]> = {};
  themes.forEach((theme) => {
    const [group] = theme.split('.');
    const groupName = group.charAt(0).toUpperCase() + group.slice(1);
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(theme);
  });
  return groups;
}

const groupedThemes = groupThemes(themeList);

function initThemes(dropDownList: HTMLSelectElement) {
  Object.entries(groupedThemes).forEach(([group, themes]) => {
    const parent = document.createElement('optgroup');
    parent.label = group;

    themes.forEach((theme) => {
      const child = document.createElement('option');
      child.value = theme;
      child.text = theme.replaceAll('.', ' ');
      parent.appendChild(child);
    });

    dropDownList.appendChild(parent);
  });
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

    themeLoaders[key]().then((cssUrl: string) => {
      const link = document.createElement('link');
      link.id = 'theme-stylesheet';
      link.rel = 'stylesheet';
      link.href = cssUrl;

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load theme: ${themeId}`));

      document.head.appendChild(link);
    });
  });
}

export function setupThemeSelector(selectorId: string): Promise<void> {
  return new Promise((resolve) => {
    const dropDownList = document.querySelector<HTMLSelectElement>(`#${selectorId}`);
    if (!dropDownList) {
      resolve();
      return;
    }

    initThemes(dropDownList);

    const savedTheme = window.localStorage.getItem(themeKey) || themeList[0];
    dropDownList.value = savedTheme;

    loadThemeCss(savedTheme).then(() => {
      dropDownList.addEventListener('change', () => {
        const newTheme = dropDownList.value;
        window.localStorage.setItem(themeKey, newTheme);
        loadThemeCss(newTheme);
      });

      resolve();
    });
  });
}
