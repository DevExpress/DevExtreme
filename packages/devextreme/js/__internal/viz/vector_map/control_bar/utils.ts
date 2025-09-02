export const createTracker = (renderer, root) => renderer
    .g()
    .attr({
        stroke: 'none',
        'stroke-width': 0,
        fill: '#000000',
        opacity: 0.0001 })
    .css({ cursor: 'pointer' })
    .append(root);

export const createVisibilityGroup = (renderer, root, className = '') => renderer.g().attr({ 'class': className }).append(root);

export const toggleDisplay = (blocks, isVisible) => {
    const cssDisplayBlock = { display: 'block' };
    const cssDisplayNone = { display: 'none' };
    const style = isVisible ? cssDisplayBlock : cssDisplayNone;

    blocks.map(item=> item.css(style));
};
