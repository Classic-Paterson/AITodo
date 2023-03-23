const { readFileSync, existsSync, writeFileSync, appendFileSync } = require('fs');
const { join, relative } = require('path');
const glob = require('glob');

function processRepository(repoPath, ignoreList, outputFilePath) {
  const allFiles = glob.sync(`${repoPath}/**/*`, { dot: true, nodir: true, ignore: ignoreList });
  const filteredFiles = allFiles.filter(file => !file.includes('node_modules'));

  for (const file of filteredFiles) {
    const relativeFilePath = relative(repoPath, file);
    const contents = readFileSync(file, 'utf-8');
    appendFileSync(outputFilePath, `----\n${relativeFilePath}\n${contents}\n`);
  }
}

function writePreamble(outputFilePath, preambleFilePath) {
  if (preambleFilePath) {
    const preambleText = readFileSync(preambleFilePath, 'utf-8');
    appendFileSync(outputFilePath, `${preambleText}\n`);
  } else {
    appendFileSync(
      outputFilePath,
      'The following text is a continuation of Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encounted before the --END-- symbol, only reply with "accepted". Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.\n'
    );
  }
}

function main() {
  let [repoPath, ...args] = process.argv.slice(2);
  repoPath = repoPath ? repoPath : './';

  if (!repoPath) {
    console.log("Usage: node git_to_text.js /path/to/git/repository [-p /path/to/preamble.txt] [-o /path/to/output_file.txt]");
    return;
  }

  const ignoreFilePath = join(repoPath, '.gptignore');
  const ignoreList = existsSync(ignoreFilePath) ? readFileSync(ignoreFilePath, 'utf-8').split('\n').map(line => line.trim()) : [];

  let outputFilePath = 'output.txt';
  let preambleFilePath = null;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o') {
      outputFilePath = args[i + 1];
    } else if (args[i] === '-p') {
      preambleFilePath = args[i + 1];
    }
  }

  if (!outputFilePath) {
    console.log('Error: missing output file path');
    return;
  }

  writeFileSync(outputFilePath, '');

  writePreamble(outputFilePath, preambleFilePath);

  processRepository(repoPath, ignoreList, outputFilePath);

  appendFileSync(outputFilePath, '--END--');
  console.log(`Repository contents written to ${outputFilePath}.`);
}

main();