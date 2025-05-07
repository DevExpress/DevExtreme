// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import { setEasing } from '../../common/core/animation/easing';

if(jQuery) {
    setEasing(jQuery.easing);
}
