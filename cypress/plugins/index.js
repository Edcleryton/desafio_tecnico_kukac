const { processResults } = require('../support/reporter')
const fs = require('fs')
const path = require('path')

/**
 * Plugin do Cypress para geração de relatórios customizados
 * @param {*} on 
 * @param {*} config 
 */
module.exports = (on, config) => {
  // Evento que é executado após todos os testes
  on('after:run', (results) => {
    console.log('\n🔄 Processando resultados dos testes...')
    
    try {
      // Processa os resultados e gera relatórios
      const processedResults = processResults(results)
      
      // Salva resultados brutos também
      const rawResultsPath = './cypress/reports/raw-results.json'
      const dir = path.dirname(rawResultsPath)
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      fs.writeFileSync(rawResultsPath, JSON.stringify(results, null, 2))
      
      console.log('\n✅ Relatórios gerados com sucesso!')
      console.log('📁 Verifique a pasta: ./cypress/reports/')
      
      // Exibe resumo no console
      console.log('\n📊 RESUMO DOS TESTES:')
      console.log(`   Total: ${processedResults.totalTests}`)
      console.log(`   ✅ Passou: ${processedResults.passedTests}`)
      console.log(`   ❌ Falhou: ${processedResults.failedTests}`)
      console.log(`   ⏭️ Ignorado: ${processedResults.skippedTests}`)
      console.log(`   ⏱️ Duração: ${Math.round(processedResults.duration / 1000)}s`)
      
      const successRate = ((processedResults.passedTests / processedResults.totalTests) * 100).toFixed(1)
      console.log(`   📈 Taxa de Sucesso: ${successRate}%`)
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatórios:', error.message)
    }
    
    return results
  })
  
  // Evento executado antes de cada spec
  on('before:spec', (spec) => {
    console.log(`\n🧪 Executando: ${path.basename(spec.name)}`)
  })
  
  // Evento executado após cada spec
  on('after:spec', (spec, results) => {
    const passed = results.tests.filter(t => t.state === 'passed').length
    const failed = results.tests.filter(t => t.state === 'failed').length
    const total = results.tests.length
    
    console.log(`   ✅ ${passed} passou | ❌ ${failed} falhou | 📊 ${total} total`)
  })
  
  // Configurações adicionais
  config.env = {
    ...config.env,
    generateReports: true,
    reportFormat: 'html,json'
  }
  
  return config
}