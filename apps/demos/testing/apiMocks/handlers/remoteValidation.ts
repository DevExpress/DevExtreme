import type { MockHandler } from '../types';

export const remoteValidationCheckUniqueEmailAddressHandler: MockHandler = {
  matches: (req) => /\/RemoteValidation\/CheckUniqueEmailAddress\b/i.test(req.url),
  respond: () => true,
};
