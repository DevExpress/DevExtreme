import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { GenerateCommunityLocalesExecutorSchema } from './schema';
import {
  writeFileText,
  readFileText,
  cleanupTempDir,
  createTempDir,
  createMockContext,
} from '../../utils';

const PROJECT_SUBPATH = ['packages', 'test-lib'] as const;

const EN_JSON = `{
    "en": {
        "Yes": "Yes",
        "No": "No",
        "Cancel": "Cancel",
        "Quote": "Say \\"hi\\"",
        "Loading": "Loading..."
    }
}
`;

const FR_JSON_INPUT = `{
    "fr": {
        "Yes": "Oui",
        "No": "TODO: Non",
        "Quote": "Dire \\"salut\\"",
        "Loading": "Chargement...",
        "Extra": "Extra"
    }
}
`;

// "No" keeps the English default (source value contains TODO), "Cancel" keeps the
// English default (missing in fr), "Extra" is dropped (absent from en), quotes are
// escaped, and en.json's key order/indentation/trailing newline are inherited verbatim.
const EXPECTED_FR = `{
    "fr": {
        "Yes": "Oui",
        "No": "No",
        "Cancel": "Cancel",
        "Quote": "Dire \\"salut\\"",
        "Loading": "Chargement..."
    }
}
`;

interface Fixture {
  projectDir: string;
  messagesDir: string;
}

async function createFixture(tempDir: string): Promise<Fixture> {
  const projectDir = path.join(tempDir, ...PROJECT_SUBPATH);
  const messagesDir = path.join(projectDir, 'js', 'localization', 'messages');

  fs.mkdirSync(messagesDir, { recursive: true });

  await writeFileText(path.join(messagesDir, 'en.json'), EN_JSON);
  await writeFileText(path.join(messagesDir, 'fr.json'), FR_JSON_INPUT);

  return { projectDir, messagesDir };
}

describe('GenerateCommunityLocalesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let fixture: Fixture;

  beforeEach(async () => {
    tempDir = createTempDir('nx-community-locales-e2e-');
    context = createMockContext({ root: tempDir });
    fixture = await createFixture(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('normalizes community locale files against the default locale', async () => {
    const options: GenerateCommunityLocalesExecutorSchema = {
      messagesDir: './js/localization/messages',
      defaultLocale: 'en',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const frContent = await readFileText(path.join(fixture.messagesDir, 'fr.json'));
    expect(frContent).toBe(EXPECTED_FR);
  });

  it('leaves the default locale file untouched', async () => {
    const result = await executor({}, context);

    expect(result.success).toBe(true);

    const enContent = await readFileText(path.join(fixture.messagesDir, 'en.json'));
    expect(enContent).toBe(EN_JSON);
  });

  it('fails when the messages directory is missing', async () => {
    const result = await executor({ messagesDir: './js/localization/does-not-exist' }, context);

    expect(result.success).toBe(false);
  });
});
