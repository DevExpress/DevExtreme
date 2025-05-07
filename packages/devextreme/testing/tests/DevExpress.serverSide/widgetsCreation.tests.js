const widgets = require('../../helpers/widgetsList.js').widgetsList;

const DataSource = require('common/data/data_source');

QUnit.module('Widget creation', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

Object.keys(widgets).forEach(function(widget) {
    QUnit.test(widget + ' creating and optionChanged', function(assert) {
        if(widget === 'Scheduler' && widgets[widget].IS_RENOVATED_WIDGET) {
            assert.ok('Renovated scheduler doesn`t support server-side rendering');
            return;
        }

        this.instance = new widgets[widget](this.element);

        assert.ok(true, 'it\'s possible to create ' + widget);

        const options = this.instance.option();
        const clock = widget === 'DataGrid' || widget === 'TreeList' ? sinon.useFakeTimers() : null;

        if(!options || Object.keys(options).length === 0) {
            assert.ok(false, 'options is not defined ' + widget);
        }
        for(const optionName in options) {
            let prevValue = options[optionName];
            let newValue = prevValue;

            // NOTE: some widgets doesn't support dataSource === null
            if(optionName === 'dataSource') {
                // NOTE: dxResponsiveBox supports only plain object in items
                let item = widget === 'ResponsiveBox' ? { text: 1 } : 1;
                item = widget === 'Scheduler' ? { text: 1, startDate: new Date(2015, 0, 1) } : item;

                newValue = new DataSource([item]);
                options[optionName] = newValue;
            }

            // The most critical scenarios for the server-side rendering
            if(optionName === 'visible') {
                prevValue = false;
                newValue = true;
                options[optionName] = newValue;
            }

            if(optionName === 'width' || optionName === 'height') {
                newValue = 555;
                options[optionName] = newValue;
            }

            this.instance.beginUpdate();
            this.instance._notifyOptionChanged(optionName, newValue, prevValue);
            this.instance.endUpdate();

            assert.ok(true, 'it\'s possible to change option ' + optionName);
        }

        if(clock) {
            clock.restore();
        }
    });
});
