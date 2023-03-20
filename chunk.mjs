import fs from 'fs';
import readline from 'readline';
import clipboardy from 'clipboardy';

const main = async (filePath) => {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream });

  let buffer = '';

  for await (const line of rl) {
    buffer += line;
    if (buffer.length >= 4000) {
      await clipboardy.write(buffer.slice(0, 4000));
      buffer = buffer.slice(4000);
      console.log('Copied 4000 characters to clipboard. Press any key to continue...');
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
};

const filePath = process.argv[2] || './output.txt';
main(filePath).catch((err) => console.error(err));
