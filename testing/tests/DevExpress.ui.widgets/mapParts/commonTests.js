var $ = require("jquery"),
    testing = require("./utils.js"),
    Map = require("ui/map"),
    GoogleStaticProvider = require("ui/map/provider.google_static"),
    ajaxMock = require("../../../helpers/ajaxMock.js");

var MARKERS = testing.MARKERS,
    ROUTES = testing.ROUTES;

var MAP_CLASS = "dx-map",
    MAP_CONTAINER_CLASS = "dx-map-container",
    MAP_SHIELD_CLASS = "dx-map-shield",
    NATIVE_CLICK_CLASS = "dx-native-click";


QUnit.module("rendering", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("widget should be rendered", function(assert) {
    var $map = $("#map").dxMap({
        provider: "googleStatic"
    });

    assert.ok($map.hasClass(MAP_CLASS), "widget class added");
});

QUnit.test("clicks inside map should be native (T349301)", function(assert) {
    var $map = $("#map").dxMap({
        provider: "googleStatic"
    });

    assert.ok($map.hasClass(NATIVE_CLICK_CLASS), "native click class added");
});

QUnit.test("widget should be rendered with correct dimensions", function(assert) {
    var $map = $("#map").dxMap({
        provider: "googleStatic",
        width: 100,
        height: 150
    });

    assert.ok($map.hasClass(MAP_CLASS), "widget class added");
    assert.equal($map.width(), 100, "width set correctly");
    assert.equal($map.height(), 150, "height set correctly");
});

QUnit.test("map container should be rendered", function(assert) {
    var $map = $("#map").dxMap({
        provider: "googleStatic"
    });

    assert.ok($map.children("." + MAP_CONTAINER_CLASS), "map container rendered");
});


QUnit.module("option change", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("disabled", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic"
        }),
        map = $map.dxMap("instance");

    map.option("disabled", true);
    assert.equal($map.find("." + MAP_SHIELD_CLASS).length, 1);

    map.option("disabled", false);
    assert.equal($map.find("." + MAP_SHIELD_CLASS).length, 0);
});


QUnit.module("markers", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("markers option should respond on add marker as object", function(assert) {
    assert.expect(3);

    var $map = $("#map").dxMap({
            provider: "googleStatic"
        }),
        map = $map.dxMap("instance");

    var done = assert.async();
    map.addMarker(MARKERS[0]).done(function() {
        assert.ok(true, "action resolved");
        assert.equal(this, map, "correct context specified");

        done();
    });

    assert.deepEqual(map.option("markers"), [MARKERS[0]], "marker added");
});

QUnit.test("markers option should respond on add marker as array", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic"
        }),
        map = $map.dxMap("instance");

    map.addMarker([MARKERS[0], MARKERS[2]]);

    assert.deepEqual(map.option("markers"), [MARKERS[0], MARKERS[2]], "markers added");
});

QUnit.test("markers option should respond on remove marker as object", function(assert) {
    assert.expect(3);

    var $map = $("#map").dxMap({
            provider: "googleStatic",
            markers: [MARKERS[0]]
        }),
        map = $map.dxMap("instance");

    var done = assert.async();
    map.removeMarker(MARKERS[0]).done(function() {
        assert.ok(true, "action resolved");
        assert.equal(this, map, "correct context specified");

        done();
    });

    assert.deepEqual(map.option("markers"), [], "marker removed");
});

QUnit.test("markers option should respond on remove marker as array", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic",
            markers: [MARKERS[0], MARKERS[2]]
        }),
        map = $map.dxMap("instance");

    map.removeMarker([MARKERS[0], MARKERS[2]]);

    assert.deepEqual(map.option("markers"), [], "markers removed");
});

QUnit.test("markers option should respond on remove marker as number", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic",
            markers: [MARKERS[0], MARKERS[2]]
        }),
        map = $map.dxMap("instance");

    map.removeMarker(1);

    assert.deepEqual(map.option("markers"), [MARKERS[0]], "marker removed");
});

QUnit.test("markers option should not accept null at initialization", function(assert) {
    assert.throws(function() {
        $("#map").dxMap({
            provider: "googleStatic",
            markers: null
        });
    }, /markers/i, "not array exception was thrown");
});

QUnit.test("markers option should not accept null at runtime", function(assert) {
    assert.throws(function() {
        $("#map").dxMap({
            provider: "googleStatic"
        }).dxMap("option", "markers", null);
    }, /markers/i, "not array exception was thrown");
});


