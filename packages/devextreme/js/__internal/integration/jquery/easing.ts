import { setEasing } from '@ts/common/core/animation/easing';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

if (jQuery) {
  setEasing(jQuery.easing);
}
