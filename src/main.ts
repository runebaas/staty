import { parse } from './parser';

parse('./example/index.sty')
  .then(console.log)
  .catch(console.error);

export default parse; // eslint-disable-line import/no-default-export
