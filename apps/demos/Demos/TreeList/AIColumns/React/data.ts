import { type AIMessage, type Employee } from "./types";
import {
  AIIntegration,
  RequestParams,
  Response,
} from 'devextreme-react/common/ai-integration';
import { AzureOpenAI } from 'openai';
import notify from 'devextreme/ui/notify';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const aiService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages: AIMessage[], signal: AbortSignal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const response = await aiService.chat.completions.create(params, { signal });
  const result = response.choices[0].message?.content;

  return result;
}

async function getAIResponseRecursive(messages: AIMessage[], signal: AbortSignal) {
  return getAIResponse(messages, signal)
    .catch(async (error) => {
      if (!error.message.includes('Connection error')) {
        return Promise.reject(error);
      }

      notify({
        message: 'You have reached the AI rate limits of this demo. Retrying in 30 seconds...',
        width: 'auto',
        type: 'error',
        displayTime: 5000,
      });

      await new Promise((resolve) => setTimeout(resolve, 30000));

      return getAIResponseRecursive(messages, signal);
    });
}

export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }: RequestParams): Response {
    const isValidRequest = JSON.stringify(prompt.user).length < 5000;
    if (!isValidRequest) {
      return {
        promise: Promise.reject(new Error('Request is too large')),
        abort: () => {},
      };
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ];

    const promise = getAIResponseRecursive(aiPrompt, signal);

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  },
});

