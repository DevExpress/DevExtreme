import ListBase from 'devextreme/ui/list_light';

const container = document.getElementById('container');
const newElement = (name) => {
    const title = document.createElement('p');
    title.innerText = name;
    const el = document.createElement('div');
    container.appendChild(title);
    container.appendChild(el);
    return el;
};

import 'devextreme/ui/list/modules/selection';
new ListBase(newElement('selection'), {
    dataSource: [ 1, 2, 3 ],
    showSelectionControls: true,
    selectionMode: 'single'
});

import 'devextreme/ui/list/modules/deleting';
new ListBase(newElement('deleting'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true
});

import 'devextreme/ui/list/modules/deleting.context';
new ListBase(newElement('itemDeleteMode context'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'context'
});

import 'devextreme/ui/list/modules/deleting.swipe';
new ListBase(newElement('itemDeleteMode swipe'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'swipe'
});

import 'devextreme/ui/list/modules/deleting.slideItem';
new ListBase(newElement('itemDeleteMode slideItem'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'slideItem'
});

import 'devextreme/ui/list/modules/deleting.toggle';
new ListBase(newElement('itemDeleteMode toggle'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'toggle'
});

import 'devextreme/ui/list/modules/deleting.slideButton';
new ListBase(newElement('itemDeleteModeslideButton'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'slideButton'
});

import 'devextreme/ui/list/modules/deleting.static';
new ListBase(newElement('itemDeleteModestatic'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'static'
});

import 'devextreme/ui/list/modules/dragging';
new ListBase(newElement('itemDragging allowReordering'), {
    dataSource: [ 1, 2, 3 ],
    itemDragging: {
        allowReordering: true
    }
});

new ListBase(newElement('itemDragging allowDropInsideItem'), {
    dataSource: [ 1, 2, 3 ],
    itemDragging: {
        allowDropInsideItem: true
    }
});

new ListBase(newElement('itemDragging group'), {
    dataSource: [ 1, 2, 3 ],
    itemDragging: {
        group: 'prop'
    }
});

import 'devextreme/ui/list/modules/context';
new ListBase(newElement('context'), {
    dataSource: [ 1, 2, 3 ],
    menuItems: [
        { text: `I'm a context action` }
    ]
});

import 'devextreme/ui/list/modules/search';
new ListBase(newElement('search'), {
    dataSource: [ 1, 2, 3 ],
    searchEnabled: true
});
