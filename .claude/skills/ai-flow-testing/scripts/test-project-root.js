import path from 'path'
import fs from 'fs'

const startDir = path.resolve('.')
console.log('Start Dir:', startDir)

let currentDir = startDir
let maxDepth = 10

while (maxDepth-- > 0) {
  const packageJsonPath = path.join(currentDir, 'package.json')
  const docsDir = path.join(currentDir, 'docs')

  console.log(`Checking: ${currentDir}`)
  console.log('  package.json exists:', fs.existsSync(packageJsonPath))
  console.log('  docs/ exists:', fs.existsSync(docsDir))

  if (fs.existsSync(packageJsonPath) || fs.existsSync(docsDir)) {
    console.log('  -> Found root!')
    break
  }

  const parentDir = path.dirname(currentDir)
  if (parentDir === currentDir) break
  currentDir = parentDir
}

console.log('Final Root:', currentDir)
