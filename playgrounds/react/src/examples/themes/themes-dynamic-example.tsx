import { RadioButton, RadioGroup } from '@devextreme/react';

import '@devextreme/styles/lib/themes/material-blue-light-scoped.css';
import { useState } from 'react';

const THEMES = ['blue', 'purple'];

export function ThemesDynamicExample(): JSX.Element {
  const [theme, setTheme] = useState(THEMES[0]);

  // In real demo we can replace static import to fetch and link injection:
  // const cssText = await fetch('@devextreme/styles/lib/themes/material-blue-light-scoped.css');
  // const link = document.getElementById('theme-style') || document.createElement('style');
  // style.innerText = cssText;
  const handleChange = (themeName?: string) => {
    setTheme(themeName ?? THEMES[0]);
  };

  return (
    <div className={`example dx-material-${theme}-light`}>
      <div className="example__title" style={{ color: 'var(--primary-900)' }}>
        Dynamic theme change example:
      </div>
      <div className="example__control">
        <RadioGroup defaultValue={THEMES[0]} valueChange={handleChange}>
          { THEMES.map((themeName) => (
            <RadioButton
              key={themeName}
              label={`Theme ${themeName}`}
              value={themeName}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
