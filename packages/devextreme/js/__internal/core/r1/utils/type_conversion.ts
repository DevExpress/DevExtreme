export function toNumber(attribute: string | undefined): number {
  return attribute ? Number(attribute.replace('px', '')) : 0;
}
