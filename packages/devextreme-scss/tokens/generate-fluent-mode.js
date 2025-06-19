const { Transform } = require('stream');
const fs = require('fs');
const path = require('path');

module.exports = function generateFluentMode() {
    return new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
            const mode = chunk.basename.replace('.scss','');
            const injectedMode = mode === 'light' ? 'dark' : 'light';
            const selector = `.dxbl-theme-fluent-mode-inverted, .dxbl-theme-fluent-mode-${injectedMode}`;

            const injectedModeContent = getInjectedContent(`scss/_design-system/fluent/modes/${injectedMode}.scss`);

            let cssRes = chunk.contents.toString().replace(':root', `:root, .dxbl-theme-fluent-mode-${mode}`);

            cssRes += injectedModeContent.replace(/^[\s\S]*?:root/, selector);

            chunk.contents = Buffer.from(cssRes);

            callback(null, chunk);
        }
    });
}

const getInjectedContent = (filePath) => fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');

