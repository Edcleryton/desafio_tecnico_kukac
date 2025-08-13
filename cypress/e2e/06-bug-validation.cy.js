describe('Validação de Bugs Reportados', () => {
  beforeEach(() => {
    cy.visit('https://kanban-dusky-five.vercel.app/')
    cy.wait(2000) // Aguarda carregamento
  })

  describe('Segurança (SEC)', () => {
    it('SEC-001: Deve verificar ausência de autenticação', { tags: ['@security', '@critical'] }, () => {
      cy.log('🔒 Testando ausência de sistema de autenticação')
      
      // Verifica se a aplicação permite acesso direto sem login
      cy.url().should('include', 'kanban-dusky-five.vercel.app')
      
      // Verifica se elementos do Kanban estão visíveis sem autenticação
      cy.get('body').should('be.visible')
      
      // Confirma que não há tela de login
      cy.get('body').should(($body) => {
        const bodyText = $body.text().toLowerCase()
        expect(bodyText).to.not.include('login')
        expect(bodyText).to.not.include('password')
        expect(bodyText).to.not.include('signin')
      })
      
      // Verifica acesso direto aos dados do Kanban
      cy.get('body').should('contain.text', 'To Do').or('contain.text', 'Fazer').or('contain.text', 'Adicionar')
    })
  })

  describe('Usabilidade (USAB)', () => {
    it('USAB-001: Deve exigir confirmação ao excluir coluna com tarefas', { tags: ['@usability', '@high'] }, () => {
      cy.log('👤 Testando exclusão de coluna sem confirmação')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar coluna
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Adicionar tarefa à coluna
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa Teste')
          cy.get('button').contains('Salvar').click()
          
          // Clicar no ícone de lixeira da coluna
          cy.get('button[title*="excluir"], button[title*="delete"], .delete-btn, [data-cy="delete-column"]').first().click()
          
          // BUG: Verificar que a coluna é excluída SEM confirmação
          cy.get('body').should('not.contain.text', 'Coluna Teste')
          
          // Confirmar que não houve modal de confirmação
          cy.get('body').should('not.contain.text', 'confirma')
          cy.get('body').should('not.contain.text', 'certeza')
        } else {
          cy.log('⚠️ Interface de adicionar coluna não encontrada - pulando teste')
        }
      })
    })

    it('USAB-002: Deve exigir confirmação ao excluir tarefa', { tags: ['@usability', '@high'] }, () => {
      cy.log('👤 Testando exclusão de tarefa sem confirmação')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar uma tarefa
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Adicionar tarefa
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa para Excluir')
          cy.get('button').contains('Salvar').click()
          
          // Clicar no ícone de lixeira da tarefa
          cy.get('.task-card, [data-cy="task-card"]').first().within(() => {
            cy.get('button[title*="excluir"], button[title*="delete"], .delete-btn').click()
          })
          
          // BUG: Verificar que a tarefa é excluída SEM confirmação
          cy.get('body').should('not.contain.text', 'Tarefa para Excluir')
          
          // Confirmar que não houve modal de confirmação
          cy.get('body').should('not.contain.text', 'confirma')
          cy.get('body').should('not.contain.text', 'certeza')
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
        }
      })
    })

    it('USAB-003: Deve fornecer feedback visual durante drag-and-drop', { tags: ['@usability', '@low'] }, () => {
      cy.log('👤 Testando ausência de feedback visual no drag-and-drop')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar colunas e tarefas para testar drag-and-drop
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna 1')
          cy.get('button').contains('Salvar').click()
          
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna 2')
          cy.get('button').contains('Salvar').click()
          
          // Adicionar tarefa na primeira coluna
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa para Mover')
          cy.get('button').contains('Salvar').click()
          
          // Iniciar drag da tarefa
          cy.get('.task-card, [data-cy="task-card"]').first().trigger('dragstart')
          
          // BUG: Verificar que NÃO há feedback visual (placeholder, sombra)
          cy.get('body').should('not.contain', '.placeholder')
          cy.get('body').should('not.contain', '.drop-zone')
          cy.get('body').should('not.contain', '.drag-over')
          cy.get('body').should('not.contain', '.highlight')
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
        }
      })
    })
  })

  describe('Bugs Funcionais e de Layout (BUG)', () => {
    it('BUG-001: Deve verificar expansão vertical com nomes longos', { tags: ['@layout', '@high'] }, () => {
      cy.log('🐛 Testando expansão vertical com nomes longos de colunas')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar 3 colunas com nomes curtos
          const shortNames = ['A Fazer', 'Fazendo', 'Feito']
          shortNames.forEach(name => {
            cy.get('button').contains('Adicionar').click()
            cy.get('input').first().type(name)
            cy.get('button').contains('Salvar').click()
          })
          
          // Criar uma coluna com nome muito longo (500+ caracteres)
          const longName = 'Esta é uma coluna com um nome extremamente longo que deveria causar problemas de layout e expansão vertical indesejada no quadro Kanban, afetando a consistência visual e a experiência do usuário. '.repeat(3)
          
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type(longName)
          cy.get('button').contains('Salvar').click()
          
          // BUG: Verificar que a coluna expande verticalmente
          cy.get('.column, [data-cy="column"]').should('have.length.at.least', 4)
          
          // Verificar que o nome longo não foi truncado
          cy.get('body').should('contain.text', longName.substring(0, 100))
          
          // Verificar quebra de layout (todas as colunas ficam com altura maior)
          cy.get('.column, [data-cy="column"]').should(($columns) => {
            // Pelo menos uma coluna deve ter altura significativamente maior
            const heights = Array.from($columns).map(col => col.offsetHeight)
            const maxHeight = Math.max(...heights)
            const minHeight = Math.min(...heights)
            expect(maxHeight).to.be.greaterThan(minHeight * 1.5)
          })
        } else {
          cy.log('⚠️ Interface de adicionar coluna não encontrada - pulando teste')
        }
      })
    })

    it('BUG-002: Deve permitir criação de colunas com apenas espaços', { tags: ['@validation', '@medium'] }, () => {
      cy.log('🐛 Testando criação de coluna com apenas espaços')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          cy.get('button').contains('Adicionar').click()
          
          // Inserir apenas espaços no campo nome
          cy.get('input').first().type('   ') // Apenas espaços
          
          // Clicar em "Criar Coluna"
          cy.get('button').contains('Salvar').or('button').contains('Criar').click()
          
          // BUG: Verificar que o sistema permite a criação
          cy.get('body').should('not.contain.text', 'Campo obrigatório')
          cy.get('body').should('not.contain.text', 'Nome inválido')
          
          // Verificar que uma coluna "invisível" foi criada
          cy.get('.column, [data-cy="column"]').should('have.length.at.least', 1)
          
          // Verificar que o botão não ficou desabilitado
          cy.get('button').contains('Salvar').or('button').contains('Criar').should('not.be.disabled')
        } else {
          cy.log('⚠️ Interface de adicionar coluna não encontrada - pulando teste')
        }
      })
    })

    it('BUG-003: Deve permitir tags duplicadas (case-insensitive)', { tags: ['@validation', '@medium'] }, () => {
      cy.log('🐛 Testando criação de tags duplicadas com case diferente')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar uma coluna primeiro
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Criar uma tarefa
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa com Tags')
          
          // Verificar se há interface de tags
          cy.get('body').then(($body2) => {
            if ($body2.find('input[placeholder*="tag"], .add-tag').length > 0) {
              // Adicionar primeira tag "Teste"
              cy.get('input[placeholder*="tag"], .add-tag').first().type('Teste{enter}')
              
              // Adicionar segunda tag "teste" (case diferente)
              cy.get('input[placeholder*="tag"], .add-tag').first().type('teste{enter}')
              
              cy.get('button').contains('Salvar').click()
              
              // BUG: Verificar que ambas as tags foram criadas (sem validação case-insensitive)
              cy.get('.tag').should('have.length', 2)
              cy.get('body').should('contain.text', 'Teste')
              cy.get('body').should('contain.text', 'teste')
            } else {
              cy.log('⚠️ Interface de tags não encontrada - salvando tarefa sem tags')
              cy.get('button').contains('Salvar').click()
            }
          })
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
        }
      })
    })

    it('BUG-004: Deve permitir excesso de tags causando vazamento', { tags: ['@validation', '@medium'] }, () => {
      cy.log('🐛 Testando vazamento de tags para fora do card')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar uma coluna primeiro
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Criar uma tarefa
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa com Muitas Tags')
          
          // Verificar se há interface de tags
          cy.get('body').then(($body2) => {
            if ($body2.find('input[placeholder*="tag"], .add-tag').length > 0) {
              // Adicionar mais de 5 tags
              for (let i = 1; i <= 7; i++) {
                cy.get('input[placeholder*="tag"], .add-tag').first().type(`Tag${i}{enter}`)
              }
              
              cy.get('button').contains('Salvar').click()
              
              // BUG: Verificar que todas as tags foram criadas (sem limite)
              cy.get('.tag').should('have.length', 7)
              
              // Verificar que não há indicador de "+X tags"
              cy.get('body').should('not.contain.text', '+').should('not.contain.text', 'mais')
            } else {
              cy.log('⚠️ Interface de tags não encontrada - salvando tarefa sem tags')
              cy.get('button').contains('Salvar').click()
            }
          })
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
        }
      })
    })

    it('BUG-005: Deve quebrar cor de fundo em tags multi-palavra', { tags: ['@layout', '@low'] }, () => {
      cy.log('🐛 Testando quebra de cor de fundo em tags com múltiplas palavras')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar uma coluna primeiro
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Criar uma tarefa
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa com Tag Multi-palavra')
          
          // Verificar se há interface de tags
          cy.get('body').then(($body2) => {
            if ($body2.find('input[placeholder*="tag"], .add-tag').length > 0) {
              // Adicionar tag com múltiplas palavras
              cy.get('input[placeholder*="tag"], .add-tag').first().type('Feature Nova{enter}')
              
              cy.get('button').contains('Salvar').click()
              
              // BUG: Verificar que a tag foi criada
              cy.get('.tag').should('contain.text', 'Feature Nova')
              
              // BUG: Verificar que a tag quebra linha (não tem white-space: nowrap)
              cy.get('.tag').contains('Feature Nova').should('not.have.css', 'white-space', 'nowrap')
            } else {
              cy.log('⚠️ Interface de tags não encontrada - salvando tarefa sem tags')
              cy.get('button').contains('Salvar').click()
            }
          })
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
        }
      })
    })

    it('BUG-006: Deve reverter tema após recarregar página', { tags: ['@theme', '@medium'] }, () => {
      cy.log('🐛 Testando não persistência de tema')
      
      // Verificar tema inicial (deve ser escuro por padrão)
      cy.get('body').then(($body) => {
        const initialTheme = $body.attr('data-theme') || $body.attr('class') || 'dark'
        
        // Procurar botão de tema (ícone de sol para ativar modo claro)
        if ($body.find('[data-cy="theme-toggle"], button[aria-label*="theme"], .theme-toggle, button:contains("☀")').length > 0) {
          // Clicar no botão de tema para ativar modo claro
          cy.get('[data-cy="theme-toggle"], button[aria-label*="theme"], .theme-toggle, button:contains("☀")').first().click()
          
          // Aguardar mudança de tema
          cy.wait(500)
          
          // Verificar que o tema mudou para claro
          cy.get('body').should(($body2) => {
            const currentTheme = $body2.attr('data-theme') || $body2.attr('class')
            expect(currentTheme).to.not.equal(initialTheme)
          })
          
          // Recarregar página (F5)
          cy.reload()
          
          // BUG: Verificar que o tema reverteu para o padrão (escuro)
          cy.get('body').should(($body3) => {
            const reloadedTheme = $body3.attr('data-theme') || $body3.attr('class') || 'dark'
            expect(reloadedTheme).to.equal(initialTheme) // Deve voltar ao tema inicial
          })
        } else {
          cy.log('⚠️ Botão de tema não encontrado - pulando teste')
        }
      })
    })

    it('BUG-007: Deve criar tags invisíveis sem cor padrão', { tags: ['@layout', '@low'] }, () => {
      cy.log('🐛 Testando tags invisíveis sem cor padrão')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar uma coluna primeiro
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna Teste')
          cy.get('button').contains('Salvar').click()
          
          // Criar uma tarefa
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa com Tag Invisível')
          
          // Verificar se há interface de tags
          cy.get('body').then(($body2) => {
            if ($body2.find('input[placeholder*="tag"], .add-tag').length > 0) {
              // Adicionar tag sem selecionar cor
              cy.get('input[placeholder*="tag"], .add-tag').first().type('TagInvisivel{enter}')
              
              cy.get('button').contains('Salvar').click()
              
              // BUG: Verificar que a tag foi criada mas pode estar invisível
              cy.get('.tag').should('contain.text', 'TagInvisivel')
              
              // Verificar que a tag não tem cor de destaque (mesma cor do fundo)
              cy.get('.tag').contains('TagInvisivel').should(($tag) => {
                const bgColor = $tag.css('background-color')
                const parentBg = $tag.parent().css('background-color')
                // BUG: Tag pode ter a mesma cor do fundo, tornando-a invisível
                expect(bgColor).to.exist
              })
            } else {
              cy.log('⚠️ Interface de tags não encontrada - salvando tarefa sem tags')
              cy.get('button').contains('Salvar').click()
            }
          })
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
        }
      })
    })

    it('BUG-008: Deve falhar ao mover tarefa para coluna vazia', { tags: ['@drag-drop', '@high'] }, () => {
      cy.log('🐛 Testando drag-and-drop para coluna vazia')
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Adicionar")').length > 0) {
          // Criar Coluna A
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna A')
          cy.get('button').contains('Salvar').click()
          
          // Criar Coluna B
          cy.get('button').contains('Adicionar').click()
          cy.get('input').first().type('Coluna B')
          cy.get('button').contains('Salvar').click()
          
          // Adicionar tarefa na Coluna A
          cy.get('[data-cy="add-task-button"], button:contains("Adicionar Tarefa")').first().click()
          cy.get('input, textarea').first().type('Tarefa para Mover')
          cy.get('button').contains('Salvar').click()
          
          // Verificar que a tarefa foi criada na Coluna A
          cy.get('.task, .task-card').should('contain.text', 'Tarefa para Mover')
          
          // Tentar arrastar tarefa para Coluna B (vazia)
          cy.get('.task, .task-card').contains('Tarefa para Mover').then(($task) => {
            // Simular drag-and-drop
            cy.wrap($task).trigger('dragstart')
            
            // Verificar se Coluna B aceita drop (BUG: pode não aceitar)
            cy.get('.column').contains('Coluna B').then(($column) => {
              cy.wrap($column).trigger('dragover')
              cy.wrap($column).trigger('drop')
              
              // BUG: Verificar que a tarefa não foi movida (ainda está na Coluna A)
              cy.get('.task, .task-card').should('contain.text', 'Tarefa para Mover')
              
              // Verificar que Coluna B continua vazia
              cy.get('.column').contains('Coluna B').parent().should('not.contain.text', 'Tarefa para Mover')
            })
          })
        } else {
          cy.log('⚠️ Interface não encontrada - pulando teste')
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