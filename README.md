# Kanban E2E Tests - Desafio Técnico

## 📋 Descrição

Este projeto contém testes end-to-end automatizados para o sistema Kanban hospedado em `https://kanban-dusky-five.vercel.app/` usando o framework Cypress.

## 🚀 Tecnologias Utilizadas

- **Cypress**: Framework de testes end-to-end
- **@cypress/grep**: Plugin para filtrar e organizar testes
- **JavaScript**: Linguagem de programação
- **Node.js**: Ambiente de execução
- **HTML/CSS**: Para geração de relatórios customizados

## 📁 Estrutura do Projeto

```
desafio_tecnico/
├── cypress/
│   ├── e2e/
│   │   ├── 00-example-test.cy.js           # Teste de exemplo
│   │   ├── 01-basic-functionality.cy.js    # Testes de funcionalidades básicas
│   │   ├── 02-add-task.cy.js               # Testes de adição de tarefas
│   │   ├── 03-task-management.cy.js        # Testes de gerenciamento de tarefas
│   │   ├── 04-ui-accessibility.cy.js       # Testes de UI e acessibilidade
│   │   ├── 05-error-handling.cy.js         # Testes de tratamento de erros
│   │   └── 06-bug-validation.cy.js         # Validação de bugs reportados
│   ├── plugins/
│   │   └── index.js                       # Plugin para geração de relatórios
│   ├── support/
│   │   ├── commands.js                     # Comandos customizados
│   │   ├── e2e.js                         # Configurações globais
│   │   └── reporter.js                    # Gerador de relatórios customizado
│   ├── screenshots/                       # Screenshots de falhas
│   └── videos/                           # Vídeos de execução
├── scripts/
│   └── generate-report.js                 # Script para geração manual de relatórios
├── reports/                               # Relatórios gerados (HTML/JSON)
├── cypress.config.js                       # Configuração do Cypress
├── package.json                           # Dependências do projeto
├── README.md                              # Documentação principal
├── RELATORIOS.md                          # Documentação específica de relatórios
├── BUG-VALIDATION.md                      # Documentação de validação de bugs
└── .gitignore                             # Arquivos ignorados pelo Git
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd desafio_tecnico
   ```

2. **Configure o PowerShell (Windows)**
   Se você estiver no Windows e encontrar erros de política de execução:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Verifique a instalação**
   ```bash
   npx cypress verify
   ```

## 🧪 Executando os Testes

### Modo Interativo (Cypress GUI)

```bash
npm run cypress:open
```

Este comando abre a interface gráfica do Cypress onde você pode:
- Visualizar todos os testes disponíveis
- Executar testes individuais
- Ver a execução em tempo real
- Debuggar problemas

### Modo Headless (Linha de Comando)

```bash
# Executa todos os testes
npm test

# Executa com interface gráfica (headed)
npm run test:headed

# Executa no Chrome
npm run test:chrome

# Executa no Firefox
npm run test:firefox

# Executa testes por categoria
npm run test:basic      # Apenas testes básicos
npm run test:tasks      # Apenas testes de tarefas
npm run test:ui         # Apenas testes de UI
npm run test:errors     # Apenas testes de erro
npm run test:bugs       # Validação de bugs reportados
npm run test:security   # Apenas testes de segurança
npm run test:regression # Testes de regressão

# Executa testes e gera relatório
npm run test:report

# Abre o último relatório gerado
npm run test:report:open
```

### Geração de Relatórios

```bash
# Gera relatório dos últimos resultados
npm run report:generate

# Abre o relatório no navegador
npm run report:open

# Gera e abre relatório automaticamente
node scripts/generate-report.js
```

## 📊 Cobertura de Testes

### 1. Funcionalidades Básicas (`01-basic-functionality.cy.js`)
- ✅ Carregamento da página principal
- ✅ Exibição das colunas do Kanban
- ✅ Visualização de tarefas existentes
- ✅ Presença do botão "Adicionar Tarefa"
- ✅ Responsividade em diferentes dispositivos
- ✅ Verificação de erros de console

### 2. Adição de Tarefas (`02-add-task.cy.js`)
- ✅ Abertura do modal/formulário de nova tarefa
- ✅ Digitação no campo de texto
- ✅ Adição de nova tarefa com sucesso
- ✅ Validação de campos obrigatórios
- ✅ Cancelamento da adição de tarefa

### 3. Gerenciamento de Tarefas (`03-task-management.cy.js`)
- ✅ Visualização de detalhes de tarefa
- ✅ Edição de tarefas existentes
- ✅ Drag and drop entre colunas
- ✅ Deleção de tarefas
- ✅ Filtros por status/coluna
- ✅ Busca de tarefas por texto

### 4. Interface e Acessibilidade (`04-ui-accessibility.cy.js`)
- ✅ Contraste adequado de elementos
- ✅ Navegação por teclado
- ✅ Atributos de acessibilidade
- ✅ Responsividade em múltiplas resoluções
- ✅ Feedback visual para interações
- ✅ Carregamento de imagens e ícones
- ✅ Performance de carregamento
- ✅ Meta tags para SEO

### 5. Tratamento de Erros (`05-error-handling.cy.js`)
- ✅ Comportamento com conexão lenta
- ✅ Tratamento de erros de API
- ✅ Validação contra inputs maliciosos
- ✅ Limitação de inputs extremamente longos
- ✅ Funcionamento sem JavaScript
- ✅ Detecção de vazamentos de memória
- ✅ Comportamento offline
- ✅ Redimensionamento extremo da janela

