export type DefaultEntries = { key: string, value: unknown }[];

export function updateUndefinedFromDefaults(
  componentInstance: Record<string, unknown>,
  changes: Record<string, { currentValue: unknown }>,
  defaultEntries: DefaultEntries,
): void {
  defaultEntries.forEach(({ key, value }) => {
    if (changes[key] && changes[key].currentValue === undefined) {
      componentInstance[key] = value;
    }
  });
}
