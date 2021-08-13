import ListBase from 'devextreme/ui/list_light';

const container = document.getElementById('container');
const newElement = () => {
    const el = document.createElement('div');
    container.appendChild(el);
    return el;
};

import 'devextreme/ui/list/modules/selection';
new ListBase(newElement(), {
    dataSource: [ 1, 2, 3 ],
    showSelectionControls: true,
    selectionMode: 'single'
});

import 'devextreme/ui/list/modules/deleting';
new ListBase(newElement(), {
    dataSource: [ 1, 2, 3 ],
    allowItemDeleting: true
});

import 'devextreme/ui/list/modules/dragging';
new ListBase(newElement(), {
    dataSource: [ 1, 2, 3 ],
    itemDragging: {
        allowReordering: true
    }
});

import 'devextreme/ui/list/modules/context';
new ListBase(newElement(), {
    dataSource: [ 1, 2, 3 ],
    menuItems: [
        { text: `I'm a context action` }
    ]
});
