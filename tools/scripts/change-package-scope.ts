import yargs from 'yargs';
import { changePackageScope, type ChangePackageScopeOptions } from 'devextreme-monorepo-tools';

export function parseChangePackageScopeArgs(argv: string[]): ChangePackageScopeOptions {
  return yargs(argv).strict().version(false).help(false)
    .option('tgz', { type: 'string', demandOption: true, nargs: 1 })
    .option('scope', { type: 'string', nargs: 1, default: undefined, coerce(s: string) { return s?.toLowerCase(); } })
    .option('removeScope', { type: 'boolean', default: undefined })
    .conflicts('scope', 'removeScope')
    .parseSync();
}

export async function runChangePackageScopeCli(argv: string[] = process.argv.slice(2)): Promise<string> {
  const args = parseChangePackageScopeArgs(argv);
  const result = await changePackageScope(args);
  console.log(result); // return value, used in GA
  return result;
}

void runChangePackageScopeCli();
