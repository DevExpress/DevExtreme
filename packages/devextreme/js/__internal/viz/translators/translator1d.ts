/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */

const _Number = Number;

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Translator1D = class Translator1D {
  declare _domain1: number;

  declare _domain2: number;

  declare _domainDelta: number;

  declare _codomain1: number;

  declare _codomain2: number;

  declare _codomainDelta: number;

  declare inverted: boolean;

  constructor(domain1?: number, domain2?: number, codomain1?: number, codomain2?: number) {
    this.setDomain(domain1, domain2).setCodomain(codomain1, codomain2).setInverted(false);
  }

  setDomain(domain1?: number, domain2?: number): this {
    this._domain1 = _Number(domain1);
    this._domain2 = _Number(domain2);
    this._domainDelta = this._domain2 - this._domain1;
    return this;
  }

  setCodomain(codomain1?: number, codomain2?: number): this {
    this._codomain1 = _Number(codomain1);
    this._codomain2 = _Number(codomain2);
    this._codomainDelta = this._codomain2 - this._codomain1;
    return this;
  }

  setInverted(state: boolean): void {
    this.inverted = state;
  }

  getDomain(): number[] {
    return [this._domain1, this._domain2];
  }

  getCodomain(): number[] {
    return [this._codomain1, this._codomain2];
  }

  getDomainStart(): number {
    return this._domain1;
  }

  getDomainEnd(): number {
    return this._domain2;
  }

  getCodomainStart(): number {
    return this._codomain1;
  }

  getCodomainEnd(): number {
    return this._codomain2;
  }

  getDomainRange(): number {
    return this._domainDelta;
  }

  getCodomainRange(): number {
    return this._codomainDelta;
  }

  translate(value: number): number {
    let ratio = (_Number(value) - this._domain1) / this._domainDelta;
    this.inverted && (ratio = 1 - ratio);
    return ratio >= 0 && ratio <= 1 ? this._codomain1 + ratio * this._codomainDelta : NaN;
  }

  adjust(value: number): number {
    const ratio = (_Number(value) - this._domain1) / this._domainDelta;
    let result = NaN;
    if (ratio < 0) {
      result = this._domain1;
    } else if (ratio > 1) {
      result = this._domain2;
    } else if (ratio >= 0 && ratio <= 1) {
      result = _Number(value);
    }
    return result;
  }
};

/// #DEBUG
export function DEBUG_set_Translator1D(value: typeof Translator1D): void {
  Translator1D = value;
}
/// #ENDDEBUG
