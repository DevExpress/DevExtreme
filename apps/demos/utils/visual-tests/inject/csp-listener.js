window.__cspViolations = [];

document.addEventListener('securitypolicyviolation', function(e) {
  var violation = {
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

  window.__cspViolations.push(violation);

  console.warn(
    '[CSP Violation] ' + e.violatedDirective
    + ' | blocked: ' + e.blockedURI
    + ' | source: ' + (e.sourceFile || 'N/A')
    + ':' + (e.lineNumber || '?')
  );
});
