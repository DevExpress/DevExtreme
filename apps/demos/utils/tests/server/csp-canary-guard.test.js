const { canaryProblem } = require('../../server/csp-canary-guard');

const POLICY = "style-src 'self' https://maxcdn.bootstrapcdn.com; report-uri /csp-report";

describe('canaryProblem', () => {
  it('passes the canary the server really served', () => {
    expect(canaryProblem(200, { 'content-security-policy-report-only': POLICY })).toBeNull();
  });

  it('passes an enforcing policy as well as a report-only one', () => {
    expect(canaryProblem(200, { 'content-security-policy': POLICY })).toBeNull();
  });

  it('names the status when the canary page is not there', () => {
    const problem = canaryProblem(404, { 'content-security-policy-report-only': POLICY });

    expect(problem).toContain('404');
    expect(problem).toContain('not where the check looks for it');
  });

  it('reports another status without guessing at the cause', () => {
    const problem = canaryProblem(500, { 'content-security-policy-report-only': POLICY });

    expect(problem).toBe('the server answered 500 for the canary page');
    expect(problem).not.toContain('looks for it');
  });

  it('reports a response that carries no policy at all', () => {
    expect(canaryProblem(200, {})).toBe('the server served the canary page without a policy header');
  });

  it('reports a policy that says nothing about style-src', () => {
    const policy = "script-src 'self'; report-uri /csp-report";

    expect(canaryProblem(200, { 'content-security-policy-report-only': policy }))
      .toBe(`the policy carries no style-src directive: ${policy}`);
  });
});