QUnit.module("saving previous markers", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("pushing into markers option should render new marker", function(assert) {
    var addedMarkers = 0,
        removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                resolve(map);
            });

            var markers = map.option("markers");
            markers.push(MARKERS[0]);
            map.option("markers", markers);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option("onReady", function() {
                assert.equal(addedMarkers, 1 + 2, "correct number of markers added");
                assert.equal(removedMarkers, 1, "correct number of markers removed");

                resolve();
            });

            var markers = map.option("markers");
            markers.push(MARKERS[1]);
            map.option("markers", markers);
        });
    });
});

QUnit.test("adding same marker after addMarker method call should not render marker", function(assert) {
    var addedMarkers = 0,
        removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                resolve(map);
            });

            map.addMarker(MARKERS[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option("onReady", function() {
                assert.equal(addedMarkers, 1 + 1, "correct number of markers added");
                assert.equal(removedMarkers, 1, "correct number of markers removed");

                resolve();
            });

            map.option("markers", [MARKERS[0]]);
        });
    });
});

QUnit.test("adding same marker after removeMarker should render marker", function(assert) {
    var addedMarkers = 0,
        removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                resolve(map);
            });

            map.removeMarker(MARKERS[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option("onReady", function() {
                assert.equal(addedMarkers, 1 + 1, "correct number of markers added");
                assert.equal(removedMarkers, 1, "correct number of markers removed");

                resolve();
            });

            map.option("markers", [MARKERS[0]]);
        });
    });
});

QUnit.test("changing existing marker should rerender marker", function(assert) {
    var addedMarkers = 0,
        removedMarkers = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                assert.equal(addedMarkers, 1 + 1, "correct number of markers added");
                assert.equal(removedMarkers, 1, "correct number of markers removed");

                resolve();
            });

            map.option("markers", [MARKERS[0]]);
        });
    });
});


QUnit.module("async markers rendering", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("addMarker method call should not render marker twice", function(assert) {
    var addedMarkers = 0;

    var done = assert.async();

    var $map = $("#map").dxMap({
            provider: "googleStatic",
            onMarkerAdded: function() {
                addedMarkers++;
            }
        }),
        map = $map.dxMap("instance");

    map.addMarker(MARKERS[0]).done(function() {
        assert.equal(addedMarkers, 1, "correct number of markers added");

        done();
    });
});

QUnit.test("markers option change should not render incorrect markers", function(assert) {
    var addedMarkers = 0;

    var done = assert.async();

    var $map = $("#map").dxMap({
            provider: "googleStatic",
            onMarkerAdded: function() {
                addedMarkers++;
            },
            onReady: function() {
            // NOTE: Only second onReady matters
                map.option("onReady", function() {
                    assert.equal(addedMarkers, 1, "correct number of markers added");

                    $map.remove();
                    done();
                });
            }
        }),
        map = $map.dxMap("instance");

    var markers = [MARKERS[0]];
    map.option("markers", markers);
    markers.push(MARKERS[1]);
    map.option("markers", markers);
    map.option("markers", markers);
    map.option("markers", markers);
    map.option("markers", markers);
    map.option("markers", markers);
    map.option("markers", markers);
    map.option("markers", markers);
});


QUnit.module("routes", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("routes option should respond on add route as object", function(assert) {
    assert.expect(3);

    var $map = $("#map").dxMap({
            provider: "googleStatic"
        }),
        map = $map.dxMap("instance");

    var done = assert.async();
    map.addRoute(ROUTES[0]).done(function() {
        assert.ok(true, "action resolved");
        assert.equal(this, map, "correct context specified");

        done();
    });

    assert.deepEqual(map.option("routes"), [ROUTES[0]], "route added");
});

QUnit.test("routes option should respond on add route as array", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic"
        }),
        map = $map.dxMap("instance");

    map.addRoute([ROUTES[0], ROUTES[2]]);

    assert.deepEqual(map.option("routes"), [ROUTES[0], ROUTES[2]], "routes added");
});

QUnit.test("routes option should respond on remove route as object", function(assert) {
    assert.expect(3);

    var $map = $("#map").dxMap({
            provider: "googleStatic",
            routes: [ROUTES[0]]
        }),
        map = $map.dxMap("instance");

    var done = assert.async();
    map.removeRoute(ROUTES[0]).done(function() {
        assert.ok(true, "action resolved");
        assert.equal(this, map, "correct context specified");

        done();
    });

    assert.deepEqual(map.option("routes"), [], "route removed");
});

QUnit.test("routes option should respond on remove route as array", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic",
            routes: [ROUTES[0], ROUTES[2]]
        }),
        map = $map.dxMap("instance");

    map.removeRoute([ROUTES[0], ROUTES[2]]);

    assert.deepEqual(map.option("routes"), [], "routes removed");
});

