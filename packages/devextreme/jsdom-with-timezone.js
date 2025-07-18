const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

module.exports = class TimezoneAwareJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // eslint-disable-next-line
        process.env.TZ = context.docblockPragmas.timezone || process.env.TZ || 'UTC';

        super(config, context);
    }
};
