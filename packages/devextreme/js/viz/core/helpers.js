import { extend as _extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import { noop } from '../../core/utils/common';
const isServerSide = !hasWindow();

function Flags() {
    this.reset();
}

Flags.prototype = {
    constructor: Flags,

    add: function(codes) {
        let i;
        const ii = codes.length;
        const flags = this._flags;

        for(i = 0; i < ii; ++i) {
            flags[codes[i]] = 1;
        }
    },

    has: function(code) {
        return this._flags[code] > 0;
    },

    count: function() {
        return Object.keys(this._flags).length;
    },

    reset: function() {
        this._flags = {};
    }
};

function combineMaps(baseMap, thisMap) {
    return baseMap !== thisMap ? _extend({}, baseMap, thisMap) : _extend({}, baseMap);
}

function combineLists(baseList, thisList) {
    return baseList !== thisList ? baseList.concat(thisList) : baseList.slice();
}

function buildTotalChanges(proto) {
    proto._totalChangesOrder = proto._optionChangesOrder.concat(proto._layoutChangesOrder, proto._customChangesOrder);
}

function addChange(settings) {
    const proto = this.prototype;
    const code = settings.code;

    proto['_change_' + code] = settings.handler;
    if(settings.isThemeDependent) {
        proto._themeDependentChanges.push(code);
    }
    if(settings.option) {
        proto._optionChangesMap[settings.option] = code;
    }
    (settings.isOptionChange ? proto._optionChangesOrder : proto._customChangesOrder).push(code);
    buildTotalChanges(proto);
}

function createChainExecutor() {
    const executeChain = function() {
        let i;
        const ii = executeChain._chain.length;
        let result;
        for(i = 0; i < ii; ++i) {
            result = executeChain._chain[i].apply(this, arguments);
        }

        return result;
    };
    executeChain._chain = [];
    executeChain.add = function(item) { executeChain._chain.push(item); };
    executeChain.copy = function(executor) { executeChain._chain = executor._chain.slice(); };

    return executeChain;
}

export function expand(target, name, expander) {
    let current = target[name];
    if(!current) {
        current = expander;
    } else {
        if(!current.add) {
            current = createChainExecutor();
            current.add(target[name]);
            current.add(expander);
        } else {
            if(Object.prototype.hasOwnProperty.call(target, name) === false) {
                current = createChainExecutor();
                current.copy(target[name]);
            }
            current.add(expander);
        }
    }
    target[name] = current;
}

function addPlugin(plugin) {
    const proto = this.prototype;
    proto._plugins.push(plugin);
    plugin.fontFields && proto._fontFields.push.apply(proto._fontFields, plugin.fontFields);
    if(plugin.members) {
        _extend(this.prototype, plugin.members);
    }
    if(plugin.customize) {
        plugin.customize(this);
    }

    if(plugin.extenders) {
        Object.keys(plugin.extenders).forEach(function(key) {
            const func = plugin.extenders[key];
            expand(proto, key, func);
        }, this);
    }
}

export const replaceInherit = isServerSide
    ? function(widget) {
        const _inherit = widget.inherit;
        widget.inherit = function() {
            const result = _inherit.apply(this, arguments);
            const proto = result.prototype;
            [
                '_plugins',
                '_eventsMap',
                '_initialChanges',
                '_themeDependentChanges',
                '_optionChangesMap',
                '_optionChangesOrder',
                '_layoutChangesOrder',
                '_customChangesOrder',
                '_totalChangesOrder'
            ].forEach(function(key) {
                proto[key] = {};
            });

            result.addPlugin = noop;

            return result;
        };
        widget.addChange = noop;
        widget.addPlugin = noop;
    }
    : function(widget) {
        const _inherit = widget.inherit;
        widget.inherit = function() {
            let proto = this.prototype;
            const plugins = proto._plugins;
            const fontFields = proto._fontFields;
            const eventsMap = proto._eventsMap;
            const initialChanges = proto._initialChanges;
            const themeDependentChanges = proto._themeDependentChanges;
            const optionChangesMap = proto._optionChangesMap;
            const partialOptionChangesMap = proto._partialOptionChangesMap;
            const partialOptionChangesPath = proto._partialOptionChangesPath;
            const optionChangesOrder = proto._optionChangesOrder;
            const layoutChangesOrder = proto._layoutChangesOrder;
            const customChangesOrder = proto._customChangesOrder;
            const result = _inherit.apply(this, arguments);

            proto = result.prototype;
            proto._plugins = combineLists(plugins, proto._plugins);
            proto._fontFields = combineLists(fontFields, proto._fontFields);
            proto._eventsMap = combineMaps(eventsMap, proto._eventsMap);
            proto._initialChanges = combineLists(initialChanges, proto._initialChanges);
            proto._themeDependentChanges = combineLists(themeDependentChanges, proto._themeDependentChanges);
            proto._optionChangesMap = combineMaps(optionChangesMap, proto._optionChangesMap);
            proto._partialOptionChangesMap = combineMaps(partialOptionChangesMap, proto._partialOptionChangesMap);
            proto._partialOptionChangesPath = combineMaps(partialOptionChangesPath, proto._partialOptionChangesPath);
            proto._optionChangesOrder = combineLists(optionChangesOrder, proto._optionChangesOrder);
            proto._layoutChangesOrder = combineLists(layoutChangesOrder, proto._layoutChangesOrder);
            proto._customChangesOrder = combineLists(customChangesOrder, proto._customChangesOrder);
            buildTotalChanges(proto);
            result.addPlugin = addPlugin;
            return result;
        };
        widget.prototype._plugins = [];
        widget.prototype._fontFields = [];
        widget.addChange = addChange;
        widget.addPlugin = addPlugin;
    };

export function changes() {
    return new Flags();
}
