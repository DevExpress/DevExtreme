import $ from 'jquery';
import testing from './utils.js';
import Map from 'ui/map';
import Provider from '__internal/ui/map/provider';
import GoogleStaticProvider from '__internal/ui/map/provider.google_static';
import ajaxMock from '../../../helpers/ajaxMock.js';

const MARKERS = testing.MARKERS;
const ROUTES = testing.ROUTES;

const MAP_CLASS = 'dx-map';
const MAP_CONTAINER_CLASS = 'dx-map-container';
const MAP_SHIELD_CLASS = 'dx-map-shield';


QUnit.module('rendering', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('widget should be rendered', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });

    assert.ok($map.hasClass(MAP_CLASS), 'widget class added');
});

QUnit.test('widget should be rendered with correct dimensions', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        width: 100,
        height: 150
    });

    assert.ok($map.hasClass(MAP_CLASS), 'widget class added');
    assert.equal($map.width(), 100, 'width set correctly');
    assert.equal($map.height(), 150, 'height set correctly');
});

QUnit.test('map container should be rendered', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });

    assert.ok($map.children('.' + MAP_CONTAINER_CLASS), 'map container rendered');
});


QUnit.module('option change', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('disabled', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });
    const map = $map.dxMap('instance');

    map.option('disabled', true);
    assert.equal($map.find('.' + MAP_SHIELD_CLASS).length, 1);

    map.option('disabled', false);
    assert.equal($map.find('.' + MAP_SHIELD_CLASS).length, 0);
});


QUnit.module('markers', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('markers option should respond on add marker as object', function(assert) {
    assert.expect(3);

    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });
    const map = $map.dxMap('instance');

    const done = assert.async();
    map.addMarker(MARKERS[0]).done(function() {
        assert.ok(true, 'action resolved');
        assert.equal(this, map, 'correct context specified');

        done();
    });

    assert.deepEqual(map.option('markers'), [MARKERS[0]], 'marker added');
});

QUnit.test('markers option should respond on add marker as array', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });
    const map = $map.dxMap('instance');

    map.addMarker([MARKERS[0], MARKERS[2]]);

    assert.deepEqual(map.option('markers'), [MARKERS[0], MARKERS[2]], 'markers added');
});

QUnit.test('markers option should respond on remove marker as object', function(assert) {
    assert.expect(3);

    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        markers: [MARKERS[0]]
    });
    const map = $map.dxMap('instance');

    const done = assert.async();
    map.removeMarker(MARKERS[0]).done(function() {
        assert.ok(true, 'action resolved');
        assert.equal(this, map, 'correct context specified');

        done();
    });

    assert.deepEqual(map.option('markers'), [], 'marker removed');
});

QUnit.test('markers option should respond on remove marker as array', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        markers: [MARKERS[0], MARKERS[2]]
    });
    const map = $map.dxMap('instance');

    map.removeMarker([MARKERS[0], MARKERS[2]]);

    assert.deepEqual(map.option('markers'), [], 'markers removed');
});

QUnit.test('markers option should respond on remove marker as number', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        markers: [MARKERS[0], MARKERS[2]]
    });
    const map = $map.dxMap('instance');

    map.removeMarker(1);

    assert.deepEqual(map.option('markers'), [MARKERS[0]], 'marker removed');
});

QUnit.test('markers option should not accept null at initialization', function(assert) {
    assert.throws(function() {
        $('#map').dxMap({
            provider: 'googleStatic',
            markers: null
        });
    }, /markers/i, 'not array exception was thrown');
});

QUnit.test('markers option should not accept null at runtime', function(assert) {
    assert.throws(function() {
        $('#map').dxMap({
            provider: 'googleStatic'
        }).dxMap('option', 'markers', null);
    }, /markers/i, 'not array exception was thrown');
});


QUnit.module('saving previous markers', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('pushing into markers option should render new marker', function(assert) {
    let addedMarkers = 0;
    let removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            onMarkerAdded: function() {
                addedMarkers++;
            },
            onMarkerRemoved: function() {
                removedMarkers++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                resolve(map);
            });

            const markers = map.option('markers');
            markers.push(MARKERS[0]);
            map.option('markers', markers);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedMarkers, 1 + 2, 'correct number of markers added');
                assert.equal(removedMarkers, 1, 'correct number of markers removed');

                resolve();
            });

            const markers = map.option('markers');
            markers.push(MARKERS[1]);
            map.option('markers', markers);
        });
    });
});

QUnit.test('adding same marker after addMarker method call should not render marker', function(assert) {
    let addedMarkers = 0;
    let removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            onMarkerAdded: function() {
                addedMarkers++;
            },
            onMarkerRemoved: function() {
                removedMarkers++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                resolve(map);
            });

            map.addMarker(MARKERS[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedMarkers, 1 + 1, 'correct number of markers added');
                assert.equal(removedMarkers, 1, 'correct number of markers removed');

                resolve();
            });

            map.option('markers', [MARKERS[0]]);
        });
    });
});

