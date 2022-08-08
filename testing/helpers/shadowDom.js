import $ from 'jquery';
import domAdapter from 'core/dom_adapter';

export function getActiveElement() {
    return domAdapter.getActiveElement($('#qunit-fixture').get(0));
}
