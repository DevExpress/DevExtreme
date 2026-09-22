import type { AIIntegration } from 'devextreme-vue/common/ai-integration';
import type {
  ClassificationResult,
  CommandResult,
  EmployeeForm,
  ExecuteGridAssistantAction,
  FormAction,
  OperationOutcome,
  PushMessage,
  RouteMessageContext,
  RouterContext,
  TaskGrid,
} from './types';
import { ChatCommandError } from './types.ts';
import {
  FIELD_OR_VALUE_NOT_FOUND_MESSAGE, FORM_ACTION_TYPES, MAX_USER_MESSAGE_LENGTH, ROUTER_TARGETS,
} from './data.ts';
import { applyFormClearAction, applyFormSmartPaste, getFormFieldOptions } from './formCommands.ts';
import {
  applyGridActions, buildGridPromptSection, buildGridResponseSchema, getGridColumnNames,
} from './gridCommands.ts';

export function extractJson(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);

  try {
    return JSON.parse((match ?? [''])[0]);
  } catch {
    throw new ChatCommandError(
      '❌ I received an unexpected response from the AI service. Please rephrase your request and try again.',
    );
  }
}

export function executeAiCommand(text: string, aiIntegration: AIIntegration): Promise<unknown> {
  return new Promise((resolve, reject) => {
    aiIntegration.execute(
      { text },
      {
        onComplete: (finalResponse: string) => {
          try {
            resolve(extractJson(finalResponse));
          } catch (error) {
            reject(error);
          }
        },
        onError: reject,
      },
    );
  });
}

function buildGridSystemPrompt(columnNames: string[]): string {
  return `You control a task DataGrid on this page.
This page ALSO has a separate employee/customer profile form (fields like name, title/prefix, position, state, birth date) that is handled elsewhere - it is NOT part of this grid.
Figure out what the user's request is about and translate ONLY the part that is clearly about the task grid into the matching commands described below.
Do NOT create a grid action just because a value could technically fit a text column (e.g. 'Subject'). If the request is about the profile form (e.g. mentions a person's name, title, job position, state, or birth date), leave that part out of 'actions' entirely - even if no other part of the request is grid-related.

${buildGridPromptSection(columnNames)}

Respond with STRICT JSON only, no code fences, no explanations, matching this schema:
${JSON.stringify(buildGridResponseSchema())}

If the request has nothing to do with the grid, respond with 'actions': [].`;
}

function buildFormActionPromptSection(form: EmployeeForm): string {
  const fieldList = getFormFieldOptions(form)
    .map((f) => `${f.dataField} (${f.label})`)
    .join(', ');

  return `Form fields (dataField and label): ${fieldList}.
If the request is about the form, also set \`formAction\` to one of:
- \`{type: 'clear_field', field: '<dataField>'}\` to clear one specific field.
- \`{type: 'clear_all'}\` to clear/reset the whole form.
- \`{type: 'smart_paste'}\` to fill in form data from the request text.
Set \`formAction\` to \`null\` if the request is not about the form.`;
}

export async function classifyRequest(
  text: string,
  aiIntegration: AIIntegration,
  form: EmployeeForm,
): Promise<ClassificationResult> {
  const prompt = [
    `Decide which UI area should handle the user's request.
Return STRICT JSON only, without markdown fences.
Format: {'target': 'form' | 'grid' | 'mixed' | 'none', 'formAction': <see below> | null, 'reason': 'short explanation' }
Rules:
- Use \`form\` for profile/customer form updates, field clearing, or smart-paste style data entry.
- Use \`grid\` for sorting, filtering, showing/hiding columns, or other \`DataGrid\` tasks.
- Use \`mixed\` when the request clearly asks for both a form change and a grid change together.
- Use \`none\` when the request is unrelated to both areas.
If you are not confident, return mixed.

${buildFormActionPromptSection(form)}

User request: '${text}'`,
  ].join('\n');

  try {
    const parsed = await executeAiCommand(prompt, aiIntegration) as {
      target?: string;
      formAction?: FormAction | null;
    };
    const target = String(parsed?.target ?? 'mixed').trim().toLowerCase() as ClassificationResult['target'];
    const rawFormAction = parsed?.formAction;
    const formAction = rawFormAction && FORM_ACTION_TYPES.has(rawFormAction.type)
      ? rawFormAction
      : null;

    return {
      target: ROUTER_TARGETS.has(target) ? target : 'mixed',
      formAction,
    };
  } catch {
    return { target: 'mixed', formAction: null };
  }
}

