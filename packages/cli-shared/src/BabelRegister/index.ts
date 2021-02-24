import { createDebug, lodash, winPath } from '../'

const debug = createDebug('xus:shared:BabelRegister')

export class BabelRegister {
  only: Record<string, string[]> = {}

  setOnlyMap({ key, value }: { key: string; value: string[] }) {
    debug(`set ${key} of only map:`)
    debug(value)
    this.only[key] = value
    this.register()
  }

  register() {
    const only = lodash.uniq(
      Object.keys(this.only)
        .reduce<string[]>((memo, key) => {
          return memo.concat(this.only[key])
        }, [])
        .map(winPath)
    )
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@babel/register')({
      presets: [
        require.resolve('@xus/babel-preset'),
        {
          targets: { node: 'current' },
          useTransformRuntime: false,
          useTypescript: true
        }
      ],
      ignore: [/node_modules/],
      only,
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      babelrc: false,
      cache: false
    })
  }
}