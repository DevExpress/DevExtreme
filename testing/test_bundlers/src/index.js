/* global document */

// import { widgetsList as widgets } from '../../helpers/widgetsList';
const widgets = require('../../helpers/widgetsList.js').widgetsList;

const myPopup = new widgets['Popup'](document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new widgets['Button'](document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});

Object.keys(widgets).forEach(function(widget) {
    const div = document.createElement('div');
    new widgets[widget](div);
    document.append(div);
});
