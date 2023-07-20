import $ from 'jquery';
import testing from './utils.js';
import Map from 'ui/map';
import GoogleStaticProvider from 'ui/map/provider.google_static';
import Color from 'color';
import ajaxMock from '../../../helpers/ajaxMock.js';

const LOCATIONS = testing.LOCATIONS;
const MARKERS = testing.MARKERS;
const ROUTES = testing.ROUTES;

const MAP_CONTAINER_CLASS = 'dx-map-container';


QUnit.module('googleStatic provider', {
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

const mapUrl = function(map) {
    return backgroundUrl((map.element ? map.$element() : map).find('.' + MAP_CONTAINER_CLASS));
};

const backgroundUrl = function($element) {
    return $element.css('backgroundImage').replace(/^url|[("")]/g, '');
};

QUnit.test('map ready action', function(assert) {
    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            onReady: function(e) {
                assert.ok(true, 'map rendered');

                resolve();
            }
        });
    });
});

QUnit.test('default options', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('sensor=false'), -1, 'dimensions set correctly');

                resolve();
            }
        });
    });
});

QUnit.test('dimensions', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            width: 400,
            height: 500,
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('size=400x500'), -1, 'dimensions set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                map.option('onReady', function() {
                    assert.notEqual(mapUrl(map).indexOf('size=300x400'), -1, 'dimensions set correctly');

                    resolve();
                });
            });

            map.option({
                'width': 300,
                'height': 400
            });
        });
    });
});

QUnit.test('type', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            type: 'hybrid',
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('maptype=hybrid'), -1, 'type set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('maptype=roadmap'), -1, 'type set correctly');

                resolve(map);
            });

            map.option('type', 'roadmap');
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('maptype=satellite'), -1, 'type set correctly');

                resolve();
            });

            map.option('type', 'satellite');
        });
    });
});

QUnit.test('center', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            center: LOCATIONS[0],
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('center=Brooklyn+Bridge,New+York,NY'), -1, 'center set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('center=40.537102,-73.990318'), -1, 'center set correctly');

                resolve(map);
            });

            map.option('center', LOCATIONS[1]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('center=40.539102,-73.970318'), -1, 'center set correctly');

                resolve(map);
            });

            map.option('center', LOCATIONS[2]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('center=40.557102,-72.990318'), -1, 'center set correctly');

                resolve();
            });

            map.option('center', LOCATIONS[3]);
        });
    });
});

QUnit.test('location parsing should be correct in case of string with one comma', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            center: 'A, B',
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('center=A,+B'), -1, 'center set correctly');

                resolve(e.component);
            }
        });
    });
});

QUnit.test('zoom', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            zoom: 1,
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('zoom=1'), -1, 'zoom set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('zoom=13'), -1, 'zoom set correctly');

                resolve();
            });

            map.option('zoom', 13);
        });
    });
});

QUnit.test('apiKey', function(assert) {
    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            apiKey: 10153453,
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('key=10153453'), -1, 'key set correctly');

                resolve();
            }
        });
    });
});

QUnit.test('markers', function(assert) {
    assert.expect(4);

    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            markers: [MARKERS[0]],
            onReady: function(e) {
                assert.notEqual(mapUrl(map)
                    .indexOf('markers=' + MARKERS[0].location.lat + ',' + MARKERS[0].location.lng), -1, 'markers set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map)
                    .indexOf('markers=' + MARKERS[0].location.lat + ',' + MARKERS[0].location.lng + '|' + MARKERS[1].location[0] + ',' + MARKERS[1].location[1]), -1, 'markers set correctly');

                resolve(map);
            });

            map.option('markers', [MARKERS[0], MARKERS[1]]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.equal(mapUrl(map)
                    .indexOf('|' + MARKERS[1].location[0] + ',' + MARKERS[1].location[1]), -1, 'marker removed correctly');
            });

            map.removeMarker(MARKERS[1]).done(function() {
                resolve(map);
            });
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map)
                    .indexOf('markers=' + MARKERS[0].location.lat + ',' + MARKERS[0].location.lng + '|' + MARKERS[1].location[0] + ',' + MARKERS[1].location[1]), -1, 'marker added correctly');
            });

            map.addMarker(MARKERS[1]).done(function() {
                resolve(map);
            });
        });
    });
});

