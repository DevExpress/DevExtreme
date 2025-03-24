/* eslint-disable spellcheck/spell-checker, no-console */
const os = require('os');

const BYTES_IN_MB = 1024 * 1024;
const INTERVAL_MS = 10000;

const printCpuUsage = () => {
    const cpus = os.cpus();
    cpus.forEach((cpu, idx) => {
        let total = 0;
        const data = [];

        for(const type in cpu.times) {
            total += cpu.times[type];
        }

        console.info(`--- CPU ${idx} ---`);
        for(const type in cpu.times) {
            data.push(`${type}: ${Math.round(100 * cpu.times[type] / total)}`);
        }

        console.log(data.join(' | '));
    });
};

const printMemoryUsage = () => {
    const totalMemory = os.totalmem() / BYTES_IN_MB;
    const freeMemory = os.freemem() / BYTES_IN_MB;
    const roundedTotalMemory = Math.round(totalMemory * 100) / 100;
    const roundedFreeMemory = Math.round(freeMemory * 100) / 100;

    console.info(`--- Memory ---\n ${roundedFreeMemory}MB / ${roundedTotalMemory}MB`);
};

const printPerformanceLog = () => {
    console.log('===== PERFORMANCE_LOG =====');
    printCpuUsage();
    printMemoryUsage();
    console.log('===========================');
};

printPerformanceLog();
setInterval(() => {
    printPerformanceLog();
}, INTERVAL_MS);
