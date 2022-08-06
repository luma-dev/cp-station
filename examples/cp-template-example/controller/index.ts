import { registerLocalTemplate } from '@cp-station/template-spec-impl';
import fs from 'node:fs';
import path from 'node:path';

registerLocalTemplate({
  handleAfterCopy() {},
  getDefaultInstance() {
    return 'general';
  },
  ensureBundled: ({ absPathCopiedTo }) => {
    const mainPath = path.resolve(absPathCopiedTo, 'main.js');
    const bundledPath = path.resolve(absPathCopiedTo, 'bundled.js');
    const mainContent = fs.readFileSync(mainPath, 'utf-8');
    const bundledContent = `const print=(...args)=>{console.log(args)};\n${mainContent}`;
    fs.writeFileSync(bundledPath, bundledContent);
    return {
      bundledFileAbsPath: bundledPath,
      stderrEncoded: '',
      stdoutEncoded: '',
    };
  },
  getBundledRunner: (req) => {
    return {
      binaryAbsPath: path.resolve(req.absPathCopiedTo, '.bin/bundled'),
      workdirAbsPath: req.absPathCopiedTo,
    };
  },
});