QUnit.test("routes option should respond on remove route as number", function(assert) {
    var $map = $("#map").dxMap({
            provider: "googleStatic",
            routes: [ROUTES[0], ROUTES[2]]
        }),
        map = $map.dxMap("instance");

    map.removeRoute(1);

    assert.deepEqual(map.option("routes"), [ROUTES[0]], "route removed");
});

QUnit.test("routes option should not accept null at initialization", function(assert) {
    assert.throws(function() {
        $("#map").dxMap({
            provider: "googleStatic",
            routes: null
        });
    }, /routes/i, "not array exception was thrown");
});

QUnit.test("routes option should not accept null at runtime", function(assert) {
    assert.throws(function() {
        $("#map").dxMap({
            provider: "googleStatic"
        }).dxMap("option", "routes", null);
    }, /routes/i, "not array exception was thrown");
});


QUnit.module("saving previous routes", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("pushing into routes option should render new route", function(assert) {
    var addedRoutes = 0,
        removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                resolve(map);
            });

            var routes = map.option("routes");
            routes.push(ROUTES[0]);
            map.option("routes", routes);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option("onReady", function() {
                assert.equal(addedRoutes, 1 + 2, "correct number of routes added");
                assert.equal(removedRoutes, 1, "correct number of routes removed");

                resolve();
            });

            var routes = map.option("routes");
            routes.push(ROUTES[1]);
            map.option("routes", routes);
        });
    });
});

QUnit.test("adding same route after addRoute should not render route", function(assert) {
    var addedRoutes = 0,
        removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                resolve(map);
            });

            map.addRoute(ROUTES[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option("onReady", function() {
                assert.equal(addedRoutes, 1 + 1, "correct number of routes added");
                assert.equal(removedRoutes, 1, "correct number of routes removed");

                resolve();
            });

            map.option("routes", [ROUTES[0]]);
        });
    });
});

QUnit.test("adding route after removeRoute should render route", function(assert) {
    var addedRoutes = 0,
        removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                resolve(map);
            });

            map.removeRoute(ROUTES[0]);
        });
    }).then(function(map) {
        return new Promise(function(resolve) {
            map.option("onReady", function() {
                assert.equal(addedRoutes, 1 + 1, "correct number of routes added");
                assert.equal(removedRoutes, 1, "correct number of routes removed");

                resolve();
            });

            map.option("routes", [ROUTES[0]]);
        });
    });
});

QUnit.test("changing existing route should rerender marker", function(assert) {
    var addedRoutes = 0,
        removedRoutes = 0;

    return new Promise(function(resolve) {
        new Map($("#map"), {
            provider: "googleStatic",
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
            map.option("onReady", function() {
                assert.equal(addedRoutes, 1 + 1, "correct number of routes added");
                assert.equal(removedRoutes, 1, "correct number of routes removed");

                resolve();
            });

            map.option("routes", [ROUTES[0]]);
        });
    });
});


QUnit.module("async routes rendering", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("addRoute method call should not render route twice", function(assert) {
    var addedRoutes = 0;

    var done = assert.async();

    var $map = $("#map").dxMap({
            provider: "googleStatic",
            onRouteAdded: function() {
                addedRoutes++;
            }
        }),
        map = $map.dxMap("instance");

    map.addRoute(ROUTES[0]).done(function() {
        assert.equal(addedRoutes, 1, "correct number of markers added");

        done();
    });
});

QUnit.test("routes option change should not render incorrect routes", function(assert) {
    var addedRoutes = 0;

    var done = assert.async();

    var $map = $("#map").dxMap({
            provider: "googleStatic",
            onRouteAdded: function() {
                addedRoutes++;
            },
            onReady: function() {
            // NOTE: Only second onReady matters
                map.option("onReady", function() {
                    assert.equal(addedRoutes, 1, "correct number of routes added");

                    $map.remove();
                    done();
                });
            }
        }),
        map = $map.dxMap("instance");

    var routes = [ROUTES[0]];
    map.option("routes", routes);
    routes.push(ROUTES[1]);
    map.option("routes", routes);
});


QUnit.module("Change provider", {
    beforeEach: function() {
        var fakeURL = "/fakeGoogleUrl?";

        GoogleStaticProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            responseText: ""
        });
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test("change provider and async options", function(assert) {
    var makeConfig = function(resolve) {
        return {
            provider: "googleStatic",
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
        new Map($("#map"), makeConfig(resolve));
    }).then(function(map) {
        map._optionSilent("provider", "bing");
        return new Promise((resolve) => {
            map.option(makeConfig(resolve));
        });
    }).then(function(map) {
        assert.ok(map._asyncActionSuppressed);
    });
});
