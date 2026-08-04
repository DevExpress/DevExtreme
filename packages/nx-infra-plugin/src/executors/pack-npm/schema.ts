export interface PackNpmExecutorSchema {
  /**
   * Directory to pack (relative to the project root). Defaults to the project root.
   */
  packageDir?: string;
  /**
   * Optional destination directory for `*.tgz` files (relative to the project root).
   * When omitted, tarballs stay where `pnpm pack` writes them.
   */
  destination?: string;
  /**
   * Optional path to a package.json (relative to the project root) whose `version`
   * is applied via `pnpm pkg set` before packing.
   */
  setVersionFrom?: string;
}
