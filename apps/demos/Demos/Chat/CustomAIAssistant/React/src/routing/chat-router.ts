import type { AIIntegration } from 'devextreme-react/common/ai-integration';
import { applyFormClearAction, applyFormSmartPaste, getFormFieldOptions } from '../commands/form-commands.ts';
import { applyGridActions, buildGridPromptSection, buildGridResponseSchema, getGridColumnNames } from '../commands/grid-commands.ts';
import type {
  ClassificationResult,
  CommandResult,
  EmployeeForm,
  ExecuteGridAssistantAction,
  PushMessage,
  RouteMessageContext,
  TaskGrid,
} from '../types/types.ts';
import { FORM_ACTION_TYPES, ROUTER_TARGETS } from '../types/types.ts';

const MAX_USER_MESSAGE_LENGTH = 2000;
const FIELD_OR_VALUE_NOT_FOUND_MESSAGE =
  '❌ No field or column exists with such a name, or the entered value is invalid. Please check the name and value and try again.';

export class ChatCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatCommandError';
    Object.setPrototypeOf(this, ChatCommandError.prototype);
  }
}

export function extractJson(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);

  try {
    return JSON.parse(match?.[0] ?? '{}');
  } catch {
    throw new ChatCommandError('❌ I received an unexpected response from the AI service. Please rephrase your request and try again.');
  }
}

