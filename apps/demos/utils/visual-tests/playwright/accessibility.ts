import type { Page } from '@playwright/test';
import type { AxeResults, Result, RunOptions } from 'axe-core';

import { createMdReport } from '../../axe-reporter/reporter';

const ACCESSIBILITY_TARGET_SELECTOR = '.demo-container';

interface AccessibilityCheckResult {
  isValid: boolean;
  errorMessage: string;
}

type Impact = 'minor' | 'moderate' | 'serious' | 'critical' | 'unknown';

function isMaterialOrFluent(theme = process.env.THEME || ''): boolean {
  return theme.startsWith('material') || theme.startsWith('fluent');
}

function getIgnoredRules(testName: string): string[] {
  const ignoredRules: string[] = [];

  if (isMaterialOrFluent()
    && [
      'Accordion-Overview',
      'TagBox-Overview',
      'TreeList-StatePersistence',
      'CardView-FieldTemplate',
      'VectorMap-DynamicViewport',
    ].includes(testName)
  ) {
    ignoredRules.push('color-contrast');
  }

  const specificRules: Record<string, string[]> = {
    'DataGrid-EditStateManagement': ['aria-required-parent'],
    'DataGrid-RemoteCRUDOperations': ['scrollable-region-focusable'],

    'Diagram-Adaptability': ['aria-dialog-name', 'label'],
    'Diagram-AdvancedDataBinding': ['aria-dialog-name', 'label'],
    'Diagram-Containers': ['aria-dialog-name', 'label'],
    'Diagram-CustomShapesWithIcons': ['aria-dialog-name', 'label'],
    'Diagram-CustomShapesWithTemplates': ['label'],
    'Diagram-CustomShapesWithTemplatesWithEditing': ['aria-dialog-name', 'label'],
    'Diagram-CustomShapesWithTexts': ['aria-dialog-name', 'label'],
    'Diagram-ImagesInShapes': ['aria-dialog-name', 'label'],
    'Diagram-ItemSelection': ['label'],
    'Diagram-NodesAndEdgesArrays': ['aria-dialog-name', 'label'],
    'Diagram-NodesArrayHierarchicalStructure': ['aria-dialog-name', 'label'],
    'Diagram-NodesArrayPlainStructure': ['aria-dialog-name', 'label'],
    'Diagram-OperationRestrictions': ['aria-dialog-name', 'label'],
    'Diagram-Overview': ['aria-dialog-name', 'label'],
    'Diagram-ReadOnly': ['label'],
    'Diagram-SimpleView': ['label'],
    'Diagram-UICustomization': ['aria-dialog-name', 'label'],
    'Diagram-WebAPIService': ['aria-dialog-name', 'label'],

    'FileManager-BindingToEF': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-BindingToFileSystem': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-BindingToHierarchicalStructure': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-CustomThumbnails': ['aria-allowed-attr', 'aria-command-name', 'image-alt', 'label'],
    'FileManager-Overview': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-UICustomization': ['aria-command-name', 'empty-table-header', 'label'],

    'Gantt-Appearance': ['aria-toggle-field-name'],
    'Gantt-ExportToPDF': ['aria-toggle-field-name'],
    'Gantt-Overview': ['aria-required-parent', 'aria-valid-attr-value'],
    'Gantt-StripLines': ['aria-required-parent', 'aria-valid-attr-value'],
    'Gantt-Validation': ['aria-required-parent', 'aria-valid-attr-value'],

    'Localization-UsingGlobalize': ['label'],
  };

  return [
    ...ignoredRules,
    ...(specificRules[testName] || []),
  ];
}

function getAxeOptions(testName: string): RunOptions {
  const rules: Record<string, { enabled: boolean }> = {};

  getIgnoredRules(testName).forEach((ruleName) => {
    rules[ruleName] = { enabled: false };
  });

  return { rules };
}

function getImpact(impact: Result['impact']): Impact {
  return impact || 'unknown';
}

function getImpactSummary(violations: Result[]): string {
  const counts: Record<Impact, number> = {
    minor: 0,
    moderate: 0,
    serious: 0,
    critical: 0,
    unknown: 0,
  };

  violations.forEach((violation) => {
    counts[getImpact(violation.impact)] += 1;
  });

  return `${violations.length} accessibility violations found `
    + `(${counts.critical} critical, ${counts.serious} serious, `
    + `${counts.moderate} moderate, ${counts.minor} minor, ${counts.unknown} unknown)`;
}

function formatFailureSummary(summary?: string): string {
  if (!summary) {
    return '';
  }

  return `\n      ${summary.replace(/\n/g, '\n      ')}`;
}

function formatViolation(violation: Result): string {
  const nodes = violation.nodes
    .map((node) => `    - ${node.target.join(', ')}${formatFailureSummary(node.failureSummary)}`)
    .join('\n');

  return [
    `${violation.id} (${getImpact(violation.impact)}): ${violation.help}`,
    `  ${violation.helpUrl}`,
    nodes,
  ].filter(Boolean).join('\n');
}

function createAccessibilityReport(violations: Result[]): string {
  if (!violations.length) {
    return '';
  }

  return [
    getImpactSummary(violations),
    ...violations.map(formatViolation),
  ].join('\n\n');
}

export async function checkDemoAccessibility(
  page: Page,
  testName: string,
): Promise<AccessibilityCheckResult> {
  const options = getAxeOptions(testName);
  const results = await page.evaluate(({ selector, runOptions }) => {
    const axe = (window as typeof window & {
      axe?: {
        run: (context: Element, options: RunOptions) => Promise<AxeResults>;
      };
    }).axe;
    const context = document.querySelector(selector);

    if (!axe) {
      throw new Error('axe-core is not loaded');
    }
    if (!context) {
      throw new Error(`Accessibility target "${selector}" was not found`);
    }

    return axe.run(context, runOptions);
  }, {
    selector: ACCESSIBILITY_TARGET_SELECTOR,
    runOptions: options,
  });

  if (results.violations.length > 0) {
    createMdReport({ testName, results });
  }

  return {
    isValid: results.violations.length === 0,
    errorMessage: createAccessibilityReport(results.violations),
  };
}
