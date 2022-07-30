export type Routes={$:{"templates_providers":{$:{"get":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:void | undefined;returnValue:{
    name: string;
    provider: {
        type: "local";
        templatePath: string;
    };
}[]}}};"set":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    name: string;
    provider: {
        type: "local";
        templatePath: string;
    };
}[];returnValue:void | undefined}}};"validate":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    type: "local";
    templatePath: string;
};returnValue:{
    valid: boolean;
    messages: {
        status: boolean | "skipped";
        message: string;
    }[];
}}}};"listInstances":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    type: "local";
    templatePath: string;
};returnValue:null | string[]}}};"getDefaultInstance":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    type: "local";
    templatePath: string;
};returnValue:string}}};"setup":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    templateProvider: {
        type: "local";
        templatePath: string;
    };
    instance: string;
};returnValue:void | undefined}}}}};"folders":{$:{"list":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:void | undefined;returnValue:{
    dirname: string;
    data: {
        templateProvider: {
            type: "local";
            templatePath: string;
        };
        name?: string | undefined;
    };
}[]}}}}}}};export const routes={"$":{"templates_providers":{"$":{"get":{"$query":{"segments":["templates_providers","get"],"isParamsVoid":true,"isReturnVoid":false}},"set":{"$query":{"segments":["templates_providers","set"],"isParamsVoid":false,"isReturnVoid":true}},"validate":{"$query":{"segments":["templates_providers","validate"],"isParamsVoid":false,"isReturnVoid":false}},"listInstances":{"$query":{"segments":["templates_providers","listInstances"],"isParamsVoid":false,"isReturnVoid":false}},"getDefaultInstance":{"$query":{"segments":["templates_providers","getDefaultInstance"],"isParamsVoid":false,"isReturnVoid":false}},"setup":{"$query":{"segments":["templates_providers","setup"],"isParamsVoid":false,"isReturnVoid":true}}}},"folders":{"$":{"list":{"$query":{"segments":["folders","list"],"isParamsVoid":true,"isReturnVoid":false}}}}}} as Routes;