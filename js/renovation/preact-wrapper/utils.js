// NOTE: function for jQuery templates
export const wrapElement = ($element, $wrapper) => {
    const attributes = $wrapper.get(0).attributes;

    for(let i = 0; i < attributes.length; i++) {
        const { name, value } = attributes[i];
        if(name === 'class') {
            $element.addClass(value);
        } else {
            $element.attr(name, value);
        }
    }

    const children = $wrapper.contents();
    $wrapper.replaceWith(children);

    return children;
};
