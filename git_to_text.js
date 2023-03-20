const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

function getIgnoreList(ignoreFilePath) {
  const ignoreList = fs.readFileSync(ignoreFilePath, 'utf-8');
  return ignore().add(ignoreList);
}

function shouldIgnore(filePath, ignoreList) {
  return ignoreList.ignores(filePath);
}

function processRepository(repoPath, ignoreList, outputFile) {
    fs.readdirSync(repoPath, { withFileTypes: true }).forEach(entry => {
      const entryPath = path.join(repoPath, entry.name);
      if (entry.isFile()) {
        let relativeFilePath = path.relative(repoPath, entryPath);
        relativeFilePath = relativeFilePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
        if (!shouldIgnore(relativeFilePath, ignoreList)) {
          const contents = fs.readFileSync(entryPath, 'utf-8');
          fs.appendFileSync(outputFile, `----\n${relativeFilePath}\n${contents}\n`);
        }
      } else if (entry.isDirectory()) {
        processRepository(entryPath, ignoreList, outputFile);
      }
    });
  }
  

const repoPath = process.argv[2];
if (!repoPath) {
  console.log('Usage: node git_to_text.js /path/to/git/repository [-p /path/to/preamble.txt] [-o /path/to/output_file.txt]');
  process.exit(1);
}

const ignoreFilePath = path.join(repoPath, '.gptignore');
const ignoreList = fs.existsSync(ignoreFilePath) ? getIgnoreList(ignoreFilePath) : ignore();

const preambleFile = process.argv.includes('-p') ? process.argv[process.argv.indexOf('-p') + 1] : null;
const outputFilePath = process.argv.includes('-o') ? process.argv[process.argv.indexOf('-o') + 1] : 'output.txt';

fs.writeFileSync(outputFilePath, '');

if (preambleFile) {
  const preambleText = fs.readFileSync(preambleFile, 'utf-8');
  fs.appendFileSync(outputFilePath, `${preambleText}\n`);
} else {
  fs.appendFileSync(outputFilePath, 'The following text is a Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encounted. Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.\n');
}

processRepository(repoPath, ignoreList, outputFilePath);
fs.appendFileSync(outputFilePath, '--END--');
console.log(`Repository contents written to ${outputFilePath}.`);
