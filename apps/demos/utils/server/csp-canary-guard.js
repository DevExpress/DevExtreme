const canaryProblem = (statusCode, headers) => {
  if (statusCode === 404) {
    return 'the server answered 404 for the canary page — it is not where the check looks for it';
  }

  if (statusCode !== 200) {
    return `the server answered ${statusCode} for the canary page`;
  }

  const policy = headers['content-security-policy-report-only']
    || headers['content-security-policy'];

  if (!policy) {
    return 'the server served the canary page without a policy header';
  }

  if (!policy.includes('style-src')) {
    return `the policy carries no style-src directive: ${policy}`;
  }

  return null;
};

module.exports = { canaryProblem };
