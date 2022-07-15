export type Routes={$:{"templates_providers":{$:{"checkIsDirectory":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:string;returnValue:boolean}}};"checkIsTemplateDirStructure":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:string;returnValue:boolean}}};"get":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:void | undefined;returnValue:{
    name: string;
    type: "local";
    path: string;
}[]}}};"set":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    name: string;
    type: "local";
    path: string;
}[];returnValue:void | undefined}}};"generate":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    name: string;
    type: "local";
    path: string;
};returnValue:void | undefined}}}}}}};export const routes={"$":{"templates_providers":{"$":{"checkIsDirectory":{"$query":{"segments":["templates_providers","checkIsDirectory"],"isParamsVoid":false,"isReturnVoid":false}},"checkIsTemplateDirStructure":{"$query":{"segments":["templates_providers","checkIsTemplateDirStructure"],"isParamsVoid":false,"isReturnVoid":false}},"get":{"$query":{"segments":["templates_providers","get"],"isParamsVoid":true,"isReturnVoid":false}},"set":{"$query":{"segments":["templates_providers","set"],"isParamsVoid":false,"isReturnVoid":true}},"generate":{"$query":{"segments":["templates_providers","generate"],"isParamsVoid":false,"isReturnVoid":true}}}}}} as Routes;