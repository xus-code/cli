import type { IRollupChain, AllConfigs } from './rollupChian'
import type { ChainFn, RollupPluginConfig, CompileTargets } from './types'
import { Target2Format } from './types'
import { rollup } from 'rollup'
import { warn, logWithSpinner, stopSpinner } from '@xus/cli'
import RollupChain from './rollupChian'
import rollupValidator from './validator'
import { defaultRollupConfig } from './options'

class RollupManager {
  private rollupChain: IRollupChain
  private chainFns: ChainFn[] = []
  private rollupPluginConfig!: RollupPluginConfig

  constructor() {
    this.rollupChain = new RollupChain()
    this.initFormat()
  }

  initFormat() {
    this.rollupChain
      .when('esm-browser')
      .output.format(Target2Format['esm-browser'])
      .end()
      .end()
      .when('esm-bundler')
      .output.format(Target2Format['esm-bundler'])
      .end()
      .end()
      .when('global')
      .output.format(Target2Format['global'])
      .end()
      .end()
      .when('node')
      .output.format(Target2Format['node'])
      .end()
      .end()
  }

  // for plugin user
  setup(pluginConfig: Partial<RollupPluginConfig>) {
    // merge to default
    this.rollupPluginConfig = Object.assign(defaultRollupConfig(), pluginConfig)

    this.registerChainFn(this.rollupPluginConfig.chainRollup)
  }

  // for register
  registerChainFn(fn: ChainFn, prepend = false) {
    if (prepend) {
      this.chainFns.unshift(fn)
    } else {
      this.chainFns.push(fn)
    }
    return this
  }

  private resloveConfigs() {
    this.chainFns.forEach((chainFn) => {
      chainFn(this.rollupChain)
    })
    return this.rollupChain.toConfig()
  }

  private validConfig(configs: AllConfigs) {
    ;(Object.keys(configs) as CompileTargets[]).forEach((prefix) => {
      const config = configs[prefix]
      config && rollupValidator(config, prefix)
    })
  }

  async build() {
    const configs = this.resloveConfigs()
    this.validConfig(configs)
    const { targets } = this.rollupPluginConfig
    for (const target of targets) {
      const config = configs[target]
      if (!config) {
        warn(`build target ${target} has no rollup config, will be skip!!!`)
        continue
      }
      const { output, ...bundleOps } = config
      logWithSpinner(`run ${target} build...`)
      const bundle = await rollup(bundleOps)
      await bundle.write(output)
      stopSpinner()
    }
  }
}

export type IRollupManager = InstanceType<typeof RollupManager>

export default RollupManager
