'use strict';

const yaml = require('yaml');
const { readFileSync } = require('fs');
const chalks = require('./chalks');

const exceptions = [
    '.github/workflows/renovate_autoapprove.yml'
]

module.exports = (results) => {
    const workflowList = results
        .filter(x => x.filename.match(/^.github\/workflows.*\.ya?ml$/i))
        .map(x => x.filename);
    if (workflowList.length) {
        const invalidWorkflows = [];
        workflowList.forEach((workflowPath) => {
            if (exceptions.includes(workflowPath))
                return;
            const workflow = yaml.parse(readFileSync(workflowPath).toString());
            const notificationJob = workflow.jobs.notify;
            if (!notificationJob) {
                console.error(`${chalks.red}ERROR:${chalks.reset} ${chalks.bright}notify${chalks.reset} job missing (${workflowPath})`);
                invalidWorkflows.push(workflowPath);
                return;
            }
            delete workflow.jobs.notify;
            const jobsSet = new Set(notificationJob.needs);
            const missing = [];
            Object.keys(workflow.jobs).forEach(job => {
                if (!jobsSet.delete(job))
                    missing.push(job);
            });
            const extra = Array.from(jobsSet);

            if (missing.length) {
                console.error(`${chalks.red}ERROR:${chalks.reset} Add the following entries to the ${chalks.bright}notify.needs${chalks.reset} field: ${chalks.green}[${missing}]${chalks.reset} (${workflowPath})`);
                invalidWorkflows.push(workflowPath);
            }
            if (extra.length) {
                console.error(`${chalks.red}ERROR:${chalks.reset} Remove the following entries from the ${chalks.bright}notify.needs${chalks.reset} field: ${chalks.red}[${extra}]${chalks.reset} (${workflowPath})`);
                invalidWorkflows.push(workflowPath);
            }
        });
        return invalidWorkflows.length;
    }
    return 0;
};
