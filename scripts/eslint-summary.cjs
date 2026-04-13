module.exports = function (results) {
  let errorCount = 0
  let warningCount = 0
  let lines = []

  results.forEach((result) => {
    errorCount += result.errorCount
    warningCount += result.warningCount

    if (result.messages.length === 0) return

    let filePath = result.filePath.replace(/\\/g, '/')
    const idx = filePath.indexOf('src/')
    if (idx !== -1) filePath = filePath.substring(idx)

    result.messages.forEach((msg) => {
      const type = msg.severity === 2 ? 'error' : 'warning'
      lines.push(`  ${filePath}:${msg.line}  ${type}  ${msg.message}  (${msg.ruleId})`)
    })
  })

  let output = ''

  if (lines.length > 0) {
    output += '\n  ESLint 检测到以下问题:\n\n'
    lines.forEach((l) => { output += l + '\n' })
    output += `\n  共 ${errorCount} 个错误, ${warningCount} 个警告\n`
  }

  if (errorCount > 0) {
    output += '\n=========================================\n'
    output += '  提交被阻止!\n'
    output += '=========================================\n'
    output += '\n'
    output += '  修复方法:\n'
    output += '    npm run lint:fix   (自动修复)\n'
    output += '    npm run lint       (查看所有问题)\n'
    output += '\n'
    output += '  提示: error 阻止提交, warning 仅提醒\n'
    output += '=========================================\n'
  }

  return output
}
