// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import easing from '../../animation/easing';

if(jQuery) {
    easing.setEasing(jQuery.easing);
}
