/* global document */

const modulesExportsList = require('../../helpers/widgetsList.js').modulesExportsList;

const myPopup = new modulesExportsList.widgetsList.Popup.default(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new modulesExportsList.widgetsList.Button.default(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});

Object.keys(modulesExportsList.widgetsList).forEach((widget) => {
    const div = document.createElement('div');
    modulesExportsList.widgetsList[widget].default(div, {
        text: widget
    });
    document.body.appendChild(div);
});
