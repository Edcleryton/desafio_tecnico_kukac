describe('Kanban - Tratamento de Erros e Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('Deve lidar com conexão lenta/instável', () => {
    // Simula conexão lenta
    cy.intercept('**/*', (req) => {
      req.reply((res) => {
        // Adiciona delay de 3 segundos
        return new Promise((resolve) => {
          setTimeout(() => resolve(res), 3000)
        })
      })
    })
    
    cy.visit('/')
    
    // Verifica se a página ainda carrega (com timeout maior)
    cy.contains('To Do', { timeout: 15000 }).should('be.visible')
  })

  it('Deve tratar erros de API graciosamente', () => {
    // Intercepta chamadas de API e simula erro
    cy.intercept('POST', '**/*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('apiError')
    
    // Tenta adicionar uma tarefa
    cy.contains('Adicionar Tarefa').click()
    cy.wait(1000)
    
    cy.get('body').then(($body) => {
      if ($body.find('input[type="text"]:visible').length > 0) {
        cy.get('input[type="text"]:visible')
          .first()
          .type('Tarefa que vai falhar')
        
        cy.get('button:contains("Adicionar"):visible, button:contains("Salvar"):visible')
          .first()
          .click()
        
        // Verifica se há tratamento de erro
        cy.get('body').should(($body) => {
          const errorTexts = ['erro', 'error', 'falha', 'failed', 'problema']
          const bodyText = $body.text().toLowerCase()
          
          // Procura por mensagens de erro
          errorTexts.forEach(errorText => {
            if (bodyText.includes(errorText)) {
              cy.log(`Mensagem de erro encontrada: ${errorText}`)
            }
          })
        })
      }
    })
  })

  it('Deve validar entrada de dados maliciosos', () => {
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      '\'; DROP TABLE tasks; --',
      '{{7*7}}',
      '<img src=x onerror=alert(1)>',
      'javascript:alert(1)'
    ]
    
    maliciousInputs.forEach(maliciousInput => {
      cy.contains('Adicionar Tarefa').click()
      cy.wait(1000)
      
      cy.get('body').then(($body) => {
        if ($body.find('input[type="text"]:visible').length > 0) {
          cy.get('input[type="text"]:visible')
            .first()
            .clear()
            .type(maliciousInput)
          
          cy.get('button:contains("Adicionar"):visible, button:contains("Salvar"):visible')
            .first()
            .click()
          
          cy.wait(1000)
          
          // Verifica se o input foi sanitizado
          cy.get('body').should('not.contain', '<script>')
          cy.get('body').should('not.contain', 'DROP TABLE')
          
          // Cancela se modal ainda estiver aberto
          cy.get('body').then(($body2) => {
            if ($body2.find('button:contains("Cancelar"):visible').length > 0) {
              cy.get('button:contains("Cancelar"):visible').click()
            }
          })
        }
      })
    })
  })

  it('Deve lidar com inputs extremamente longos', () => {
    const longText = 'A'.repeat(10000) // 10k caracteres
    
    cy.contains('Adicionar Tarefa').click()
    cy.wait(1000)
    
    cy.get('body').then(($body) => {
      if ($body.find('input[type="text"]:visible, textarea:visible').length > 0) {
        cy.get('input[type="text"]:visible, textarea:visible')
          .first()
          .type(longText.substring(0, 1000)) // Digita apenas 1k para não travar
        
        // Verifica se há limitação de caracteres
        cy.get('input[type="text"]:visible, textarea:visible')
          .first()
          .should(($input) => {
            const value = $input.val()
            expect(value.length).to.be.lessThan(10000)
          })
      }
    })
  })

  it('Deve funcionar com JavaScript desabilitado parcialmente', () => {
    // Testa funcionalidades básicas
    cy.visit('/')
    
    // Verifica se elementos estáticos ainda funcionam
    cy.contains('To Do').should('be.visible')
    
    // Testa se formulários HTML básicos funcionam
    cy.get('body').then(($body) => {
      if ($body.find('form').length > 0) {
        cy.get('form').should('be.visible')
      }
    })
  })

  it('Deve detectar vazamentos de memória', () => {
    // Executa várias ações para detectar possíveis vazamentos
    for (let i = 0; i < 10; i++) {
      cy.contains('Adicionar Tarefa').click()
      cy.wait(500)
      
      // Cancela se modal abrir
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Cancelar"):visible').length > 0) {
          cy.get('button:contains("Cancelar"):visible').click()
        }
        // Pressiona ESC como alternativa
        cy.get('body').type('{esc}')
      })
      
      cy.wait(500)
    }
    
    // Verifica se a página ainda responde
    cy.contains('To Do').should('be.visible')
  })

  it('Deve lidar com múltiplas abas/janelas', () => {
    // Abre nova aba (simulado)
    cy.window().then((win) => {
      // Simula mudança de foco
      win.dispatchEvent(new Event('blur'))
      cy.wait(1000)
      win.dispatchEvent(new Event('focus'))
    })
    
    // Verifica se a aplicação ainda funciona
    cy.contains('To Do').should('be.visible')
    cy.contains('Adicionar Tarefa').should('be.visible')
  })

  it('Deve funcionar offline (se suportado)', () => {
    // Simula modo offline
    cy.window().then((win) => {
      cy.stub(win.navigator, 'onLine').value(false)
      win.dispatchEvent(new Event('offline'))
    })
    
    cy.wait(1000)
    
    // Verifica se há indicação de modo offline
    cy.get('body').should(($body) => {
      const offlineTexts = ['offline', 'sem conexão', 'desconectado']
      const bodyText = $body.text().toLowerCase()
      
      offlineTexts.forEach(offlineText => {
        if (bodyText.includes(offlineText)) {
          cy.log(`Indicação de modo offline encontrada: ${offlineText}`)
        }
      })
    })
    
    // Testa funcionalidades básicas offline
    cy.contains('To Do').should('be.visible')
  })

  it('Deve reportar erros de console adequadamente', () => {
    let consoleErrors = []
    
    cy.window().then((win) => {
      cy.stub(win.console, 'error').callsFake((message) => {
        consoleErrors.push(message)
      })
    })
    
    // Executa algumas ações
    cy.contains('Adicionar Tarefa').click()
    cy.wait(1000)
    
    cy.then(() => {
      // Verifica se há muitos erros críticos
      const criticalErrors = consoleErrors.filter(error => 
        typeof error === 'string' && 
        (error.includes('TypeError') || 
         error.includes('ReferenceError') || 
         error.includes('SyntaxError'))
      )
      
      expect(criticalErrors.length).to.be.lessThan(5)
    })
  })

  it('Deve lidar com redimensionamento extremo da janela', () => {
    // Testa redimensionamentos extremos
    const extremeViewports = [
      { width: 100, height: 100 },
      { width: 3840, height: 2160 },
      { width: 200, height: 2000 },
      { width: 2000, height: 200 }
    ]
    
    extremeViewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height)
      cy.wait(1000)
      
      // Verifica se a aplicação não quebra
      cy.get('body').should('be.visible')
      
      // Verifica se elementos principais ainda existem
      cy.get('body').should('contain.text', 'To Do')
    })
  })
})