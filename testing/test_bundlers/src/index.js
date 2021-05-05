/* global document */

import Popup from 'devextreme/ui/popup';
import Button from 'devextreme/ui/button';

const myPopup = new Popup(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new Button(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});
