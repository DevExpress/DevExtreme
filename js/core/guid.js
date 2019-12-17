var Class = require('./class');

/**
* @name Guid
* @type object
* @namespace DevExpress.data
* @module core/guid
* @export default
*/
var Guid = Class.inherit({

    /**
    * @name Guidmethods.ctor
    * @publicName ctor()
    */
    /**
    * @name Guidmethods.ctor
    * @publicName ctor(value)
    * @param1 value:string
    */
    ctor: function(value) {
        if(value) {
            value = String(value);
        }
        this._value = this._normalize(value || this._generate());
    },

    _normalize: function(value) {
        value = value.replace(/[^a-f0-9]/ig, '').toLowerCase();
        while(value.length < 32) {
            value += '0';
        }
        return [
            value.substr(0, 8),
            value.substr(8, 4),
            value.substr(12, 4),
            value.substr(16, 4),
            value.substr(20, 12)
        ].join('-');
    },

    _generate: function() {
        var value = '';
        for(var i = 0; i < 32; i++) {
            value += Math.round(Math.random() * 15).toString(16);
        }
        return value;
    },

    /**
    * @name Guidmethods.toString
    * @publicName toString()
    * @return string
    */
    toString: function() {
        return this._value;
    },

    /**
    * @name Guidmethods.valueOf
    * @publicName valueOf()
    * @return string
    */
    valueOf: function() {
        return this._value;
    },

    toJSON: function() {
        return this._value;
    }

});

module.exports = Guid;
