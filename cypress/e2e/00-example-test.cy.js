describe('Exemplo - Teste Básico do Kanban', () => {
  it('Deve acessar o site e verificar elementos principais', () => {
    // Visita a página principal
    cy.visit('https://kanban-dusky-five.vercel.app/')
    
    // Aguarda o carregamento
    cy.wait(3000)
    
    // Verifica se a página carregou corretamente
    cy.url().should('include', 'kanban-dusky-five.vercel.app')
    
    // Verifica se o elemento "To Do" está visível
    cy.contains('To Do', { timeout: 10000 }).should('be.visible')
    
    // Verifica se o botão "Adicionar Tarefa" está presente
    cy.contains('Adicionar Tarefa', { timeout: 10000 }).should('be.visible')
    
    // Verifica se as tarefas existentes estão visíveis
    cy.contains('Documentar padrões mobile').should('be.visible')
    cy.contains('Ajustes fluxo de compra').should('be.visible')
    cy.contains('Banners da home').should('be.visible')
    cy.contains('Template de e-mail marketing').should('be.visible')
    
    // Tira um screenshot para documentação
    cy.screenshot('kanban-homepage')
    
    // Log de sucesso
    cy.log('✅ Teste básico executado com sucesso!')
  })
  
  it('Deve testar a responsividade básica', () => {
    cy.visit('https://kanban-dusky-five.vercel.app/')
    
    // Testa em diferentes tamanhos de tela
    const viewports = [
      { width: 1280, height: 720, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ]
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height)
      cy.wait(1000)
      
      // Verifica se elementos principais ainda estão visíveis
      cy.contains('To Do').should('be.visible')
      cy.contains('Adicionar Tarefa').should('be.visible')
      
      // Tira screenshot de cada viewport
      cy.screenshot(`kanban-${viewport.name.toLowerCase()}`)
      
      cy.log(`✅ Teste responsivo ${viewport.name} executado com sucesso!`)
    })
  })
})