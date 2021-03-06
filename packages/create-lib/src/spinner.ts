import ora from 'ora'
import chalk from 'chalk'
import logSymbols from 'log-symbols'

type OraIns = ora.Ora | null

export class Spinner {
  private oraIns!: OraIns

  start(msg: string) {
    if (this.oraIns) {
      this.oraIns.stop()
    } else {
      this.oraIns = ora()
    }
    this.oraIns.text = chalk.yellow(' ' + msg)
    this.oraIns.start()
  }

  failed(text?: string) {
    this.oraIns &&
      this.oraIns.stopAndPersist({
        symbol: logSymbols.error,
        text: chalk.red(text || this.oraIns.text)
      })
  }

  succeed(text?: string) {
    this.oraIns &&
      this.oraIns.stopAndPersist({
        symbol: logSymbols.success,
        text: chalk.green(text || this.oraIns.text)
      })
  }
}
