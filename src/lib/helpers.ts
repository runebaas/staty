import * as fs from 'fs';
import { promisify } from 'util';

export const ReadFile = promisify(fs.readFile);

export const RemoveTextOffset = (value: string): string => {
  let contentStartsAt = -1;
  const lineSplit = value.includes('\r\n') ? '\r\n' : '\n';
  return value
    .split(lineSplit)
    .map(f => {
      if (contentStartsAt === -1) {
        if (f.length === 0) { return f; }
        contentStartsAt = f.match(/^(\s+)/gm)[0].length;
      }
      return f.slice(contentStartsAt);
    })
    .join(lineSplit);
};
