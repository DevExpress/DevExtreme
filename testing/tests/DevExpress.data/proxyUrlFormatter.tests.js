const proxyUrlFormatter = require('data/proxy_url_formatter');

QUnit.module('proxyUrlFormatter util');

QUnit.test('parseUrl', function(assert) {

    assert.deepEqual(proxyUrlFormatter.parseUrl('https://example.com:81/path/page.html?k=v#top'), {
        protocol: 'https:',
        hostname: 'example.com',
        port: '81',
        pathname: '/path/page.html',
        search: '?k=v',
        hash: '#top'
    });

    assert.equal(proxyUrlFormatter.parseUrl('/path').pathname, '/path');
});