QUnit.test('adding same marker after removeMarker should render marker', function(assert) {
    let addedMarkers = 0;
    let removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            markers: [MARKERS[0]],
            onMarkerAdded: function() {
                addedMarkers++;
            },
            onMarkerRemoved: function() {
                removedMarkers++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                resolve(map);
            });

            map.removeMarker(MARKERS[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedMarkers, 1 + 1, 'correct number of markers added');
                assert.equal(removedMarkers, 1, 'correct number of markers removed');

                resolve();
            });

            map.option('markers', [MARKERS[0]]);
        });
    });
});

QUnit.test('changing existing marker should rerender marker', function(assert) {
    let addedMarkers = 0;
    let removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            markers: [MARKERS[0]],
            onMarkerAdded: function() {
                addedMarkers++;
            },
            onMarkerRemoved: function() {
                removedMarkers++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedMarkers, 1 + 1, 'correct number of markers added');
                assert.equal(removedMarkers, 1, 'correct number of markers removed');

                resolve();
            });

            map.option('markers', [MARKERS[0]]);
        });
    });
});


QUnit.module('async markers rendering', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('addMarker method call should not render marker twice', function(assert) {
    let addedMarkers = 0;

    const done = assert.async();

    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        onMarkerAdded: function() {
            addedMarkers++;
        }
    });
    const map = $map.dxMap('instance');

    map.addMarker(MARKERS[0]).done(function() {
        assert.equal(addedMarkers, 1, 'correct number of markers added');

        done();
    });
});

QUnit.test('markers option change should not render incorrect markers', function(assert) {
    let addedMarkers = 0;

    const done = assert.async();

    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        onMarkerAdded: function() {
            addedMarkers++;
        },
        onReady: function() {
            // NOTE: Only second onReady matters
            map.option('onReady', function() {
                assert.equal(addedMarkers, 1, 'correct number of markers added');

                $map.remove();
                done();
            });
        }
    });
    const map = $map.dxMap('instance');

    const markers = [MARKERS[0]];
    map.option('markers', markers);
    markers.push(MARKERS[1]);
    map.option('markers', markers);
    map.option('markers', markers);
    map.option('markers', markers);
    map.option('markers', markers);
    map.option('markers', markers);
    map.option('markers', markers);
    map.option('markers', markers);
});


QUnit.module('routes', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('routes option should respond on add route as object', function(assert) {
    assert.expect(3);

    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });
    const map = $map.dxMap('instance');

    const done = assert.async();
    map.addRoute(ROUTES[0]).done(function() {
        assert.ok(true, 'action resolved');
        assert.equal(this, map, 'correct context specified');

        done();
    });

    assert.deepEqual(map.option('routes'), [ROUTES[0]], 'route added');
});

QUnit.test('routes option should respond on add route as array', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic'
    });
    const map = $map.dxMap('instance');

    map.addRoute([ROUTES[0], ROUTES[2]]);

    assert.deepEqual(map.option('routes'), [ROUTES[0], ROUTES[2]], 'routes added');
});

QUnit.test('routes option should respond on remove route as object', function(assert) {
    assert.expect(3);

    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        routes: [ROUTES[0]]
    });
    const map = $map.dxMap('instance');

    const done = assert.async();
    map.removeRoute(ROUTES[0]).done(function() {
        assert.ok(true, 'action resolved');
        assert.equal(this, map, 'correct context specified');

        done();
    });

    assert.deepEqual(map.option('routes'), [], 'route removed');
});

QUnit.test('routes option should respond on remove route as array', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        routes: [ROUTES[0], ROUTES[2]]
    });
    const map = $map.dxMap('instance');

    map.removeRoute([ROUTES[0], ROUTES[2]]);

    assert.deepEqual(map.option('routes'), [], 'routes removed');
});

QUnit.test('routes option should respond on remove route as number', function(assert) {
    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        routes: [ROUTES[0], ROUTES[2]]
    });
    const map = $map.dxMap('instance');

    map.removeRoute(1);

    assert.deepEqual(map.option('routes'), [ROUTES[0]], 'route removed');
});

QUnit.test('routes option should not accept null at initialization', function(assert) {
    assert.throws(function() {
        $('#map').dxMap({
            provider: 'googleStatic',
            routes: null
        });
    }, /routes/i, 'not array exception was thrown');
});

QUnit.test('routes option should not accept null at runtime', function(assert) {
    assert.throws(function() {
        $('#map').dxMap({
            provider: 'googleStatic'
        }).dxMap('option', 'routes', null);
    }, /routes/i, 'not array exception was thrown');
});


