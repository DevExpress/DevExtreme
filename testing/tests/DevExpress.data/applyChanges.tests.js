import { extend } from 'core/utils/extend';
import { errors } from 'data/errors';
import applyChanges from 'data/apply_changes';

QUnit.module('Apply Changes', {
    beforeEach: function() {
        this.data = [
            {
                id: 1,
                name: 'test1'
            },
            {
                id: 2,
                name: 'test2'
            },
            {
                id: 3,
                name: 'test3'
            },
            {
                id: 4,
                name: 'test4'
            },
            {
                id: 5,
                name: 'test5'
            }
        ];

        this.changes = [
            {
                type: 'insert',
                data: {
                    id: 345,
                    name: 'test new'
                }
            },
            {
                type: 'remove',
                key: 3
            },
            {
                type: 'update',
                key: 4,
                data: {
                    name: 'new name'
                }
            }
        ];

        this.keyExpr = 'id';

        this.addOptions = (config) => {
            if(!this.options) {
                this.options = {};
            }
            extend(this.options, config);
        };
    }
}, () => {
    [false, true].forEach(withKeyExpr => {
        const keyExprSpecified = `'keyExpr' is ${withKeyExpr ? '' : 'not'} specified`;

        [true, false].forEach(withImmutable => {
            const immutableSpecified = `'immutable' is ${withImmutable ? '' : 'not'} specified`;

            QUnit.test(`Items should be updated with immutability when ${immutableSpecified} and ${keyExprSpecified}`, function(assert) {
                // arrange
                withKeyExpr && this.addOptions({ keyExpr: this.keyExpr });
                withImmutable && this.addOptions({ immutable: true });

                // act
                const result = applyChanges(this.data, this.changes, this.options);

                // assert
                assert.equal(this.data.length, 5, 'data length');
                assert.equal(result.length, 5, 'result length');
                assert.notEqual(result, this.data, 'original and result arrays are not equal');
                assert.equal(this.data[0], result[0], 'first items are equal');
                assert.equal(this.data[1], result[1], 'second items are equal');
                assert.notEqual(this.data[2], result[2], 'third items are not equal');
                assert.deepEqual(this.data[2], { id: 3, name: 'test3' }, 'third item value of the original array');
                assert.deepEqual(result[2], { id: 4, name: 'new name' }, 'third item value of the result array');
                assert.notEqual(this.data[3], result[3], 'fourth items are not equal');
                assert.deepEqual(this.data[3], { id: 4, name: 'test4' }, 'fourth item value of the original array');
                assert.deepEqual(result[3], { id: 5, name: 'test5' }, 'fourth item value of the result array');
                assert.notEqual(this.data[4], result[4], 'fifth items are not equal');
                assert.deepEqual(this.data[4], { id: 5, name: 'test5' }, 'fifth item value of the original array');
                assert.deepEqual(result[4], { id: 345, name: 'test new' }, 'fifth item value of the result array');
            });
        });

        QUnit.test(`Items should be updated with mutability when 'immutable' is specified and ${keyExprSpecified}`, function(assert) {
            // arrange
            this.addOptions({ immutable: false });
            withKeyExpr && this.addOptions({ keyExpr: this.keyExpr });

            // act
            const result = applyChanges(this.data, this.changes, this.options);

            // assert
            assert.equal(this.data.length, 5, 'data length');
            assert.equal(result, this.data, 'original and result arrays are equal');
            assert.deepEqual(this.data[0], { id: 1, name: 'test1' }, 'first item value of the original array');
            assert.deepEqual(this.data[1], { id: 2, name: 'test2' }, 'second item value of the original array');
            assert.deepEqual(this.data[2], { id: 4, name: 'new name' }, 'third item value of the original array');
            assert.deepEqual(this.data[3], { id: 5, name: 'test5' }, 'fourth item value of the original array');
            assert.deepEqual(this.data[4], { id: 345, name: 'test new' }, 'first item value of the original array');
        });
    });

    QUnit.test('Errors should be logged in the console when key values are not correct', function(assert) {
        // arrange
        this.data = [
            {
                id: 1,
                name: 'test1'
            },
            {
                id: 2,
                name: 'test2'
            },
            {
                id: 3,
                name: 'test3'
            },
            {
                id: 4,
                name: 'test4'
            },
            {
                id: 345,
                name: 'test5'
            }
        ];
        this.changes = [
            {
                type: 'insert',
                data: {
                    id: 345,
                    name: 'test new'
                }
            },
            {
                type: 'remove',
                key: 3
            },
            {
                type: 'update',
                key: 43,
                data: {
                    name: 'new name'
                }
            }
        ];
        const errorsLogSpy = sinon.spy(errors, 'log');

        // act
        applyChanges(this.data, this.changes);

        // assert
        assert.equal(errorsLogSpy.callCount, 2);
        assert.equal(errorsLogSpy.getCall(0).args[0], 'E4008');
        assert.equal(errorsLogSpy.getCall(1).args[0], 'E4009');
    });
});
