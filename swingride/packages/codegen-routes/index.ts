import type { Router } from '@swingride/core';
import { hasSubroutes, isQueryRouter, isSubscriptionRouter } from '@swingride/core';
import * as fs from 'node:fs';
import { printNode, zodToTs } from 'zod-to-ts';

const isZodVoid = (zod: any) => {
  return zod._def.typeName === 'ZodVoid';
};

export type TransformRoutesCodeParams = {
  router: Router;
};
export const transformRoutesCode = (params: TransformRoutesCodeParams) => {
  const innerType = (router: Router, segments: string[]): string => {
    const subs = hasSubroutes(router)
      ? [
          '$:{',
          Object.entries(router.subs)
            .map(([key, sub]) => `${JSON.stringify(key)}:${innerType(sub, [...segments, key])}`)
            .join(';'),
          '}',
        ].join('')
      : '';
    const $query = isQueryRouter(router)
      ? [
          '$query:{',
          [
            ['segments:string[]'].join(''),
            ['isParamsVoid:boolean'].join(''),
            ['isReturnVoid:boolean'].join(''),
            [
              '[s:symbol]:{',
              [
                ['params:', printNode(zodToTs(router.query.paramsSchema).node)].join(''),
                ['returnValue:', printNode(zodToTs(router.query.returnSchema).node)].join(''),
              ].join(';'),
              '}',
            ].join(''),
          ].join(';'),
          '}',
        ].join('')
      : '';
    const $subscription = isSubscriptionRouter(router)
      ? [
          '$subscription:{',
          [
            ['segments:string[]'].join(''),
            ['isParamsVoid:boolean'].join(''),
            ['isYieldVoid:boolean'].join(''),
            ['isReturnVoid:boolean'].join(''),
            [
              '[s:symbol]:{',
              [
                ['params:', printNode(zodToTs(router.subscription.paramsSchema).node)].join(''),
                ['yieldValue:', printNode(zodToTs(router.subscription.yieldSchema).node)].join(''),
                ['returnValue:', printNode(zodToTs(router.subscription.returnSchema).node)].join(''),
              ].join(';'),
            ].join(''),
          ].join(';'),
          '}}',
        ].join('')
      : '';
    return `{${[subs, $query, $subscription].filter((e) => e).join(';')}}`;
  };
  const innerVar = (router: Router, segments: string[]): any => {
    const subs = hasSubroutes(router)
      ? [
          '$',
          Object.fromEntries(Object.entries(router.subs).map(([key, sub]) => [key, innerVar(sub, [...segments, key])])),
        ]
      : [];
    const $query = isQueryRouter(router)
      ? [
          '$query',
          {
            segments,
            isParamsVoid: isZodVoid(router.query.paramsSchema),
            isReturnVoid: isZodVoid(router.query.returnSchema),
          },
        ]
      : [];
    const $subscription = isSubscriptionRouter(router)
      ? [
          '$subscription',
          {
            segments,
            isParamsVoid: isZodVoid(router.subscription.paramsSchema),
            isYieldVoid: isZodVoid(router.subscription.yieldSchema),
            isReturnVoid: isZodVoid(router.subscription.returnSchema),
          },
        ]
      : [];
    return Object.fromEntries([subs, $query, $subscription]);
  };
  return [
    `export type Routes=${innerType(params.router, [])};`,
    `export const routes=${JSON.stringify(innerVar(params.router, []))} as Routes;`,
  ].join('');
};

export type GenerateRoutesCodeParams = {
  router: Router;
  outputPath: string;
};
export const generateRoutesCode = (params: GenerateRoutesCodeParams) => {
  fs.writeFileSync(params.outputPath, transformRoutesCode({ router: params.router }));
};
