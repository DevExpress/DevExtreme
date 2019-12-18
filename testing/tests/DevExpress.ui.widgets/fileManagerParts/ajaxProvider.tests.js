const { test } = QUnit;
import ajaxMock from '../../../helpers/ajaxMock.js';

import AjaxFileProvider from 'ui/file_manager/file_provider/ajax';

const fileItems = [
    {
        name: 'F1',
        isDirectory: true,
        children: [ { name: 'File1.1.txt' } ]
    },
    {
        name: 'F2',
        isDirectory: true
    }
];

const moduleConfig = {
    beforeEach: function() {
        this.options = {
            url: 'url-to-js-file'
        };
        this.provider = new AjaxFileProvider(this.options);
    },

    afterEach: function() {
        ajaxMock.clear();
    }
};

QUnit.module('Ajax File Provider', moduleConfig, () => {

    test('get folders', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.url,
            responseText: fileItems
        });

        this.provider.getFolders('')
            .done(folders => {
                assert.equal(folders.length, 2);
                assert.equal(folders[0].name, 'F1');
                assert.ok(folders[0].isDirectory);
                assert.equal(folders[1].name, 'F2');
                assert.ok(folders[1].isDirectory);
                done();
            });
    });

});
