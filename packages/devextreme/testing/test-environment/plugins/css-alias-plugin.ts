import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Plugin to handle CSS imports with SystemJS loader syntax (theme.css!)
 * These imports are used in DevExtreme tests to load CSS themes dynamically
 */
export function cssAliasPlugin(rootDir: string): Plugin {
  const cssThemes = [
    'generic_light',
    'material_blue_light',
    'material_blue_dark', 
    'material_lime_light',
    'material_lime_dark',
    'material_orange_light',
    'material_orange_dark',
    'material_purple_light',
    'material_purple_dark',
    'material_teal_light',
    'material_teal_dark'
  ];

  // Create a simple CSS placeholder if the actual CSS file doesn't exist
  const createPlaceholderCSS = (themeName: string) => `
/* Placeholder CSS for ${themeName} theme in Vite development environment */
/* This file is auto-generated to support CSS imports in tests */

/* Basic DevExtreme theme styles for testing */
.dx-theme-${themeName.replace(/_/g, '-')} {
  --dx-color-primary: #337ab7;
  --dx-color-success: #5cb85c;
  --dx-color-warning: #f0ad4e;
  --dx-color-danger: #d9534f;
  --dx-color-info: #5bc0de;
}

.dx-widget {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #333;
}

.dx-state-hover {
  background-color: #f5f5f5;
}

.dx-state-focused {
  outline: 1px dotted #333;
}

.dx-state-active {
  background-color: #e6e6e6;
}
`;

  return {
    name: 'css-alias-plugin',
    resolveId(id) {
      // Handle CSS imports with SystemJS loader syntax (theme.css!)
      if (id.endsWith('.css!')) {
        const themeName = id.replace('.css!', '');
        if (cssThemes.includes(themeName)) {
          // Return a virtual module ID
          return `virtual:css-theme:${themeName}`;
        }
      }
      return null;
    },
    load(id) {
      if (id.startsWith('virtual:css-theme:')) {
        const themeName = id.replace('virtual:css-theme:', '');
        
        // Try to find the actual CSS file first
        const possiblePaths = [
          path.resolve(rootDir, `artifacts/css/dx.${themeName.replace('_', '.')}.css`),
          path.resolve(rootDir, `artifacts/css/${themeName}.css`),
          path.resolve(rootDir, `css/${themeName}.css`),
          path.resolve(rootDir, `themes/${themeName}/dx.${themeName}.css`)
        ];

        for (const cssPath of possiblePaths) {
          if (fs.existsSync(cssPath)) {
            console.log(`📝 Loading CSS theme from: ${cssPath}`);
            return fs.readFileSync(cssPath, 'utf-8');
          }
        }

        // If no actual CSS file found, return placeholder CSS
        console.log(`⚠️ CSS file not found for theme: ${themeName}, using placeholder`);
        return createPlaceholderCSS(themeName);
      }
      return null;
    }
  };
}