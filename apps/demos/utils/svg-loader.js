module.exports.translate = (data) => `module.exports = {default: \`data:image/svg+xml;base64,${btoa(data.source)}\`}`;
