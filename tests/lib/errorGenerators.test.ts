import { GenerateErrorNode } from '../../src/lib/errorGenerators';

describe('GenerateErrorNode', () => {
  test('Generate Error Node', () => {
    const error = GenerateErrorNode('Test', '/some/path', new Error('Not an error'));
    expect(error).toEqual({
      nodeName: 'div',
      tagName: 'error',
      attrs: [],
      childNodes: [
        {
          nodeName: '#text',
          value: '--- ERROR | Test | /some/path | Not an error ---'
        }
      ]
    });
  });
});
