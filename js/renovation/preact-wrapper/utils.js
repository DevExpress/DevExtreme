import { each } from '../../core/utils/iterator';

// NOTE: function for jQuery templates
export const wrapElement = ($element, $wrapper) => {
    const attributes = $wrapper.get(0).attributes;
    const children = $wrapper.contents();

    addAttributes($element, attributes);

    $wrapper.remove();
    each(children, (_, child) => {
        $element.append(child);
    });

    return children;
};

const addAttributes = ($element, attributes) => {
    each(attributes, (_, { name, value }) => {
        if(name === 'class') {
            $element.addClass(value);
        } else {
            $element.attr(name, value);
        }
    });
};

export const removeDifferentElements = ($children, $newChildren) => {
    each($newChildren, (_, element) => {
        let hasComponent = false;
        each($children, (_, oldElement) => {
            if(element === oldElement) {
                hasComponent = true;
            }
        });
        if(!hasComponent) {
            element.parentNode.removeChild(element);
        }
    });
};

export const getInnerActionName = (actionName) => {
    return actionName.charAt(2).toLowerCase() + actionName.substr(3) + 'Action';
};

export const setAttribute = (name, value, target) => {
    name = (name === 'role' || name === 'id') ? name : `aria-${name}`;
    value = value?.toString() ?? null;

    target.attr(name, value);
};
