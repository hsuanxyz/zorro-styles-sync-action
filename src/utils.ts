import {Extract} from 'unzipper'
import fs from 'fs-extra'
import request from 'request'

export async function unzip(path: string, output: string): Promise<void> {
  return new Promise(resolve => {
    fs.createReadStream(path)
      .pipe(Extract({path: output}))
      .on('close', () => resolve())
  })
}

export async function download(url: string, dest: string): Promise<void> {
  return new Promise(resolve => {
    request(url)
      .pipe(fs.createWriteStream(dest))
      .on('close', () => resolve())
  })
}
