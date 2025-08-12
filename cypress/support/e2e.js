// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para prevenir que o Cypress falhe o teste
  // em caso de exceções JavaScript não capturadas
  return false
})

// Configuração para aguardar carregamento da página
beforeEach(() => {
  // Aguarda a página carregar completamente
  cy.visit('/', { timeout: 30000 })
  cy.wait(2000) // Aguarda 2 segundos para garantir carregamento completo
})