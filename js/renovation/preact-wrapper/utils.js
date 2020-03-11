import { each } from '../../core/utils/iterator';

// NOTE: function for jQuery templates
export const wrapElement = ($element, $wrapper) => {
    const attributes = $wrapper.get(0).attributes;
    const children = $wrapper.contents();

    each(attributes, (_, { name, value }) => {
        if(name === 'class') {
            $element.addClass(value);
        } else {
            $element.attr(name, value);
        }
    });

    $wrapper.remove();
    each(children, (_, child) => {
        $element.append(child);
    });

    return children;
};

export const getInnerActionName = (actionName) => {
    return actionName.charAt(2).toLowerCase() + actionName.substr(3) + 'Action';
};
