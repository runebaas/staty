import cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { Component, ComponentDefinition, PropDefinition } from '../../models/componentModel';

const readFile = promisify(fs.readFile);

export async function parser(component: Component): Promise<CheerioStatic> {
  const { propData, document } = component;

  if (!checkForMissingProperties(component)) {
    throw new Error(`Component ${component.definition.name} is missing required properties`);
  }

  document('ref').map((i, e) => e.attribs.id = v4());
  document('ref').each((i, ref) => {
    try {
      document(`#${ref.attribs.id}`).replaceWith(propData[ref.attribs.name]);
    } catch (e) {
      throw new Error(`failed to substitute ref "${ref.attribs.name || '(anonymous)'}" in ${component.path}`);
    }
  });

  document('component').map((i, e) => e.attribs.id = v4());

  const componentReplace: Promise<void>[] = [];
  document('component').each((i, comp) =>
    componentReplace.push((async () => {
      const info = await parseComponentInfo(path.dirname(component.path), comp);
      const res = await parser(info);
      document(`#${comp.attribs.id}`).replaceWith(res('slot').html());
    })()));
  await Promise.all(componentReplace);

  return document;
}

export async function parseComponentInfo(workdir: string, component: (CheerioElement | {attribs: { path: string }}) = { attribs: { path: 'index.sty' } }): Promise<Component> {
  const { path: componentPath, ...props } = component.attribs;

  const filePath = path.resolve(workdir, componentPath);

  const document = await loadDocument(filePath);
  const definition = loadDefinition(document);

  return {
    path: filePath,
    propData: props as { [name: string]: string; },
    definition,
    document
  };
}

async function loadDocument(filePath): Promise<CheerioStatic> {
  const entry = await readFile(filePath);
  return cheerio.load(entry);
}

function loadDefinition(comp: CheerioStatic): ComponentDefinition {
  const definition = {
    name: 'anonymous',
    props: []
  };

  comp('definition').children().each((i, tag) => {
    if (tag.tagName === 'meta' && tag.attribs.content) {
      switch (tag.attribs.name) {
        case 'name':
          definition.name = tag.attribs.content;
          return;
        case 'prop':
          definition.props.push(resolvePropDefinition(tag));
          return;
        default:
          return;
      }
    }
  });

  return definition;
}

function resolvePropDefinition({ attribs }: CheerioElement): PropDefinition {
  const definition: PropDefinition = {
    name: attribs.content,
    default: attribs.default
  };

  return definition;
}

function checkForMissingProperties({ definition, propData }: Component): PropDefinition[] {
  return definition.props.filter(prop => !!prop.default && propData[prop.name]);
}
