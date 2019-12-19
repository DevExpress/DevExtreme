module.exports = {
    events: {
        'mouseover': 'mouseover',
        'mouseout': 'mouseout',
        'mousemove': 'mousemove',
        'touchstart': 'touchstart',
        'touchmove': 'touchmove',
        'touchend': 'touchend',
        'mousedown': 'mousedown',
        'mouseup': 'mouseup',

        click: 'click',
        selectSeries: 'selectseries',
        deselectSeries: 'deselectseries',
        selectPoint: 'selectpoint',
        deselectPoint: 'deselectpoint',
        showPointTooltip: 'showpointtooltip',
        hidePointTooltip: 'hidepointtooltip'
    },
    states: {
        hover: 'hover',
        normal: 'normal',
        selection: 'selection',
        normalMark: 0,
        hoverMark: 1,
        selectedMark: 2,
        applyHover: 'applyHover',
        applySelected: 'applySelected',
        resetItem: 'resetItem'
    },
    radialLabelIndent: 30,
    pieLabelSpacing: 10,
    pieSeriesSpacing: 4
};
