(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.vizMocks = module.exports = factory(
                require('jquery'),
                require('viz/core/tooltip'),
                require('viz/core/title'),
                require('viz/components/legend'),
                require('viz/axes/base_axis'),
                require('viz/series/points/base_point'),
                require('viz/series/base_series').Series,
                require('viz/core/loading_indicator'),
                require('viz/core/export'),
                require('viz/core/renderers/renderer'),
                require('viz/core/errors_warnings'),
                require('__internal/viz/core/m_base_widget'),
                require('viz/core/base_widget.utils')
            );
        });
    } else {
        root.vizMocks = factory(
            jQuery,
            DevExpress.require('viz/core/tooltip'),
            DevExpress.require('viz/core/title'),
            DevExpress.require('viz/components/legend'),
            DevExpress.require('viz/axes/base_axis'),
            DevExpress.require('viz/series/points/base_point'),
            DevExpress.require('viz/series/base_series').Series,
            DevExpress.require('viz/core/loading_indicator'),
            DevExpress.require('viz/core/export'),
            DevExpress.require('viz/core/renderers/renderer'),
            DevExpress.require('viz/core/errors_warnings'),
            DevExpress.require('__internal/viz/core/m_base_widget'),
            DevExpress.require('viz/core/base_widget.utils')
        );
    }
}(window, function($, tooltipModule, titleModule, legendModule, axisModule, pointModule, Series, loadingIndicatorModule, exportMenuModule, rendererModule, errors, baseWidgetModule, baseWidgetUtils) {
    /* global currentAssert, currentTest */

    const Element = stubClass(rendererModule.SvgElement, {
        attr: function(attrs) {
            if(typeof attrs === 'string') {
                if(attrs.indexOf('scale') !== -1) {
                    return this._stored_settings[attrs] || 1;
                }
                return this._stored_settings[attrs] === undefined ? 0 : this._stored_settings[attrs];
            }
            for(const key in attrs) {
                this._stored_settings[key] = attrs[key];
            }
            return this;
        },
        smartAttr: function(attrs) {
            return this.attr(attrs);
        },
        applyEllipsis: function(maxWidth) { // for text
            return maxWidth < 50;
        },
        setMaxSize: function(maxWidth) { // for text
            return { textChanged: maxWidth < 50 };
        },
        stopAnimation: function() {
            return this;
        },
        css: function(css) {
            for(const key in css) {
                this._stored_styles[key] = css[key];
            }
            return this;
        },
        append: function(parent) {
            !parent.children && (parent.children = []);
            parent.children.push(this);
            this.parent = parent;
            return this;
        },
        clear: function() {
            this.children.length = 0;
            for(let i = 0; i < this.children.length; i++) {
                this.children.parent = null;
            }
            return this;
        },
        remove: function() {
            if(this.parent) {
                for(let i = this.parent.children.length - 1; i >= 0; i--) {
                    if(this.parent.children[i] === this) {
                        this.parent.children.splice(i, 1);
                    }
                }
            }
            this.parent = null;
            return this;
        },
        getBBox: function() {
            const template = $.isFunction(this.renderer.bBoxTemplate) ? this.renderer.bBoxTemplate.call(this) : this.renderer.bBoxTemplate;
            return $.extend({}, template);
        },
        dispose: function() {
            this.clear();
            this.remove();
            $(this.element).remove();
        },
        on: function() {
            $(this.element).on.apply($(this.element), arguments);
            return this;
        },
        off: function(a1, a2, a3) {
            $(this.element).off.apply($(this.element), arguments);
            return this;
        },
        trigger: function(a1, a2, a3) {
            $(this.element).trigger.apply($(this.element), arguments);
            return this;
        },
        restoreText: function() { }
    }, {
        $constructor: function() {
            this.children = [];
            this._stored_settings = {};
            this._stored_styles = {};
            this.element = document.createElement('svg');
            this.element.getScreenCTM = function() { return [0, 1, 1, 0, 210, 240]; };
            this.element.createSVGPoint = function() { return { matrixTransform: function() { return { x: 3, y: 5 }; } }; };
            this.element.addEventListener = function() {};
            this.element.removeEventListener = function() {};
        },
        $thisReturnFunctions: [
            'toBackground',
            'sharp',
            'rotate',
            'enableLinks',
            'virtualLink',
            'linkOn',
            'linkOff',
            'linkAppend',
            'linkRemove',
            'data',
            'animate'
        ]
    });

    let patternCounter = 0;
    let elementCounter = 0;

    const createMockElement = function(renderer, nodeType, params) {
        const elem = new Element();
        elem.__id = elementCounter++;
        elem.renderer = renderer;
        elem.typeOfNode = nodeType;
        $.extend(elem._stored_settings, params);
        if(nodeType === 'pattern') {
            elem.id = 'pattern.id' + patternCounter++;
        }
        if(nodeType === 'shadowFilter') {
            elem.id = 'shadowFilter.id';
        }
        if(nodeType === 'clipRect') {
            elem.id = 'clipRect.id' + patternCounter++;
        }
        if(nodeType === 'brightFilter') {
            elem.id = 'some_bright_ref';
        }
        return elem;
    };

    const Renderer = stubClass(rendererModule.Renderer, {
        animationEnabled: function() { return true; },
        arc: function(x, y, innerRadius, outerRadius, startAngle, endAngle) { return createMockElement(this, 'arc', { x: x, y: y, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle }); },
        g: function() { return createMockElement(this, 'group'); },
        text: function(text, x, y) { return createMockElement(this, 'text', { text: text, x: x, y: y }); },
        rect: function(x, y, width, height) { return createMockElement(this, 'rect', { x: x, y: y, width: width, height: height }); },
        simpleRect: function() { return createMockElement(this, 'rect'); },
        path: function(points, type) { return createMockElement(this, 'path', { points: points, type: type }); },
        circle: function(x, y, r) { return createMockElement(this, 'circle', { cx: x, cy: y, r: r }); },
        image: function(x, y, w, h, href, location) { return createMockElement(this, 'image', { x: x, y: y, width: w, height: h, location: location }); },
        pattern: function(color, hatching) { return createMockElement(this, 'pattern', { color: color, hatching: hatching }); },
        shadowFilter: function(x, y, width, height, dx, dy, blur, color, opacity) { return createMockElement(this, 'shadowFilter', { x: x, y: y, width: width, height: height, dx: dx, dy: dy, blur: blur, color: color, opacity: opacity }); },
        clipRect: function(x, y, width, height) { return createMockElement(this, 'clipRect', { x: x, y: y, width: width, height: height }); },
        dispose: function() {
            this.root.dispose();
        },
        svg: function() { return ''; },
        getRootOffset: function() { return this.offsetTemplate || { left: 3, top: 5 }; },
        brightFilter: function() { return createMockElement(this, 'brightFilter'); },
        linearGradient: function(colors, id, rotationAngle) { return createMockElement(this, 'linearGradient', { color: colors, rotationAngle: rotationAngle, id: id }); },
        radialGradient: function(colors, id) { return createMockElement(this, 'linearGradient', { color: colors, id: id }); },
        customPattern: function(id, template, width, height) { return createMockElement(this, 'pattern', { id: id, template: template, width: width, height: height }); }
    }, {
        $constructor: function(options) { this._options = options; this.root = createMockElement(this, 'root'); this.bBoxTemplate = { x: 1, y: 2, height: 10, width: 20 }; },
        $thisReturnFunctions: ['resize', 'draw', 'clear']
    });

    const dxErrors = errors.ERROR_MESSAGES;

    function ObjectPool(ctor) {
        const that = this;

        this.ctor = ctor;
        this.stubIndex = 0;

        this.returnValues = [];// for consistency with sinon.js

        this.getItem = function() {
            let stub;
            const oldStub = this.returnValues[this.stubIndex];

            if(this.returnValues[this.stubIndex]) {
                stub = this._resetStub(oldStub);
            } else {
                stub = sinon.createStubInstance(this.ctor);
                this.returnValues.push(stub);
            }

            this.stubIndex++;
            return stub;
        };

        this._resetStub = function(stub) {
            $.each(stub, function(key, value) {
                if($.isFunction(value && value.reset)) {
                    value.reset();
                    $.isFunction(value.resetBehavior) && value.resetBehavior();
                } else {
                    stub[key] = undefined;
                }
            });
            return stub;
        };

        this.resetIndex = function() {
            that.stubIndex = 0;
        };

        const wrapCtor = function() {
            return that.getItem();
        };
        wrapCtor.resetIndex = this.resetIndex;
        wrapCtor.returnValues = this.returnValues;
        wrapCtor.toString = function() {
            return 'object pool';// http://en.wikipedia.org/wiki/Object_pool_pattern
        };
        return wrapCtor;
    }

    function incidentOccurred() {
        return sinon.spy(function(idError, options, notValidParameter) {
            const error = dxErrors[idError];

            if(!error) {
                currentAssert().ok(false, 'incidentOccurred Mock error. not find idError' + idError);
                return;
            }
            if(notValidParameter !== undefined) {
                currentAssert().ok(false, 'incidentOccurred Mock error. Pass more two parameters. use array for pass array parameters');
            }
        });
    }

    function stubIncidentOccurredCreation() {
        baseWidgetUtils.DEBUG_stub_createIncidentOccurred(incidentOccurred);
    }

    function restoreIncidentOccurredCreation() {
        baseWidgetUtils.DEBUG_restore_createIncidentOccurred();
    }

    function wrapObject(target, items) {
        const originalItems = $.extend({}, target);
        $.extend(target, items);
        target.__restore = function() {
            delete this.__restore;
            $.each(target, function(name) {
                delete target[name];
            });
            $.extend(target, originalItems);
        };
    }

    function stubClass(target, members, settings) {
        const _members = $.extend({}, members);
        settings = settings || {};
        proto.prototype = typeof target === 'function' ? target.prototype : target;
        const stubPrototype = stub.prototype = new proto();
        $.each(stubPrototype, function(name, member) {
            if(typeof member === 'function' && name !== 'constructor') {
                stubPrototype[name] = function() {
                    createStub(this, name);
                    return this[name].apply(this, arguments);
                };
            }
        });
        settings.$extraFunctions && $.each(settings.$extraFunctions, function(_, name) {
            _members[name] = 'name' in _members ? _members[name] : function() { };
        });
        settings.$thisReturnFunctions && $.each(settings.$thisReturnFunctions, function(_, name) {
            _members[name] = 'name' in _members ? _members[name] : function() { return this; };
        });
        settings.$forceStubs && (function() {
            const $constructor = settings.$constructor;
            settings.$constructor = function() {
                const instance = this;
                $constructor && $constructor.apply(instance, arguments);
                $.each(settings.$forceStubs, function(_, name) {
                    instance.stub(name);
                });
            };
        }());
        $.each(_members, function(name, member) {
            if(typeof member === 'function' && name !== 'constructor') {
                stubPrototype[name] = function() {
                    createStub(this, name);
                    return this[name].apply(this, arguments);
                };
            } else if(name !== 'constructor') {
                stubPrototype[name] = member;
            }
        });
        stubPrototype.stub = function(name) {
            if(this.__stubs[name] === undefined) {
                if(typeof stubPrototype[name] === 'function' && name !== 'constructor') {
                    createStub(this, name);
                } else {
                    this.__stubs[name] = null;
                }
            }
            return this.__stubs[name];
        };
        function stub() {
            this.__stubs = {};
            this.ctorArgs = $.makeArray(arguments);
            settings.$constructor && settings.$constructor.apply(this, arguments);
            stub.called && stub.called(this);
        }
        function proto() {
            this.constructor = stub;
        }
        function createStub(instance, name) {
            instance[name] = instance.__stubs[name] = typeof _members[name] === 'function' ? sinon.spy(_members[name]) : sinon.stub();
        }
        return stub;
    }

    //  B232790
    const getClass = function($element) {
        return $element.attr('class');
    };

    function environmentMethodInvoker(name, defaultResult) {
        return function() {
            const method = currentTest()[name];
            if(method) {
                return method.apply(this, arguments);
            } else if(typeof defaultResult === 'function') {
                return defaultResult.apply(this, arguments);
            } else {
                return defaultResult;
            }
        };
    }

    function forceThemeOptions(themeManager) {
        themeManager.setCallback.lastCall.args[0]();
    }

    function spyUponProtectedMethod(target, methodName) {
        let spy = null;
        if(typeof target['TEST' + methodName] === 'function') {
            spy = target[methodName] = sinon.spy();
        } else {
            throw new Error('The protected must also be defined as \'TEST_someMethod\' within the target.');
        }
        return spy;
    }

    return {
        Element: Element,
        Renderer: Renderer,
        LoadingIndicator: stubClass(loadingIndicatorModule.LoadingIndicator),
        ExportMenu: stubClass(exportMenuModule.ExportMenu),
        Point: stubClass(pointModule.Point),
        Series: stubClass(Series),
        Legend: stubClass(legendModule.Legend),
        Title: stubClass(titleModule.Title),
        Tooltip: stubClass(tooltipModule.Tooltip),
        Axis: stubClass(axisModule.Axis),
        incidentOccurred: incidentOccurred,
        stubIncidentOccurredCreation: stubIncidentOccurredCreation,
        restoreIncidentOccurredCreation: restoreIncidentOccurredCreation,
        wrapObject: wrapObject,
        stubClass: stubClass,
        ObjectPool: ObjectPool,
        getClass: getClass,
        environmentMethodInvoker: environmentMethodInvoker,
        forceThemeOptions: forceThemeOptions,
        spyUponProtectedMethod: spyUponProtectedMethod
    };

}));
