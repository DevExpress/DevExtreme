import modules from 'ui/grid_core/ui.grid_core.modules';

QUnit.module('Modules used class', {}, () => {
    /* const RootController = modules.Controller.inherit(
        {
            method: function(param) {
                RootController.calls.push({ instance: this, param });
                return param;
            },
            additionalMethod: function(param) {
                RootController.calls.push({ instance: this, param });
                return 'additionalMethod';
            },
            publicMethods: function() {
                return ['method'];
            }
        }
    );
        const InheritedController = RootController.inherit({
        method: function(param) {
            this.callBase(param);
            RootController.calls.push({ instance: this, param: param + 'override' });
            return param;
        },
        newMethod: function(param) {
            RootController.calls.push({ instance: this, param });
            return param;
        },
        publicMethods: function() {
            return [];
        }
    });
    const WrongInheritance = Class.inherit({});
    */
    class RootController extends modules.Controller {
        static calls = [];
        static constructors = [];
        constructor(component) {
            super(component);
            RootController.constructors.push('RootController');
        }
        publicMethods() {
            return ['method'];
        }
        method(param) {
            RootController.calls.push({ instance: this, param });
            return param;
        }
        additionalMethod(param) {
            RootController.calls.push({ instance: this, param });
            return 'additionalMethod';
        }
    }
    class InheritedController extends RootController {
        method(param) {
            super.method(param);
            RootController.calls.push({
                instance: this,
                param: param + 'override',
            });
            return param;
        }
        newMethod(param) {
            RootController.calls.push({ instance: this, param });
            return param;
        }
        publicMethods() {
            return [];
        }
    }
    class WrongInheritance {}
    QUnit.module(
        'Controller basic functions',
        {
            beforeEach: function() {
                // clean all registerd modules
                modules.modules = [];
                modules.registerModule('root', {
                    controllers: {
                        'root-controller': RootController,
                    },
                });
                RootController.calls = [];
            },
        },
        () => {
            QUnit.test('call controller method', function(assert) {
                // arrange
                const instance = {};
                // act
                modules.processModules(instance, modules);
                const controllerInstance =
                    instance._controllers['root-controller'];
                // assert
                assert.equal(
                    controllerInstance.method('val'),
                    'val',
                    'call method'
                );
                assert.deepEqual(
                    RootController.calls[0],
                    { instance: controllerInstance, param: 'val' },
                    'check calls'
                );
                assert.equal(
                    controllerInstance.component,
                    instance,
                    'component field is instance'
                );
            });

            QUnit.test('public methods', function(assert) {
                // arragne
                const instance = {};
                // act
                modules.processModules(instance, modules);
                const controllerInstance =
                    instance._controllers['root-controller'];
                // assert
                assert.equal(
                    instance.method('val2'),
                    'val2',
                    'publicMethods added to instance'
                );
                assert.deepEqual(
                    RootController.calls[0],
                    { instance: controllerInstance, param: 'val2' },
                    'check calls'
                );
            });

            QUnit.test('wrong inherited class', function(assert) {
                // act
                modules.registerModule('wrong-inheritance', {
                    controllers: {
                        'wrong-inherited-controller': WrongInheritance,
                    },
                });
                const instance = {};
                // assert
                assert.throws(
                    () => modules.processModules(instance, modules),
                    (ex) => {
                        assert.ok(ex.__id, 'E1002');
                        return true;
                    }
                );
            });

            QUnit.test(
                'inheritance controller should not override public method',
                function(assert) {
                    const instance = {};
                    modules.registerModule('inheritance', {
                        controllers: {
                            'inherited-controller': InheritedController,
                        },
                    });
                    modules.processModules(instance, modules);
                    const rootControllerInstance =
                        instance._controllers['root-controller'];

                    assert.equal(
                        instance.method('val3'),
                        'val3',
                        'publicMethods added to instance'
                    );
                    assert.deepEqual(
                        RootController.calls[0],
                        { instance: rootControllerInstance, param: 'val3' },
                        'check ancestor calls'
                    );
                }
            );

            QUnit.test(
                'inheritance controller method should call base controller',
                function(assert) {
                    const instance = {};
                    modules.registerModule('inheritance', {
                        controllers: {
                            'inherited-controller': InheritedController,
                        },
                    });

                    modules.processModules(instance, modules);

                    const controllerInstance =
                        instance._controllers['inherited-controller'];
                    assert.equal(
                        controllerInstance.method('val4'),
                        'val4',
                        'newMethod check'
                    );
                    // assert.deepEqual(OldRootController.calls[0].instance, controllerInstance, 'aaaa');
                    assert.deepEqual(
                        RootController.calls[0],
                        { instance: controllerInstance, param: 'val4' },
                        'check ancestor calls'
                    );
                    assert.deepEqual(
                        RootController.calls[1],
                        { instance: controllerInstance, param: 'val4override' },
                        'check calls'
                    );
                }
            );
        }
    );

    const applyExtender = (Base) => {
        return class Extender extends Base {
            constructor(component) {
                super(component);
                RootController.constructors.push('Extender');
            }
            extenderMethod() {
                RootController.calls.push({
                    instance: this,
                    type: 'extender',
                    name: 'extenderMethod',
                });
            }
            method(param) {
                RootController.calls.push({
                    instance: this,
                    param,
                    type: 'extender',
                });
                return super.method(param);
            }
            useRootControllerMethod(param) {
                const val = this.additionalMethod(param);
                RootController.calls.push({
                    instance: this,
                    param,
                    val,
                    type: 'extender',
                });
                return param;
            }
        };
    };
    QUnit.module(
        'Controller Extender',
        {
            beforeEach: function() {
                // clean all registerd modules
                modules.modules = [];
                modules.registerModule('root', {
                    controllers: {
                        'root-controller': RootController,
                    },
                    extenders: {
                        controllers: {
                            'root-controller': applyExtender,
                        },
                    },
                });
                RootController.calls = [];
                RootController.constructors = [];
            },
        },
        () => {
            QUnit.test('call base method', function(assert) {
                // arrange
                const instance = {};
                // act
                modules.processModules(instance, modules);
                const controllerInstance =
                    instance._controllers['root-controller'];

                assert.equal(
                    controllerInstance.method('val4'),
                    'val4',
                    'overrided by extender method check'
                );
                assert.deepEqual(
                    RootController.calls[0],
                    {
                        instance: controllerInstance,
                        param: 'val4',
                        type: 'extender',
                    },
                    'check ancestor call'
                );
                assert.deepEqual(
                    RootController.calls[1],
                    { instance: controllerInstance, param: 'val4' },
                    'check ancestor call'
                );
            });

            QUnit.test(
                'call useRootControllerMethod method',
                function(assert) {
                    const instance = {};

                    modules.processModules(instance, modules);
                    const controllerInstance =
                        instance._controllers['root-controller'];

                    assert.equal(
                        controllerInstance.useRootControllerMethod('val5'),
                        'val5',
                        'call useRootControllerMethod'
                    );
                    assert.deepEqual(
                        RootController.calls[0],
                        { instance: controllerInstance, param: 'val5' },
                        'check additionalMethod call'
                    );
                    assert.deepEqual(
                        RootController.calls[1],
                        {
                            instance: controllerInstance,
                            param: 'val5',
                            type: 'extender',
                            val: 'additionalMethod',
                        },
                        'check extender call'
                    );
                }
            );

            QUnit.test('Extend extender method', function(assert) {
                // arrange
                /* const ExtendedExtender = {
                extenderMethod: function() {
                    RootController.calls.push({ instance: this, name: 'extenderMethod', type: 'extenderOfExtender' });
                    this.callBase();
                }
            };*/
                const applyExtendedExtender = (Base) =>
                    class ExtendedExtender extends Base {
                        extenderMethod() {
                            RootController.calls.push({
                                instance: this,
                                name: 'extenderMethod',
                                type: 'extenderOfExtender',
                            });
                            super.extenderMethod();
                        }
                    };
                modules.registerModule('extenderOfExtender', {
                    extenders: {
                        controllers: {
                            'root-controller': applyExtendedExtender,
                        },
                    },
                });
                const instance = {};
                modules.processModules(instance, modules);
                const controllerInstance =
                    instance._controllers['root-controller'];
                // act
                controllerInstance.extenderMethod();
                // assert
                assert.deepEqual(
                    RootController.calls[0].type,
                    'extenderOfExtender',
                    'check type es6Class'
                );
                assert.deepEqual(
                    RootController.calls[1].type,
                    'extender',
                    'check type class.inherit'
                );
            });

            QUnit.test('sinon.spy should work', function(assert) {
                // arrange
                /* const ExtendedExtender = {
                extenderMethod: function() {
                    RootController.calls.push({ instance: this, name: 'extenderMethod', type: 'extenderOfExtender' });
                    this.callBase();
                }
            };*/
                const applyExtendedExtender = (Base) =>
                    class ExtendedExtender extends Base {
                        extenderMethod() {
                            RootController.calls.push({
                                instance: this,
                                name: 'extenderMethod',
                                type: 'extenderOfExtender',
                            });
                            super.extenderMethod();
                        }
                    };
                modules.registerModule('extenderOfExtender', {
                    extenders: {
                        controllers: {
                            'root-controller': applyExtendedExtender,
                        },
                    },
                });
                const instance = {};
                modules.processModules(instance, modules);
                const controllerInstance =
                    instance._controllers['root-controller'];

                sinon.spy(controllerInstance, 'extenderMethod');
                // act
                controllerInstance.extenderMethod();
                // assert
                assert.ok(controllerInstance.extenderMethod.calledOnce);
            });

            QUnit.test('Constructor override', function(assert) {
                // arrange
                const applyExtendedExtender = (Base) => {
                    return class ExtendedExtender extends Base {
                        constructor(component) {
                            super(component);
                            RootController.constructors.push(
                                'ExtendedExtender'
                            );
                        }
                    };
                };
                /* const classInheritExtender = {
                ctor: function(component) {
                    this.callBase(component);
                    RootController.constructors.push('class.inherit');
                }
            }

            modules.registerModule('class.inherit', {
                extenders: {
                    controllers: {
                        'root-controller': classInheritExtender
                    }
                }
            });*/
                modules.registerModule('extenderOfExtender', {
                    extenders: {
                        controllers: {
                            'root-controller': applyExtendedExtender,
                        },
                    },
                });
                const component = {};
                // act
                modules.processModules(component, modules);
                const controllerInstance =
                    component._controllers['root-controller'];
                // assert
                assert.deepEqual(
                    RootController.constructors[0],
                    'RootController',
                    'RootController'
                );
                assert.deepEqual(
                    RootController.constructors[1],
                    'Extender',
                    'Extender'
                );
                assert.deepEqual(
                    controllerInstance.component,
                    component,
                    'component'
                );
            });

            QUnit.test(
                'Use extender method in other extender',
                function(assert) {
                    // arrange
                    /*
            const ExtendedExtender = {
                methodUsedExtender: function() {
                    RootController.calls.push({ instance: this, name: 'methodUsedExtender', type: 'extenderOfExtender' });
                    this.extenderMethod();
                }
            };
            */
                    const applyExtendedExtender = (Base) =>
                        class ExtendedExtender extends Base {
                            methodUsedExtender() {
                                RootController.calls.push({
                                    instance: this,
                                    name: 'methodUsedExtender',
                                    type: 'extenderOfExtender',
                                });
                                super.extenderMethod();
                            }
                        };

                    modules.registerModule('extenderOfExtender', {
                        extenders: {
                            controllers: {
                                'root-controller': applyExtendedExtender,
                            },
                        },
                    });
                    const instance = {};
                    modules.processModules(instance, modules);
                    const controllerInstance =
                        instance._controllers['root-controller'];
                    // act
                    controllerInstance.methodUsedExtender();
                    // assert
                    assert.deepEqual(
                        RootController.calls[0].name,
                        'methodUsedExtender',
                        'check type es6Class'
                    );
                    assert.deepEqual(
                        RootController.calls[0].type,
                        'extenderOfExtender',
                        'check type es6Class'
                    );
                    assert.deepEqual(
                        RootController.calls[1].name,
                        'extenderMethod',
                        'check type es6Class'
                    );
                    assert.deepEqual(
                        RootController.calls[1].type,
                        'extender',
                        'check type class.inherit'
                    );
                }
            );

            QUnit.test('override several extender', function(assert) {
                // arrange
                /*
            const Extender1 = {
                extenderMethod1: function() {
                    RootController.calls.push({ name: 'extenderMethod1', type: 'Extender1' });
                }
            };
            const ExtendedExtender = {
                extenderMethod: function() {
                    RootController.calls.push({ name: 'extenderMethod', type: 'extenderOfExtender' });
                    this.callBase();
                },
                extenderMethod1: function() {
                    RootController.calls.push({ name: 'extenderMethod1', type: 'extenderOfExtender' });
                    this.callBase();
                }
            };
            */
                const applyExtender1 = (Base) =>
                    class Extender1 extends Base {
                        extenderMethod1() {
                            RootController.calls.push({
                                name: 'extenderMethod1',
                                type: 'Extender1',
                            });
                        }
                    };
                const applyExtendedExtender = (Base) =>
                    class ExtendedExtender extends Base {
                        extenderMethod() {
                            RootController.calls.push({
                                name: 'extenderMethod',
                                type: 'extenderOfExtender',
                            });
                            super.extenderMethod();
                        }
                        extenderMethod1() {
                            RootController.calls.push({
                                name: 'extenderMethod1',
                                type: 'extenderOfExtender',
                            });
                            super.extenderMethod1();
                        }
                    };

                modules.registerModule('extender1', {
                    extenders: {
                        controllers: {
                            'root-controller': applyExtender1,
                        },
                    },
                });
                modules.registerModule('extenderOfExtender', {
                    extenders: {
                        controllers: {
                            'root-controller': applyExtendedExtender,
                        },
                    },
                });
                const instance = {};
                modules.processModules(instance, modules);
                const controllerInstance =
                    instance._controllers['root-controller'];
                // act
                controllerInstance.extenderMethod();
                controllerInstance.extenderMethod1();
                // assert
                assert.deepEqual(RootController.calls[0], {
                    name: 'extenderMethod',
                    type: 'extenderOfExtender',
                });
                assert.deepEqual(RootController.calls[1], {
                    instance: controllerInstance,
                    name: 'extenderMethod',
                    type: 'extender',
                });
                assert.deepEqual(RootController.calls[2], {
                    name: 'extenderMethod1',
                    type: 'extenderOfExtender',
                });
                assert.deepEqual(RootController.calls[3], {
                    name: 'extenderMethod1',
                    type: 'Extender1',
                });
            });
        }
    );
    QUnit.module('View Extender', {}, () => {
        QUnit.test(
            'Check view use same approach as controller',
            function(assert) {
                // arrange
                /* const ExtendedExtender = {
                extenderMethod: function() {
                    RootView.calls.push({ instance: this, name: 'extenderMethod', type: 'extenderOfExtender' });
                    this.callBase();
                }
            };*/
                class RootView extends modules.View {
                    static calls = [];
                    extenderMethod() {
                        RootView.calls.push({
                            instance: this,
                            name: 'extenderMethod',
                            type: 'RootView',
                        });
                    }
                }
                const applyExtendedExtender = (Base) =>
                    class ExtendedExtender extends Base {
                        extenderMethod() {
                            RootView.calls.push({
                                instance: this,
                                name: 'extenderMethod',
                                type: 'ExtendedExtender',
                            });
                            super.extenderMethod();
                        }
                    };
                // clean up modules
                modules.modules = [];

                modules.registerModule('root', {
                    views: {
                        'root-view': RootView,
                    },
                });
                modules.registerModule('extenderOfViewExtender', {
                    extenders: {
                        views: {
                            'root-view': applyExtendedExtender,
                        },
                    },
                });
                const instance = {};

                modules.processModules(instance, modules);
                const viewInstance = instance._views['root-view'];
                // act
                viewInstance.extenderMethod();
                // assert
                assert.deepEqual(
                    RootView.calls[0],
                    {
                        instance: viewInstance,
                        name: 'extenderMethod',
                        type: 'ExtendedExtender',
                    },
                    'check type es6Class'
                );
                assert.deepEqual(
                    RootView.calls[1],
                    {
                        instance: viewInstance,
                        name: 'extenderMethod',
                        type: 'RootView',
                    },
                    'check type class.inherit'
                );
            }
        );
    });
});