### 6. Validação de Bugs (`06-bug-validation.cy.js`)
- ✅ **Segurança**: Prevenção de XSS em títulos
- ✅ **Usabilidade**: Confirmação para exclusões
- ✅ **Usabilidade**: Feedback visual em drag-and-drop
- ✅ **Layout**: Truncamento de textos longos
- ✅ **Validação**: Prevenção de nomes vazios/espaços
- ✅ **Validação**: Tags duplicadas (case-insensitive)
- ✅ **Layout**: Gerenciamento de overflow de tags
- ✅ **Layout**: Aplicação correta de estilos em tags

## 🎯 Comandos Customizados

O projeto inclui comandos customizados para facilitar a escrita de testes:

```javascript
// Adicionar uma nova tarefa
cy.addTask('Título da tarefa')

// Verificar se uma tarefa existe
cy.verifyTaskExists('Título da tarefa')

// Mover tarefa entre colunas
cy.moveTask('Título da tarefa', 'Coluna destino')

// Deletar uma tarefa
cy.deleteTask('Título da tarefa')

// Aguardar carregamento da página
cy.waitForPageLoad()

// Verificar responsividade
cy.checkResponsiveness()
```

## ⚙️ Configurações

### Cypress Configuration (`cypress.config.js`)

- **Base URL**: `https://kanban-dusky-five.vercel.app`
- **Viewport**: 1280x720 (padrão)
- **Timeouts**: 10s para comandos, 30s para carregamento
- **Retries**: 2 tentativas em modo de execução
- **Vídeos**: Habilitados para falhas
- **Screenshots**: Habilitados para falhas

## 🐛 Problemas Conhecidos e Soluções

### Problemas de Instalação

#### Erro de Política de Execução (Windows)
```
UnauthorizedAccess: Execution of scripts is disabled on this system
```
**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Problemas de Dependências
Se `npm install` falhar:
1. Limpe o cache: `npm cache clean --force`
2. Delete `node_modules` e `package-lock.json`
3. Execute `npm install` novamente

### Problemas de Execução

#### Timeouts
Se os testes falharem por timeout, você pode:
1. Aumentar os timeouts no `cypress.config.js`
2. Adicionar `cy.wait()` estratégicos nos testes
3. Verificar a conexão com a internet
4. Usar `cy.intercept()` para aguardar requisições específicas

#### Elementos não encontrados
Se elementos não forem encontrados:
1. Verifique se o site está acessível
2. Atualize os seletores nos testes
3. Use seletores mais robustos (data-cy, IDs)
4. Aguarde elementos aparecerem: `cy.get('[data-cy=element]', { timeout: 10000 })`

#### Falhas intermitentes
Para falhas esporádicas:
1. Use o sistema de retry configurado
2. Adicione waits antes de interações
3. Verifique se elementos estão visíveis antes de interagir
4. Use `cy.should('be.visible')` antes de clicar

### Problemas de Relatórios

#### Relatórios não são gerados
1. Verifique se a pasta `reports/` existe
2. Execute `node scripts/generate-report.js` manualmente
3. Verifique permissões de escrita na pasta

#### Relatório não abre automaticamente
1. Abra manualmente: `reports/cypress-report.html`
2. Verifique se o navegador padrão está configurado
3. Use `npm run report:open` para abrir manualmente

## 📈 Relatórios

### Relatórios Automáticos

O projeto inclui um sistema completo de geração de relatórios:

#### Tipos de Relatórios Gerados:

1. **Relatório HTML** (`reports/cypress-report.html`)
   - Interface visual moderna e responsiva
   - Gráficos de pizza para visualização de resultados
   - Detalhes completos de cada teste
   - Métricas de performance e duração
   - Screenshots de falhas integradas

2. **Relatório JSON** (`reports/cypress-results.json`)
   - Dados estruturados para integração
   - Informações detalhadas de cada spec
   - Métricas de tempo e performance
   - Ideal para CI/CD e automação

3. **Relatório Console**
   - Resumo imediato após execução
   - Taxa de sucesso e estatísticas
   - Tempo total de execução

#### Localização dos Arquivos:

- **Relatórios**: `reports/` (HTML e JSON)
- **Vídeos**: `cypress/videos/` (execuções completas)
- **Screenshots**: `cypress/screenshots/` (falhas)
- **Logs**: Terminal durante execução

#### Funcionalidades dos Relatórios:

- ✅ Geração automática após cada execução
- ✅ Abertura automática no navegador
- ✅ Histórico de execuções
- ✅ Métricas detalhadas de performance
- ✅ Integração com screenshots e vídeos
- ✅ Suporte a múltiplos formatos
- ✅ Compatível com CI/CD

Para mais detalhes sobre relatórios, consulte o arquivo `RELATORIOS.md`.

## 🔧 Manutenção

### Atualizando Testes

1. **Novos elementos**: Adicione novos seletores em `commands.js`
2. **Novas funcionalidades**: Crie novos arquivos de teste
3. **Mudanças na UI**: Atualize os seletores existentes

### Boas Práticas

- Use `data-cy` attributes quando possível
- Evite seletores baseados em texto que pode mudar
- Mantenha testes independentes entre si
- Use comandos customizados para ações repetitivas
- Documente mudanças significativas

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação oficial do Cypress
2. Consulte os logs de erro detalhados
3. Execute testes individuais para isolar problemas
4. Verifique se o site de destino está funcionando

## 📝 Notas Importantes

- Os testes são executados contra um ambiente de produção
- Alguns testes podem falhar se a aplicação não implementar certas funcionalidades
- Os testes são projetados para serem robustos e adaptativos
- Falhas podem indicar problemas reais na aplicação testada

---

**Desenvolvido para o Desafio Técnico - Automação de Testes E2E**