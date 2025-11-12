const WARNING_CODES = {
  LEGACY_CONFIG_COMPONENT_USED: {
    code: 'W3001',
    template: 'You are using the legacy {0} configuration component. Please upgrade to '
      + 'our new {1} configuration component. Upgrade instructions:\n\n'
      + '  https://js.devexpress.com/Angular/Documentation/Guide/Common/DevExtreme_CLI/#Migrate_to_Named_Configuration_Components',
  },
} as const;

export type WarningId = keyof typeof WARNING_CODES;
export type WarningDefinition = typeof WARNING_CODES[WarningId];

export default WARNING_CODES;
