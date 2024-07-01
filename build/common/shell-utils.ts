type Mapping = string | { kind: 'flag', alias: string };

function mapKeyValue(key: string, value: unknown, map: Record<string, Mapping>): string {
  const mapping = key in map ? map[key] : undefined;
  if (mapping !== undefined) {
    if (typeof (mapping) === 'string') {
      return `${mapping}='${value}'`;
    }

    if (mapping.kind === 'flag') {
      return value ? `${mapping.alias}` : '';
    }
  }

  return `${key}='${value}'`;
}

export function mapOptions<TOptions extends Record<string, any>>(options: TOptions, map: Record<keyof TOptions, Mapping>): string {
  return Object.entries(options)
    .map(([key, value]) => mapKeyValue(key, value, map))
    .filter(o => o)
    .join(' ');
}
