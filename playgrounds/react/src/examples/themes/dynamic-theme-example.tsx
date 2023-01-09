import { RadioButton, RadioGroup } from '@devextreme/react';

import '@devextreme/styles/lib/themes/dark-scoped.css';

const OPTIONS = ['light', 'dark'];
const handleChange = async (newValue?: string) => {
  // In reaal demo we can replace static import to fetch and link injection:
  // const cssText = await fetch('@devextreme/styles/lib/themes/dark-scoped.css');
  // const link = document.getElementById('theme-style') || document.createElement('style');
  // style.innerText = cssText;
  document.getElementById('dynamic-theme')!.className = `dx-theme-${newValue}`;
};

export function DynamicThemeExample(): JSX.Element {
  return (
    <div id="dynamic-theme" className="example">
      <div className="example__title" style={{ backgroundColor: 'var(--dx-background-color)' }}>
        Select theme:
      </div>
      <div className="example__control">
        <RadioGroup defaultValue={OPTIONS[0]} valueChange={handleChange}>
          { OPTIONS.map((option) => <RadioButton key={option} value={option} label={option} />)}
        </RadioGroup>
      </div>
    </div>
  );
}
