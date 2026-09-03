const SMART_PASTE_TIMEOUT_MS = 30000;

function getFormFieldOptions(form) {
  return (form.option('items') || [])
    .filter((item) => item.dataField)
    .map((item) => ({
      dataField: item.dataField,
      label: item.label?.text ?? item.dataField,
    }));
}

function applyFormClearAction(form, formAction) {
  if (!formAction || formAction.type === 'smart_paste') return null;

  if (formAction.type === 'clear_all') {
    try {
      form.clear();
      return { status: 'success', message: 'Cleared all Form fields.' };
    } catch {
      return {
        status: 'failure',
        message: "I couldn't clear the form.",
      };
    }
  }

  if (formAction.type === 'clear_field') {
    const isKnownField = getFormFieldOptions(form).some(
      (f) => f.dataField === formAction.field,
    );

    if (!isKnownField) {
      return {
        status: 'failure',
        message: `I couldn't find a field named '${formAction.field}' to clear.`,
      };
    }

    form.updateData(formAction.field, null);

    return { status: 'success', message: `Cleared ${formAction.field}.` };
  }

  return null;
}

function applyFormSmartPaste(form, text) {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      form.off('smartPasted', handleSmartPasted);
      resolve(result);
    };

    const handleSmartPasted = (e) => {
      const fieldCount = Object.keys(e.aiResult ?? {}).length;
      finish(
        fieldCount > 0
          ? { status: 'success', message: 'Updated the form.' }
          : {
            status: 'failure',
            message: "I couldn't find any Form fields matching the request.",
          },
      );
    };

    const timeoutId = setTimeout(() => {
      finish({
        status: 'failure',
        message: "I couldn't process your request. Please try rephrasing it.",
      });
    }, SMART_PASTE_TIMEOUT_MS);

    form.on('smartPasted', handleSmartPasted);

    try {
      form.smartPaste(text);
    } catch {
      finish({
        status: 'failure',
        message: "I couldn't process your request. Please try rephrasing it.",
      });
    }
  });
}
