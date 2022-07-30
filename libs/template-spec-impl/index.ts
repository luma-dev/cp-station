import type { LocalCommandName, RegisterLocalTemplateParams } from '@cp-station/template-spec-gen';
import { localTemplateData } from '@cp-station/template-spec-gen';
// import { Base64 } from 'js-base64';
import fs from 'node:fs';

export const registerLocalTemplate = (params: RegisterLocalTemplateParams) => {
  const mainProcess = async () => {
    const stdin = fs.readFileSync(0, 'utf-8');
    const req: {
      command: LocalCommandName;
      params: any;
    } = JSON.parse(stdin.trim());
    if (req.command === 'getControllerType') {
      // eslint-disable-next-line no-console
      console.log('"local"');
      return;
    }
    if (!(req.command in localTemplateData)) {
      throw new Error(`command "${req.command}" not found`);
    }

    const res = await params[req.command](req.params);

    if (res !== undefined) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(res));
    }
  };

  mainProcess().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
};
