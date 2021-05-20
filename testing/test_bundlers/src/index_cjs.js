/* global document */

const widgetsList = require('../../helpers/devExtremeCjsModulesList.js').modulesExportsList.widgetsList;

const de = require('localization/messages/de.json');
const ru = require('localization/messages/ru.json');

const Globalize = require('globalize');

Globalize.load(
    require('devextreme-cldr-data/supplemental.json'),
    require('devextreme-cldr-data/de.json'),
    require('devextreme-cldr-data/ru.json')
);

Globalize.loadMessages(de);
Globalize.loadMessages(ru);

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
