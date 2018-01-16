"use strict";

var originalWindow = window;

var serverSideWindowMock = {
    addEventListener: originalWindow.addEventListener.bind(originalWindow),
    cancelAnimationFrame: originalWindow.cancelAnimationFrame.bind(originalWindow),
    FormData: originalWindow.FormData.bind(originalWindow),
    getComputedStyle: originalWindow.getComputedStyle.bind(originalWindow),
    getSelection: originalWindow.getSelection.bind(originalWindow),
    HTMLElement: originalWindow.HTMLElement.bind(originalWindow),
    Node: originalWindow.Node.bind(originalWindow),
    Promise: originalWindow.Promise.bind(originalWindow),
    requestAnimationFrame: originalWindow.requestAnimationFrame.bind(originalWindow),
    WeakMap: originalWindow.WeakMap.bind(originalWindow),
    XMLHttpRequest: originalWindow.XMLHttpRequest.bind(originalWindow),

    console: originalWindow.console,
    document: originalWindow.document,
    Element: originalWindow.Element,
    Event: originalWindow.Event,
    innerHeight: originalWindow.innerHeight,
    innerWidth: originalWindow.innerWidth,
    location: originalWindow.location,
    navigator: originalWindow.navigator,
    screen: originalWindow.screen,
    width: originalWindow.width
};

serverSideWindowMock.window = serverSideWindowMock;

module.exports = serverSideWindowMock;
