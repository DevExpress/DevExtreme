const { setHeight, setWidth, implementationsMap } = require('core/utils/size');
const renderer = require('core/renderer');

QUnit.module('renderer');

QUnit.test('renderer should return correct element if window contains element with id=toArray', function(assert) {
    const element = renderer('<div>');
    element.attr('id', 'toArray');

    document.getElementById('qunit-fixture').appendChild(element[0]);

    const $window = renderer(window);
    assert.equal($window[0], window);
});

QUnit.module('HTML main');

QUnit.test('base', function(assert) {
    assert.equal(renderer('<div>').html('<div></div>').html(), '<div></div>');
    assert.equal(renderer('<div>').html('<div><p>test</p></div>').html(), '<div><p>test</p></div>');
});

QUnit.test('Nearby tags', function(assert) {
    assert.equal(renderer('<div>').html('<div>1</div><div>2</div>').html(), '<div>1</div><div>2</div>');
});

QUnit.module('HTML table');

QUnit.test('Insert tbody tag', function(assert) {
    assert.equal(
        renderer('<table>').html('<tbody><tr><th></th></tr></tbody>').html(),
        '<tbody><tr><th></th></tr></tbody>');
});

QUnit.test('Insert colgroup tag', function(assert) {
    assert.equal(
        renderer('<table>').html('<colgroup></colgroup>').html(),
        '<colgroup></colgroup>');
});

QUnit.test('Insert caption tag', function(assert) {
    assert.equal(
        renderer('<table>').html('<caption></caption>').html(),
        '<caption></caption>');
});

QUnit.test('Insert thead tag', function(assert) {
    assert.equal(
        renderer('<table>').html('<thead></thead>').html(),
        '<thead></thead>');
});

QUnit.test('Insert tfoot tag', function(assert) {
    assert.equal(
        renderer('<table>').html('<tfoot></tfoot>').html(),
        '<tfoot></tfoot>');
});

QUnit.test('Insert tr tag', function(assert) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    assert.equal(
        renderer(tbody).html('<tr><th></th></tr>').html(),
        '<tr><th></th></tr>');
});

QUnit.test('Insert into table tag', function(assert) {
    const table = document.createElement('table');
    const colgroup = document.createElement('colgroup');
    table.appendChild(colgroup);

    assert.equal(
        renderer(colgroup).html('<col>').html(),
        '<col>');
});

QUnit.test('Insert th tag', function(assert) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    table.appendChild(tbody);
    tbody.appendChild(tr);

    assert.equal(
        renderer(tr).html('<th></th>').html(),
        '<th></th>');
});
QUnit.test('Insert td tag', function(assert) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    table.appendChild(tbody);
    tbody.appendChild(tr);

    assert.equal(
        renderer(tr).html('<td></td>').html(),
        '<td></td>');
});

QUnit.test('Insert thead tag into div', function(assert) {
    assert.equal(
        renderer('<div>').html('<thead></thead>').html(),
        '<thead></thead>');
});

QUnit.module('CSS method');

QUnit.test('Get value', function(assert) {
    let element = renderer('<div>');

    document.getElementById('qunit-fixture').appendChild(element[0]);

    element[0].style.width = '5px';
    element[0].style.border = '1px solid red';
    element[0].style.padding = '1px';
    element[0].style.margin = '100px';
    element[0].style.color = 'red';

    assert.equal(element.css('width'), '5px', 'Get width');
    assert.equal(element.css('color'), 'rgb(255, 0, 0)', 'Get color');
    assert.equal(element.css('position'), 'static', 'Get position');
    assert.equal(element.css('borderLeftWidth'), '1px', 'Get border');

    element = renderer('fake_element');
    assert.equal(element.css('width'), undefined, 'Return undefined if element is empty');

});

