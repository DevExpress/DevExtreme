const shell = require("shelljs");
const TOOL_COMMAND = "devextreme-internal-declaration-tools";

if(!shell.which(TOOL_COMMAND)) {
    shell.echo(`${TOOL_COMMAND} command is not available`);
    shell.exit(0);
}

shell.exit(shell.exec(TOOL_COMMAND).code);
