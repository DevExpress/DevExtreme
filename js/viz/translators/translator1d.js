const _Number = Number;

function Translator1D() {
    this.setDomain(arguments[0], arguments[1]).setCodomain(arguments[2], arguments[3]);
}

Translator1D.prototype = {
    constructor: Translator1D,

    setDomain: function(domain1, domain2) {
        const that = this;
        that._domain1 = _Number(domain1);
        that._domain2 = _Number(domain2);
        that._domainDelta = that._domain2 - that._domain1;
        return that;
    },

    setCodomain: function(codomain1, codomain2) {
        const that = this;
        that._codomain1 = _Number(codomain1);
        that._codomain2 = _Number(codomain2);
        that._codomainDelta = that._codomain2 - that._codomain1;
        return that;
    },

    getDomain: function() {
        return [this._domain1, this._domain2];
    },

    getCodomain: function() {
        return [this._codomain1, this._codomain2];
    },

    getDomainStart: function() {
        return this._domain1;
    },

    getDomainEnd: function() {
        return this._domain2;
    },

    getCodomainStart: function() {
        return this._codomain1;
    },

    getCodomainEnd: function() {
        return this._codomain2;
    },

    getDomainRange: function() {
        return this._domainDelta;
    },

    getCodomainRange: function() {
        return this._codomainDelta;
    },

    translate: function(value) {
        const ratio = (_Number(value) - this._domain1) / this._domainDelta;
        return 0 <= ratio && ratio <= 1 ? this._codomain1 + ratio * this._codomainDelta : NaN;
    },

    adjust: function(value) {
        const ratio = (_Number(value) - this._domain1) / this._domainDelta;
        let result = NaN;
        if(ratio < 0) {
            result = this._domain1;
        } else if(ratio > 1) {
            result = this._domain2;
        } else if(0 <= ratio && ratio <= 1) {
            result = _Number(value);
        }
        return result;
    }
};

exports.Translator1D = Translator1D;
