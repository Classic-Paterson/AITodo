import fs from 'fs';
import readline from 'readline';
import clipboardy from 'clipboardy';

async function main(filePath = './output.txt') {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream });
  
  const prompt = 'The following text is a continuation of Git repository with code. The structure of the text are sections that begin with ----, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encounted before the --END-- symbol, only reply with "accepted". Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.';
  const characterLength = 4000 - prompt.length;
  let buffer = '';

  for await (const line of rl) {
    buffer += line;
    if (buffer.length >= characterLength) {
      await clipboardy.write(prompt + buffer.slice(0, characterLength));
      buffer = buffer.slice(characterLength);
      console.log(`Copied ${characterLength} characters to clipboard. Press any key to continue...`);
      await new Promise((resolve) => {
        process.stdin.once('data', () => {
          process.stdin.removeAllListeners('data');
          resolve();
        });
      });
    }
  }

  if (buffer.length > 0) {
    await clipboardy.write(buffer);
    console.log('Copied the remaining characters to clipboard. Press any key to exit...');
    await new Promise((resolve) => {
      process.stdin.once('data', () => {
        process.stdin.removeAllListeners('data');
        resolve();
      });
    });
  }

  process.stdin.pause();
}

const filePath = process.argv[2];
main(filePath).catch((err) => console.error(err));