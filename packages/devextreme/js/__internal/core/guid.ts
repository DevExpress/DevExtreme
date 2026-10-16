export class Guid {
  private readonly _value: string;

  constructor(value?: string) {
    const initialValue = value ? String(value) : '';

    this._value = this._normalize(initialValue || this._generate());
  }

  private _normalize(value: string): string {
    let normalizedValue = value.replace(/[^a-f0-9]/ig, '').toLowerCase();

    while (normalizedValue.length < 32) {
      normalizedValue += '0';
    }

    return [
      normalizedValue.slice(0, 8),
      normalizedValue.slice(8, 12),
      normalizedValue.slice(12, 16),
      normalizedValue.slice(16, 20),
      normalizedValue.slice(20, 32),
    ].join('-');
  }

  private _generate(): string {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));

    return Array.from(bytes, (byte: number): string => byte.toString(16).padStart(2, '0')).join('');
  }

  public toString(): string {
    return this._value;
  }

  public valueOf(): string {
    return this._value;
  }

  public toJSON(): string {
    return this._value;
  }
}