QUnit.test('Set value', function(assert) {
    let element = renderer('<div>');

    document.body.appendChild(element[0]);

    element.css('width', 5);
    element.css('color', 'red');

    assert.equal(window.getComputedStyle(element[0])['width'], '5px', 'Set width');
    assert.equal(window.getComputedStyle(element[0])['color'], 'rgb(255, 0, 0)', 'Set color');

    element.css('height', 'auto');
    assert.equal(element[0].style['height'], 'auto', 'Set height with string');


    element.css({
        position: 'fixed',
        zIndex: 2,
        margin: '2px'
    });

    assert.equal(window.getComputedStyle(element[0])['position'], 'fixed', 'Set position with object of css values');
    assert.equal(window.getComputedStyle(element[0])['zIndex'], '2', 'Set zIndex with object of css values');
    const margin = window.getComputedStyle(element[0])['margin'] || window.getComputedStyle(element[0])['marginBottom'];// IE sets marginTop, marginBottom ... instead of margin
    assert.equal(margin, '2px', 'Set margin with object of css values');

    element = renderer('fake_element');
    const returnValue = element.css('height', '25px');
    assert.equal(returnValue, element, 'Return element itself for empty element');
});

QUnit.module('addClass method');


QUnit.test('class should be set for only an element node', function(assert) {
    const element = renderer('<div>');
    const textNodeElement = renderer(document.createTextNode('text'));
    const svgElement = renderer(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));

    element.addClass('someClass');
    textNodeElement.addClass('someClass');
    svgElement.addClass('someClass');

    assert.ok(element.hasClass('someClass'));
    assert.ok(svgElement.hasClass('someClass'));
    assert.notOk(textNodeElement.hasClass('someClass'));
});

QUnit.module('removeClass method');

QUnit.test('class should not be set when class name empty', function(assert) {
    const element = renderer('<div>');
    element.addClass('someClass');

    element.removeClass(' someClass');

    assert.notOk(element.hasClass('someClass'));
});

QUnit.test('should get class on element', function(assert) {
    const element = renderer(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));

    assert.notOk(element.hasClass('someClass'));
});

