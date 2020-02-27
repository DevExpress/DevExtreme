import { addLibrary, getLibrary, resetLibraryRegistry } from 'core/library_registry';
import { logger } from 'core/utils/console';

const { module: testModule, test } = QUnit;

testModule('Library registry', function() {
    test('library request throw an error when unknown library has been requested and keep name formatting', function(assert) {
        assert.throws(
            function() { getLibrary('AwEsOmeLib'); },
            function(e) {
                return /(E1041)[\s\S]*(AwEsOmeLib)/.test(e.message);
            },
            'The requested library is unknown'
        );
    });

    test('library request sends a warning when incorrect name has been passed', function(assert) {
        sinon.stub(logger, 'warn');
        getLibrary({ name: 'myLib' });

        const warnArgs = logger.warn.lastCall.args[0];
        assert.ok(logger.warn.calledOnce);
        assert.ok(/(W0017)[\s\S]*(Incorrect argument type)/.test(warnArgs));

        getLibrary(123);
        assert.ok(logger.warn.calledTwice);

        getLibrary(123);
        assert.ok(logger.warn.calledThrice);

        logger.warn.restore();
    });

    test('add library', function(assert) {
        const myLib = { Name: 'Awesome Lib' };

        addLibrary('myLib', myLib);

        assert.deepEqual(getLibrary('myLib'), myLib, 'we can get library from the registry');
        assert.deepEqual(getLibrary('MyLiB'), myLib, 'key is case insensitive');

        resetLibraryRegistry();
    });

    test('libraries is not overrides by default', function(assert) {
        const oldLib = { Name: 'Awesome Lib', Version: '1.0.0' };
        const newLib = { Name: 'Awesome Lib', Version: '2.0.0' };
        const libKey = 'myLib';

        sinon.stub(logger, 'warn');

        addLibrary(libKey, oldLib);
        addLibrary(libKey, newLib);

        const warnArgs = logger.warn.lastCall.args[0];
        assert.ok(logger.warn.calledOnce);
        assert.ok(/(W0018)[\s\S]*(myLib)/.test(warnArgs));
        assert.deepEqual(getLibrary(libKey), oldLib);

        addLibrary(libKey, newLib, true);
        assert.ok(logger.warn.calledOnce, 'there is no new warnings');
        assert.deepEqual(getLibrary(libKey), newLib, 'library has been replaced');

        logger.warn.restore();
        resetLibraryRegistry();
    });

    test('resetLibraryRegistry method clear the registry', function(assert) {
        addLibrary('myLib', { name: 'test' });
        resetLibraryRegistry();

        assert.throws(
            function() { getLibrary('myLib'); },
            function(e) {
                return /(E1041)[\s\S]*(myLib)/.test(e.message);
            },
            'The requested library is unknown'
        );
    });
});
