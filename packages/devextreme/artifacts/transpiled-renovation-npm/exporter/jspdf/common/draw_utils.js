"use strict";

exports.addNewPage = addNewPage;
exports.drawCellsContent = drawCellsContent;
exports.drawCellsLines = drawCellsLines;
exports.drawGridLines = drawGridLines;
exports.drawLine = drawLine;
exports.drawRect = drawRect;
exports.drawTextInRect = drawTextInRect;
exports.getDocumentStyles = getDocumentStyles;
exports.roundToThreeDecimals = roundToThreeDecimals;
exports.setDocumentStyles = setDocumentStyles;
var _type = require("../../../core/utils/type");
var _extend = require("../../../core/utils/extend");
var _pdf_utils = require("./pdf_utils");
const _excluded = ["_rect", "gridCell"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function roundToThreeDecimals(value) {
  return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}
function drawCellsContent(doc, customDrawCell, cellsArray, docStyles) {
  cellsArray.forEach(cell => {
    const {
        _rect,
        gridCell
      } = cell,
      pdfCell = _objectWithoutPropertiesLoose(cell, _excluded);
    const {
      x,
      y,
      w,
      h
    } = _rect;
    const rect = {
      x,
      y,
      w,
      h
    };
    const eventArg = {
      doc,
      rect,
      pdfCell,
      gridCell,
      cancel: false
    };
    customDrawCell === null || customDrawCell === void 0 || customDrawCell(eventArg);
    if (!eventArg.cancel) {
      drawCellBackground(doc, cell);
      drawCellText(doc, cell, docStyles);
    }
  });
}
function drawLine(doc, startX, startY, endX, endY) {
  doc.line(roundToThreeDecimals(startX), roundToThreeDecimals(startY), roundToThreeDecimals(endX), roundToThreeDecimals(endY));
}
function drawRect(doc, x, y, width, height, style) {
  if ((0, _type.isDefined)(style)) {
    doc.rect(roundToThreeDecimals(x), roundToThreeDecimals(y), roundToThreeDecimals(width), roundToThreeDecimals(height), style);
  } else {
    doc.rect(roundToThreeDecimals(x), roundToThreeDecimals(y), roundToThreeDecimals(width), roundToThreeDecimals(height));
  }
}
function getLineHeightShift(doc) {
  const DEFAULT_LINE_HEIGHT = 1.15;

  // TODO: check lineHeightFactor from text options. Currently supports only doc options - https://github.com/MrRio/jsPDF/issues/3234
  return (doc.getLineHeightFactor() - DEFAULT_LINE_HEIGHT) * doc.getFontSize();
}
function drawTextInRect(doc, text, rect, verticalAlign, horizontalAlign, jsPDFTextOptions) {
  const textArray = text.split('\n');
  const linesCount = textArray.length;
  const heightOfOneLine = (0, _pdf_utils.calculateTextHeight)(doc, textArray[0], doc.getFont(), {
    wordWrapEnabled: false,
    targetRectWidth: 1000000000
  });
  const vAlign = verticalAlign ?? 'middle';
  const hAlign = horizontalAlign ?? 'left';
  const verticalAlignCoefficientsMap = {
    top: 0,
    middle: 0.5,
    bottom: 1
  };
  const horizontalAlignMap = {
    left: 0,
    center: 0.5,
    right: 1
  };
  const y = rect.y + rect.h * verticalAlignCoefficientsMap[vAlign] - heightOfOneLine * (linesCount - 1) * verticalAlignCoefficientsMap[vAlign] + getLineHeightShift(doc);
  const x = rect.x + rect.w * horizontalAlignMap[hAlign];
  const textOptions = (0, _extend.extend)({
    baseline: vAlign,
    align: hAlign
  }, jsPDFTextOptions);
  doc.text(textArray.join('\n'), roundToThreeDecimals(x), roundToThreeDecimals(y), textOptions);
}
function drawCellBackground(doc, cell) {
  if ((0, _type.isDefined)(cell.backgroundColor)) {
    trySetColor(doc, 'fill', cell.backgroundColor);
    drawRect(doc, cell._rect.x, cell._rect.y, cell._rect.w, cell._rect.h, 'F');
  }
}
function drawCellText(doc, cell, docStyles) {
  if ((0, _type.isDefined)(cell.text) && cell.text !== '') {
    // TODO: use cell.text.trim() ?
    const {
      textColor,
      font,
      _rect,
      padding
    } = cell;
    setTextStyles(doc, {
      textColor,
      font
    }, docStyles);
    const textRect = {
      x: _rect.x + padding.left,
      y: _rect.y + padding.top,
      w: _rect.w - (padding.left + padding.right),
      h: _rect.h - (padding.top + padding.bottom)
    };
    if ((0, _type.isDefined)(cell._textLeftOffset) || (0, _type.isDefined)(cell._textTopOffset)) {
      textRect.x = textRect.x + (cell._textLeftOffset ?? 0);
      textRect.y = textRect.y + (cell._textTopOffset ?? 0);
      doc.saveGraphicsState(); // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#saveGraphicsState
      clipOutsideRectContent(doc, cell._rect.x, cell._rect.y, cell._rect.w, cell._rect.h);
    }
    drawTextInRect(doc, cell.text, textRect, cell.verticalAlign, cell.horizontalAlign, cell._internalTextOptions);
    if ((0, _type.isDefined)(cell._textLeftOffset) || (0, _type.isDefined)(cell._textTopOffset)) {
      doc.restoreGraphicsState(); // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#restoreGraphicsState
    }
  }
}
function drawCellsLines(doc, cellsArray, docStyles) {
  cellsArray.filter(cell => !(0, _type.isDefined)(cell.borderColor)).forEach(cell => {
    drawBorders(doc, cell._rect, cell, docStyles);
  });
  cellsArray.filter(cell => (0, _type.isDefined)(cell.borderColor)).forEach(cell => {
    drawBorders(doc, cell._rect, cell, docStyles);
  });
}
function drawGridLines(doc, rect, options, docStyles) {
  drawBorders(doc, rect, options, docStyles);
}
function drawBorders(doc, rect, _ref, docStyles) {
  let {
    borderWidth,
    borderColor,
    drawLeftBorder = true,
    drawRightBorder = true,
    drawTopBorder = true,
    drawBottomBorder = true
  } = _ref;
  if (!(0, _type.isDefined)(rect)) {
    throw 'rect is required';
  }
  if (!drawLeftBorder && !drawRightBorder && !drawTopBorder && !drawBottomBorder) {
    return;
  } else if (drawLeftBorder && drawRightBorder && drawTopBorder && drawBottomBorder) {
    setLinesStyles(doc, {
      borderWidth,
      borderColor
    }, docStyles);
    drawRect(doc, rect.x, rect.y, rect.w, rect.h);
  } else {
    setLinesStyles(doc, {
      borderWidth,
      borderColor
    }, docStyles);
    if (drawTopBorder) {
      drawLine(doc, rect.x, rect.y, rect.x + rect.w, rect.y); // top
    }
    if (drawLeftBorder) {
      drawLine(doc, rect.x, rect.y, rect.x, rect.y + rect.h); // left
    }
    if (drawRightBorder) {
      drawLine(doc, rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h); // right
    }
    if (drawBottomBorder) {
      drawLine(doc, rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h); // bottom
    }
  }
}
function setTextStyles(doc, _ref2, docStyles) {
  let {
    textColor,
    font
  } = _ref2;
  trySetColor(doc, 'text', (0, _type.isDefined)(textColor) ? textColor : docStyles.textColor);
  const currentFont = (0, _type.isDefined)(font) ? (0, _extend.extend)({}, docStyles.font, font) : docStyles.font;
  const docFont = doc.getFont();
  if (currentFont.name !== docFont.fontName || currentFont.style !== docFont.fontStyle || (0, _type.isDefined)(currentFont.weight) // fontWeight logic, https://raw.githack.com/MrRio/jsPDF/master/docs/jspdf.js.html#line4842
  ) {
    doc.setFont(currentFont.name, currentFont.style, currentFont.weight);
  }
  if (currentFont.size !== doc.getFontSize()) {
    doc.setFontSize(currentFont.size);
  }
}
function setLinesStyles(doc, _ref3, docStyles) {
  let {
    borderWidth,
    borderColor
  } = _ref3;
  const currentBorderWidth = (0, _type.isDefined)(borderWidth) ? borderWidth : docStyles.borderWidth;
  if (currentBorderWidth !== getDocBorderWidth(doc)) {
    setDocBorderWidth(doc, (0, _pdf_utils.toPdfUnit)(doc, currentBorderWidth));
  }
  trySetColor(doc, 'draw', (0, _type.isDefined)(borderColor) ? borderColor : docStyles.borderColor);
}
function trySetColor(doc, target, color) {
  const getterName = `get${capitalizeFirstLetter(target)}Color`;
  const setterName = `set${capitalizeFirstLetter(target)}Color`;
  const {
    ch1 = color,
    ch2,
    ch3,
    ch4
  } = color;
  const normalizedColor = doc.__private__.decodeColorString(doc.__private__.encodeColorString({
    ch1,
    ch2,
    ch3,
    ch4,
    precision: target === 'text' ? 3 : 2
  }));
  if (normalizedColor !== doc[getterName]() || target === 'fill') {
    doc[setterName].apply(doc, [ch1, ch2, ch3, ch4].filter(item => item !== undefined));
  }
}
function getDocumentStyles(doc) {
  const docFont = doc.getFont();
  return {
    borderWidth: getDocBorderWidth(doc),
    borderColor: doc.getDrawColor(),
    font: {
      name: docFont.fontName,
      style: docFont.fontStyle,
      size: doc.getFontSize()
    },
    textColor: doc.getTextColor()
  };
}
function setDocumentStyles(doc, styles) {
  const {
    borderWidth,
    borderColor,
    font,
    textColor
  } = styles;
  const docFont = doc.getFont();
  if (docFont.fontName !== font.name || docFont.fontStyle !== font.style) {
    doc.setFont(font.name, font.style, undefined);
  }
  const docFontSize = doc.getFontSize();
  if (docFontSize !== font.size) {
    doc.setFontSize(font.size);
  }
  if (getDocBorderWidth(doc) !== borderWidth) {
    setDocBorderWidth(doc, borderWidth);
  }
  if (doc.getDrawColor() !== borderColor) {
    doc.setDrawColor(borderColor);
  }
  if (doc.getTextColor() !== textColor) {
    doc.setTextColor(textColor);
  }
}
function addNewPage(doc) {
  doc.addPage();
  resetDocBorderWidth(doc);
}
function getDocBorderWidth(doc) {
  // The 'getLineWidth' method was implemented in 2.5.0 version - https://github.com/parallax/jsPDF/pull/3324
  if ((0, _type.isDefined)(doc.getLineWidth)) {
    return doc.getLineWidth();
  }
  return doc.__borderWidth ?? 0.200025; // // https://github.com/parallax/jsPDF/blob/a56c882e2c139e74a9adaea0baa78fb1386cbf23/src/jspdf.js#L4946
}
function setDocBorderWidth(doc, width) {
  doc.setLineWidth(width);

  // The 'getLineWidth' method was implemented in 2.5.0 version - https://github.com/parallax/jsPDF/pull/3324
  if (!(0, _type.isDefined)(doc.getLineWidth)) {
    doc.__borderWidth = width;
  }
}
function resetDocBorderWidth(doc) {
  if (!(0, _type.isDefined)(doc.getLineWidth)) {
    doc.__borderWidth = null;
  }
}
function clipOutsideRectContent(doc, x, y, w, h) {
  doc.moveTo(roundToThreeDecimals(x), roundToThreeDecimals(y)); // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#moveTo - Begin a new subpath by moving the current point to coordinates (x, y)
  doc.lineTo(roundToThreeDecimals(x + w), roundToThreeDecimals(y)); // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#lineTo - Append a straight line segment from the current point to the point (x, y)
  doc.lineTo(roundToThreeDecimals(x + w), roundToThreeDecimals(y + h));
  doc.lineTo(roundToThreeDecimals(x), roundToThreeDecimals(y + h));
  doc.clip(); // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#clip - Clip all outside path content after calling drawing ops
  doc.discardPath(); // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#discardPath - Consumes the current path without any effect. Mainly used in combination with clip or clipEvenOdd.
}