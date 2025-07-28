import fs from 'fs';
import path from 'path';
import { PluginOption } from 'vite';

export function moduleResolverPlugin(baseDir: string): PluginOption {
  return {
    name: 'module-resolver',
    
    resolveId(id: string) {
      if (id.endsWith('.json!')) {
        const jsonPath = id.replace('.json!', '.json');

        if (jsonPath.includes('localization/messages/')) {
          let messagePath: string;
          if (jsonPath.startsWith('/')) {
            messagePath = jsonPath;
          } else {
            messagePath = jsonPath.replace('localization/messages/', './js/localization/messages/');
            messagePath = path.resolve(baseDir, messagePath);
          }
          
          if (fs.existsSync(messagePath)) {
            return messagePath;
          } 
        }
      }
      
      if (id.endsWith('.css!')) {
        const cssPath = id.replace('.css!', '.css');
        
        // Map theme CSS files to actual artifact files
        const cssMap: Record<string, string> = {
          'generic_light': './artifacts/css/dx.light.css',
          'material_blue_light': './artifacts/css/dx.material.blue.light.css',
          'material_blue_dark': './artifacts/css/dx.material.blue.dark.css',
          'material_lime_light': './artifacts/css/dx.material.lime.light.css',
          'material_lime_dark': './artifacts/css/dx.material.lime.dark.css',
          'material_orange_light': './artifacts/css/dx.material.orange.light.css',
          'material_orange_dark': './artifacts/css/dx.material.orange.dark.css',
          'material_purple_light': './artifacts/css/dx.material.purple.light.css',
          'material_purple_dark': './artifacts/css/dx.material.purple.dark.css',
          'material_teal_light': './artifacts/css/dx.material.teal.light.css',
          'material_teal_dark': './artifacts/css/dx.material.teal.dark.css',
        };
        
        if (cssMap[cssPath]) {
          return path.resolve(baseDir, cssMap[cssPath]);
        }
      }
      
      return null;
    },
    
    load(id: string) {
      if (id.endsWith('/js/localization.js')) {
        return `
          import {
            formatDate,
            formatMessage,
            formatNumber,
            loadMessages,
            locale,
            parseDate,
            parseNumber,
          } from './common/core/localization';

          // Named exports (original)
          export {
            formatDate,
            formatMessage,
            formatNumber,
            loadMessages,
            locale,
            parseDate,
            parseNumber,
          };

          // Default export for test compatibility
          const localization = {
            formatDate,
            formatMessage,
            formatNumber,
            loadMessages,
            locale,
            parseDate,
            parseNumber,
          };

          export default localization;
        `;
      }
      
      return null;
    }
  };
}