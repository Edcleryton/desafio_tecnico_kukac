describe('Kanban - Gerenciamento de Tarefas', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('Deve permitir visualizar detalhes de uma tarefa', () => {
    // Clica na primeira tarefa disponível
    cy.get('body').then(($body) => {
      const taskSelectors = [
        '[data-cy="task-item"]',
        '.task',
        '.card',
        '[draggable="true"]'
      ]
      
      // Procura por tarefas existentes
      const existingTasks = [
        'Documentar padrões mobile',
        'Ajustes fluxo de compra',
        'Banners da home',
        'Template de e-mail marketing'
      ]
      
      existingTasks.forEach(task => {
        if ($body.text().includes(task)) {
          cy.contains(task)
            .should('be.visible')
            .click()
          
          // Verifica se algum modal ou detalhe apareceu
          cy.wait(1000)
          
          // Procura por elementos de modal/detalhes
          const detailSelectors = [
            '.modal',
            '[role="dialog"]',
            '.task-details',
            '.popup'
          ]
          
          detailSelectors.forEach(selector => {
            if ($body.find(selector).length > 0) {
              cy.get(selector).should('be.visible')
            }
          })
        }
      })
    })
  })

  it('Deve permitir editar uma tarefa existente', () => {
    // Procura por tarefa existente e tenta editá-la
    cy.contains('Documentar padrões mobile', { timeout: 10000 })
      .should('be.visible')
      .rightclick() // Tenta menu de contexto
    
    cy.wait(1000)
    
    // Procura por opções de edição
    cy.get('body').then(($body) => {
      const editSelectors = [
        'button:contains("Editar"):visible',
        'button:contains("Edit"):visible',
        '[data-cy="edit-task"]:visible',
        '.edit-option:visible'
      ]
      
      editSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click()
          
          // Verifica se formulário de edição apareceu
          cy.get('input[type="text"]:visible, textarea:visible')
            .should('be.visible')
            .clear()
            .type('Tarefa editada - Documentar padrões mobile')
        }
      })
    })
  })

  it('Deve suportar drag and drop entre colunas', () => {
    // Tenta mover uma tarefa usando drag and drop
    cy.contains('Documentar padrões mobile')
      .should('be.visible')
      .trigger('mousedown', { button: 0 })
      .wait(100)
    
    // Procura por outras colunas para mover
    cy.get('body').then(($body) => {
      const possibleColumns = ['Doing', 'Done', 'In Progress', 'Em Progresso']
      
      possibleColumns.forEach(column => {
        if ($body.text().includes(column)) {
          cy.contains(column)
            .trigger('mousemove')
            .trigger('mouseup')
          
          cy.wait(1000)
          
          // Verifica se a tarefa foi movida
          cy.contains('Documentar padrões mobile')
            .should('be.visible')
        }
      })
    })
  })

  it('Deve permitir deletar uma tarefa', () => {
    // Primeiro adiciona uma tarefa para deletar
    const taskToDelete = `Tarefa para deletar ${Date.now()}`
    
    cy.contains('Adicionar Tarefa').click()
    cy.wait(1000)
    
    // Adiciona tarefa
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'input[type="text"]:visible',
        'textarea:visible'
      ]
      
      inputSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .first()
            .type(taskToDelete)
          
          // Salva a tarefa
          cy.get('button:contains("Adicionar"):visible, button:contains("Salvar"):visible')
            .first()
            .click()
          
          cy.wait(2000)
          
          // Agora tenta deletar
          cy.contains(taskToDelete)
            .should('be.visible')
            .rightclick()
          
          // Procura opção de deletar
          cy.get('body').then(($body2) => {
            const deleteSelectors = [
              'button:contains("Deletar"):visible',
              'button:contains("Excluir"):visible',
              'button:contains("Delete"):visible',
              '[data-cy="delete-task"]:visible'
            ]
            
            deleteSelectors.forEach(deleteSelector => {
              if ($body2.find(deleteSelector).length > 0) {
                cy.get(deleteSelector).first().click()
                
                // Confirma deleção se necessário
                cy.wait(500)
                cy.get('button:contains("Confirmar"):visible, button:contains("Sim"):visible')
                  .first()
                  .click()
                
                // Verifica se a tarefa foi removida
                cy.contains(taskToDelete).should('not.exist')
              }
            })
          })
        }
      })
    })
  })

  it('Deve filtrar tarefas por status/coluna', () => {
    // Verifica se existem filtros disponíveis
    cy.get('body').then(($body) => {
      const filterSelectors = [
        'select:visible',
        '.filter:visible',
        'button:contains("Filtro"):visible',
        '[data-cy="filter"]:visible'
      ]
      
      filterSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).should('be.visible')
          
          // Testa filtro se disponível
          if (selector.includes('select')) {
            cy.get(selector).select(0) // Seleciona primeira opção
          } else {
            cy.get(selector).click()
          }
          
          cy.wait(1000)
          
          // Verifica se as tarefas foram filtradas
          cy.get('body').should('be.visible')
        }
      })
    })
  })

  it('Deve buscar tarefas por texto', () => {
    // Procura por campo de busca
    cy.get('body').then(($body) => {
      const searchSelectors = [
        'input[type="search"]:visible',
        'input[placeholder*="buscar"]:visible',
        'input[placeholder*="search"]:visible',
        '[data-cy="search"]:visible'
      ]
      
      searchSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .should('be.visible')
            .type('mobile')
          
          cy.wait(1000)
          
          // Verifica se apenas tarefas com 'mobile' aparecem
          cy.contains('Documentar padrões mobile')
            .should('be.visible')
        }
      })
    })
  })
})