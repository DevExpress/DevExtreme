/* global document */

const widgets = require('../../helpers/widgetsList.js').widgetsList;

const myPopup = new widgets.Popup.default(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new widgets.Button.default(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});

Object.keys(widgets).forEach((widget) => {

});
