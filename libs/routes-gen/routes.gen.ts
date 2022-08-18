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
    folderName: string;
    folderData: {
        templateProvider: {
            type: "local";
            templatePath: string;
        };
        folderId: string;
    };
}[]}}};"getById":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    folderId: string;
} | {
    folderName: string;
};returnValue:{
    folderName: string;
    folderData: {
        templateProvider: {
            type: "local";
            templatePath: string;
        };
        folderId: string;
    };
} | null}}};"getBundledCode":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    folderId: string;
} | {
    folderName: string;
};returnValue:string}}};"setFolderName":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    folderSpecifier: {
        folderId: string;
    } | {
        folderName: string;
    };
    newFolderName: string;
};returnValue:void | undefined}}}}};"cases":{$:{"listCases":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    folderId: string;
} | {
    folderName: string;
};returnValue:({
    type: "single";
    caseEntry: {
        caseName: string;
        caseData: {
            caseType: "input";
            caseId: string;
            hash?: {
                programMain: string;
                inMain: string;
            } | undefined;
        } | {
            caseType: "interact";
            caseId: string;
            responderFolderId?: string | undefined;
            hash?: {
                programMain: string;
                programResnponder: string;
                inResponder: string;
            } | undefined;
        };
    };
} | {
    type: "nest";
    nestName: string;
    nestData: {
        caseType: "nest";
        nestId: string;
    };
    caseEntries: {
        caseName: string;
        caseData: {
            caseType: "input";
            caseId: string;
            hash?: {
                programMain: string;
                inMain: string;
            } | undefined;
        } | {
            caseType: "interact";
            caseId: string;
            responderFolderId?: string | undefined;
            hash?: {
                programMain: string;
                programResnponder: string;
                inResponder: string;
            } | undefined;
        };
    }[];
})[]}}};"createCase":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    caseType: "input" | "interact";
    parentNestId: string | null;
    folderSpecifier: {
        folderId: string;
    } | {
        folderName: string;
    };
};returnValue:{
    caseId: string;
    caseName: string;
}}}};"createNest":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    folderId: string;
} | {
    folderName: string;
};returnValue:{
    nestId: string;
    nestName: string;
}}}};"editCase":{$query:{segments:string[];isParamsVoid:boolean;isReturnVoid:boolean;[s:symbol]:{params:{
    caseType: "input" | "interact";
    parentNestId: string | null;
    folderSpecifier: {
        folderId: string;
    } | {
        folderName: string;
    };
};returnValue:{
    caseId: string;
    caseName: string;
}}}}}}}};export const routes={"$":{"templates_providers":{"$":{"get":{"$query":{"segments":["templates_providers","get"],"isParamsVoid":true,"isReturnVoid":false}},"set":{"$query":{"segments":["templates_providers","set"],"isParamsVoid":false,"isReturnVoid":true}},"validate":{"$query":{"segments":["templates_providers","validate"],"isParamsVoid":false,"isReturnVoid":false}},"listInstances":{"$query":{"segments":["templates_providers","listInstances"],"isParamsVoid":false,"isReturnVoid":false}},"getDefaultInstance":{"$query":{"segments":["templates_providers","getDefaultInstance"],"isParamsVoid":false,"isReturnVoid":false}},"setup":{"$query":{"segments":["templates_providers","setup"],"isParamsVoid":false,"isReturnVoid":true}}}},"folders":{"$":{"list":{"$query":{"segments":["folders","list"],"isParamsVoid":true,"isReturnVoid":false}},"getById":{"$query":{"segments":["folders","getById"],"isParamsVoid":false,"isReturnVoid":false}},"getBundledCode":{"$query":{"segments":["folders","getBundledCode"],"isParamsVoid":false,"isReturnVoid":false}},"setFolderName":{"$query":{"segments":["folders","setFolderName"],"isParamsVoid":false,"isReturnVoid":true}}}},"cases":{"$":{"listCases":{"$query":{"segments":["cases","listCases"],"isParamsVoid":false,"isReturnVoid":false}},"createCase":{"$query":{"segments":["cases","createCase"],"isParamsVoid":false,"isReturnVoid":false}},"createNest":{"$query":{"segments":["cases","createNest"],"isParamsVoid":false,"isReturnVoid":false}},"editCase":{"$query":{"segments":["cases","editCase"],"isParamsVoid":false,"isReturnVoid":false}}}}}} as Routes;