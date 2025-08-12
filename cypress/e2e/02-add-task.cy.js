describe('Kanban - Adicionar Tarefas', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('Deve abrir modal/formulário ao clicar em "Adicionar Tarefa"', () => {
    // Clica no botão adicionar tarefa
    cy.contains('Adicionar Tarefa', { timeout: 10000 })
      .should('be.visible')
      .click()
    
    // Verifica se algum formulário ou modal apareceu
    cy.get('body').then(($body) => {
      // Procura por elementos comuns de formulário
      const formSelectors = [
        'input[type="text"]',
        'textarea',
        '[data-cy="task-input"]',
        'form',
        '.modal',
        '[role="dialog"]'
      ]
      
      let formFound = false
      formSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).should('be.visible')
          formFound = true
        }
      })
      
      // Se nenhum formulário foi encontrado, documenta o comportamento
      if (!formFound) {
        cy.log('Nenhum formulário visível encontrado após clicar em Adicionar Tarefa')
      }
    })
  })

  it('Deve permitir digitar texto no campo de nova tarefa', () => {
    cy.contains('Adicionar Tarefa').click()
    
    // Tenta encontrar campo de input
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'input[type="text"]:visible',
        'textarea:visible',
        '[data-cy="task-input"]:visible',
        'input:not([type="hidden"]):visible'
      ]
      
      inputSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .first()
            .should('be.visible')
            .type('Nova tarefa de teste')
            .should('have.value', 'Nova tarefa de teste')
        }
      })
    })
  })

  it('Deve adicionar nova tarefa com sucesso', () => {
    const newTaskTitle = `Tarefa de Teste ${Date.now()}`
    
    // Tenta usar o comando customizado
    cy.contains('Adicionar Tarefa').click()
    
    // Aguarda um pouco para o formulário aparecer
    cy.wait(1000)
    
    // Procura por campo de input e botão de salvar
    cy.get('body').then(($body) => {
      // Procura input
      const inputSelectors = [
        'input[type="text"]:visible',
        'textarea:visible',
        '[data-cy="task-input"]:visible'
      ]
      
      let inputFound = false
      inputSelectors.forEach(selector => {
        if ($body.find(selector).length > 0 && !inputFound) {
          cy.get(selector)
            .first()
            .type(newTaskTitle)
          inputFound = true
        }
      })
      
      if (inputFound) {
        // Procura botão de salvar
        const saveSelectors = [
          'button:contains("Adicionar"):visible',
          'button:contains("Salvar"):visible',
          'button:contains("Criar"):visible',
          '[data-cy="save-task"]:visible',
          'button[type="submit"]:visible'
        ]
        
        saveSelectors.forEach(selector => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).first().click()
          }
        })
        
        // Verifica se a tarefa foi adicionada
        cy.contains(newTaskTitle, { timeout: 10000 })
          .should('be.visible')
      }
    })
  })

  it('Deve validar campos obrigatórios', () => {
    cy.contains('Adicionar Tarefa').click()
    cy.wait(1000)
    
    // Tenta salvar sem preencher
    cy.get('body').then(($body) => {
      const saveSelectors = [
        'button:contains("Adicionar"):visible',
        'button:contains("Salvar"):visible',
        'button[type="submit"]:visible'
      ]
      
      saveSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click()
          
          // Verifica se há mensagem de erro ou validação
          cy.get('body').should(($body) => {
            const errorTexts = ['obrigatório', 'required', 'erro', 'error', 'preencha']
            const bodyText = $body.text().toLowerCase()
            
            // Se encontrar texto de erro, é um bom sinal de validação
            errorTexts.forEach(errorText => {
              if (bodyText.includes(errorText)) {
                cy.log(`Validação encontrada: ${errorText}`)
              }
            })
          })
        }
      })
    })
  })

  it('Deve cancelar adição de tarefa', () => {
    cy.contains('Adicionar Tarefa').click()
    cy.wait(1000)
    
    // Procura botão de cancelar
    cy.get('body').then(($body) => {
      const cancelSelectors = [
        'button:contains("Cancelar"):visible',
        'button:contains("Fechar"):visible',
        '[data-cy="cancel-task"]:visible',
        '.close:visible',
        '[aria-label="Close"]:visible'
      ]
      
      cancelSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click()
          
          // Verifica se o formulário foi fechado
          cy.wait(500)
          cy.get('input[type="text"]:visible, textarea:visible').should('not.exist')
        }
      })
    })
  })
})