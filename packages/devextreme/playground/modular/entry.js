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

import 'devextreme/__internal/ui/list/modules/m_selection';
new ListBase(newElement('selection'), {
    dataSource: [ 1, 2, 3 ],
    showSelectionControls: true,
    selectionMode: 'single'
});

import 'devextreme/__internal/ui/list/modules/m_deleting';
new ListBase(newElement('deleting'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true
});

import 'devextreme/__internal/ui/list/modules/m_deleting.context';
new ListBase(newElement('itemDeleteMode context'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'context'
});

import 'devextreme/__internal/ui/list/modules/m_deleting.swipe';
new ListBase(newElement('itemDeleteMode swipe'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'swipe'
});

import 'devextreme/__internal/ui/list/modules/m_deleting.slideItem';
new ListBase(newElement('itemDeleteMode slideItem'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'slideItem'
});

import 'devextreme/__internal/ui/list/modules/m_deleting.toggle';
new ListBase(newElement('itemDeleteMode toggle'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'toggle'
});

import 'devextreme/__internal/ui/list/modules/m_deleting.slideButton';
new ListBase(newElement('itemDeleteModeslideButton'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'slideButton'
});

import 'devextreme/__internal/ui/list/modules/m_deleting.static';
new ListBase(newElement('itemDeleteModestatic'), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true,
    itemDeleteMode: 'static'
});

import 'devextreme/__internal/ui/list/modules/m_dragging';
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

import 'devextreme/__internal/ui/list/modules/m_context';
new ListBase(newElement('context'), {
    dataSource: [ 1, 2, 3 ],
    menuItems: [
        { text: `I'm a context action` }
    ]
});

import 'devextreme/__internal/ui/list/modules/m_search';
new ListBase(newElement('search'), {
    dataSource: [ 1, 2, 3 ],
    searchEnabled: true
});
