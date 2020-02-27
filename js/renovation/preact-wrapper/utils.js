import { each } from '../../core/utils/iterator';

// NOTE: function for jQuery templates
export const wrapElement = ($element, $wrapper) => {
    const attributes = $wrapper.get(0).attributes;
    each(attributes, (_, { name, value }) => {
        if(name === 'class') {
            $element.addClass(value);
        } else {
            $element.attr(name, value);
        }
    });

    const children = $wrapper.contents();
    $wrapper.replaceWith(children);

    return children;
};
