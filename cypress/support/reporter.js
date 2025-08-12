const fs = require('fs')
const path = require('path')

/**
 * Gerador de Relatórios Customizado para Cypress
 * Cria relatórios HTML e JSON dos resultados dos testes
 */
class CypressReporter {
  constructor() {
    this.results = {
      startTime: new Date().toISOString(),
      endTime: null,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0,
      specs: [],
      summary: {
        browser: '',
        cypressVersion: '',
        nodeVersion: process.version
      }
    }
  }

  // Adiciona resultado de um spec
  addSpecResult(specResult) {
    this.results.specs.push(specResult)
    this.results.totalTests += specResult.tests.length
    this.results.passedTests += specResult.tests.filter(t => t.state === 'passed').length
    this.results.failedTests += specResult.tests.filter(t => t.state === 'failed').length
    this.results.skippedTests += specResult.tests.filter(t => t.state === 'skipped').length
  }

  // Finaliza o relatório
  finalize() {
    this.results.endTime = new Date().toISOString()
    this.results.duration = new Date(this.results.endTime) - new Date(this.results.startTime)
  }

  // Gera relatório JSON
  generateJSONReport(outputPath = './cypress/reports/results.json') {
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2))
    console.log(`📊 Relatório JSON gerado: ${outputPath}`)
  }

  // Gera relatório HTML
  generateHTMLReport(outputPath = './cypress/reports/report.html') {
    const htmlContent = this.generateHTMLContent()
    const dir = path.dirname(outputPath)
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, htmlContent)
    console.log(`📋 Relatório HTML gerado: ${outputPath}`)
  }

  // Gera conteúdo HTML do relatório
  generateHTMLContent() {
    const passRate = ((this.results.passedTests / this.results.totalTests) * 100).toFixed(1)
    const failRate = ((this.results.failedTests / this.results.totalTests) * 100).toFixed(1)
    
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Testes E2E - Kanban</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .summary-card h3 { color: #333; margin-bottom: 10px; }
        .summary-card .number { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .total { color: #007bff; }
        .specs-section { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .spec-item { border-bottom: 1px solid #eee; padding: 20px 0; }
        .spec-item:last-child { border-bottom: none; }
        .spec-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .spec-name { font-size: 1.3em; font-weight: bold; color: #333; }
        .spec-status { padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; }
        .spec-status.passed { background: #28a745; }
        .spec-status.failed { background: #dc3545; }
        .test-list { margin-left: 20px; }
        .test-item { padding: 8px 0; display: flex; align-items: center; }
        .test-status { width: 20px; height: 20px; border-radius: 50%; margin-right: 10px; }
        .test-status.passed { background: #28a745; }
        .test-status.failed { background: #dc3545; }
        .test-status.skipped { background: #ffc107; }
        .test-title { flex: 1; }
        .test-duration { color: #666; font-size: 0.9em; }
        .error-details { background: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin-top: 10px; border-radius: 5px; }
        .error-details pre { color: #dc3545; font-size: 0.9em; white-space: pre-wrap; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; margin-top: 10px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Relatório de Testes E2E</h1>
            <p>Sistema Kanban - Automação com Cypress</p>
            <p>Executado em: ${new Date(this.results.startTime).toLocaleString('pt-BR')}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>Total de Testes</h3>
                <div class="number total">${this.results.totalTests}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 100%"></div>
                </div>
            </div>
            <div class="summary-card">
                <h3>✅ Aprovados</h3>
                <div class="number passed">${this.results.passedTests}</div>
                <p>${passRate}% do total</p>
            </div>
            <div class="summary-card">
                <h3>❌ Falharam</h3>
                <div class="number failed">${this.results.failedTests}</div>
                <p>${failRate}% do total</p>
            </div>
            <div class="summary-card">
                <h3>⏭️ Ignorados</h3>
                <div class="number skipped">${this.results.skippedTests}</div>
                <p>Duração: ${Math.round(this.results.duration / 1000)}s</p>
            </div>
        </div>

        <div class="specs-section">
            <h2>📋 Detalhes dos Testes por Arquivo</h2>
            ${this.results.specs.map(spec => this.generateSpecHTML(spec)).join('')}
        </div>

        <div class="footer">
            <p>Relatório gerado automaticamente pelo Cypress Reporter</p>
            <p>Cypress ${this.results.summary.cypressVersion} | Node.js ${this.results.summary.nodeVersion}</p>
        </div>
    </div>
</body>
</html>`
  }

  // Gera HTML para um spec específico
  generateSpecHTML(spec) {
    const specStatus = spec.tests.some(t => t.state === 'failed') ? 'failed' : 'passed'
    
    return `
        <div class="spec-item">
            <div class="spec-header">
                <div class="spec-name">${spec.name}</div>
                <div class="spec-status ${specStatus}">${specStatus.toUpperCase()}</div>
            </div>
            <div class="test-list">
                ${spec.tests.map(test => this.generateTestHTML(test)).join('')}
            </div>
        </div>`
  }

  // Gera HTML para um teste específico
  generateTestHTML(test) {
    const errorDetails = test.error ? `
        <div class="error-details">
            <strong>Erro:</strong>
            <pre>${test.error}</pre>
        </div>` : ''
    
    return `
        <div class="test-item">
            <div class="test-status ${test.state}"></div>
            <div class="test-title">${test.title}</div>
            <div class="test-duration">${test.duration || 0}ms</div>
            ${errorDetails}
        </div>`
  }

  // Gera relatório de cobertura simples
  generateCoverageReport() {
    const coverage = {
      funcionalidadesBasicas: this.calculateCoverage('01-basic-functionality'),
      adicionarTarefas: this.calculateCoverage('02-add-task'),
      gerenciamentoTarefas: this.calculateCoverage('03-task-management'),
      uiAcessibilidade: this.calculateCoverage('04-ui-accessibility'),
      tratamentoErros: this.calculateCoverage('05-error-handling')
    }
    
    return coverage
  }

  // Calcula cobertura para um módulo específico
  calculateCoverage(moduleName) {
    const moduleSpecs = this.results.specs.filter(spec => spec.name.includes(moduleName))
    if (moduleSpecs.length === 0) return { coverage: 0, tests: 0, passed: 0 }
    
    const totalTests = moduleSpecs.reduce((sum, spec) => sum + spec.tests.length, 0)
    const passedTests = moduleSpecs.reduce((sum, spec) => 
      sum + spec.tests.filter(t => t.state === 'passed').length, 0)
    
    return {
      coverage: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
      tests: totalTests,
      passed: passedTests
    }
  }
}

// Função para processar resultados do Cypress
function processResults(results) {
  const reporter = new CypressReporter()
  
  if (results && results.runs) {
    results.runs.forEach(run => {
      const specResult = {
        name: path.basename(run.spec.name),
        tests: run.tests.map(test => ({
          title: test.title.join(' > '),
          state: test.state,
          duration: test.duration,
          error: test.displayError || null
        }))
      }
      reporter.addSpecResult(specResult)
    })
  }
  
  reporter.finalize()
  reporter.generateJSONReport()
  reporter.generateHTMLReport()
  
  // Gera relatório de cobertura
  const coverage = reporter.generateCoverageReport()
  console.log('\n📊 Cobertura de Testes:')
  Object.entries(coverage).forEach(([module, data]) => {
    console.log(`  ${module}: ${data.coverage}% (${data.passed}/${data.tests} testes)`)
  })
  
  return reporter.results
}

module.exports = {
  CypressReporter,
  processResults
}