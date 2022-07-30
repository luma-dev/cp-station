export type LocalCommandName="getControllerType"|"handleAfterCopy"|"getDefaultInstance"|"ensureBundled"|"getBundledRunner";export type LocalCommands={"getControllerType":{params:void | undefined,returnType:"local" | "docker"},"handleAfterCopy":{params:{
    absPathCopiedTo: string;
},returnType:void | undefined},"getDefaultInstance":{params:void | undefined,returnType:string},"ensureBundled":{params:{
    absPathCopiedTo: string;
},returnType:{
    stdoutEncoded: string;
    stderrEncoded: string;
} & ({
    bundledFileAbsPath: string;
} | {
    bundledFileContent: string;
})},"getBundledRunner":{params:{
    absPathCopiedTo: string;
},returnType:{
    workdirAbsPath: string;
    binaryAbsPath: string;
}}};export type RegisterLocalTemplateParams={"handleAfterCopy":(params:{
    absPathCopiedTo: string;
})=>void | undefined|Promise<void | undefined>,"getDefaultInstance":(params:void | undefined)=>string|Promise<string>,"ensureBundled":(params:{
    absPathCopiedTo: string;
})=>{
    stdoutEncoded: string;
    stderrEncoded: string;
} & ({
    bundledFileAbsPath: string;
} | {
    bundledFileContent: string;
})|Promise<{
    stdoutEncoded: string;
    stderrEncoded: string;
} & ({
    bundledFileAbsPath: string;
} | {
    bundledFileContent: string;
})>,"getBundledRunner":(params:{
    absPathCopiedTo: string;
})=>{
    workdirAbsPath: string;
    binaryAbsPath: string;
}|Promise<{
    workdirAbsPath: string;
    binaryAbsPath: string;
}>};export const localTemplateData={"getControllerType":{"paramsIsVoid":true,"returnIsVoid":false},"handleAfterCopy":{"paramsIsVoid":false,"returnIsVoid":true},"getDefaultInstance":{"paramsIsVoid":true,"returnIsVoid":false},"ensureBundled":{"paramsIsVoid":false,"returnIsVoid":false},"getBundledRunner":{"paramsIsVoid":false,"returnIsVoid":false}};