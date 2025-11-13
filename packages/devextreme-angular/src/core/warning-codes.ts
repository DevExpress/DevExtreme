const WARNING_CODES = {
  LEGACY_CONFIG_COMPONENT_USED: {
    code: 'W3001',
    template: 'You are using the legacy {legacySelector} configuration component. We recommend '
      + 'upgrading to the new {replacement} configuration component.',
    // TODO: link to docs article, when available
  },
} as const;

export type WarningId = keyof typeof WARNING_CODES;
export type WarningDefinition = typeof WARNING_CODES[WarningId];

export default WARNING_CODES;
