/* global document */

const widgetsList = require('../../helpers/devExtremeModulesList.js').modulesExportsList.widgetsList;

const myPopup = new widgetsList.Popup.default(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new widgetsList.Button.default(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});

const widgets = Object.keys(widgetsList);

for(const index in widgets) {
    const div = document.createElement('div');
    const widget = widgets[index];
    new widgetsList[widget].default(div, {
        text: widget
    });
    document.body.appendChild(div);
}