QUnit.test('class should be removed from SVG', function(assert) {
    const element = renderer(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
    element.addClass('someClass');

    element.removeClass('someClass');

    assert.notOk(element.hasClass('someClass'));
});

QUnit.module('width and height methods');

QUnit.test('width and height should take into consideration borders and paddings if box-sizing is border-box', function(assert) {
    const $element = renderer('<div>');
    document.getElementById('qunit-fixture').appendChild($element.get(0));

    $element.css('boxSizing', 'border-box');
    $element.css('padding', '3px 4px');
    $element.css('border', '4px solid');

    setHeight($element, 80);
    setWidth($element, 80);

    assert.equal($element.get(0).style.height, '94px');
    assert.equal($element.get(0).style.width, '96px');
});

QUnit.test('string value should be set correctly', function(assert) {
    const $element = renderer('<div>');
    document.getElementById('qunit-fixture').appendChild($element.get(0));

    $element.css('boxSizing', 'border-box');
    $element.css('padding', '3px 4px');
    $element.css('border', '4px solid');

    setHeight($element, '80');
    setWidth($element, '80');

    assert.equal($element.get(0).style.height, '94px');
    assert.equal($element.get(0).style.width, '96px');
});

QUnit.test('null and NaN values should not be set in .css()', function(assert) {
    const $element = renderer('<div>');
    const prop = 'height';
    document.getElementById('qunit-fixture').appendChild($element.get(0));

    $element.css(prop, '100px');
    assert.equal($element.get(0).style[prop], '100px');

    $element.css(prop, null);
    assert.equal($element.get(0).style[prop], '100px');

    $element.css(prop, NaN);
    assert.equal($element.get(0).style[prop], '100px');
});


['Width', 'Height'].forEach(function(propName) {
    const outerPropName = 'outer' + propName;
    const innerPropName = 'inner' + propName;
    propName = propName.toLocaleLowerCase();
    const setter = function(target, $el, value) {
        return implementationsMap['set' + target[0].toUpperCase() + target.slice(1)](...[...arguments].slice(1));
    };

    QUnit.test(propName + ' shouldn\'t take into consideration borders and paddings if box-sizing isn\'t border-box', function(assert) {
        const $element = renderer('<div>');
        document.getElementById('qunit-fixture').appendChild($element.get(0));

        $element.css('padding', 3);
        $element.css('border', '4px solid');

        setter(propName, $element, 80);

        assert.equal($element.get(0).style[propName], '80px');
    });

    QUnit.test(outerPropName + ' shouldn\'t take into consideration borders and paddings if box-sizing is border-box', function(assert) {
        const $element = renderer('<div>');
        document.getElementById('qunit-fixture').appendChild($element.get(0));

        $element.css('boxSizing', 'border-box');
        $element.css('padding', 3);
        $element.css('border', '4px solid');

        setter(outerPropName, $element, 80);

        assert.equal($element.get(0).style[propName], '80px');
    });

    QUnit.test(outerPropName + ' shouldn take into consideration borders and paddings if box-sizing isn\'t border-box', function(assert) {
        const $element = renderer('<div>');
        document.getElementById('qunit-fixture').appendChild($element.get(0));

        $element.css('padding', 3);
        $element.css('border', '4px solid');

        setter(outerPropName, $element, 80);

        assert.equal($element.get(0).style[propName], '66px');
    });

    QUnit.test(innerPropName + ' shouldn\'t take into consideration borders and paddings if box-sizing is border-box', function(assert) {
        const $element = renderer('<div>');
        document.getElementById('qunit-fixture').appendChild($element.get(0));

        $element.css('boxSizing', 'border-box');
        $element.css('padding', 3);
        $element.css('border', '4px solid');

        setter(innerPropName, $element, 80);

        assert.equal($element.get(0).style[propName], '88px');
    });

    QUnit.test(innerPropName + ' shouldn take into consideration borders and paddings if box-sizing isn\'t border-box', function(assert) {
        const $element = renderer('<div>');
        document.getElementById('qunit-fixture').appendChild($element.get(0));

        $element.css('padding', 3);
        $element.css('border', '4px solid');

        setter(innerPropName, $element, 80);

        assert.equal($element.get(0).style[propName], '74px');
    });
});

QUnit.module('text method');

QUnit.test('shouldn process functions', function(assert) {
    const element = renderer('<div>');

    element.text(function() {
        return 'text';
    });

    assert.equal(element[0].textContent, 'text', 'the value that the function returns');
});

QUnit.module('append method');

QUnit.test('shouldn insert number value', function(assert) {
    const element = renderer('<div>');

    element.append(1);

    assert.equal(element[0].textContent, '1', 'number value');
});

QUnit.module('replaceWith method');

QUnit.test('Should not remove content when replacing the same content', function(assert) {
    const $element = renderer('<div>');

    const fixture = document.getElementById('qunit-fixture');

    fixture.appendChild($element.get(0));
    assert.equal(fixture.childElementCount, 1, 'element attached to the DOM');

    const $result = $element.replaceWith($element);
    assert.equal(fixture.childElementCount, 1, 'element still exist');
    assert.equal($element.is($result), true, 'returned value the same element');
});

QUnit.module('attr method');
// T1108190
QUnit.test('Add/remove atribute', function(assert) {
    const $element = renderer('<div>');

    $element.attr('data-test', 'test');
    $element.attr('readonly', true);
    const fixture = document.getElementById('qunit-fixture');

    fixture.appendChild($element.get(0));
    assert.equal($element.get(0).getAttribute('data-test'), 'test', 'element data-test attribute');
    assert.equal(!!$element.get(0).getAttribute('readonly'), true, 'element readOnly attribute');
    $element.attr('readonly', false);
    assert.equal($element.get(0).getAttribute('readonly'), undefined, 'element readOnly attribute');
});

QUnit.test('Remove an attribute from the whole set of elements (T1261932)', function(assert) {
    const fixture = document.getElementById('qunit-fixture');

    const $wrapper = renderer('<div>').html('<div readonly="true">1</div><div readonly="true">2</div>');

    const $allInnerElements = $wrapper.find('div');

    fixture.appendChild($allInnerElements.get(0));

    $allInnerElements.removeAttr('readonly');

    $allInnerElements.each(function(_, element) {
        assert.equal(element.getAttribute('readonly'), undefined, 'element readOnly attribute');
    });
});