function buildGridResultsPromise(
  gridInstance: TaskGrid,
  aiIntegration: AIIntegration,
  text: string,
): Promise<OperationOutcome> {
  const columnNames = getGridColumnNames(gridInstance);
  const prompt = `${buildGridSystemPrompt(columnNames)}\n\nUser request: '${text}'`;

  return executeAiCommand(prompt, aiIntegration)
    .then((parsed) => {
      const actions = Array.isArray((parsed as { actions?: ExecuteGridAssistantAction[] })?.actions)
        ? (parsed as { actions: ExecuteGridAssistantAction[] }).actions
        : [];

      if (actions.length === 0) {
        gridInstance?.endCustomLoading();
        return { results: [], error: null };
      }

      try {
        return {
          results: applyGridActions(gridInstance, actions, text),
          error: null,
        };
      } finally {
        gridInstance?.endCustomLoading();
      }
    })
    .catch((error) => {
      gridInstance?.endCustomLoading();
      return { results: [], error };
    });
}

function buildFormResultsPromise(
  form: EmployeeForm,
  formAction: FormAction | null,
  text: string,
): Promise<OperationOutcome> {
  if (!formAction) {
    return Promise.resolve({ results: [], error: null });
  }

  const clearResult = applyFormClearAction(form, formAction);
  if (clearResult) {
    return Promise.resolve({ results: [clearResult], error: null });
  }

  return applyFormSmartPaste(form, text)
    .then((result) => ({ results: [result], error: null }))
    .catch((error) => ({ results: [], error }));
}

function formatFailures(failed: string[]): string {
  return failed.map((message) => `❌ ${message}`).join('\n');
}

function formatSucceeded(succeeded: string[]): string {
  return succeeded.map((message) => `✅ Done. ${message}`).join('\n');
}

export function joinSucceededOrThrow(results: CommandResult[], fallbackError: Error | null): string {
  const succeeded = results.filter((r) => r.status === 'success').map((r) => r.message);
  const failed = results.filter((r) => r.status === 'failure').map((r) => r.message);

  if (succeeded.length === 0) {
    throw failed.length > 0
      ? new ChatCommandError(formatFailures(failed))
      : (fallbackError ?? new ChatCommandError(FIELD_OR_VALUE_NOT_FOUND_MESSAGE));
  }

  return failed.length > 0
    ? `${formatSucceeded(succeeded)}\n${formatFailures(failed)}`
    : formatSucceeded(succeeded);
}

export async function runCommand(
  text: string,
  { form, gridInstance, aiIntegration }: RouterContext,
): Promise<string> {
  if (text.length > MAX_USER_MESSAGE_LENGTH) {
    return Promise.reject(
      new ChatCommandError(
        '❌ This message is too long for me to process. Please shorten it and try again.',
      ),
    );
  }

  const { target, formAction } = await classifyRequest(text, aiIntegration, form);

  if (target === 'none') {
    throw new ChatCommandError(
      "❌ This request doesn't appear to be related to Form or DataGrid. Please try rephrasing it.",
    );
  }

  if (target === 'form') {
    const { results: formResults, error: formError } = await buildFormResultsPromise(form, formAction, text);

    return joinSucceededOrThrow(formResults, formError);
  }

  if (target === 'grid') {
    gridInstance?.beginCustomLoading('');

    const { results: gridResults, error: gridError } = await buildGridResultsPromise(gridInstance, aiIntegration, text);

    return joinSucceededOrThrow(gridResults, gridError);
  }

  const [
    { results: formResults, error: formError },
    { results: gridResults, error: gridError },
  ] = await Promise.all([
    buildFormResultsPromise(form, formAction, text),
    buildGridResultsPromise(gridInstance, aiIntegration, text),
  ]);

  if (gridError) {
    console.warn('DataGrid AI request failed, but the Form request may have succeeded:', gridError);
  }

  if (formError) {
    console.warn('Form AI request failed, but the DataGrid request may have succeeded:', formError);
  }

  return joinSucceededOrThrow([...formResults, ...gridResults], gridError ?? formError);
}

export function reportAiResult(promise: Promise<string>, pushMessage: PushMessage): Promise<void> {
  return promise
    .then((message) => {
      pushMessage({
        author: { id: 'ai', name: 'AI Assistant' },
        text: message,
      });
    })
    .catch((error) => {
      const text = error instanceof ChatCommandError
        ? error.message
        : "❌ I couldn't reach the AI service. Please check your connection and try again.";

      pushMessage({
        author: { id: 'ai', name: 'AI Assistant' },
        text,
      });
    });
}

export function routeMessage(
  text: string,
  {
    form, gridInstance, aiIntegration, pushMessage,
  }: RouteMessageContext,
): Promise<void> {
  return reportAiResult(
    runCommand(text, { form, gridInstance, aiIntegration }),
    pushMessage,
  );
}
