const removeFromPeerDeps = ['typescript', '@babel/core', 'eslint-plugin-import'];
const removePeerDepsOf = [
  'vitest',
  'vite',
  'ts-node-dev',
  'ts-node',
  'postcss-load-config',
  'node-fetch',
  'meros',
  'ws',
  'listr2',
];
const fixDeps = [];

function readPackage(pkg) {
  delete pkg.peerDependenciesMeta;
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    for (const dep of fixDeps) {
      if (pkg[section][dep]) {
        pkg[section][dep] = require('./package.json').devDependencies[dep];
      }
    }
  }
  for (const section of ['peerDependencies']) {
    for (const dep of removeFromPeerDeps) {
      if (pkg[section][dep]) {
        delete pkg[section][dep];
      }
    }
    for (const dep of removePeerDepsOf) {
      if (pkg.name === dep && pkg[section]) {
        delete pkg[section];
      }
    }
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
