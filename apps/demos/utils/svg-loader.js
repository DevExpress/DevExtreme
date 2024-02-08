module.exports.translate = function (data) {
  return `module.exports = {default: \`data:image/svg+xml;base64,${btoa(data.source)}\`}`;
};
