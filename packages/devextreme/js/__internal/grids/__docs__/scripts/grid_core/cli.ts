interface CliArgs {
  jsonOnly: boolean;
  htmlOnly: boolean;
}

export function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    jsonOnly: false,
    htmlOnly: false,
  };

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < args.length; i += 1) {
    switch (args[i]) {
      case '--json':
        result.jsonOnly = true;
        break;
      case '--html':
        result.htmlOnly = true;
        break;
      default:
        console.error(`Error: Unknown argument "${args[i]}"`);
        process.exit(1);
    }
  }

  if (result.jsonOnly && result.htmlOnly) {
    console.error('Error: Cannot specify both --json and --html. Use neither to generate both.');
    process.exit(1);
  }

  return result;
}
