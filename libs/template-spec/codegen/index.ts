import * as fs from 'node:fs';
import { z } from 'zod';
import { printNode, zodToTs } from 'zod-to-ts';
import type { DefineCommand } from '../util';
import { defineCommand } from '../util';

const isZodVoid = (zod: any) => {
  return zod._def.typeName === 'ZodVoid';
};

export const getControllerType = defineCommand({
  paramsSchema: z.void(),
  returnSchema: z.union([z.literal('local'), z.literal('docker')]),
});

const transformTemplateDefinition = (typeName: string, template: Record<string, DefineCommand>) => {
  const upperTypeName = `${typeName[0].toUpperCase()}${typeName.slice(1)}`;
  const commandNameTypeName = `${upperTypeName}CommandName`;
  const commandsTypeName = `${upperTypeName}Commands`;
  const templateCommands = { getControllerType, ...template };
  const commandNames = Object.keys(templateCommands);

  const commands = Object.entries(templateCommands).map(([name, { paramsSchema, returnSchema }]) => {
    return [
      `${JSON.stringify(name)}:{`,
      [`params:${printNode(zodToTs(paramsSchema).node)}`, `returnType:${printNode(zodToTs(returnSchema).node)}`].join(
        ',',
      ),
      '}',
    ].join('');
  });

  const registerParams = Object.entries(template).map(([name, { paramsSchema, returnSchema }]) => {
    const t = printNode(zodToTs(returnSchema).node);
    return [`${JSON.stringify(name)}:`, `(params:${printNode(zodToTs(paramsSchema).node)})=>${t}|Promise<${t}>`].join(
      '',
    );
  });

  const templateData = Object.fromEntries(
    Object.entries(templateCommands).map(([name, { paramsSchema, returnSchema }]) => {
      return [
        name,
        {
          paramsIsVoid: isZodVoid(paramsSchema),
          returnIsVoid: isZodVoid(returnSchema),
        },
      ];
    }),
  );

  return [
    // command name
    `export type ${commandNameTypeName}=${commandNames.map((c) => JSON.stringify(c)).join('|')};`,
    `export type ${commandsTypeName}={${commands}};`,
    `export type Register${upperTypeName}TemplateParams={${registerParams}};`,
    `export const ${typeName}TemplateData=${JSON.stringify(templateData)};`,
  ].join('');
};

type TemplateTypes = Record<string, Record<string, DefineCommand>>;
export type TransformTemplateTypesCodeParams = {
  templateTypes: TemplateTypes;
};
export const transformTemplateTypesCode = ({ templateTypes }: TransformTemplateTypesCodeParams) => {
  return Object.entries(templateTypes)
    .map(([typeName, templateType]) => transformTemplateDefinition(typeName, templateType))
    .join('');
};

export type GenerateRoutesCodeParams = {
  templateTypes: TemplateTypes;
  outputPath: string;
};
export const generateTemplateTypesCode = (params: GenerateRoutesCodeParams) => {
  fs.writeFileSync(params.outputPath, transformTemplateTypesCode({ templateTypes: params.templateTypes }));
};
