import { BaseCommand } from '__internal/core/ai/commands/base';

class TestCommand extends BaseCommand {
    getTemplateName() {
        return 'test';
    }

    buildPromptData(params) {
        const data = {
            user: {
                first: params && params.first,
            },
            system: {
                second: params && params.second,
            },
        };

        return data;
    }

    parseResult(response) {
        return `Parsed result: ${response}`;
    }
}

const moduleConfig = {
    beforeEach() {
        this.promptManager = {
            buildPrompt: () => {
                return {
                    system: 'systemMessage',
                    user: 'userMessage',
                };
            },
        };

        this.requestManager = {
            sendRequest: (_, callbacks) => {
                callbacks.onComplete('AI response');

                return () => {};
            },
        };

        this.command = new TestCommand(this.promptManager, this.requestManager);
    },
};

QUnit.module('BaseCommand Unit', () => {
    QUnit.module('constructor', moduleConfig, () => {
        QUnit.test('Stores PromptManager and RequestManager correctly', function(assert) {
            assert.strictEqual(this.command.promptManager, this.promptManager, 'promptManager is saved correctly');
            assert.strictEqual(this.command.requestManager, this.requestManager, 'requestManager is saved correctly');
        });
    });

    QUnit.module('execute', moduleConfig, () => {
        QUnit.test('getTemplateName returns value correctly', function(assert) {
            const getTemplateNameSpy = sinon.spy(this.command, 'getTemplateName');

            this.command.execute();

            assert.ok(getTemplateNameSpy.calledOnce, 'getTemplateName is called once');
            assert.strictEqual(getTemplateNameSpy.returnValues[0], 'test', 'getTemplateName returns "test"');
        });

        QUnit.test('buildPromptData receives and returns correct data', function(assert) {
            const params = { first: 'first', second: 'second' };
            const buildPromptDataSpy = sinon.spy(this.command, 'buildPromptData');

            this.command.execute(params);

            assert.ok(buildPromptDataSpy.calledOnce, 'buildPromptData is called once');

            const [passedParams] = buildPromptDataSpy.firstCall.args;
            const returnedValue = buildPromptDataSpy.returnValues[0];

            assert.deepEqual(passedParams, params, 'buildPromptData called with correct params');
            assert.deepEqual(returnedValue, {
                user: { first: params.first },
                system: { second: params.second }
            }, 'buildPromptData returns correct object');
        });

        QUnit.test('parseResult receives correct value and returns expected result', function(assert) {
            const parseResultSpy = sinon.spy(this.command, 'parseResult');

            this.command.execute();

            assert.ok(parseResultSpy.calledOnce, 'parseResult is called once');

            const [passedParams] = parseResultSpy.firstCall.args;
            const returnedValue = parseResultSpy.returnValues[0];

            assert.strictEqual(passedParams, 'AI response', 'parseResult receives value correctly');
            assert.strictEqual(returnedValue, 'Parsed result: AI response', 'parseResult returns value correctly');
        });

        QUnit.test('callbacks are called correctly', function(assert) {
            const onCompleteSpy = sinon.spy();
            const onErrorSpy = sinon.spy();
            const onChunkSpy = sinon.spy();

            this.command.execute({}, {
                onComplete: onCompleteSpy,
                onError: onErrorSpy,
                onChunk: onChunkSpy,
            });

            assert.ok(onCompleteSpy.calledOnce, 'onComplete is called once');
            assert.strictEqual(onErrorSpy.callCount, 0, 'onError not called');
            assert.strictEqual(onChunkSpy.callCount, 0, 'onChunk not called');
        });

        QUnit.test('onComplete is called with parseResult output', function(assert) {
            const onCompleteSpy = sinon.spy();

            this.command.execute({}, { onComplete: onCompleteSpy });

            const [result] = onCompleteSpy.firstCall.args;

            assert.strictEqual(result, 'Parsed result: AI response', 'onComplete receives the result of parseResult');
        });

        QUnit.test('calls onError if request fails', function(assert) {
            const originalSendRequest = this.requestManager.sendRequest;

            try {
                this.requestManager.sendRequest = (_, callbacks) => {
                    callbacks.onError(new Error('Test error'));
                };

                const onErrorSpy = sinon.spy();
                const onCompleteSpy = sinon.spy();

                this.command.execute({}, {
                    onError: onErrorSpy,
                    onComplete: onCompleteSpy,
                });

                assert.ok(onErrorSpy.calledOnce, 'onError is called once');

                const [error] = onErrorSpy.firstCall.args;

                assert.strictEqual(error.message, 'Test error', 'onError receives correct error message');
                assert.strictEqual(onCompleteSpy.callCount, 0, 'onComplete is not called');
            } finally {
                this.requestManager.sendRequest = originalSendRequest;
            }
        });

        QUnit.test('calls onChunk for each chunk', function(assert) {
            const originalSendRequest = this.requestManager.sendRequest;

            try {
                this.requestManager.sendRequest = (prompt, callbacks) => {
                    callbacks.onChunk('first');
                    callbacks.onChunk('second');

                    callbacks.onComplete('first second');
                };

                const onChunkSpy = sinon.spy();
                const onCompleteSpy = sinon.spy();

                this.command.execute({}, {
                    onChunk: onChunkSpy,
                    onComplete: onCompleteSpy,
                });

                assert.strictEqual(onChunkSpy.callCount, 2, 'onChunk called twice');

                const [firstChunkValue] = onChunkSpy.firstCall.args;
                const [secondChunkValue] = onChunkSpy.secondCall.args;

                assert.strictEqual(firstChunkValue, 'first', 'first chunk value is correct');
                assert.strictEqual(secondChunkValue, 'second', 'second chunk value is correct');

                assert.ok(onCompleteSpy.calledOnce, 'onComplete is called once');
            } finally {
                this.requestManager.sendRequest = originalSendRequest;
            }
        });
    });
});