QUnit.module('saving previous routes', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('pushing into routes option should render new route', function(assert) {
    let addedRoutes = 0;
    let removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            onRouteAdded: function() {
                addedRoutes++;
            },
            onRouteRemoved: function() {
                removedRoutes++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                resolve(map);
            });

            const routes = map.option('routes');
            routes.push(ROUTES[0]);
            map.option('routes', routes);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedRoutes, 1 + 2, 'correct number of routes added');
                assert.equal(removedRoutes, 1, 'correct number of routes removed');

                resolve();
            });

            const routes = map.option('routes');
            routes.push(ROUTES[1]);
            map.option('routes', routes);
        });
    });
});

QUnit.test('adding same route after addRoute should not render route', function(assert) {
    let addedRoutes = 0;
    let removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            onRouteAdded: function() {
                addedRoutes++;
            },
            onRouteRemoved: function() {
                removedRoutes++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                resolve(map);
            });

            map.addRoute(ROUTES[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedRoutes, 1 + 1, 'correct number of routes added');
                assert.equal(removedRoutes, 1, 'correct number of routes removed');

                resolve();
            });

            map.option('routes', [ROUTES[0]]);
        });
    });
});

QUnit.test('adding route after removeRoute should render route', function(assert) {
    let addedRoutes = 0;
    let removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            routes: [ROUTES[0]],
            onRouteAdded: function() {
                addedRoutes++;
            },
            onRouteRemoved: function() {
                removedRoutes++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                resolve(map);
            });

            map.removeRoute(ROUTES[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedRoutes, 1 + 1, 'correct number of routes added');
                assert.equal(removedRoutes, 1, 'correct number of routes removed');

                resolve();
            });

            map.option('routes', [ROUTES[0]]);
        });
    });
});

QUnit.test('changing existing route should rerender marker', function(assert) {
    let addedRoutes = 0;
    let removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            routes: [ROUTES[0]],
            onRouteAdded: function() {
                addedRoutes++;
            },
            onRouteRemoved: function() {
                removedRoutes++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(addedRoutes, 1 + 1, 'correct number of routes added');
                assert.equal(removedRoutes, 1, 'correct number of routes removed');

                resolve();
            });

            map.option('routes', [ROUTES[0]]);
        });
    });
});


QUnit.module('async routes rendering', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('addRoute method call should not render route twice', function(assert) {
    let addedRoutes = 0;

    const done = assert.async();

    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        onRouteAdded: function() {
            addedRoutes++;
        }
    });
    const map = $map.dxMap('instance');

    map.addRoute(ROUTES[0]).done(function() {
        assert.equal(addedRoutes, 1, 'correct number of markers added');

        done();
    });
});

QUnit.test('routes option change should not render incorrect routes', function(assert) {
    let addedRoutes = 0;

    const done = assert.async();

    const $map = $('#map').dxMap({
        provider: 'googleStatic',
        onRouteAdded: function() {
            addedRoutes++;
        },
        onReady: function() {
            // NOTE: Only second onReady matters
            map.option('onReady', function() {
                assert.equal(addedRoutes, 1, 'correct number of routes added');

                $map.remove();
                done();
            });
        }
    });
    const map = $map.dxMap('instance');

    const routes = [ROUTES[0]];
    map.option('routes', routes);
    routes.push(ROUTES[1]);
    map.option('routes', routes);
});


