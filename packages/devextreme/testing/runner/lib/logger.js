const fs = require('fs');

function createRunnerLogger(filePath) {
    const rawLogger = createRawLogger(filePath);

    return {
        write(message, color) {
            const text = String(message || '');
            rawLogger.write(text);
            process.stdout.write(colorize(text, color));
        },
        writeLine(message = '', color) {
            const text = String(message || '');
            rawLogger.writeLine(text);
            process.stdout.write(`${colorize(text, color)}\n`);
        },
        writeError(message) {
            const text = `ERROR: ${message}`;
            rawLogger.writeLine(text);
            process.stderr.write(`${text}\n`);
        },
    };
}

function createRawLogger(filePath) {
    return {
        filePath,
        writeLine(text = '') {
            this.write(`${text || ''}\r\n`);
            this._time = true;
        },
        write(text = '') {
            if(!text) {
                return;
            }

            if(this._time !== false) {
                this._time = false;
                fs.appendFileSync(this.filePath, `${formatLogTime(new Date())}     `, 'utf8');
            }

            fs.appendFileSync(this.filePath, text, 'utf8');
        },
        _time: true,
    };
}

function formatLogTime(date) {
    let hours = date.getHours() % 12;
    if(hours === 0) {
        hours = 12;
    }

    return `${pad2(hours)}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

function pad2(value) {
    return String(value).padStart(2, '0');
}

function colorize(text, color) {
    if(!color) {
        return text;
    }

    const colorCodes = {
        red: 31,
        green: 32,
        yellow: 33,
        white: 37,
    };

    const code = colorCodes[color];
    if(!code) {
        return text;
    }

    return `\u001b[${code}m${text}\u001b[0m`;
}

module.exports = {
    createRunnerLogger,
};
