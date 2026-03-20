export interface CliArgs {
  jsonOnly: boolean;
  htmlOnly: boolean;
}

export function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { jsonOnly: false, htmlOnly: false };

  args.forEach((arg) => {
    switch (arg) {
      case '--json':
        result.jsonOnly = true;
        break;
      case '--html':
        result.htmlOnly = true;
        break;
      default:
        console.error(`Error: Unknown argument "${arg}". Valid options are: --json, --html`);
        process.exit(1);
    }
  });

  if (result.jsonOnly && result.htmlOnly) {
    console.error('Error: Cannot specify both --json and --html. Use neither to generate both.');
    process.exit(1);
  }

  return result;
}
