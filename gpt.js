const fs = require("fs");
const path = require("path");
const glob = require("glob");

function getIgnoreList(ignoreFilePath) {
  const ignoreList = fs.readFileSync(ignoreFilePath, "utf-8").split("\n").map(line => line.trim());
  return ignoreList;
}

function processRepository(repoPath, ignoreList, outputFile) {
  const allFiles = glob.sync(`${repoPath}/**/*`, { dot: true, nodir: true, ignore: ignoreList });
  const filteredFiles = allFiles.filter(file => !file.includes("node_modules"));

  for (const file of filteredFiles) {
    const relativeFilePath = path.relative(repoPath, file);
    const contents = fs.readFileSync(file, "utf-8");
    fs.appendFileSync(outputFile, `----\n${relativeFilePath}\n${contents}\n`);
  }
}

const repoPath = process.argv[2] ?? './';
if (!repoPath) {
  console.log("Usage: node git_to_text.js /path/to/git/repository [-p /path/to/preamble.txt] [-o /path/to/output_file.txt]");
  process.exit(1);
}

const ignoreFilePath = path.join(repoPath, ".gptignore");
const ignoreList = fs.existsSync(ignoreFilePath) ? getIgnoreList(ignoreFilePath) : [];

const preambleFile = process.argv.includes("-p") ? process.argv[process.argv.indexOf("-p") + 1] : null;
const outputFilePath = process.argv.includes("-o") ? process.argv[process.argv.indexOf("-o") + 1] : "output.txt";

fs.writeFileSync(outputFilePath, "");

if (preambleFile) {
  const preambleText = fs.readFileSync(preambleFile, "utf-8");
  fs.appendFileSync(outputFilePath, `${preambleText}\n`);
} else {
  fs.appendFileSync(outputFilePath, "The following text is a Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encounted. Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.\n");
}

processRepository(repoPath, ignoreList, outputFilePath);
fs.appendFileSync(outputFilePath, "--END--");
console.log(`Repository contents written to ${outputFilePath}.`);
