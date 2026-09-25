import type { FormTypes } from 'devextreme-react/form';
import { formFieldOptions } from './data.ts';
import type { AIResult, CommandResult, EmployeeForm, FormAction, FormFieldOption } from './data.ts';

const SMART_PASTE_TIMEOUT_MS = 30000;

export function getFormFieldOptions(): FormFieldOption[] {
  return formFieldOptions;
}

export function applyFormClearAction(form: EmployeeForm, formAction: FormAction | null): CommandResult | null {
  if (!formAction || formAction.type === 'smart_paste') {
    return null;
  }

  if (formAction.type === 'clear_all') {
    try {
      form.clear();
      return { status: 'success', message: 'Cleared all Form fields.' };
    } catch {
      return { status: 'failure', message: "I couldn't clear the form." };
    }
  }

  const fieldName = formAction.field;
  if (!fieldName) {
    return { status: 'failure', message: "I couldn't find a field to clear." };
  }

  const isKnownField = getFormFieldOptions().some((field) => field.dataField === fieldName);
  if (!isKnownField) {
    return { status: 'failure', message: `I couldn't find a field named '${fieldName}' to clear.` };
  }

  form.updateData(fieldName, null);
  return { status: 'success', message: `Cleared ${fieldName}.` };
}

export function formatAiResultDetails(aiResult: AIResult): string {
  const labelByField = new Map(getFormFieldOptions().map((field) => [field.dataField, field.label]));

  return Object.keys(aiResult)
    .map((field) => labelByField.get(field) ?? field)
    .join(', ');
}

export function applyFormSmartPaste(form: EmployeeForm, text: string): Promise<CommandResult> {
  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = 0;

    const finish = (result: CommandResult): void => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeoutId);
      form.off('smartPasted', handleSmartPasted);
      resolve(result);
    };

    const handleSmartPasted = (event: FormTypes.SmartPastedEvent): void => {
      const aiResult = (event.aiResult ?? {}) as AIResult;
      const fieldCount = Object.keys(aiResult).length;

      finish(
        fieldCount > 0
          ? { status: 'success', message: `Updated the form (${formatAiResultDetails(aiResult)}).` }
          : { status: 'failure', message: "I couldn't find any Form fields matching the request." },
      );
    };

    timeoutId = window.setTimeout(() => {
      finish({ status: 'failure', message: "I couldn't process your request. Please try rephrasing it." });
    }, SMART_PASTE_TIMEOUT_MS);

    form.on('smartPasted', handleSmartPasted);

    try {
      form.smartPaste(text);
    } catch {
      finish({ status: 'failure', message: "I couldn't process your request. Please try rephrasing it." });
    }
  });
}
