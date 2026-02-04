import path from 'node:path';
import { createUnplugin } from 'unplugin';

const LICENSE_FILE_PATH = 'devextreme-license.js';
const DEFAULT_PLACEHOLDER = '/* ___$$$$$___devextreme___lcp___placeholder____$$$$$ */';

function normalizeFilePath(filePath) {
  return path.resolve(filePath).replace(/\\/g, '/').toLowerCase();
}

export default createUnplugin((options = {}) => {
  const placeholder = options.placeholder ?? DEFAULT_PLACEHOLDER;

  let cachedLcpKey;
  let cachedLcpKeyPromise;

  async function resolveLcpKey() {
    if (cachedLcpKey) {
      return cachedLcpKey;
    }
    if (cachedLcpKeyPromise) {
      return cachedLcpKeyPromise;
    }

    cachedLcpKeyPromise = (async () => {
      let lcpKey ='=================@@@@@@@@@@@_LCP_Key_@@@@@@@@@=====================';

      return lcpKey;
    })();

    return cachedLcpKeyPromise;
  }

  return {
    name: 'devextreme-bundler-plugin',
    enforce: 'pre',
    transformInclude(id) {
      return typeof id === 'string' && id.endsWith(LICENSE_FILE_PATH);
    },
    async transform(code, id) {
      try {
        const targetFile = path.resolve(process.cwd(), normalizeFilePath(LICENSE_FILE_PATH));

        if (!targetFile || !placeholder) {
          return null;
        }

        const normalizedId = normalizeFilePath(id.split('?')[0]);
        const normalizedTarget = normalizeFilePath(targetFile);

        if (normalizedId !== normalizedTarget) {
          return null;
        }

        if (!code.includes(placeholder)) {
          return null;
        }

        const lcpKey = await resolveLcpKey();
        if (!lcpKey) {
          return code;
        }

        const modifedCode =  code.split(placeholder).join(String(lcpKey));

        return modifedCode;
      } catch (error) {
        console.warn('[devextreme-bundler-plugin] Failed.', error);
      }

      return code;
    }
  };
});
