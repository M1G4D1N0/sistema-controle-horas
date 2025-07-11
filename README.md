# Sistema de Controle de Horas Trabalhadas

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)

Sistema web completo para controle de horas trabalhadas com suporte a banco de dados PostgreSQL, múltiplos formatos de exportação e numeração de semanas ISO 8601.

## 🚀 Funcionalidades

- **Controle Semanal**: Registro de horas trabalhadas de segunda a domingo
- **Cálculo Automático**: Valores calculados automaticamente (R$ 50,00 dia completo, R$ 25,00 meio período)
- **Numeração ISO 8601**: Semanas numeradas conforme padrão internacional
- **Atualização Automática**: Detecção automática de nova semana toda segunda-feira
- **Persistência de Dados**: Banco PostgreSQL com fallback para localStorage
- **Múltiplos Formatos de Exportação**:
  - JSON (estruturado)
  - CSV (planilhas)
  - HTML (impressão)
  - TXT (texto simples)
  - PDF (documento profissional)
  - PNG (imagem alta qualidade)

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.1.3
- Font Awesome 6.0.0
- jsPDF (exportação PDF)
- html2canvas (exportação PNG)

### Backend
- Node.js + Express.js
- PostgreSQL (Neon Serverless)
- Drizzle ORM
- dotenv para variáveis de ambiente

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/sistema-controle-horas.git
cd sistema-controle-horas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=sua_url_do_postgresql
PORT=5000
```

### 4. Execute as migrações do banco
```bash
npm run db:push
```

### 5. Inicie o servidor
```bash
npm start
```

O sistema estará disponível em `http://localhost:5000`

## 🎯 Como Usar

1. **Registro de Horas**: Marque os checkboxes para dias completos ou meio período
2. **Visualização**: Acompanhe o resumo semanal na lateral direita
3. **Exportação**: Use o botão "Exportar Dados" para gerar relatórios
4. **Reset**: Use "Resetar Semana" para limpar os dados atuais

## 📊 Estrutura do Projeto

```
sistema-controle-horas/
├── server/
│   ├── api.ts          # Endpoints da API
│   ├── db.ts           # Configuração do banco
│   ├── storage.ts      # Camada de persistência
│   └── main.js         # Servidor principal
├── shared/
│   └── schema.ts       # Schema do banco (Drizzle)
├── index.html          # Interface principal
├── script.js           # Lógica do frontend
├── styles.css          # Estilos customizados
├── server.js           # Servidor Express
└── package.json        # Dependências
```

## 🗄️ Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas:

- **users**: Usuários do sistema
- **timesheet_entries**: Registros de horas trabalhadas
- **weekly_summaries**: Resumos semanais

## 🔧 Configuração para Produção

### Variáveis de Ambiente
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
```

### Deploy no Replit
1. Importe o projeto no Replit
2. Configure as variáveis de ambiente
3. O sistema será executado automaticamente

## 📈 Funcionalidades Avançadas

### Numeração ISO 8601
- Semanas numeradas conforme padrão internacional
- Semana 1 = primeira semana com quinta-feira do ano
- Consistente com sites de calendário brasileiros

### Exportação Profissional
- Documentos PDF com logotipo organizacional
- Layout responsivo para impressão
- Imagens PNG de alta qualidade

### Detecção Automática
- Verificação de nova semana a cada hora
- Notificação automática nas segundas-feiras
- Limpeza automática de dados antigos

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/seu-usuario/sistema-controle-horas/issues)
- Consulte a [documentação](https://github.com/seu-usuario/sistema-controle-horas/wiki)

## 🏆 Créditos

Desenvolvido com ❤️ usando tecnologias modernas para controle eficiente de horas trabalhadas.

---

**Versão**: 2.0.0  
**Última Atualização**: Julho 2025