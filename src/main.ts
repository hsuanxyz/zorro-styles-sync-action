import * as core from '@actions/core'
import {Bot} from './bot'

async function run(): Promise<void> {
  try {
    const token = core.getInput('account_token')
    const version = core.getInput('version')
    const repo = 'ng-zorro-antd'
    const originOwner = 'ng-zorro-bot'
    const upstreamOwner = 'NG-ZORRO'
    const username = 'ng-zorro-bot'
    const userEmail = 'ng-zorro@users.noreply.github.com'
    const bot = new Bot({
      token,
      repo,
      originOwner,
      upstreamOwner,
      username,
      userEmail
    })
    if (version) {
      await bot.checkOnceWithVersion(version)
    } else {
      await bot.run()
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
