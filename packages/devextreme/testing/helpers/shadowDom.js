import $ from 'jquery';
import domAdapter from '__internal/core/dom_adapter';

export function getActiveElement() {
    return domAdapter.getActiveElement($('#qunit-fixture').get(0));
}
