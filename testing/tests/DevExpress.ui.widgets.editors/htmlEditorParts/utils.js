function checkLink(assert, { content, href, afterLink }, text) {
    if(href) {
        const matcher = new RegExp(`href="${href}"`);
        assert.ok(!!text.match(matcher), 'HREF OK');
    }

    if(content) {
        const matcher = new RegExp(`>${content}</a>`);
        assert.ok(!!text.match(matcher), 'Content OK');
    }

    if(afterLink) {
        const matcher = new RegExp(`</a>${afterLink}</p>`);
        assert.ok(!!text.match(matcher), 'After link content OK');
    }
}

function prepareTableValue(value) {
    return value.replace(/(\s?style="[^"]*")|(\s?data-row="[^"]*")/ig, '');
}

function prepareEmbedValue(value) {
    return value.replace(/\uFEFF/g, '');
}

export { checkLink, prepareTableValue, prepareEmbedValue };
