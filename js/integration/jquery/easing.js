const jQuery = require('jquery');
const easing = require('../../animation/easing');

if(jQuery) {
    easing.setEasing(jQuery.easing);
}
