import sh from 'shelljs';
import fs from 'fs';
import { mapOptions } from './shell-utils';

interface PackageOptions {
  name: string;
  version: string;
  license: string;
  author: string;
}

export const npm = {
  initEmpty(): void {
    fs.writeFileSync('package.json', JSON.stringify({}));
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
    set(options: Partial<PackageOptions>): void {
      sh.exec(`npm pkg set ${mapOptions(options, {
        name: 'name',
        version: 'version',
        license: 'license',
        author: 'author'
      })}`);
    },
    get(option: keyof PackageOptions): string | undefined {
      const execResult = sh.exec(`npm pkg get ${option} --workspaces=false`, { silent: true });
      return JSON.parse(execResult.stdout);
    }
  }
}
