import {
    join as pathJoin,
    relative as pathRelative
} from 'node:path';
import {
    writeFileSync,
    readFileSync,
    readdirSync,
    lstatSync
} from 'node:fs';
import { fileURLToPath } from 'node:url';

enum ConfigFilename {
    PACKAGE = 'package.json',
    BASE_TSCONFIG = 'tsconfig.base.json',
    PACKAGE_TSCONFIG = 'tsconfig.package.json',
    PROJECT_TSCONFIG = 'tsconfig.project.json'
}

const TSCONFIG_HEADER = '// File generated automatically, use npm run update:tsconfig for update\n';

interface IPackageJSON {
    name: string;
    workspaces: string[];
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
}

const readJSON = <T>(path: string): T => (
    JSON.parse(
        readFileSync(path, 'utf8')
    )
);

const writeTsconfig = <T>(path: string, data: T): void => {
    writeFileSync(path, TSCONFIG_HEADER + JSON.stringify(data, undefined, '\t'));
};

const rootPath = fileURLToPath(new URL('..', import.meta.url));

const rootPackage = readJSON<IPackageJSON>(
    pathJoin(rootPath, ConfigFilename.PACKAGE)
);

const workspacePaths = rootPackage.workspaces
    .map(workspaceDirectory => (
        workspaceDirectory.replace('/*', '')
    ))
    .map(workspaceDirectory => (
        pathJoin(rootPath, workspaceDirectory)
    ));

const packageDirectories = workspacePaths
    .flatMap(workspacePath => (
        readdirSync(workspacePath)
            .map(packageDirectory => (
                pathJoin(workspacePath, packageDirectory)
            ))
    ))
    .filter(packageDirectory => (
        lstatSync(packageDirectory).isDirectory()
    ));

const packagePathMap = new Map<string, string>();
const packageJSONMap = new Map<string, IPackageJSON>();

for (const packageDirectory of packageDirectories) {
    const packageJSON = readJSON<IPackageJSON>(
        pathJoin(packageDirectory, ConfigFilename.PACKAGE)
    );

    const { name: packageName } = packageJSON;

    packagePathMap.set(packageName, packageDirectory);
    packageJSONMap.set(packageName, packageJSON);
}

const internalDependencyMap = new Map<string, string[]>();

for (const [packageName, packageJSON] of packageJSONMap.entries()) {
    const allDependencies = [
        ...Object.keys(packageJSON.dependencies || {}),
        ...Object.keys(packageJSON.devDependencies || {}),
        ...Object.keys(packageJSON.peerDependencies || {})
    ];

    const internalDependencies = allDependencies.filter(dependencyName => (
        packageJSONMap.has(dependencyName)
    ));

    internalDependencyMap.set(packageName, internalDependencies);
}

const resolveInternalDependencies = (dependencies: string[]): string[] => (
    [...new Set([
        ...dependencies.flatMap(dependency => {
            const internalDependencies = internalDependencyMap.get(dependency)!;

            return resolveInternalDependencies(internalDependencies);
        }),
        ...dependencies
    ])]
);

for (const [packageName, packagePath] of packagePathMap.entries()) {
    const tsconfigPath = pathJoin(packagePath, ConfigFilename.PACKAGE_TSCONFIG);

    const internalDependencies = resolveInternalDependencies(
        internalDependencyMap.get(packageName)!
    );

    const tsconfigData = {
        extends: pathJoin(
            pathRelative(packagePath, rootPath),
            ConfigFilename.BASE_TSCONFIG
        ),
        compilerOptions: {
            outDir: './lib',
            rootDir: './src',
            composite: true
        },
        include: ['src'],
        exclude: ['test', 'lib'],
        references: internalDependencies.map(dependencyName => {
            const dependencyPath = packagePathMap.get(dependencyName)!;

            return {
                path: pathJoin(
                    pathRelative(packagePath, dependencyPath),
                    ConfigFilename.PACKAGE_TSCONFIG
                )
            };
        })
    };

    writeTsconfig(tsconfigPath, tsconfigData);
}

const tsconfigProjectPath = pathJoin(rootPath, ConfigFilename.PROJECT_TSCONFIG);

const tsconfigProjectData = {
    files: [],
    references: resolveInternalDependencies([...packagePathMap.keys()])
        .map(dependencyName => {
            const dependencyPath = packagePathMap.get(dependencyName)!;

            return {
                path: pathJoin(
                    pathRelative(rootPath, dependencyPath),
                    ConfigFilename.PACKAGE_TSCONFIG
                )
            };
        })
};

writeTsconfig(tsconfigProjectPath, tsconfigProjectData);
