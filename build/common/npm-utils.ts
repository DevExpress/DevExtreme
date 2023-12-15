import sh from 'shelljs';
import fs from 'fs';
import { mapOptions } from './shell-utils';

export const npm = {
  initEmpty(): void {
    fs.writeFileSync('package.json', JSON.stringify({}));
  },
  init(options: { authorName?: string, scope?: string, yes?: boolean }): void {
    console.log(`"npm init ${mapOptions(options, {
      authorName: '--init-author-name',
      scope: '--scope',
      yes: { kind: 'flag', alias: '-y' },
    })}"`);
  },
  pack(options: { destination: string }): void {
    sh.exec(`npm pack ${mapOptions(options, {
      destination: '--pack-destination',
    })}`);
  },
  pkg: {
    delete(option: string): void {
      sh.exec(`npm pkg delete ${option}`);
    },
    set(options: { name: string, version: string, license: string, author: string }): void {
      sh.exec(`npm pkg set ${mapOptions(options, {
        name: 'name',
        version: 'version',
        license: 'license',
        author: 'author'
      })}`);
    }
  },
  publish(options: { registry: string, ignoreScripts?: boolean, dryRun?: boolean, quiet?: boolean }): void {
    console.log(`"npm init ${mapOptions(options, {
      registry: '--registry',
      ignoreScripts: { kind: 'flag', alias: '--ignore-scripts' },
      dryRun: { kind: 'flag', alias: '--dry-run' },
      quiet: { kind: 'flag', alias: '--quiet' },
    })}"`);
  }
}
