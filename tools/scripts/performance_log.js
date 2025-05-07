// NOTE: This is a temporary script to check the runner CPU / memory usage
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
    const usedMemory = totalMemory - freeMemory;
    const roundedTotalMemory = Math.round(totalMemory * 100) / 100;
    const roundedUsedMemory = Math.round(usedMemory * 100) / 100;
    const memoryUsagePercents = (roundedUsedMemory * 100) / roundedTotalMemory;
    const memoryUsagePercentsRounded = Math.round(memoryUsagePercents * 100) / 100;

    console.info(`--- Memory ---\nUsed: ${memoryUsagePercentsRounded}%`);
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
