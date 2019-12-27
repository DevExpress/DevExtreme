const inArray = require('../../core/utils/array').inArray;
const each = require('../../core/utils/iterator').each;
const _round = Math.round;
const _min = Math.min;
const _max = Math.max;
const _each = each;
const _inArray = inArray;

const horizontalAlignmentMap = {
    'left': 0,
    'center': 1,
    'right': 2
};

const verticalAlignmentMap = {
    'top': 0,
    'bottom': 1
};

function getCellIndex(options) {
    return verticalAlignmentMap[options.verticalAlignment] * 3 + horizontalAlignmentMap[options.horizontalAlignment];
}

function createCells(canvas, items) {
    const hStep = (canvas.right - canvas.left) / 3;
    const vStep = (canvas.bottom - canvas.top) / 2;
    const h1 = canvas.left;
    const h2 = _round(h1 + hStep);
    const h3 = _round(h1 + hStep + hStep);
    const h4 = canvas.right;
    const v1 = canvas.top;
    const v2 = _round(v1 + vStep);
    const v3 = canvas.bottom;
    const cells = [
        { rect: [h1, v1, h2, v2] },
        { rect: [h2, v1, h3, v2], center: true },
        { rect: [h3, v1, h4, v2], horInversion: true },
        { rect: [h1, v2, h2, v3], verInversion: true },
        { rect: [h2, v2, h3, v3], center: true, verInversion: true },
        { rect: [h3, v2, h4, v3], horInversion: true, verInversion: true }
    ];
    const itemsList = [[], [], [], [], [], []];

    _each(items, function(_, item) {
        const options = item.getLayoutOptions();
        if(options) {
            itemsList[getCellIndex(options)].push({ item: item, width: options.width, height: options.height });
        }
    });
    _each(cells, function(i, cell) {
        if(itemsList[i].length) {
            cell.items = itemsList[i];
        } else {
            if(cell.center) {
                cell.rect[0] = cell.rect[2] = (cell.rect[0] + cell.rect[2]) / 2;
            } else {
                cell.rect[cell.horInversion ? 0 : 2] = cell.rect[cell.horInversion ? 2 : 0];
            }
            cell.rect[cell.verInversion ? 1 : 3] = cell.rect[cell.verInversion ? 3 : 1];
        }
    });
    return cells;
}

function adjustCellSizes(cells) {
    _each([0, 1, 2, 3, 4, 5], function(_, index) {
        const cell = cells[index];
        const otherCell = cells[(index + 3) % 6];
        if(cell.items) {
            if(!otherCell.items) {
                cell.rect[1] = _min(cell.rect[1], otherCell.rect[3]);
                cell.rect[3] = _max(cell.rect[3], otherCell.rect[1]);
            }
        }
    });
    _each([1, 4], function(_, index) {
        const cell = cells[index];
        const otherCell1 = cells[index - 1];
        const otherCell2 = cells[index + 1];
        let size1;
        let size2;
        if(cell.items) {
            if(!otherCell1.items && !otherCell2.items) {
                size1 = cell.rect[0] - otherCell1.rect[2];
                size2 = otherCell2.rect[0] - cell.rect[2];
                if(size1 > size2) {
                    if(size1 / size2 >= 2) {
                        cell.rect[0] -= size1;
                        cell.right = true;
                    } else {
                        cell.rect[0] -= size2;
                        cell.rect[2] += size2;
                    }
                } else {
                    if(size2 / size1 >= 2) {
                        cell.rect[2] += size2;
                        cell.center = null;
                    } else {
                        cell.rect[0] -= size1;
                        cell.rect[2] += size1;
                    }
                }
            }
        } else {
            if(otherCell1.items) {
                otherCell1.rect[2] = (cell.rect[0] + cell.rect[2]) / 2;
            }
            if(otherCell2.items) {
                otherCell2.rect[0] = (cell.rect[0] + cell.rect[2]) / 2;
            }
        }
    });
}

