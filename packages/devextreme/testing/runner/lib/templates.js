const fs = require('fs');
const path = require('path');

function createTemplateRenderer(templatesRoot, escapeHtml) {
    const templateCache = new Map();

    function readTemplate(templateName) {
        const key = String(templateName || '');

        if(templateCache.has(key)) {
            return templateCache.get(key);
        }

        const filePath = path.resolve(templatesRoot, key);
        const relativePath = path.relative(templatesRoot, filePath);

        if(relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
            throw new Error(`Invalid template path: ${key}`);
        }

        const templateText = fs.readFileSync(filePath, 'utf8');
        templateCache.set(key, templateText);

        return templateText;
    }

    function getTemplateValue(data, key, shouldEscape) {
        const hasValue = Object.prototype.hasOwnProperty.call(data, key);
        const value = hasValue ? data[key] : '';
        const valueAsString = value === null || value === undefined ? '' : String(value);

        if(shouldEscape) {
            return escapeHtml(valueAsString);
        }

        return valueAsString;
    }

    function renderTemplate(templateName, vars) {
        const template = readTemplate(templateName);
        const data = vars || {};

        return template
            .replace(/\{\{\{([A-Za-z0-9_]+)\}\}\}/g, (_, key) => getTemplateValue(data, key, false))
            .replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key) => getTemplateValue(data, key, true));
    }

    return {
        renderTemplate,
    };
}

module.exports = {
    createTemplateRenderer,
};
