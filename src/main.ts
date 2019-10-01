#!/usr/bin/env node

import {compile} from './compiler';

const file = process.argv.find(arg => arg.endsWith('.staty'));

compile(file ? file : './index.staty')
  .then(console.log)
  .catch(console.error);

export default compile; // eslint-disable-line import/no-default-export