export function executeAiCommand(text: string, aiIntegration: AIIntegration): Promise<unknown> {
  return new Promise((resolve, reject) => {
    aiIntegration.execute(
      { text },
      {
        onComplete: (finalResponse) => {
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

export async function classifyRequest(
  text: string,
  aiIntegration: AIIntegration,
  form: EmployeeForm,
): Promise<ClassificationResult> {
  if (!aiIntegration) {
    return { target: 'mixed', formAction: null };
  }

  const prompt = [
    `Decide which UI area should handle the user's request.
Return STRICT JSON only, without markdown fences.
Format: {'target': 'form' | 'grid' | 'mixed' | 'none', 'formAction': <see below> | null, 'reason': 'short explanation'}
Rules:
- Use 'form' for profile/customer form updates, field clearing, or smart-paste style data entry.
- Use 'grid' for sorting, filtering, showing/hiding columns, or other DataGrid tasks.
- Use 'mixed' when the request clearly asks for both a form change and a grid change together.
- Use 'none' when the request is unrelated to both areas.
If you are not confident, return mixed.

${buildFormActionPromptSection(form)}

User request: '${text}'`,
  ].join('\n');

  try {
    const parsed = (await executeAiCommand(prompt, aiIntegration)) as Record<string, unknown>;
    const target = String(parsed?.target ?? 'mixed').trim().toLowerCase();
    const rawFormAction = parsed?.formAction as { type?: string; field?: string } | null;
    const formActionType = rawFormAction?.type;

    if (!rawFormAction || typeof formActionType !== 'string' || !FORM_ACTION_TYPES.has(formActionType as never)) {
      return {
        target: ROUTER_TARGETS.has(target as never) ? (target as ClassificationResult['target']) : 'mixed',
        formAction: null,
      };
    }

    return {
      target: ROUTER_TARGETS.has(target as never) ? (target as ClassificationResult['target']) : 'mixed',
      formAction: {
        type: formActionType as never,
        field: rawFormAction.field,
      },
    };
  } catch {
    return { target: 'mixed', formAction: null };
  }
}

export function buildFormActionPromptSection(form: EmployeeForm): string {
  const fieldList = getFormFieldOptions(form)
    .map((field) => `${field.dataField} (${field.label})`)
    .join(', ');

  return `Form fields (dataField and label): ${fieldList}.
If the request is about the form, also set formAction to one of:
- {type: 'clear_field', field: '<dataField>'} to clear one specific field.
- {type: 'clear_all'} to clear/reset the whole form.
- {type: 'smart_paste'} to fill in form data from the request text.
Set formAction to null if the request is not about the form.`;
}

export function buildGridSystemPrompt(columnNames: string[]): string {
  return `You control a task DataGrid on this page.
This page ALSO has a separate employee/customer profile form (fields like name, title/prefix, position, state, birth date) that is handled elsewhere - it is NOT part of this grid.
Figure out what the user's request is about and translate ONLY the part that is clearly about the task grid into the matching commands described below.
Do NOT create a grid action just because a value could technically fit a text column.
If the request is about the profile form, leave that part out of 'actions' entirely.

${buildGridPromptSection(columnNames)}

Respond with STRICT JSON only, no code fences, matching this schema:
${JSON.stringify(buildGridResponseSchema())}

If the request has nothing to do with the grid, respond with 'actions': [].`;
}

export async function buildGridResultsPromise(
  grid: TaskGrid,
  aiIntegration: AIIntegration,
  text: string,
): Promise<{ results: CommandResult[]; error: unknown }> {
  const prompt = `${buildGridSystemPrompt(getGridColumnNames(grid))}\n\nUser request: '${text}'`;

  try {
    const parsed = (await executeAiCommand(prompt, aiIntegration)) as { actions?: ExecuteGridAssistantAction[] };
    const actions = Array.isArray(parsed.actions) ? parsed.actions : [];

    if (actions.length === 0) {
      return { results: [], error: null };
    }

    return {
      results: applyGridActions(grid, actions, text),
      error: null,
    };
  } catch (error) {
    return { results: [], error };
  }
}

export async function buildFormResultsPromise(
  form: EmployeeForm,
  formAction: ClassificationResult['formAction'],
  text: string,
): Promise<{ results: CommandResult[]; error: unknown }> {
  const clearResult = applyFormClearAction(form, formAction);
  if (clearResult) {
    return { results: [clearResult], error: null };
  }

  try {
    return { results: [await applyFormSmartPaste(form, text)], error: null };
  } catch (error) {
    return { results: [], error };
  }
}

function formatFailures(messages: string[]): string {
  return messages.map((message) => `❌ ${message}`).join('\n');
}

function formatSucceeded(messages: string[]): string {
  return messages.map((message) => `✅ Done. ${message}`).join('\n');
}

export function joinSucceededOrThrow(results: CommandResult[], fallbackError: Error | null): string {
  const succeeded = results.filter((result) => result.status === 'success').map((result) => result.message);
  const failed = results.filter((result) => result.status === 'failure').map((result) => result.message);

  if (succeeded.length === 0) {
    throw failed.length > 0
      ? new ChatCommandError(formatFailures(failed))
      : fallbackError ?? new ChatCommandError(FIELD_OR_VALUE_NOT_FOUND_MESSAGE);
  }

  return failed.length > 0
    ? `${formatSucceeded(succeeded)}\n${formatFailures(failed)}`
    : formatSucceeded(succeeded);
}

export async function runCommand(text: string, { form, gridInstance, aiIntegration }: RouteMessageContext): Promise<string> {
  if (text.length > MAX_USER_MESSAGE_LENGTH) {
    throw new ChatCommandError('❌ This message is too long for me to process. Please shorten it and try again.');
  }

  const { target, formAction } = await classifyRequest(text, aiIntegration, form);

  if (target === 'none') {
    throw new ChatCommandError("❌ This request doesn't appear to be related to Form or DataGrid. Please try rephrasing it.");
  }

  if (target === 'form') {
    const { results, error } = await buildFormResultsPromise(form, formAction, text);
    return joinSucceededOrThrow(results, error instanceof Error ? error : null);
  }

  if (target === 'grid') {
    const { results, error } = await buildGridResultsPromise(gridInstance, aiIntegration, text);
    return joinSucceededOrThrow(results, error instanceof Error ? error : null);
  }

  const [formResult, gridResult] = await Promise.all([
    buildFormResultsPromise(form, formAction, text),
    buildGridResultsPromise(gridInstance, aiIntegration, text),
  ]);

  return joinSucceededOrThrow(
    [...formResult.results, ...gridResult.results],
    gridResult.error instanceof Error ? gridResult.error : formResult.error instanceof Error ? formResult.error : null,
  );
}

export function reportAiResult(promise: Promise<string>, pushMessage: PushMessage): Promise<void> {
  return promise
    .then((message) => {
      pushMessage({
        author: { id: 'ai', name: 'AI Assistant' },
        text: message,
      });
    })
    .catch((error: unknown) => {
      const text =
        error instanceof ChatCommandError
          ? error.message
          : "❌ I couldn't reach the AI service. Please check your connection and try again.";

      pushMessage({
        author: { id: 'ai', name: 'AI Assistant' },
        text,
      });
    });
}

export function routeMessage(text: string, context: RouteMessageContext): Promise<void> {
  return reportAiResult(runCommand(text, context), context.pushMessage);
}
