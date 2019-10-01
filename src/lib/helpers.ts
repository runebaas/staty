import * as fs from 'fs';
import {promisify} from 'util';

export const readFile = promisify(fs.readFile);

export const removeTextOffset = (value: string): string => {
  let contentStartsAt = -1;
  const lineSplit = value.includes('\r\n') ? '\r\n' : '\n';

  return value
    .split(lineSplit)
    .map(line => {
      if (contentStartsAt === -1) {
        if (line.length === 0) { return line; }
        contentStartsAt = line.match(/^(\s+)/gm)[0].length;
      }

      return line.slice(contentStartsAt);
    })
    .join(lineSplit);
};
