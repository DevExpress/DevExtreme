(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.fixtures = module.exports = factory(require('jquery'));
        });
    } else {
        root.fixtures = factory(root.jQuery);
    }
}(window, function($) {

    const fixtures = {
        simple: {
            create: function() {
                $('<div id=where>').css({
                    position: 'absolute',
                    width: 100,
                    height: 100,
                    background: 'blue',
                    top: 200,
                    left: 200
                }).appendTo(document.body);

                $('<div id=what>').css({
                    position: 'absolute',
                    background: 'orange',
                    width: 50,
                    height: 50,
                    top: 0,
                    left: 0
                }).appendTo(document.body);
            },

            drop: function() {
                $('#where').remove();
                $('#what').remove();
            }
        },

        frameAdapted: {
            create: function() {
                fixtures.simple.create();

                $('#where').css({
                    top: 100,
                    left: 100
                });

                $('#what').css({
                    width: 10,
                    height: 10
                });
            },

            drop: function() {
                fixtures.simple.drop();
            }
        },

        differentTargets: {
            create: function() {
                fixtures.simple.create();
                $('<div id=there>').css({
                    position: 'absolute',
                    width: 100,
                    height: 100,
                    background: 'red',
                    top: 50,
                    left: 50
                }).appendTo(document.body);
            },
            drop: function() {
                fixtures.simple.drop();
                $('#there').remove();
            }
        },

        separatePositionedContainers: {
            create: function() {
                fixtures.simple.create();
                $('<div id=whereWrapper>').css({
                    position: 'absolute',
                    top: 100,
                    left: 100
                }).append($('#where')).appendTo(document.body);

                $('<div id=whatWrapper>').css({
                    position: 'absolute',
                    top: 400,
                    left: 200
                }).append($('#what')).appendTo(document.body);
            },

            drop: function() {
                $('#whereWrapper').remove();
                $('#whatWrapper').remove();
            }
        },

        customBoundary: {
            create: function() {
                const b = $('<div id=boundary>').css({
                    position: 'absolute',
                    background: 'green',
                    width: 300,
                    height: 300,
                    left: 10,
                    top: 10
                }).appendTo(document.body);

                $('<div id=where>').css({
                    position: 'absolute',
                    width: 100,
                    height: 100,
                    background: 'blue',
                    top: 100,
                    left: 100
                }).appendTo(b);

                $('<div id=what>').css({
                    position: 'absolute',
                    background: 'orange',
                    width: 100,
                    height: 100,
                    top: 0,
                    left: 0
                }).appendTo(document.body);
            },

            drop: function() {
                $('#where').remove();
                $('#what').remove();
                $('#boundary').remove();
            }
        },

        customBoundaryWithLeftTopOffset: {
            create: function() {
                fixtures.customBoundary.create();
                $('#where').css({
                    left: 50,
                    top: 50
                });
            },

            drop: function() {
                fixtures.customBoundary.drop();
            }
        },

        collisionTopLeft: {
            create: function() {
                fixtures.simple.create();
                $('#where').css({
                    top: 0,
                    left: 0
                });
            },

            drop: function() {
                fixtures.simple.drop();
            }
        },

        collisionTopRight: {
            create: function() {
                fixtures.simple.create();
                const win = $(window);
                const where = $('#where');
                where.css({
                    top: 0,
                    left: win.scrollLeft() + win.width() - where.outerWidth()
                });
            },

            drop: function() {
                fixtures.simple.drop();
            }
        },

        collisionBottomLeft: {
            create: function() {
                fixtures.simple.create();
                const win = $(window);
                const where = $('#where');
                where.css({
                    top: win.scrollTop() + win.height() - where.outerHeight(),
                    left: 0
                });
            },

            drop: function() {
                fixtures.simple.drop();
            }
        },

        collisionBottomRight: {
            create: function() {
                fixtures.simple.create();
                const win = $(window);
                const where = $('#where');
                where.css({
                    top: win.scrollTop() + win.height() - where.outerHeight(),
                    left: win.scrollLeft() + win.width() - where.outerWidth()
                });
            },

            drop: function() {
                fixtures.simple.drop();
            }
        },

        collisionSmallWindow: {
            create: function() {
                fixtures.simple.create();
                $('#where').css({
                    width: $(window).width(),
                    height: $(window).height(),
                    top: 0,
                    left: 0
                });
            },

            drop: function() {
                fixtures.simple.drop();
            }
        }
    };

    return fixtures;
}));
