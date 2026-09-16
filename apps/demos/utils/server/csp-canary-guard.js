/*
 * Whether what came back is the canary at all, before anything is concluded from it.
 *
 * The demo server sets the CSP header from its first middleware, so every response carries a
 * complete policy — a 404 included. That makes a canary page that moved or went missing pass the
 * policy assertions exactly like the real one, and the failure then surfaces a render deadline
 * later as "Nothing rendered", which sends the reader to look at the renderer rather than at the
 * path. The status code is the one thing that tells those two apart, so it is checked first.
 *
 * Only a 404 is told what it means. A server that is reachable and answers something else is not
 * a moved file, and guessing at the cause is the mistake this guard exists to stop making — the
 * status is reported and left to speak for itself. A server that is not there at all never gets
 * here: the request rejects with ECONNREFUSED before any status exists.
 */

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
