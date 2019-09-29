import { compile } from '../../src/compiler';
import { ReadFile } from '../../src/lib/helpers';
import * as path from 'path';

describe('Full Test', () => {
  test('Renders the example correctly', async () => {
    const expected = await ReadFile(path.resolve(path.dirname(__filename), './expectedResult.html'));
    const result = await compile('./example/index.staty');
    expect(result).toBe(expected.toString());
  });
});