QUnit.module('Change provider', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('change provider and async options', function(assert) {
    const makeConfig = function(resolve) {
        return {
            provider: 'googleStatic',
            zoom: 1000,
            markers: [{
                iconSrc: null,
                location: {
                    lat: 40.755833,
                    lng: -73.986389
                }
            }, {
                iconSrc: null,
                location: {
                    lat: 40.7825,
                    lng: -73.966111
                }
            }],
            onReady: function(e) {
                resolve(e.component);
            }
        };
    };

    return new Promise(function(resolve) {
        new Map($('#map'), makeConfig(resolve));
    }).then(function(map) {
        map._options.silent('provider', 'bing');
        return new Promise((resolve) => {
            map.option(makeConfig(resolve));
        });
    }).then(function(map) {
        assert.ok(map._asyncActionSuppressed);
    });
});

['resolve', 'reject'].forEach((completion) => {
    QUnit.test(`async ${completion} from a replaced provider is ignored`, function(assert) {
        let completeAction;
        const actionResult = new Promise((resolve, reject) => {
            completeAction = completion === 'resolve' ? resolve : reject;
        });
        const replacedProvider = {
            updateZoom: sinon.stub().returns(actionResult)
        };
        const map = {
            _provider: replacedProvider,
            _lastAsyncAction: Promise.resolve(),
            _triggerReadyAction: sinon.spy(),
            _triggerUpdateAction: sinon.spy(),
        };
        const action = Map.prototype._queueAsyncAction.call(map, 'updateZoom');

        return Promise.resolve().then(() => {
            assert.ok(replacedProvider.updateZoom.calledOnce, 'action starts on the captured provider');
            map._provider = {};
            completeAction(completion === 'resolve' ? true : new Error('stale provider'));

            return action;
        }).then(() => {
            assert.ok(map._triggerReadyAction.notCalled, 'stale action does not raise onReady');
            assert.ok(map._triggerUpdateAction.notCalled, 'stale action does not raise onUpdated');
        });
    });
});

QUnit.test('queued action is not started after its provider is replaced', function(assert) {
    let continueQueue;
    const replacedProvider = {
        updateZoom: sinon.spy()
    };
    const map = {
        _provider: replacedProvider,
        _lastAsyncAction: new Promise(resolve => {
            continueQueue = resolve;
        }),
        _triggerReadyAction: sinon.spy(),
        _triggerUpdateAction: sinon.spy(),
    };
    const action = Map.prototype._queueAsyncAction.call(map, 'updateZoom');
    map._provider = {};
    continueQueue();

    return action.then(() => {
        assert.ok(replacedProvider.updateZoom.notCalled, 'action captured for the old provider is skipped');
    });
});

QUnit.module('disposed widget', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: '',
        });

        this.instance = new Map($('#map'), {
            provider: 'googleStatic',
        });

        this.getProvider = () => {
            return this.instance._provider;
        };

        this.getLastAsyncAction = () => {
            return this.instance._lastAsyncAction;
        };
    },
    afterEach: function() {
        ajaxMock.clear();
    }
}, () => {
    QUnit.test('there is no error when async action is completed after widget is disposed (T914315)', function(assert) {
        const done = assert.async();

        this.instance.option('onReady', () => {
            this.getProvider().updateZoom = () => {
                this.instance.dispose();

                return Promise.resolve(true);
            };

            this.instance.option('zoom', 10);

            this.getLastAsyncAction().then(
                () => {
                    assert.ok(true, 'no errors');
                    done();
                },
                (e) => {
                    assert.ok(false, `error: ${e.message}`);
                    done();
                }
            );
        });
    });
});

QUnit.module('provider update operations', () => {
    ['Markers', 'Routes'].forEach(collection => {
        const updateMethod = `update${collection}`;
        const addMethod = `add${collection}`;
        const removeMethod = `remove${collection}`;

        QUnit.test(`${updateMethod} waits for removal and returns the addition result`, async function(assert) {
            const provider = new Provider(null, null);
            const removedOptions = [{}];
            const addedOptions = [{}];
            const addedResult = [false, [{}]];
            let completeRemoval;
            const removal = new Promise(resolve => { completeRemoval = resolve; });
            const remove = sinon.stub(provider, removeMethod).returns(removal);
            const add = sinon.stub(provider, addMethod).returns(Promise.resolve(addedResult));

            const pending = provider[updateMethod](removedOptions, addedOptions);
            assert.ok(remove.calledOnceWithExactly(removedOptions), 'removal receives its options');
            assert.ok(add.notCalled, 'addition waits for removal to finish');
            completeRemoval(true);

            assert.strictEqual(await pending, addedResult, 'addition result is preserved');
            assert.ok(add.calledOnceWithExactly(addedOptions), 'addition receives its options');
        });

        ['add', 'remove'].forEach(operation => {
            QUnit.test(`${updateMethod} rejects when ${operation} fails`, async function(assert) {
                const provider = new Provider(null, null);
                const reason = new Error('Provider operation failed');
                const remove = sinon.stub(provider, removeMethod).returns(Promise.resolve());
                const add = sinon.stub(provider, addMethod).returns(Promise.resolve());
                const failingOperation = operation === 'add' ? add : remove;
                failingOperation.callsFake(() => Promise.reject(reason));

                await assert.rejects(provider[updateMethod]([{}], [{}]), reason, 'the update rejects with the original error');
                if(operation === 'remove') {
                    assert.ok(add.notCalled, 'failed removal prevents addition');
                }
            });
        });

        QUnit.test(`${updateMethod} skips empty batches`, async function(assert) {
            const provider = new Provider(null, null);
            const remove = sinon.spy(provider, removeMethod);
            const add = sinon.spy(provider, addMethod);

            assert.strictEqual(await provider[updateMethod]([], []), undefined, 'empty update completes without a result');
            assert.ok(remove.notCalled, 'empty removal is skipped');
            assert.ok(add.notCalled, 'empty addition is skipped');
        });
    });
});

QUnit.module('Accessibility', {
    beforeEach: function() {
        const fakeURL = '/fakeGoogleUrl?';

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ''
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
}, () => {
    QUnit.test('tabindex should not be on main div', function(assert) {
        const $map = $('#map').dxMap({
            provider: 'googleStatic',
        });

        assert.notOk($map.attr('tabindex'));
    });
});
