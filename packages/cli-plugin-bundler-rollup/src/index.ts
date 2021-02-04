import type { IPluginAPI } from '@xus/cli'
import { rollupSchema } from './options'
import RollupManager from './rollupManager'

export default function (api: IPluginAPI): void {
  // config validator
  api.registerConfigValidator('rollup', rollupSchema)
  // register bundler
  api.registerBundler('rollup', new RollupManager())
}

// export types
export * from './types'
export { IRollupChain } from './rollupChian'
export { IRollupManager } from './rollupManager'
