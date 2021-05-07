/* global document */

const widgets = require('../../helpers/widgetsList.js').widgetsList;

const myPopup = new widgets.Popup.dxPopup(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new widgets.Button.dxButton(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});