export const employees: Employee[] = [{
  ID: 1,
  Head_ID: 0,
  First_Name: 'John',
  Last_Name: 'Heart',
  Prefix: 'Mr.',
  Title: 'CEO',
  City: 'Los Angeles',
  State: 'California',
  Email: 'jheart@dx-email.com',
  Skype: 'jheart_DX_skype',
  Mobile_Phone: '(213) 555-9392',
  Birth_Date: '1964-03-16',
  Hire_Date: '1995-01-15',
  Status: 'Salaried',
}, {
  ID: 3,
  Head_ID: 1,
  First_Name: 'Arthur',
  Last_Name: 'Miller',
  Prefix: 'Mr.',
  Title: 'CTO',
  City: 'Los Angeles',
  State: 'California',
  Email: 'arthurm@dx-email.com',
  Mobile_Phone: '+1 (310) 555-8583',
  Birth_Date: '1972-07-11',
  Hire_Date: '2007-12-18',
  Status: 'Salaried',
}, {
  ID: 4,
  Head_ID: 1,
  First_Name: 'Robert',
  Last_Name: 'Reagan',
  Prefix: 'Mr.',
  Title: 'CMO',
  City: 'Pasadena',
  State: 'California',
  Email: 'robertr@dx-email.com',
  Mobile_Phone: '+1 (818) 555-2387',
  Birth_Date: '1974-09-07',
  Hire_Date: '2002-11-08',
  Status: 'Salaried',
}, {
  ID: 5,
  Head_ID: 1,
  First_Name: 'Greta',
  Last_Name: 'Sims',
  Prefix: 'Ms.',
  Title: 'HR Manager',
  City: 'Alhambra',
  State: 'California',
  Email: 'gretas@dx-email.com',
  Mobile_Phone: '+1 (818) 555-6546',
  Birth_Date: '1977-11-22',
  Hire_Date: '1998-04-23',
  Status: 'Salaried',
}, {
  ID: 6,
  Head_ID: 3,
  First_Name: 'Brett',
  Last_Name: 'Wade',
  Prefix: 'Mr.',
  Title: 'IT Manager',
  City: 'San Marino',
  State: 'California',
  Email: 'brettw@dx-email.com',
  Mobile_Phone: '+1 (626) 555-0358',
  Birth_Date: '1968-12-01',
  Hire_Date: '2009-03-06',
  Status: 'Salaried',
}, {
  ID: 7,
  Head_ID: 5,
  First_Name: 'Sandra',
  Last_Name: 'Johnson',
  Prefix: 'Mrs.',
  Title: 'Controller',
  City: 'Long Beach',
  State: 'California',
  Email: 'sandraj@dx-email.com',
  Mobile_Phone: '+1 (562) 555-2082',
  Birth_Date: '1974-11-15',
  Hire_Date: '2005-05-11',
  Status: 'Salaried',
}, {
  ID: 21,
  Head_ID: 6,
  First_Name: 'Taylor',
  Last_Name: 'Riley',
  Prefix: 'Mr.',
  Title: 'Network Admin',
  City: 'West Hollywood',
  State: 'California',
  Email: 'taylorr@dx-email.com',
  Mobile_Phone: '+1 (310) 555-7276',
  Birth_Date: '1982-08-14',
  Hire_Date: '2012-04-14',
  Status: 'Salaried',
}, {
  ID: 22,
  Head_ID: 6,
  First_Name: 'Amelia',
  Last_Name: 'Harper',
  Prefix: 'Mrs.',
  Title: 'Network Admin',
  City: 'Los Angeles',
  State: 'California',
  Email: 'ameliah@dx-email.com',
  Mobile_Phone: '+1 (213) 555-4276',
  Birth_Date: '1983-11-19',
  Hire_Date: '2011-02-10',
  Status: 'Salaried',
}, {
  ID: 25,
  Head_ID: 6,
  First_Name: 'Karen',
  Last_Name: 'Goodson',
  Prefix: 'Miss',
  Title: 'Programmer',
  City: 'South Pasadena',
  State: 'California',
  Email: 'kareng@dx-email.com',
  Mobile_Phone: '+1 (626) 555-0908',
  Birth_Date: '1987-04-26',
  Hire_Date: '2011-03-14',
  Status: 'Salaried',
}, {
  ID: 28,
  Head_ID: 6,
  First_Name: 'Morgan',
  Last_Name: 'Kennedy',
  Prefix: 'Mrs.',
  Title: 'Graphic Designer',
  City: 'San Fernando Valley',
  State: 'California',
  Email: 'morgank@dx-email.com',
  Mobile_Phone: '+1 (818) 555-8238',
  Birth_Date: '1984-07-17',
  Hire_Date: '2012-01-11',
  Status: 'Salaried',
}, {
  ID: 29,
  Head_ID: 28,
  First_Name: 'Violet',
  Last_Name: 'Bailey',
  Prefix: 'Ms.',
  Title: 'Jr Graphic Designer',
  City: 'La Canada',
  State: 'California',
  Email: 'violetb@dx-email.com',
  Mobile_Phone: '+1 (818) 555-2478',
  Birth_Date: '1985-06-10',
  Hire_Date: '2012-01-19',
  Status: 'Salaried',
}, {
  ID: 32,
  Head_ID: 3,
  First_Name: 'Bart',
  Last_Name: 'Arnaz',
  Prefix: 'Mr.',
  Title: 'Director of Engineering',
  City: 'Irvine',
  State: 'California',
  Email: 'barta@dx-email.com',
  Mobile_Phone: '+1 (714) 555-2000',
  Birth_Date: '1979-11-01',
  Hire_Date: '2008-06-29',
  Status: 'Salaried',
}, {
  ID: 36,
  Head_ID: 32,
  First_Name: 'Samantha',
  Last_Name: 'Piper',
  Prefix: 'Ms.',
  Title: 'Engineer',
  City: 'Los Angeles',
  State: 'California',
  Email: 'samanthap@dx-email.com',
  Mobile_Phone: '+1 (323) 555-4512',
  Birth_Date: '1984-12-01',
  Hire_Date: '2008-01-22',
  Status: 'Salaried',
}, {
  ID: 38,
  Head_ID: 32,
  First_Name: 'Terry',
  Last_Name: 'Bradley',
  Prefix: 'Mr.',
  Title: 'QA Engineer',
  City: 'Simi Valley',
  State: 'California',
  Email: 'terryb@dx-email.com',
  Mobile_Phone: '+1 (805) 555-2788',
  Birth_Date: '1984-01-09',
  Hire_Date: '2007-10-18',
  Status: 'Salaried',
}, {
  ID: 44,
  Head_ID: 4,
  First_Name: 'Clark',
  Last_Name: 'Morgan',
  Prefix: 'Mr.',
  Title: 'Retail Sales Manager',
  City: 'Martinez',
  State: 'California',
  Email: 'clarkm@dx-email.com',
  Mobile_Phone: '+1 (925) 555-2525',
  Birth_Date: '1988-04-07',
  Hire_Date: '2012-04-11',
  Status: 'Commission',
}, {
  ID: 45,
  Head_ID: 4,
  First_Name: 'Todd',
  Last_Name: 'Hoffman',
  Prefix: 'Mr.',
  Title: 'Retail Sales Manager',
  City: 'Livermore',
  State: 'California',
  Email: 'toddh@dx-email.com',
  Mobile_Phone: '+1 (925) 555-3579',
  Birth_Date: '1987-03-25',
  Hire_Date: '2012-04-19',
  Status: 'Commission',
}, {
  ID: 48,
  Head_ID: 32,
  First_Name: 'Brad',
  Last_Name: 'Farkus',
  Prefix: 'Mr.',
  Title: 'Engineer',
  City: 'Los Angeles',
  State: 'California',
  Email: 'bradf@dx-email.com',
  Mobile_Phone: '+1 (213) 555-3626',
  Birth_Date: '1991-03-17',
  Hire_Date: '2010-04-15',
  Status: 'Terminated',
}, {
  ID: 51,
  Head_ID: 32,
  First_Name: 'Stu',
  Last_Name: 'Pizaro',
  Prefix: 'Mr.',
  Title: 'Engineer',
  City: 'Los Angeles',
  State: 'California',
  Email: 'stu@dx-email.com',
  Mobile_Phone: '+1 (213) 555-2552',
  Birth_Date: '1985-09-11',
  Hire_Date: '2011-07-19',
  Status: 'Terminated',
}];
