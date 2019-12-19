var $ = require('jquery'),
    List = require('ui/list'),
    ajaxMock = require('../../../helpers/ajaxMock.js');

QUnit.module(
    'data source from url',
    {
        afterEach: function() {
            ajaxMock.clear();
        }
    },
    function() {
        var TEST_URL = '/a3211c1d-c725-4185-acc0-0a59a4152aae';

        function setupAjaxMock(responseFactory) {
            ajaxMock.setup({
                url: TEST_URL,
                callback: function() {
                    this.responseText = responseFactory();
                }
            });
        }

        function appendWidgetContainer(id) {
            return $('#qunit-fixture').append('<div id=list></div>');
        }

        QUnit.test('list refresh', function(assert) {
            var done = assert.async(),
                dataVersion = 1,
                list;

            appendWidgetContainer();
            setupAjaxMock(function() {
                switch(dataVersion) {
                    case 1: return [ 1 ];
                    case 2: return [ 2 ];
                }
            });

            list = new List('#list', {
                dataSource: TEST_URL,
                onItemRendered: handleItemRendered
            });

            function handleItemRendered(e) {
                switch(dataVersion) {
                    case 1:
                        assert.equal(e.itemData, 1);
                        dataVersion = 2;
                        list.reload();
                        return;

                    case 2:
                        assert.equal(e.itemData, 2);
                        done();
                        return;
                }
            }

        });

        QUnit.test('list search', function(assert) {
            var done = assert.async(),
                list,
                itemRenderedCount = 0,
                searching = false;

            appendWidgetContainer();
            setupAjaxMock(function() {
                return [ 'a', 'z' ];
            });

            list = new List('#list', {
                dataSource: TEST_URL,
                onItemRendered: handleItemRendered
            });

            function handleItemRendered(e) {
                if(!searching) {
                    itemRenderedCount++;
                    if(itemRenderedCount === 2) {
                        var source = list.getDataSource();
                        source.searchExpr('this');
                        source.searchValue('z');

                        searching = true;
                        source.load();
                    }
                } else {
                    assert.equal(e.itemData, 'z');
                    done();
                }
            }
        });
    }
);
