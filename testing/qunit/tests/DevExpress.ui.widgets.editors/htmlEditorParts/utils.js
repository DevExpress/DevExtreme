export const checkLink = (assert, { content, href, afterLink }, text) => {
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
};