QUnit.test('markerIcon', function(assert) {
    const markerUrl1 = 'http://example.com/1.png';
    const markerUrl2 = 'http://example.com/2.png';

    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            markers: [MARKERS[0]],
            markerIconSrc: markerUrl1,
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf('markers=icon:' + markerUrl1 + '|' + MARKERS[0].location.lat + ',' + MARKERS[0].location.lng), -1, 'markers set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf('markers=icon:' + markerUrl2 + '|' + MARKERS[0].location.lat + ',' + MARKERS[0].location.lng), -1, 'markers set correctly');

                resolve(map);
            });

            map.option('markerIconSrc', markerUrl2);
        });
    });
});

QUnit.test('markerAdded', function(assert) {
    let markerAddedFired = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            markers: [MARKERS[0]],
            onMarkerAdded: function(args) {
                assert.equal(args.options, MARKERS[0], 'correct options passed as parameter');
                markerAddedFired++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function() {
        assert.equal(markerAddedFired, 1, 'markerAdded fired');
    });
});

QUnit.test('markerRemoved', function(assert) {
    let markerRemovedFired = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            markers: [MARKERS[0]],
            onMarkerRemoved: function(args) {
                assert.equal(args.options, MARKERS[0], 'correct options passed as parameter');
                markerRemovedFired++;
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

            map.option('markers', []);
        });
    }).then(function() {
        assert.equal(markerRemovedFired, 1, 'markerRemoved fired');
    });
});

QUnit.test('autoAdjust', function(assert) {
    assert.expect(0);

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            autoAdjust: true,
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function(map) {
        map.option('autoAdjust', false);
    });
});

QUnit.test('routes', function(assert) {
    const route0 = 'path='
        + 'color:' + (new Color(ROUTES[0].color).toHex() + Math.round((ROUTES[0].opacity) * 255).toString(16)).replace('#', '0x') + '|'
        + 'weight:' + ROUTES[0].weight + '|'
        + ROUTES[0].locations[0][0] + ',' + ROUTES[0].locations[0][1] + '|'
        + ROUTES[0].locations[1][0] + ',' + ROUTES[0].locations[1][1] + '|'
        + ROUTES[0].locations[2][0] + ',' + ROUTES[0].locations[2][1];

    return new Promise(function(resolve) {
        const map = new Map($('#map'), {
            provider: 'googleStatic',
            routes: [ROUTES[0]],
            onReady: function(e) {
                assert.notEqual(mapUrl(map).indexOf(route0), -1, 'routes set correctly');

                resolve(e.component);
            }
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option('onReady', function() {
                assert.notEqual(mapUrl(map).indexOf(route0 + '&' + route0), -1, 'routes set correctly');

                resolve(map);
            });

            map.option('routes', [ROUTES[0], ROUTES[0]]);
        });
    });
});

QUnit.test('routeAdded', function(assert) {
    let routeAddedFired = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            routes: [ROUTES[0]],
            onRouteAdded: function(args) {
                assert.equal(args.options, ROUTES[0], 'correct options passed as parameter');
                routeAddedFired++;
            },
            onReady: function(e) {
                resolve(e.component);
            }
        });
    }).then(function() {
        assert.equal(routeAddedFired, 1, 'routeAdded fired');
    });
});

QUnit.test('routeRemoved', function(assert) {
    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            routes: [ROUTES[0]],
            onRouteRemoved: function(args) {
                assert.equal(args.options, ROUTES[0], 'correct options passed as parameter');
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

            map.option('routes', []);
        });
    });
});

QUnit.test('click', function(assert) {
    let clicked = 0;
    let eventFired = 0;

    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            width: 400,
            height: 500,
            onClick: function() {
                clicked++;
            },
            onReady: function(e) {
                const $element = $(e.element);
                $element.dxMap('instance').on('click', function() {
                    eventFired++;
                });
                $element.children().trigger('dxclick');

                resolve();
            }
        });
    }).then(function() {
        assert.equal(clicked, 1);
        assert.equal(eventFired, 1);
    });
});

QUnit.test('the pointer down event propagation should be canceled', function(assert) {
    let isPropagationStopped;
    return new Promise(function(resolve) {
        new Map($('#map'), {
            provider: 'googleStatic',
            width: 400,
            height: 500,
            onReady: function(e) {
                $(e.element).on('dxpointerdown', function(e) {
                    isPropagationStopped = e.isPropagationStopped();
                });
                $(e.element).children().trigger('dxpointerdown');

                resolve();
            }
        });
    }).then(function() {
        assert.ok(!isPropagationStopped);
    });
});
