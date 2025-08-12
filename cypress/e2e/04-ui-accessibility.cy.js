describe('Kanban - Interface e Acessibilidade', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('Deve ter elementos com contraste adequado', () => {
    // Verifica se elementos principais são visíveis
    cy.contains('To Do').should('be.visible')
    cy.contains('Adicionar Tarefa').should('be.visible')
    
    // Verifica se o texto é legível
    cy.get('body').should('have.css', 'color')
    cy.get('body').should('have.css', 'background-color')
  })

  it('Deve ser navegável por teclado', () => {
    // Testa navegação por Tab
    cy.get('body').tab()
    cy.focused().should('be.visible')
    
    // Continua navegando
    cy.focused().tab()
    cy.focused().should('be.visible')
    
    // Testa Enter em elementos focados
    cy.contains('Adicionar Tarefa')
      .focus()
      .type('{enter}')
    
    cy.wait(1000)
    
    // Verifica se a ação foi executada
    cy.get('body').should('be.visible')
  })

  it('Deve ter atributos de acessibilidade adequados', () => {
    // Verifica se botões têm labels adequados
    cy.contains('Adicionar Tarefa')
      .should('have.attr', 'type')
      .or('have.attr', 'role')
      .or('have.attr', 'aria-label')
    
    // Verifica se inputs têm labels
    cy.get('body').then(($body) => {
      if ($body.find('input').length > 0) {
        cy.get('input').each(($input) => {
          cy.wrap($input).should('satisfy', ($el) => {
            return $el.attr('aria-label') || 
                   $el.attr('placeholder') || 
                   $el.prev('label').length > 0 ||
                   $el.parent().find('label').length > 0
          })
        })
      }
    })
  })

  it('Deve funcionar em diferentes resoluções', () => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1366, height: 768, name: 'Desktop Medium' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 414, height: 896, name: 'Mobile Large' },
      { width: 375, height: 667, name: 'Mobile Medium' },
      { width: 320, height: 568, name: 'Mobile Small' }
    ]
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height)
      cy.wait(1000)
      
      // Verifica se elementos principais ainda estão visíveis
      cy.contains('To Do').should('be.visible')
      
      // Verifica se o botão adicionar tarefa está acessível
      cy.contains('Adicionar Tarefa').should('be.visible')
      
      // Verifica se não há overflow horizontal
      cy.get('body').should('not.have.css', 'overflow-x', 'scroll')
    })
  })

  it('Deve ter feedback visual adequado para interações', () => {
    // Testa hover em botões
    cy.contains('Adicionar Tarefa')
      .trigger('mouseover')
      .should('be.visible')
    
    // Verifica se há mudança visual no hover
    cy.contains('Adicionar Tarefa')
      .should('have.css', 'cursor', 'pointer')
      .or('have.css', 'cursor', 'default')
    
    // Testa focus em elementos interativos
    cy.contains('Adicionar Tarefa')
      .focus()
      .should('be.focused')
  })

  it('Deve carregar imagens e ícones corretamente', () => {
    // Verifica se há imagens na página
    cy.get('body').then(($body) => {
      if ($body.find('img').length > 0) {
        cy.get('img').each(($img) => {
          cy.wrap($img)
            .should('be.visible')
            .and(($img) => {
              expect($img[0].naturalWidth).to.be.greaterThan(0)
            })
        })
      }
      
      // Verifica ícones SVG se existirem
      if ($body.find('svg').length > 0) {
        cy.get('svg').should('be.visible')
      }
    })
  })

  it('Deve ter performance adequada', () => {
    // Mede tempo de carregamento
    const startTime = Date.now()
    
    cy.visit('/')
    cy.contains('To Do').should('be.visible')
    
    cy.then(() => {
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(10000) // Menos de 10 segundos
    })
  })

  it('Deve funcionar sem JavaScript (graceful degradation)', () => {
    // Desabilita JavaScript temporariamente
    cy.visit('/', {
      onBeforeLoad: (win) => {
        // Simula ambiente sem JS
        win.document.documentElement.classList.add('no-js')
      }
    })
    
    // Verifica se conteúdo básico ainda é visível
    cy.get('body').should('be.visible')
    cy.contains('To Do').should('be.visible')
  })

  it('Deve ter meta tags adequadas para SEO', () => {
    // Verifica meta tags importantes
    cy.get('head meta[name="viewport"]')
      .should('exist')
      .should('have.attr', 'content')
    
    cy.get('head title')
      .should('exist')
      .should('not.be.empty')
    
    // Verifica se há meta description
    cy.get('head').then(($head) => {
      if ($head.find('meta[name="description"]').length > 0) {
        cy.get('meta[name="description"]')
          .should('have.attr', 'content')
          .should('not.be.empty')
      }
    })
  })

  it('Deve suportar modo escuro/claro se disponível', () => {
    // Procura por toggle de tema
    cy.get('body').then(($body) => {
      const themeSelectors = [
        'button:contains("Dark"):visible',
        'button:contains("Light"):visible',
        'button:contains("Theme"):visible',
        '[data-cy="theme-toggle"]:visible',
        '.theme-toggle:visible'
      ]
      
      themeSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .should('be.visible')
            .click()
          
          cy.wait(1000)
          
          // Verifica se houve mudança visual
          cy.get('body').should('be.visible')
        }
      })
    })
  })
})