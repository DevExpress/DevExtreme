import $ from 'jquery';
import domAdapter from '__internal/core/m_dom_adapter';

export function getActiveElement() {
    return domAdapter.getActiveElement($('#qunit-fixture').get(0));
}
