var jQuery = require('jquery'),
    easing = require('../../animation/easing');

if(jQuery) {
    easing.setEasing(jQuery.easing);
}
