import { compile } from './compiler';

compile('./example/index.staty')
  .then(console.log)
  .catch(console.error);

export default compile; // eslint-disable-line import/no-default-export
