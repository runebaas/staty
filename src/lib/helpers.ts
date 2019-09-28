import * as fs from 'fs';
import { promisify } from 'util';

export const ReadFile = promisify(fs.readFile);
