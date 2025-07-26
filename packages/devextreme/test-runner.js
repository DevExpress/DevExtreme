/* eslint-disable no-console */
const puppeteer = require('puppeteer');

class TestRunner {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: false, // Change to true for headless mode
            // eslint-disable-next-line spellcheck/spell-checker
            devtools: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();

        // Listen to console errors
        this.page.on('console', msg => {
            const type = msg.type();
            if(type === 'error') {
                console.log(`❌ Console Error: ${msg.text()}`);
            } else if(type === 'log') {
                console.log(`📝 Console Log: ${msg.text()}`);
            }
        });

        // Listen to page errors
        this.page.on('pageerror', error => {

            console.log(`💥 Page Error: ${error.message}`);
        });
    }

    async runTest(testPath) {
        if(!this.page) {
            throw new Error('TestRunner not initialized. Call init() first.');
        }

        const testUrl = `${this.baseUrl}/run/${testPath}`;

        console.log(`🚀 Running test: ${testUrl}`);

        try {
            await this.page.goto(testUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for QUnit tests to complete
            await this.page.waitForFunction(() => {
                return window.QUnit && window.QUnit.config.queue.length === 0;
            }, { timeout: 60000 });

            // Get test results
            const results = await this.page.evaluate(() => {
                if(!window.QUnit) {
                    return { error: 'QUnit not found' };
                }

                const config = window.QUnit.config;
                const testResults = [];

                // Get all completed tests
                if(window.QUnit.config.modules) {
                    window.QUnit.config.modules.forEach(module => {
                        module.tests.forEach(test => {
                            testResults.push({
                                name: test.name,
                                module: module.name,
                                passed: test.failed === 0,
                                failed: test.failed,
                                total: test.total,
                                runtime: test.runtime,
                                assertions: test.assertions || []
                            });
                        });
                    });
                }

                return {
                    passed: config.stats.bad === 0,
                    failed: config.stats.bad,
                    total: config.stats.all,
                    runtime: config.stats.runtime,
                    tests: testResults
                };
            });

            return results;

        } catch(error) {

            console.error(`❌ Error running test ${testPath}:`, error.message);
            return {
                error: error.message,
                passed: false
            };
        }
    }

    async close() {
        if(this.browser) {
            await this.browser.close();
        }
    }

    // Utility for running specific test
    static async runSingleTest(testPath, baseUrl) {
        const runner = new TestRunner(baseUrl);
        try {
            await runner.init();
            const results = await runner.runTest(testPath);

            console.log('\n📊 Test Results:');
            console.log(`Total: ${results.total || 0}`);
            console.log(`Passed: ${(results.total || 0) - (results.failed || 0)}`);
            console.log(`Failed: ${results.failed || 0}`);
            console.log(`Runtime: ${results.runtime || 0}ms`);
            console.log(`Status: ${results.passed ? '✅ PASSED' : '❌ FAILED'}`);

            if(results.error) {
                console.log(`Error: ${results.error}`);
            }

            if(results.tests && results.tests.length > 0) {
                console.log('\n📋 Test Details:');
                results.tests.forEach(test => {
                    const status = test.passed ? '✅' : '❌';
                    console.log(`  ${status} ${test.module}: ${test.name} (${test.runtime}ms)`);

                    if(!test.passed && test.assertions) {
                        test.assertions.forEach(assertion => {
                            if(!assertion.result) {
                                console.log(`    ❌ ${assertion.message}`);
                            }
                        });
                    }
                });
            }

            return results;
        } finally {
            await runner.close();
        }
    }
}

// CLI interface
if(require.main === module) {
    const testPath = process.argv[2];
    const baseUrl = process.argv[3] || 'http://localhost:3000';

    if(!testPath) {
        console.log('Usage: node test-runner.js <test-path> [base-url]');
        console.log('Example: node test-runner.js DevExpress.core/config.tests.js');
        process.exit(1);
    }

    TestRunner.runSingleTest(testPath, baseUrl)
        .then(results => {
            process.exit(results.passed ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Runner failed:', error);
            process.exit(1);
        });
}

module.exports = TestRunner;