function adjustCellsAndApplyLayout(cells, forceMode) {
    let hasHiddenItems = false;
    adjustCellSizes(cells);
    _each(cells, function(_, cell) {
        if(cell.items) {
            hasHiddenItems = applyCellLayout(cell, forceMode) || hasHiddenItems;
        }
    });
    return hasHiddenItems;
}

function applyCellLayout(cell, forceMode) {
    const cellRect = cell.rect;
    const cellWidth = cellRect[2] - cellRect[0];
    const cellHeight = cellRect[3] - cellRect[1];
    let xOffset = 0;
    let yOffset = 0;
    let currentHeight = 0;
    let totalL = cellRect[2];
    let totalT = cellRect[3];
    let totalR = cellRect[0];
    let totalB = cellRect[1];
    const moves = [];
    let hasHiddenItems = false;

    _each(cell.items, function(_, item) {
        if(item.width > cellWidth || item.height > cellHeight) {
            moves.push(null);
            hasHiddenItems = true;
            return forceMode || false;
        }
        if(xOffset + item.width > cellWidth) {
            yOffset += currentHeight;
            xOffset = currentHeight = 0;
        }
        if(yOffset + item.height > cellHeight) {
            moves.push(null);
            hasHiddenItems = true;
            return forceMode || false;
        }
        currentHeight = _max(currentHeight, item.height);
        const dx = cell.horInversion ? cellRect[2] - item.width - xOffset : cellRect[0] + xOffset;
        const dy = cell.verInversion ? cellRect[3] - item.height - yOffset : cellRect[1] + yOffset;
        xOffset += item.width;
        totalL = _min(totalL, dx);
        totalT = _min(totalT, dy);
        totalR = _max(totalR, dx + item.width);
        totalB = _max(totalB, dy + item.height);
        moves.push([dx, dy]);
    });

    if(forceMode || !hasHiddenItems) {
        xOffset = 0;
        if(cell.right) {
            xOffset = cellRect[2] - cellRect[0] - totalR + totalL;
        } else if(cell.center) {
            xOffset = _round((cellRect[2] - cellRect[0] - totalR + totalL) / 2);
        }
        _each(cell.items, function(i, item) {
            const move = moves[i];
            if(move) {
                item.item.locate(move[0] + xOffset, move[1]);
            } else {
                item.item.resize(null);
            }
        });
        cell.rect = [totalL, totalT, totalR, totalB];
        cell.items = null;
    }
    return hasHiddenItems;
}

function applyLayout(canvas, items) {
    const cells = createCells(canvas, items);
    if(adjustCellsAndApplyLayout(cells)) {
        adjustCellsAndApplyLayout(cells, true);
    }
}

function LayoutControl() {
    const that = this;
    that._items = [];
    that._suspended = 0;
    that._updateLayout = function() {
        that._update();
    };
}

LayoutControl.prototype = {
    constructor: LayoutControl,

    dispose: function() {
        this._items = this._updateLayout = null;
    },

    setSize: function(canvas) {
        this._canvas = canvas;
        this._update();
    },

    suspend: function() {
        ++this._suspended;
    },

    resume: function() {
        if(--this._suspended === 0) {
            this._update();
        }
    },

    // It should return callback (update trigger) instead of injecting the argument
    addItem: function(item) {
        this._items.push(item);
        item.updateLayout = this._updateLayout;
    },

    removeItem: function(item) {
        this._items.splice(_inArray(item, this._items), 1);
        item.updateLayout = null;
    },

    _update: function() {
        let canvas;
        if(this._suspended === 0) {
            canvas = this._canvas;
            _each(this._items, function(_, item) {
                item.resize(canvas);
            });
            applyLayout({ left: canvas.left, top: canvas.top, right: canvas.width + canvas.left, bottom: canvas.height + canvas.top }, this._items);
        }
    }
};

exports.LayoutControl = LayoutControl;
