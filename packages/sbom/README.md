# SBOM Generator

Generates Software Bill of Materials (SBOM) files in CycloneDX format for DevExtreme packages.

## Prerequisites

- GitHub personal access token (classic) with package read permissions ([GitHub Packages authentication guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token))

## Usage

### Build SBOM for All Public Packages

```shell
pnpm nx build sbom
```

Generates SBOM files for all public packages:
- `devextreme`
- `devextreme-react`
- `devextreme-angular`
- `devextreme-vue`
- `devextreme-themebuilder`

**Output:** `dist/*.cdx.json`

### Generate SBOM for Specific Package (development)

```shell
pnpm nx make sbom <package-name> [--debug]
```

Generates SBOM for a single package. Use `--debug` to preserve the raw output from [cdxgen](https://github.com/cdxgen/cdxgen).

**Example:**

```shell
pnpm nx make sbom devextreme --debug
```

## Notes

- This workspace operates as an isolated pnpm workspace due to GitHub Packages access constraints and requires separate `pnpm install` or `pnpm add` commands
- Dependencies are installed automatically before each build via the `install-dependencies` target
- The `devextreme-dist.cdx.json` file is identical to `devextreme.cdx.json`
