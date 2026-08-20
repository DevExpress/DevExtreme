export class Guid {
  private readonly _value: string;

  constructor(value?: string) {
    const initialValue = value ? String(value) : '';

    this._value = this._normalize(initialValue || this._generate());
  }

  public _normalize(value: string): string {
    let normalizedValue = value.replace(/[^a-f0-9]/ig, '').toLowerCase();

    while (normalizedValue.length < 32) {
      normalizedValue += '0';
    }

    return [
      normalizedValue.substr(0, 8),
      normalizedValue.substr(8, 4),
      normalizedValue.substr(12, 4),
      normalizedValue.substr(16, 4),
      normalizedValue.substr(20, 12),
    ].join('-');
  }

  private _generate(): string {
    let value = '';

    for (let i = 0; i < 32; i += 1) {
      value += Math.round(Math.random() * 15).toString(16);
    }

    return value;
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
