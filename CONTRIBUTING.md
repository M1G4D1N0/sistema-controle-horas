# Contribuindo para o Sistema de Controle de Horas Trabalhadas

Obrigado por seu interesse em contribuir! Este documento fornece diretrizes para contribuições.

## 🚀 Como Contribuir

### 1. Configuração do Ambiente de Desenvolvimento

```bash
# Fork e clone o repositório
git clone https://github.com/seu-usuario/sistema-controle-horas.git
cd sistema-controle-horas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações
npm run db:push

# Inicie o servidor de desenvolvimento
npm start
```

### 2. Estrutura de Branches

- `main`: Branch principal (production-ready)
- `develop`: Branch de desenvolvimento
- `feature/*`: Novas funcionalidades
- `bugfix/*`: Correções de bugs
- `hotfix/*`: Correções urgentes

### 3. Padrões de Código

#### JavaScript
- Use ES6+ sempre que possível
- Prefira `const` e `let` ao invés de `var`
- Mantenha funções pequenas e focadas
- Use nomes descritivos para variáveis e funções

#### HTML/CSS
- Use Bootstrap classes quando possível
- Mantenha HTML semântico
- Use CSS custom properties para temas

#### Backend
- Use TypeScript para novos arquivos
- Mantenha separação clara entre camadas
- Use Drizzle ORM para queries de banco

### 4. Processo de Desenvolvimento

1. **Criar uma Branch**
```bash
git checkout -b feature/nova-funcionalidade
```

2. **Fazer Commits Descritivos**
```bash
git commit -m "feat: adiciona exportação em Excel"
git commit -m "fix: corrige cálculo de semana ISO 8601"
git commit -m "docs: atualiza README com novas funcionalidades"
```

3. **Testar Localmente**
```bash
npm test
npm run lint
```

4. **Abrir Pull Request**
- Descreva as mudanças claramente
- Inclua screenshots se aplicável
- Referencie issues relacionadas

### 5. Padrões de Commit

Use o formato [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação de código
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

### 6. Diretrizes de Código

#### Frontend (JavaScript)
```javascript
// ✅ Bom
const calculateWeeklyTotal = (entries) => {
  return entries.reduce((total, entry) => total + entry.value, 0);
};

// ❌ Evitar
function calc(e) {
  let t = 0;
  for(let i = 0; i < e.length; i++) {
    t += e[i].value;
  }
  return t;
}
```

#### Backend (TypeScript)
```typescript
// ✅ Bom
interface TimesheetEntry {
  id: number;
  date: string;
  fullDay: boolean;
  halfDay: boolean;
  value: number;
}

// ❌ Evitar
const createEntry = (data: any) => {
  // ...
};
```

### 7. Testes

#### Testes Unitários
```javascript
// Exemplo de teste
describe('calculateWeeklyTotal', () => {
  it('should calculate total correctly', () => {
    const entries = [
      { value: 50 },
      { value: 25 },
      { value: 50 }
    ];
    expect(calculateWeeklyTotal(entries)).toBe(125);
  });
});
```

#### Testes de Integração
- Teste endpoints da API
- Teste fluxos completos
- Teste exportação de dados

### 8. Documentação

- Atualize README.md para novas funcionalidades
- Documente APIs no código
- Mantenha CHANGELOG.md atualizado
- Adicione exemplos de uso

### 9. Revisão de Código

Antes de submeter:
- [ ] Código segue os padrões estabelecidos
- [ ] Testes passam
- [ ] Documentação está atualizada
- [ ] Funcionalidade foi testada manualmente
- [ ] Não há console.log ou comentários desnecessários

### 10. Tipos de Contribuição

#### 🐛 Reportar Bugs
- Use o template de issue
- Inclua passos para reproduzir
- Descreva comportamento esperado vs atual
- Inclua screenshots/logs se aplicável

#### 💡 Sugerir Funcionalidades
- Descreva o problema que resolve
- Explique a solução proposta
- Considere alternativas
- Avalie impacto na performance

#### 📚 Melhorar Documentação
- Corrija erros de português
- Adicione exemplos práticos
- Melhore clareza das instruções
- Atualize informações obsoletas

### 11. Configuração do Banco de Dados

Para desenvolvimento local:
```bash
# Usando Docker
docker run --name postgres-timesheet \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=timesheet \
  -p 5432:5432 \
  -d postgres:13

# Ou configure um banco PostgreSQL local
```

### 12. Ambiente de Produção

- Use variáveis de ambiente para configuração
- Nunca commite credenciais
- Teste em ambiente similar à produção
- Monitore performance

### 13. Recursos Úteis

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [ISO 8601 Week Numbering](https://en.wikipedia.org/wiki/ISO_week_date)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 📞 Contato

- Issues: Para bugs e sugestões
- Discussions: Para dúvidas gerais
- Email: Para questões sensíveis

Agradecemos sua contribuição! 🎉