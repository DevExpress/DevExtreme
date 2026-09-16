import { applyFormClearAction, applyFormSmartPaste, getFormFieldOptions } from '../commands/form-commands.js';
import {
  applyGridActions, buildGridPromptSection, buildGridResponseSchema, getGridColumnNames,
} from '../commands/grid-commands.js';
import { FORM_ACTION_TYPES, ROUTER_TARGETS } from '../types/types.js';

const MAX_USER_MESSAGE_LENGTH = 2000;
const FIELD_OR_VALUE_NOT_FOUND_MESSAGE = '❌ No field or column exists with such a name, or the entered value is invalid. Please check the name and value and try again.';
export class ChatCommandError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ChatCommandError';
    Object.setPrototypeOf(this, ChatCommandError.prototype);
  }
}
export function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  try {
    return JSON.parse(match?.[0] ?? '{}');
  } catch {
    throw new ChatCommandError('❌ I received an unexpected response from the AI service. Please rephrase your request and try again.');
  }
}
export function executeAiCommand(text, aiIntegration) {
  return new Promise((resolve, reject) => {
    aiIntegration.execute({ text }, {
      onComplete: (finalResponse) => {
        try {
          resolve(extractJson(finalResponse));
        } catch (error) {
          reject(error);
        }
      },
      onError: reject,
    });
  });
}
export async function classifyRequest(text, aiIntegration) {
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

${buildFormActionPromptSection()}

User request: '${text}'`,
  ].join('\n');
  try {
    const parsed = (await executeAiCommand(prompt, aiIntegration));
    const target = String(parsed?.target ?? 'mixed').trim().toLowerCase();
    const rawFormAction = parsed?.formAction;
    const formActionType = rawFormAction?.type;
    if (!rawFormAction || typeof formActionType !== 'string' || !FORM_ACTION_TYPES.has(formActionType)) {
      return {
        target: ROUTER_TARGETS.has(target) ? target : 'mixed',
        formAction: null,
      };
    }
    return {
      target: ROUTER_TARGETS.has(target) ? target : 'mixed',
      formAction: {
        type: formActionType,
        field: rawFormAction.field,
      },
    };
  } catch {
    return { target: 'mixed', formAction: null };
  }
}
export function buildFormActionPromptSection() {
  const fieldList = getFormFieldOptions()
    .map((field) => `${field.dataField} (${field.label})`)
    .join(', ');
  return `Form fields (dataField and label): ${fieldList}.
If the request is about the form, also set formAction to one of:
- {type: 'clear_field', field: '<dataField>'} to clear one specific field.
- {type: 'clear_all'} to clear/reset the whole form.
- {type: 'smart_paste'} to fill in form data from the request text.
Set formAction to null if the request is not about the form.`;
}
export function buildGridSystemPrompt(columnNames) {
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
export async function buildGridResultsPromise(grid, aiIntegration, text) {
  const prompt = `${buildGridSystemPrompt(getGridColumnNames(grid))}\n\nUser request: '${text}'`;
  try {
    const parsed = (await executeAiCommand(prompt, aiIntegration));
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
export async function buildFormResultsPromise(form, formAction, text) {
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
function formatFailures(messages) {
  return messages.map((message) => `❌ ${message}`).join('\n');
}
function formatSucceeded(messages) {
  return messages.map((message) => `✅ Done. ${message}`).join('\n');
}
export function joinSucceededOrThrow(results, fallbackError) {
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
export async function runCommand(text, { form, gridInstance, aiIntegration }) {
  if (text.length > MAX_USER_MESSAGE_LENGTH) {
    throw new ChatCommandError('❌ This message is too long for me to process. Please shorten it and try again.');
  }
  const { target, formAction } = await classifyRequest(text, aiIntegration);
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
  const errors = [gridResult.error, formResult.error].filter((error) => error instanceof Error);
  return joinSucceededOrThrow([...formResult.results, ...gridResult.results], errors[0] ?? null);
}
export function reportAiResult(promise, pushMessage) {
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
export function routeMessage(text, context) {
  return reportAiResult(runCommand(text, context), context.pushMessage);
}
