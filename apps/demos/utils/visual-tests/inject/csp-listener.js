// eslint-disable-next-line no-underscore-dangle
window.__cspViolations = [];

document.addEventListener('securitypolicyviolation', (e) => {
  const violation = {
    blockedURI: e.blockedURI,
    violatedDirective: e.violatedDirective,
    effectiveDirective: e.effectiveDirective,
    originalPolicy: e.originalPolicy,
    sourceFile: e.sourceFile,
    lineNumber: e.lineNumber,
    columnNumber: e.columnNumber,
    documentURI: e.documentURI,
    disposition: e.disposition,
    timestamp: new Date().toISOString(),
  };

  // eslint-disable-next-line no-underscore-dangle
  window.__cspViolations.push(violation);

  console.warn(
    `[CSP Violation] ${e.violatedDirective}`
    + ` | blocked: ${e.blockedURI}`
    + ` | source: ${e.sourceFile || 'N/A'}`
    + `:${e.lineNumber || '?'}`,
  );
});
