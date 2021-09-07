'use strict';

const stagedFiles = require('staged-git-files');
const validateMaxPath = require('./validate-max-path');
const validateWorkflows = require('./validate-workflows');

const fileStatuses = {
    Added: true,
    Copied: true,
    Deleted: false,
    Modified: true,
    Renamed: true,
    'Type-Change': false,
    Unmerged: false,
    Unknown: false
};

stagedFiles((err, results) => {
    let result = 0;
    const staged = results.filter(x => fileStatuses[x.status]);
    
    result = result | validateMaxPath(staged);
    result = result | validateWorkflows(staged);

    process.exit(result);
});
