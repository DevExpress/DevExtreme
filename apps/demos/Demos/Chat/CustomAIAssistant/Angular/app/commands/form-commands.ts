import type { DxFormComponent, DxFormTypes } from 'devextreme-angular/ui/form';
import type {
  AIResult, CommandResult, FormAction, FormFieldOption,
} from '../types/types';
import { SMART_PASTE_TIMEOUT_MS } from '../data/data';

export function getFormFieldOptions(form: DxFormComponent): FormFieldOption[] {
  return ((form.instance.option('items') as { dataField?: string; label?: { text?: string } }[]) ?? [])
    .filter((item) => item.dataField)
    .map((item) => ({
      dataField: item.dataField ?? '',
      label: item.label?.text ?? item.dataField ?? '',
    }));
}

export function applyFormClearAction(
  form: DxFormComponent,
  formAction: FormAction | null,
): CommandResult | null {
  if (!formAction || formAction.type === 'smart_paste') return null;

  if (formAction.type === 'clear_all') {
    try {
      form.instance.clear();
      return { status: 'success', message: 'Cleared all Form fields.' };
    } catch {
      return {
        status: 'failure',
        message: "I couldn't clear the form.",
      };
    }
  }

  if (formAction.type === 'clear_field') {
    const isKnownField = getFormFieldOptions(form).some((f) => f.dataField === formAction.field);

    if (!isKnownField) {
      return {
        status: 'failure',
        message: `I couldn't find a field named '${formAction.field}' to clear.`,
      };
    }

    form.instance.updateData(formAction.field ?? '', null);

    return { status: 'success', message: `Cleared ${formAction.field}.` };
  }

  return null;
}

export function formatAiResultDetails(form: DxFormComponent, aiResult: AIResult): string {
  const labelByField = new Map(getFormFieldOptions(form).map((f) => [f.dataField, f.label]));

  return Object.keys(aiResult)
    .map((field) => labelByField.get(field) ?? field)
    .join(', ');
}

export function applyFormSmartPaste(form: DxFormComponent, text: string): Promise<CommandResult> {
  return new Promise((resolve) => {
    let settled = false;
    let timedOut = false;

    const finish = (result: CommandResult): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      form.instance.off('smartPasted', handleSmartPasted);
      resolve(result);
    };

    const handleSmartPasted = (e: DxFormTypes.SmartPastedEvent): void => {
      if (timedOut) {
        return;
      }

      const aiResult = e.aiResult ?? {};
      const fieldCount = Object.keys(aiResult).length;
      finish(
        fieldCount > 0
          ? { status: 'success', message: `Updated the form (${formatAiResultDetails(form, aiResult)}).` }
          : {
            status: 'failure',
            message: "I couldn't find any Form fields matching the request.",
          },
      );
    };

    const timeoutId = setTimeout(() => {
      timedOut = true;
      finish({
        status: 'failure',
        message: "I couldn't process your request. Please try rephrasing it.",
      });
    }, SMART_PASTE_TIMEOUT_MS);

    form.instance.on('smartPasted', handleSmartPasted);

    try {
      form.instance.smartPaste(text);
    } catch {
      finish({
        status: 'failure',
        message: "I couldn't process your request. Please try rephrasing it.",
      });
    }
  });
}
