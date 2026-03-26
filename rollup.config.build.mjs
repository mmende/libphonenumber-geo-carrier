import { builtinModules } from 'module'
import pkg from './package.json' with { type: 'json' }

const externalPackages = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
])

export default {
  input: '.rollup-tmp/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: (id) => externalPackages.has(id),
}
