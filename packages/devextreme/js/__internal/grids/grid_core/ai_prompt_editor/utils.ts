export const getPrompt = (prompt: string | undefined): string => prompt ?? '';

export const isPromptChanged = (
  initialPrompt: string | undefined,
  currentPrompt: string | undefined,
): boolean => getPrompt(initialPrompt) !== getPrompt(currentPrompt);
