"use strict";

exports.combineClasses = combineClasses;
function combineClasses(classesMap) {
  return Object.keys(classesMap).filter(p => classesMap[p]).join(' ');
}