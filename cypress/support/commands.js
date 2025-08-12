// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para adicionar uma nova tarefa
Cypress.Commands.add('addTask', (taskTitle) => {
  cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")', { timeout: 10000 })
    .should('be.visible')
    .click()
  
  cy.get('input[type="text"], textarea, [data-cy="task-input"]', { timeout: 10000 })
    .should('be.visible')
    .type(taskTitle)
  
  cy.get('button:contains("Adicionar"), button:contains("Salvar"), [data-cy="save-task"]', { timeout: 10000 })
    .should('be.visible')
    .click()
})

// Comando para verificar se uma tarefa existe
Cypress.Commands.add('verifyTaskExists', (taskTitle) => {
  cy.contains(taskTitle, { timeout: 10000 })
    .should('be.visible')
})

// Comando para mover tarefa entre colunas (drag and drop)
Cypress.Commands.add('moveTask', (taskTitle, targetColumn) => {
  cy.contains(taskTitle)
    .should('be.visible')
    .trigger('mousedown', { button: 0 })
  
  cy.get(`[data-cy="${targetColumn}"], :contains("${targetColumn}")`)
    .trigger('mousemove')
    .trigger('mouseup')
})

// Comando para deletar uma tarefa
Cypress.Commands.add('deleteTask', (taskTitle) => {
  cy.contains(taskTitle)
    .should('be.visible')
    .rightclick() // ou procurar por botão de delete
  
  cy.get('button:contains("Deletar"), button:contains("Excluir"), [data-cy="delete-task"]')
    .should('be.visible')
    .click()
})

// Comando para aguardar carregamento da página
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body', { timeout: 30000 }).should('be.visible')
  cy.wait(2000)
})

// Comando para verificar responsividade
Cypress.Commands.add('checkResponsiveness', () => {
  // Desktop
  cy.viewport(1280, 720)
  cy.wait(1000)
  
  // Tablet
  cy.viewport(768, 1024)
  cy.wait(1000)
  
  // Mobile
  cy.viewport(375, 667)
  cy.wait(1000)
  
  // Volta para desktop
  cy.viewport(1280, 720)
})