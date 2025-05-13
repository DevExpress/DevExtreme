const fs = require('fs');
const path = require('path');

const linkPath = path.resolve(__dirname, '../src/external');
const targetPath = path.resolve(__dirname, '../../../examples');

try {
    if(fs.existsSync(linkPath)) {
        const stat = fs.lstatSync(linkPath);
        if(!stat.isSymbolicLink()) {
            console.error('❌ "src/external" exists, but it is not a symlink. Please remove it manually.');
            process.exit(1);
        }
    } else {
        fs.symlinkSync(targetPath, linkPath, 'junction');
        console.log('✅ Symlink for angular created: src/external → ../../../examples');
    }
} catch(err) {
    console.error('❌ Error creating symlink:', err.message);
    process.exit(1);
}
