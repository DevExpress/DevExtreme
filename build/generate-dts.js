const shell = require("shelljs");
const TOOL_COMMAND = "devextreme-internal-declaration-tools";

if(!shell.which(TOOL_COMMAND)) {
    shell.echo(`${TOOL_COMMAND} command is not available`);
    shell.exit(0);
}

if(shell.exec(TOOL_COMMAND).code > 0) {
    shell.exit(1);
}

