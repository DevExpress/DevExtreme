const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PROJECT_ROOT, GIT_CONFIG } = require("../config/constants");

/**
 * Gets commits for the specified path
 */
function getGitCommits(filePath, limit = GIT_CONFIG.DEFAULT_COMMIT_LIMIT) {
  try {
    const absolutePath = path.resolve(PROJECT_ROOT, filePath);
    const relativePath = path.relative(PROJECT_ROOT, absolutePath);

    // Check if file/folder exists
    if (!fs.existsSync(absolutePath)) {
      return { error: `Path ${relativePath} not found` };
    }

    // Git log command to get recent commits
    const gitCommand = `git log --oneline --pretty=format:"${GIT_CONFIG.LOG_FORMAT}" --date=${GIT_CONFIG.DATE_FORMAT} -${limit} -- "${relativePath}"`;

    const output = execSync(gitCommand, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    }).trim();

    if (!output) {
      return { commits: [], message: `No commits found for ${relativePath}` };
    }

    const commits = output.split('\n').map(line => {
      const [hash, author, date, message] = line.split('|');
      return { hash, author, date, message };
    });

    return { commits, path: relativePath };
  } catch (error) {
    return { error: `Error getting commits: ${error.message}` };
  }
}

/**
 * Displays commits in console
 */
function displayCommits(commitData) {
  console.clear();

  if (commitData.error) {
    console.log(`❌ ${commitData.error}`);
    return;
  }

  if (commitData.commits.length === 0) {
    console.log(`📝 ${commitData.message}`);
    return;
  }

  console.log(`\n📋 Last ${commitData.commits.length} commits for: ${commitData.path}`);
  console.log('='.repeat(80));

  // Group commits by authors for statistics
  const authorStats = {};
  commitData.commits.forEach(commit => {
    if (!authorStats[commit.author]) {
      authorStats[commit.author] = 0;
    }
    authorStats[commit.author]++;
  });

  // Show author statistics
  const sortedAuthors = Object.entries(authorStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log(`\n👥 Top 5 authors:`);
  sortedAuthors.forEach(([author, count], index) => {
    const emoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index];
    console.log(`${emoji} ${author}: ${count} commits`);
  });

  console.log(`\n📝 Commit history:`);
  console.log('-'.repeat(80));

  commitData.commits.forEach((commit, index) => {
    const number = (index + 1).toString().padStart(2, '0');
    console.log(`${number}. ${commit.hash} | ${commit.author} | ${commit.date}`);
    console.log(`    ${commit.message}`);
    if (index < commitData.commits.length - 1) {
      console.log('');
    }
  });

  console.log('-'.repeat(80));
}

module.exports = {
  getGitCommits,
  displayCommits
};
