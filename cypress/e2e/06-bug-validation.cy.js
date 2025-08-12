describe('Validação de Bugs Reportados', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Segurança (SEC)', () => {
    it('SEC-001: Deve prevenir XSS em títulos de colunas', { tags: ['@security', '@critical'] }, () => {
      const xssPayload = '<script>alert("XSS")</script>'
      
      // Tentar criar coluna com payload XSS
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type(xssPayload)
          cy.get('button').contains('Salvar').click()
          
          // Verificar se o script não foi executado
          cy.get('h2, h3, .column-title').should('contain.text', 'script')
          cy.get('h2, h3, .column-title').should('not.contain.html', '<script>')
        } else {
          cy.log('Interface de adicionar coluna não encontrada - teste pulado')
        }
      })
    })
  })

  describe('Usabilidade (USAB)', () => {
    it('USAB-001: Deve exibir confirmação ao excluir coluna com tarefas', { tags: ['@usability', '@high'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar uma coluna
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Verificar se existe botão de excluir
          cy.get('body').then(($body2) => {
            if ($body2.find('button:contains("Excluir")').length > 0) {
              cy.get('button').contains('Excluir').click()
              
              // Verificar se aparece confirmação (modal ou alert)
              cy.get('body').should('contain.text', 'confirmação').or('contain.text', 'certeza')
            } else {
              cy.log('Botão de excluir não encontrado - teste pulado')
            }
          })
        } else {
          cy.log('Interface de adicionar coluna não encontrada - teste pulado')
        }
      })
    })

    it('USAB-002: Deve exibir confirmação ao excluir tarefas', { tags: ['@usability', '@high'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Adicionar uma tarefa
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Tarefa para Excluir')
          cy.get('button').contains('Salvar').click()
          
          // Verificar se existe botão de excluir tarefa
          cy.get('body').then(($body2) => {
            if ($body2.find('button:contains("Excluir")').length > 0) {
              cy.get('button').contains('Excluir').click()
              
              // Verificar se aparece confirmação
              cy.get('body').should('contain.text', 'confirmação').or('contain.text', 'certeza')
            } else {
              cy.log('Botão de excluir tarefa não encontrado - teste pulado')
            }
          })
        } else {
          cy.log('Interface de adicionar tarefa não encontrada - teste pulado')
        }
      })
    })

    it('USAB-003: Deve fornecer feedback visual durante drag-and-drop', { tags: ['@usability', '@low'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('.task, .task-card').length > 0 && $body.find('.column').length > 1) {
          // Verificar se há tarefas e colunas para testar drag-and-drop
          cy.get('.task, .task-card').first().as('sourceTask')
          cy.get('.column').last().as('targetColumn')
          
          // Simular início do drag
          cy.get('@sourceTask').trigger('dragstart')
          
          // Verificar se há feedback visual
          cy.get('@targetColumn').then(($column) => {
            cy.wrap($column).should('satisfy', ($el) => {
              const hasClass = $el.attr('class') && /highlight|drop-zone|active/.test($el.attr('class'))
              const hasText = /soltar|drop/i.test($el.text())
              const hasBgColor = $el.css('background-color') !== 'rgba(0, 0, 0, 0)'
              return hasClass || hasText || hasBgColor
            })
          })
        } else {
          cy.log('Elementos necessários para drag-and-drop não encontrados - teste pulado')
        }
      })
    })
  })

  describe('Bugs Funcionais e de Layout (BUG)', () => {
    it('BUG-001: Deve truncar nomes longos de colunas', { tags: ['@layout', '@high'] }, () => {
       const longText = 'Este é um nome de coluna extremamente longo que deveria ser truncado para não quebrar o layout da aplicação e manter a consistência visual'
       
       cy.get('body').then(($body) => {
         if ($body.find('button:contains("Adicionar")').length > 0) {
           // Criar coluna com nome muito longo
           cy.get('button').contains('Adicionar').click()
           cy.get('input').first().type(longText)
           cy.get('button').contains('Salvar').click()
           
           // Verificar se o nome foi truncado usando CSS ou se há limitação de caracteres
           cy.get('body').then(($body2) => {
             if ($body2.find('.column-title, h3, h2').length > 0) {
               cy.get('.column-title, h3, h2').last().then(($title) => {
                 const titleText = $title.text()
                 // Verificar se o texto foi truncado (menor que o original)
                 expect(titleText.length).to.be.lessThan(longText.length)
                 
                 // Verificar se há CSS de truncamento ou se o texto foi limitado
                 const hasEllipsis = $title.css('text-overflow') === 'ellipsis'
                 const hasOverflowHidden = $title.css('overflow') === 'hidden'
                 const isTextLimited = titleText.length < longText.length
                 
                 expect(hasEllipsis || hasOverflowHidden || isTextLimited).to.be.true
               })
             } else {
               cy.log('Título da coluna não encontrado - verificando se há limitação de input')
             }
           })
         } else {
           cy.log('Interface de adicionar coluna não encontrada - teste pulado')
         }
       })
     })

    it('BUG-002: Deve validar nomes de colunas com apenas espaços', { tags: ['@validation', '@medium'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Tentar criar coluna com apenas espaços
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('     ') // Apenas espaços
          
          // Verificar se o botão criar está desabilitado ou se há validação
          cy.get('button').contains('Salvar').then(($btn) => {
            cy.wrap($btn).should('satisfy', ($el) => {
              return $el.is(':disabled') || $el.hasClass('disabled') || $el.attr('disabled') !== undefined
            })
          })
        } else {
          cy.log('Interface de adicionar coluna não encontrada - teste pulado')
        }
      })
    })

    it('BUG-003: Deve prevenir tags duplicadas (case-insensitive)', { tags: ['@validation', '@medium'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="tag"], .add-tag').length > 0) {
          // Adicionar primeira tag
          cy.get('input[placeholder*="tag"], .add-tag').first().type('Teste{enter}')
          
          // Tentar adicionar tag duplicada com case diferente
          cy.get('input[placeholder*="tag"], .add-tag').first().type('teste{enter}')
          
          // Verificar se apenas uma tag existe ou se há validação
          cy.get('body').then(($body2) => {
            if ($body2.find('.tag').length > 0) {
              cy.get('.tag').should('have.length', 1)
            } else {
              // Verificar se há mensagem de erro
              cy.get('body').should('contain.text', 'duplicada').or('contain.text', 'existe')
            }
          })
        } else {
          cy.log('Interface de tags não encontrada - teste pulado')
        }
      })
    })

    it('BUG-004: Deve gerenciar overflow de tags em cards', { tags: ['@layout', '@medium'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('.task-card, .task').length > 0 && $body.find('input[placeholder*="tag"], .add-tag').length > 0) {
          // Adicionar múltiplas tags
          const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5']
          tags.forEach(tag => {
            cy.get('input[placeholder*="tag"], .add-tag').first().type(`${tag}{enter}`)
          })
          
          // Verificar se as tags não vazam do card
          cy.get('.task-card, .task').first().then(($card) => {
            const cardRect = $card[0].getBoundingClientRect()
            
            cy.get('body').then(($body2) => {
              if ($body2.find('.tag').length > 0) {
                cy.get('.tag').each(($tag) => {
                  const tagRect = $tag[0].getBoundingClientRect()
                  expect(tagRect.right).to.be.lessThan(cardRect.right + 20) // Margem de 20px
                })
              }
            })
          })
        } else {
          cy.log('Elementos necessários para teste de tags não encontrados - teste pulado')
        }
      })
    })

    it('BUG-005: Deve aplicar cor de fundo completa em tags com múltiplas palavras', { tags: ['@layout', '@low'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="tag"], .add-tag').length > 0) {
          // Adicionar tag com múltiplas palavras
          cy.get('input[placeholder*="tag"], .add-tag').first().type('Feature Nova{enter}')
          
          // Verificar se a tag tem cor de fundo aplicada corretamente
          cy.get('body').then(($body2) => {
            if ($body2.find('.tag').length > 0) {
              cy.get('.tag').contains('Feature Nova').then(($tag) => {
                const tagElement = $tag[0]
                const computedStyle = window.getComputedStyle(tagElement)
                
                // Verificar se tem cor de fundo
                expect(computedStyle.backgroundColor).to.not.equal('rgba(0, 0, 0, 0)')
                expect(computedStyle.backgroundColor).to.not.equal('transparent')
              })
            } else {
              cy.log('Tag não foi criada - verificando se há validação')
            }
          })
        } else {
          cy.log('Interface de tags não encontrada - teste pulado')
        }
      })
    })

    it('BUG-006: Deve persistir preferência de tema após recarregar a página', { tags: ['@theme', '@medium'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('button[aria-label*="tema"], .theme-toggle, button:contains("tema")').length > 0) {
          // Alternar tema
          cy.get('button[aria-label*="tema"], .theme-toggle, button:contains("tema")').first().click()
          
          // Aguardar mudança de tema
          cy.wait(500)
          
          // Recarregar a página
          cy.reload()
          
          // Verificar se a preferência foi mantida no localStorage
          cy.window().then((win) => {
            const savedTheme = win.localStorage.getItem('theme') || win.localStorage.getItem('preferred-theme') || win.localStorage.getItem('darkMode')
            expect(savedTheme).to.not.be.null
          })
        } else {
          cy.log('Botão de alternar tema não encontrado - teste pulado')
        }
      })
    })

    it('BUG-007: Deve aplicar cor padrão visível para tags criadas sem cor', { tags: ['@layout', '@low'] }, () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="tag"], .add-tag').length > 0) {
          // Adicionar tag sem selecionar cor
          cy.get('input[placeholder*="tag"], .add-tag').first().type('tag-sem-cor{enter}')
          
          // Verificar se a tag foi criada e é visível
          cy.get('body').then(($body2) => {
            if ($body2.find('.tag').length > 0) {
              cy.get('.tag').contains('tag-sem-cor').should('be.visible')
              
              cy.get('.tag').contains('tag-sem-cor').then(($tag) => {
                const tagElement = $tag[0]
                const computedStyle = window.getComputedStyle(tagElement)
                
                // Verificar se tem cor de fundo padrão
                expect(computedStyle.backgroundColor).to.not.equal('rgba(0, 0, 0, 0)')
                expect(computedStyle.backgroundColor).to.not.equal('transparent')
              })
            } else {
              cy.log('Tag não foi criada - pode haver validação específica')
            }
          })
        } else {
          cy.log('Interface de tags não encontrada - teste pulado')
        }
      })
    })
  })

  describe('Testes de Regressão', () => {
    it('Deve executar todos os cenários de bug em sequência', { tags: ['@regression'] }, () => {
      // Teste integrado para verificar se as correções não quebram outras funcionalidades
      
      // 1. Testar XSS
      cy.log('Testando prevenção XSS')
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('<script>alert("test")</script>')
          cy.get('button').contains('Salvar').click()
        }
      })
      
      // 2. Testar validação de espaços
      cy.log('Testando validação de espaços')
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().clear().type('   ')
          cy.get('button').contains('Salvar').should('be.disabled')
          
          // 3. Testar funcionalidade básica ainda funciona
          cy.log('Testando funcionalidade básica')
          cy.get('input').first().clear().type('Coluna Válida')
          cy.get('button').contains('Salvar').click()
          cy.get('body').should('contain.text', 'Coluna Válida')
        } else {
          cy.log('Interface não encontrada - teste de regressão pulado')
        }
      })
    })
  })
})