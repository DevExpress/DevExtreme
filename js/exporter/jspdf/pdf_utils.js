function getLineHeight(doc) {
    const textHeight = doc.getTextDimensions('any text').h;
    return textHeight * doc.getLineHeightFactor();
}


export { getLineHeight };
