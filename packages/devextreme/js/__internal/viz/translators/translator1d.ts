/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const _Number = Number;

export function Translator1D() {
  this.setDomain(arguments[0], arguments[1]).setCodomain(arguments[2], arguments[3]).setInverted(false);
}

Translator1D.prototype = {
  constructor: Translator1D,

  setDomain(domain1, domain2) {
    const that = this;
    that._domain1 = _Number(domain1);
    that._domain2 = _Number(domain2);
    that._domainDelta = that._domain2 - that._domain1;
    return that;
  },

  setCodomain(codomain1, codomain2) {
    const that = this;
    that._codomain1 = _Number(codomain1);
    that._codomain2 = _Number(codomain2);
    that._codomainDelta = that._codomain2 - that._codomain1;
    return that;
  },

  setInverted(state) {
    this.inverted = state;
  },

  getDomain() {
    return [this._domain1, this._domain2];
  },

  getCodomain() {
    return [this._codomain1, this._codomain2];
  },

  getDomainStart() {
    return this._domain1;
  },

  getDomainEnd() {
    return this._domain2;
  },

  getCodomainStart() {
    return this._codomain1;
  },

  getCodomainEnd() {
    return this._codomain2;
  },

  getDomainRange() {
    return this._domainDelta;
  },

  getCodomainRange() {
    return this._codomainDelta;
  },

  translate(value) {
    let ratio = (_Number(value) - this._domain1) / this._domainDelta;
    this.inverted && (ratio = 1 - ratio);
    return ratio >= 0 && ratio <= 1 ? this._codomain1 + ratio * this._codomainDelta : NaN;
  },

  adjust(value) {
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
  },
};
