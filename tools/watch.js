const { spawn } = require('child_process')

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const children = []

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `${args.join(' ')} exited with ${signal ? `signal ${signal}` : `code ${code}`}`
        )
      )
    })

    child.on('error', reject)
  })

const watch = (args) => {
  const child = spawn(command, args, { stdio: 'inherit' })
  children.push(child)
  child.on('exit', (code) => {
    if (code && code !== 0) {
      process.exitCode = code
      shutdown()
    }
  })
  child.on('error', (error) => {
    console.error(error)
    process.exitCode = 1
    shutdown()
  })
}

const shutdown = () => {
  while (children.length > 0) {
    const child = children.pop()
    if (child && !child.killed) {
      child.kill('SIGTERM')
    }
  }
}

process.on('SIGINT', () => {
  shutdown()
  process.exit()
})

process.on('SIGTERM', () => {
  shutdown()
  process.exit()
})

;(async () => {
  await run(['rimraf', 'lib', '.rollup-tmp'])
  await run(['tsc', '-p', 'tsconfig.build.json'])

  watch(['tsc', '-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput'])
  watch(['rollup', '-c', 'rollup.config.build.mjs', '-w'])
})().catch((error) => {
  console.error(error)
  shutdown()
  process.exit(1)
})
