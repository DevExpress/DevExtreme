import { Injectable } from '@angular/core';

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const defaultText = `Payment: Amount - $123.00
Statement Date: 10/15/2024
Name: John Smith
Contact: (123) 456-7890
Email: john@myemail.com
Address:
- 123 Elm St Apt 4B
- New York, NY 10001
`;

@Injectable({
  providedIn: 'root',
})
export class Service {
  getDefaultText() {
    return defaultText;
  }

  getAzureOpenAIConfig() {
    return AzureOpenAIConfig;
  }
}
