import * as rruleModule from 'rrule';

type RRuleModule = typeof rruleModule;

// rrule's `main` is a UMD bundle, so Node's ESM loader exposes it only as a default export,
// while bundlers take rrule's ESM build (`module`) with named exports and no default.
// A namespace import works in both: named exports from the ESM build,
// `default` from the UMD bundle.
const resolveRRuleModule = (module: RRuleModule & { default?: RRuleModule }): RRuleModule => (
  module.RRule ? module : module.default as RRuleModule
);

export const { RRule, RRuleSet } = resolveRRuleModule(rruleModule);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RRuleSet = InstanceType<typeof RRuleSet>;
