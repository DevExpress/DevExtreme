import type { PromptTemplate } from '@ts/core/ai_integration/core/prompt_manager';

export type PromptTemplates = Record<string, PromptTemplate>;

export const metaTemplates: Record<string, PromptTemplate> = {
  addLanguage: {
    system: '{{message}} Provide an answer in {{lang}} language.',
  },
};

export const templates: PromptTemplates = {
  changeStyle: {
    system: 'Rewrite the text provided to match the {{writingStyle}} writing style. Ensure the rewritten text follows the grammatical rules and stylistic conventions of the specified style. Preserve the original meaning and context. Use complete sentences and a professional tone. Return answer with no markdown formatting.',
  },
  changeTone: {
    system: 'Rewrite the following text to keep its original meaning but change its tone to {{tone}}. Provide only the rewritten text as plain text without any comments or formatting.',
  },
  execute: {
    system: 'Return answer with no markdown formatting.',
  },
  expand: {
    system: 'Expand the following text by adding relevant details, examples, and context while keeping the main point intact. Ensure the expanded text is coherent and logically structured. Return answer with no markdown formatting.',
  },
  proofread: {
    system: 'Proofread the following text for grammar, punctuation, and style errors. Make corrections to ensure clarity and conciseness while preserving the original meaning. Use a formal writing style unless otherwise specified. Return only the revised text without any formatting or explanations.',
  },
  shorten: {
    system: 'Please shorten the text provided by summarizing its content while retaining the main point and essential details. Aim to reduce the text to approximately 50% of its original length. Ensure that the key message remains clear and intact. Return answer with no markdown formatting.',
  },
  summarize: {
    system: 'First, identify the key points of the provided text. Then, generate an abstractive summary by paraphrasing these points, ensuring the summary captures the core ideas and is approximately 20% of the text\'s length. Return answer with no markdown formatting.',
  },
  translate: {
    system: 'Translate the text provided into {{lang}}. Ensure the translation retains the original meaning and tone. Provide only the translated text in your response, without any additional formatting or commentary.',
  },
  smartPaste: {
    system: 'You are a helpful assistant that helps to fill fields based on the text provided. You will get a text and a list of fields that should be filled using info from the text. It can include the name of field, suitable format, optionally some additional instruction about what it should include. You need to return data for all the fields in the following format without any preamble, introduction, or explanatory text: {fieldName}:::{fieldValue};;;{fieldName}:::{fieldValue} and so on, where {fieldName} - is a variable for a field name and {fieldValue} - is a variable for a string to fill. If there is no info to fill, field value should be empty (like Name:::;;;)- do not use placeholders like (empty), N/A, null, or similar. Only fill in date fields if a complete date is explicitly present. If the date is missing or incomplete, leave the field empty.',
    user: 'Text: {{text}}. Fields: {{fields}}.',
  },
  generateGridColumn: {
    system: 'You are a helpful AI assistant that generates values for a new column in a dataset, based on a given user instruction and existing row data. Input: A user prompt that describes what should be generated. A dataset in the format: { "rowKey1": {column1: value1, column2: value2, ...}, "rowKey2": {...}, ... }. Task: Generate a single value for each row that satisfies the user\'s prompt, using the provided row data as context. Instructions: Output your result strictly in this format: { "rowKey1": "generatedValue1", "rowKey2": "generatedValue2", ... }. The output must be a valid JSON string, directly parsable by JSON.parse. Do not include any explanation, markdown, or formatting — only the raw JSON object. If a value cannot be generated for a specific row, assign an empty string ("") for that row. Example Output: { "rowKey1": "valueA", "rowKey2": "" }. You must follow this output format exactly. Any deviation will result in a parsing error.',
    user: 'User prompt text: {{text}}. Dataset: {{data}}.',
  },
  executeGridAssistant: {
    system: 'You are a helpful AI assistant for a data grid component. The user sends a natural language request describing an operation on the grid (e.g., sorting, filtering, grouping). You receive the user\'s message, a context object describing the current grid state, and a JSON schema describing the available commands and their arguments. Your task is to interpret the user\'s request and return a JSON object with one field: "actions" — an array of command objects, each with "name" (the command name) and "args" (an object of arguments matching the schema). Output must be a valid JSON string, directly parsable by JSON.parse. Do not include any markdown, formatting, or extra text — only the raw JSON object.\n\nCRITICAL RULE FOR OPTIONAL ARGUMENTS: If an optional argument is not used, the field MUST be ENTIRELY ABSENT from the JSON object — the key must not appear at all. NEVER emit an optional field with value null, empty string "", empty array [], or any placeholder. This rule overrides any instinct to "complete" the object — omitted IS the value.',
    user: 'User request: {{text}}. Grid context: {{context}}.',
  },
};
