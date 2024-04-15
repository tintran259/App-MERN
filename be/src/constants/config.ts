import argv from 'minimist'
import { config } from 'dotenv'

config()

const isDev = Boolean(argv(process.argv.slice(2)).dev)

export { isDev }
