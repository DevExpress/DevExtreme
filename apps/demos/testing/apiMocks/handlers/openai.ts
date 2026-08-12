import type { MockHandler, MockRequest } from '../types';

// POST https://public-api.devexpress.com/demo-openai/.../chat/completions

// The AI-column demo posts a chat-completion request whose body embeds the
// demo-authored prompt verbatim. The column parses choices[0].message.content
// as a JSON string of the shape { "<rowKey>": "<value>", ... }.

interface AIColumnCase {
  // A distinctive fragment of the demo's own prompt, used to identify it.
  promptIncludes: string;
  // Answers keyed by row key (the grid keyExpr value).
  answers: Record<string, string>;
}

const cases: AIColumnCase[] = [
  {
    // apps/demos/Demos/DataGrid/AIColumns — the AI column asks for the
    // manufacturing country; answers cover the first rendered page (IDs 1-10).
    promptIncludes: 'Identify the country where the vehicle model is manufactured',
    answers: {
      1: 'Japan',
      2: 'United States',
      3: 'Japan',
      4: 'Japan',
      5: 'Germany',
      6: 'Germany',
      7: 'Japan',
      8: 'Germany',
      9: 'Japan',
      10: 'Germany',
    },
  },
  {
    // apps/demos/Demos/TreeList/AIColumns — the AI column assigns a department.
    // Answers cover every employee (18 rows), so the tree's render order and
    // paging don't matter — the column only reads the keys it requested.
    promptIncludes: 'Identify the department where the employee works',
    answers: {
      1: 'Management',
      3: 'Management',
      4: 'Management',
      5: 'Human Resources',
      6: 'IT',
      7: 'Management',
      21: 'IT',
      22: 'IT',
      25: 'Engineering',
      28: 'Engineering',
      29: 'Engineering',
      32: 'Engineering',
      36: 'Engineering',
      38: 'Engineering',
      44: 'Sales',
      45: 'Sales',
      48: 'Engineering',
      51: 'Engineering',
    },
  },
];

const isOpenAIUrl = (url: string): boolean => /demo-openai\b/i.test(url);

const findCase = (req: MockRequest): AIColumnCase | undefined => {
  const body = typeof req.body === 'string'
    ? req.body
    : req.body?.toString() ?? '';

  return cases.find((c) => body.includes(c.promptIncludes));
};

const matches = (req: MockRequest): boolean => {
  const method = req.method.toLowerCase();
  // Answer the CORS preflight for the endpoint too, so it isn't sent to the
  // real service (which would reintroduce flakiness).
  if (method === 'options') {
    return isOpenAIUrl(req.url);
  }
  return isOpenAIUrl(req.url) && method === 'post' && !!findCase(req);
};

const completion = (content: string): object => ({
  choices: [
    { index: 0, finish_reason: 'stop', message: { role: 'assistant', content } },
  ],
});

export const openAIHandler: MockHandler = {
  matches,
  respond: (req) => {
    // CORS preflight — a minimal body is enough (the browser discards it).
    if (req.method.toLowerCase() === 'options') {
      return {};
    }
    return completion(JSON.stringify(findCase(req)?.answers ?? {}));
  },
};
