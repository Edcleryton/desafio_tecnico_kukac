#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { CypressReporter } = require('../cypress/support/reporter')

/**
 * Script para gerar relatórios a partir de resultados existentes
 * Pode ser executado independentemente após os testes
 */

function findLatestResults() {
  const reportsDir = path.join(__dirname, '../cypress/reports')
  const videosDir = path.join(__dirname, '../cypress/videos')
  
  // Procura por arquivos de resultados
  const possibleFiles = [
    path.join(reportsDir, 'raw-results.json'),
    path.join(reportsDir, 'results.json'),
    path.join(__dirname, '../cypress-results.json')
  ]
  
  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      console.log(`📁 Encontrado arquivo de resultados: ${file}`)
      return file
    }
  }
  
  // Se não encontrar resultados, cria um relatório baseado nos vídeos/screenshots
  console.log('⚠️ Nenhum arquivo de resultados encontrado.')
  console.log('📊 Gerando relatório baseado em arquivos existentes...')
  
  return generateReportFromFiles()
}

function generateReportFromFiles() {
  const reporter = new CypressReporter()
  const specsDir = path.join(__dirname, '../cypress/e2e')
  
  if (!fs.existsSync(specsDir)) {
    console.error('❌ Diretório de specs não encontrado!')
    process.exit(1)
  }
  
  // Lista todos os arquivos de spec
  const specFiles = fs.readdirSync(specsDir)
    .filter(file => file.endsWith('.cy.js'))
    .sort()
  
  console.log(`📋 Encontrados ${specFiles.length} arquivos de teste:`)
  
  specFiles.forEach(file => {
    console.log(`   - ${file}`)
    
    // Cria um resultado simulado baseado no arquivo
    const specResult = {
      name: file,
      tests: [
        {
          title: `Testes em ${file.replace('.cy.js', '')}`,
          state: 'unknown',
          duration: 0,
          error: null
        }
      ]
    }
    
    reporter.addSpecResult(specResult)
  })
  
  reporter.finalize()
  reporter.generateJSONReport()
  reporter.generateHTMLReport()
  
  return reporter.results
}

function generateDetailedReport(resultsFile) {
  try {
    const rawData = fs.readFileSync(resultsFile, 'utf8')
    const results = JSON.parse(rawData)
    
    const reporter = new CypressReporter()
    
    // Processa resultados do Cypress
    if (results.runs) {
      results.runs.forEach(run => {
        const specResult = {
          name: path.basename(run.spec.name),
          tests: run.tests.map(test => ({
            title: Array.isArray(test.title) ? test.title.join(' > ') : test.title,
            state: test.state || 'unknown',
            duration: test.duration || 0,
            error: test.displayError || test.err?.message || null
          }))
        }
        reporter.addSpecResult(specResult)
      })
    } else if (results.specs) {
      // Formato alternativo
      results.specs.forEach(spec => {
        reporter.addSpecResult(spec)
      })
    }
    
    reporter.finalize()
    reporter.generateJSONReport()
    reporter.generateHTMLReport()
    
    return reporter.results
  } catch (error) {
    console.error('❌ Erro ao processar resultados:', error.message)
    return generateReportFromFiles()
  }
}

function generateSummaryReport(results) {
  console.log('\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO RESUMIDO DE TESTES E2E')
  console.log('='.repeat(60))
  
  console.log(`🕐 Período: ${new Date(results.startTime).toLocaleString('pt-BR')}`)
  if (results.endTime) {
    console.log(`🏁 Finalizado: ${new Date(results.endTime).toLocaleString('pt-BR')}`)
    console.log(`⏱️ Duração Total: ${Math.round(results.duration / 1000)}s`)
  }
  
  console.log('\n📈 ESTATÍSTICAS:')
  console.log(`   📋 Total de Testes: ${results.totalTests}`)
  console.log(`   ✅ Aprovados: ${results.passedTests} (${((results.passedTests/results.totalTests)*100).toFixed(1)}%)`)
  console.log(`   ❌ Falharam: ${results.failedTests} (${((results.failedTests/results.totalTests)*100).toFixed(1)}%)`)
  console.log(`   ⏭️ Ignorados: ${results.skippedTests}`)
  
  console.log('\n📁 ARQUIVOS TESTADOS:')
  results.specs.forEach(spec => {
    const passed = spec.tests.filter(t => t.state === 'passed').length
    const failed = spec.tests.filter(t => t.state === 'failed').length
    const total = spec.tests.length
    const status = failed > 0 ? '❌' : passed > 0 ? '✅' : '⚪'
    
    console.log(`   ${status} ${spec.name} (${passed}/${total} passou)`)
  })
  
  console.log('\n📂 ARQUIVOS GERADOS:')
  console.log('   📋 cypress/reports/report.html - Relatório visual completo')
  console.log('   📊 cypress/reports/results.json - Dados estruturados')
  
  if (results.failedTests > 0) {
    console.log('\n⚠️ ATENÇÃO: Alguns testes falharam!')
    console.log('   Verifique o relatório HTML para detalhes dos erros.')
  } else if (results.passedTests === results.totalTests) {
    console.log('\n🎉 PARABÉNS! Todos os testes passaram!')
  }
  
  console.log('\n' + '='.repeat(60))
}

function openReportInBrowser() {
  const reportPath = path.join(__dirname, '../cypress/reports/report.html')
  
  if (fs.existsSync(reportPath)) {
    const { exec } = require('child_process')
    
    // Tenta abrir no navegador padrão
    const command = process.platform === 'win32' ? 'start' : 
                   process.platform === 'darwin' ? 'open' : 'xdg-open'
    
    exec(`${command} "${reportPath}"`, (error) => {
      if (error) {
        console.log(`\n🌐 Abra manualmente: file://${reportPath}`)
      } else {
        console.log('\n🌐 Relatório aberto no navegador!')
      }
    })
  } else {
    console.log('❌ Arquivo de relatório não encontrado!')
  }
}

// Execução principal
function main() {
  console.log('🚀 Iniciando geração de relatórios...')
  
  const resultsFile = findLatestResults()
  let results
  
  if (typeof resultsFile === 'string') {
    results = generateDetailedReport(resultsFile)
  } else {
    results = resultsFile // Já é o objeto de resultados
  }
  
  generateSummaryReport(results)
  
  // Verifica se deve abrir o relatório
  const shouldOpen = process.argv.includes('--open') || process.argv.includes('-o')
  if (shouldOpen) {
    openReportInBrowser()
  }
  
  console.log('\n✅ Geração de relatórios concluída!')
}

// Executa apenas se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = {
  generateDetailedReport,
  generateSummaryReport,
  openReportInBrowser
}