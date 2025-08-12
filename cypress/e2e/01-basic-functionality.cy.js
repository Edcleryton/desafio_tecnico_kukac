describe('Kanban - Funcionalidades Básicas', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('Deve carregar a página principal corretamente', () => {
    // Verifica se a página carregou
    cy.url().should('include', 'kanban-dusky-five.vercel.app')
    
    // Verifica se o título da página está presente
    cy.title().should('not.be.empty')
    
    // Verifica se o body está visível
    cy.get('body').should('be.visible')
  })

  it('Deve exibir as colunas do Kanban', () => {
    // Procura por elementos que indicam colunas do Kanban
    // Baseado no conteúdo visto: "📝 To Do"
    cy.contains('To Do', { timeout: 10000 }).should('be.visible')
    
    // Verifica se existem outras colunas típicas de Kanban
    cy.get('body').then(($body) => {
      // Procura por possíveis outras colunas
      const commonColumns = ['Doing', 'Done', 'In Progress', 'Em Progresso', 'Concluído']
      commonColumns.forEach(column => {
        if ($body.text().includes(column)) {
          cy.contains(column).should('be.visible')
        }
      })
    })
  })

  it('Deve exibir tarefas existentes', () => {
    // Verifica se as tarefas mencionadas no conteúdo estão visíveis
    const expectedTasks = [
      'Documentar padrões mobile',
      'Ajustes fluxo de compra',
      'Banners da home',
      'Template de e-mail marketing'
    ]
    
    expectedTasks.forEach(task => {
      cy.contains(task, { timeout: 10000 }).should('be.visible')
    })
  })

  it('Deve ter botão para adicionar nova tarefa', () => {
    // Procura pelo botão "Adicionar Tarefa"
    cy.contains('Adicionar Tarefa', { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
  })

  it('Deve ser responsivo em diferentes tamanhos de tela', () => {
    // Testa responsividade
    cy.checkResponsiveness()
    
    // Verifica se o conteúdo ainda está visível em mobile
    cy.viewport(375, 667)
    cy.contains('To Do').should('be.visible')
    cy.contains('Adicionar Tarefa').should('be.visible')
  })

  it('Deve carregar sem erros de console críticos', () => {
    // Monitora erros de console
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as('consoleError')
    })
    
    cy.reload()
    cy.waitForPageLoad()
    
    // Verifica se não há muitos erros críticos
    cy.get('@consoleError').should('not.have.been.calledWith', 
      Cypress.sinon.match(/TypeError|ReferenceError|SyntaxError/)
    )
  })
})