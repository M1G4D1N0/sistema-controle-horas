# Changelog

Todas as mudanças importantes neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2025-07-11

### Adicionado
- Suporte para semana completa (segunda a domingo - 7 dias)
- Numeração de semanas ISO 8601 sincronizada com sites brasileiros
- Detecção automática de nova semana toda segunda-feira  
- Exportação em formato PDF com design profissional
- Exportação em formato PNG de alta qualidade
- Logotipo organizacional SVG customizado
- Templates de documento profissional para exportação
- Detecção automática do mês atual
- Cálculo automático do número da semana
- Sistema de notificação para nova semana
- Função de debug para verificar cálculos ISO 8601

### Modificado
- Migração de localStorage para banco PostgreSQL
- Interface atualizada com informações de mês e semana
- Todos os formatos de exportação agora incluem semana completa
- Modal de exportação com 6 opções (JSON, CSV, HTML, TXT, PDF, PNG)
- Cabeçalho da aplicação com informações detalhadas da semana
- Documentação completa do projeto no replit.md

### Melhorado
- Performance na geração de relatórios
- Qualidade visual dos documentos exportados
- Consistência na numeração de semanas
- Responsividade da interface

### Corrigido
- Cálculo incorreto do número da semana
- Problemas de sincronização com calendários brasileiros
- Exportação incompleta de dados da semana

## [1.0.0] - 2025-07-10

### Adicionado
- Sistema básico de controle de horas trabalhadas
- Semana de segunda a sexta-feira
- Cálculo automático de valores (R$ 50,00 e R$ 25,00)
- Exportação em JSON, CSV, HTML e TXT
- Interface responsiva com Bootstrap
- Persistência em localStorage
- Resumo semanal com contadores
- Função de reset semanal
- Notificações de sucesso
- Modal de exportação com múltiplas opções

### Recursos Iniciais
- Geração automática de datas da semana
- Formatação brasileira de datas e moeda
- Tabela interativa com checkboxes
- Cálculo em tempo real dos valores
- Interface moderna com ícones Font Awesome