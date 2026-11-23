import { RequestMock } from 'testcafe';
import { xmlaRules } from './xmlaRules';

export const xmlaServiceMock = xmlaRules.reduce(
  (mock, rule) => mock
    .onRequestTo((req) => rule.matches(req))
    .respond(rule.body, 200, rule.headers),
  RequestMock(),
);
