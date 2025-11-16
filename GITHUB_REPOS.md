# 📚 Sistema de Importação de Repositórios GitHub

## 🎯 Como Funciona

O sistema carrega automaticamente seus repositórios públicos do GitHub e os exibe na seção "Outros Projetos" do portfolio.

## ⚙️ Configuração

### Arquivo: `assets/js/github-repos.js`

```javascript
new GitHubReposLoader('marcosferreira', 'github-repos-container', {
  exclude: [
    'marcosferreira.github.io',
    'netflix-web',
    'nnlanches-web'
  ],
  maxRepos: 6,
  sortBy: 'updated',
  showForks: false
})
```

### Opções Disponíveis

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `exclude` | Array | `[]` | Lista de repositórios para excluir |
| `maxRepos` | Number | `6` | Número máximo de repositórios a exibir |
| `sortBy` | String | `'updated'` | Ordenação: `'updated'`, `'stars'`, `'created'` |
| `showForks` | Boolean | `false` | Mostrar repositórios que são forks |

## 🎨 Informações Exibidas

Para cada repositório, o card mostra:
- ✅ Nome do repositório (link para GitHub)
- ✅ Descrição
- ✅ Linguagem principal (com cor)
- ✅ Número de stars (se > 0)
- ✅ Número de forks (se > 0)
- ✅ Data de última atualização
- ✅ Link para repositório
- ✅ Link para demo (se configurado no GitHub)

## 🚀 Como Adicionar Demo aos Repositórios

1. Vá no repositório no GitHub
2. Clique em ⚙️ Settings
3. Na seção "About", adicione a URL no campo "Website"
4. O botão "Demo" aparecerá automaticamente no card

## 🎨 Personalização

### Excluir Repositórios Específicos

Adicione o nome do repo no array `exclude`:

```javascript
exclude: [
  'marcosferreira.github.io',
  'repo-privado',
  'teste-123'
]
```

### Alterar Número de Repositórios

```javascript
maxRepos: 9  // Mostra 9 repos (3x3 grid)
```

### Ordenar por Estrelas

```javascript
sortBy: 'stars'  // Mostra os mais populares primeiro
```

### Mostrar Forks

```javascript
showForks: true  // Inclui repos que você fez fork
```

## 🌈 Cores de Linguagens

O sistema usa cores oficiais do GitHub para cada linguagem:
- JavaScript: Amarelo (#f1e05a)
- TypeScript: Azul (#3178c6)
- Python: Azul escuro (#3572a5)
- HTML: Laranja (#e34c26)
- CSS: Azul (#1572b6)
- PHP: Roxo (#777bb4)
- Dart: Azul claro (#00b4ab)
- E mais...

## 📊 Limites da API

- **Sem autenticação**: 60 requisições/hora por IP
- **Com autenticação**: 5000 requisições/hora

Para a maioria dos casos, 60/hora é suficiente pois o site só faz 1 requisição quando carrega.

## 🔧 Solução de Problemas

### Repositórios não aparecem

1. Verifique se os repos são **públicos**
2. Certifique-se que têm **descrição**
3. Verifique se não estão na lista `exclude`

### Erro de carregamento

- Aguarde alguns minutos (pode ter atingido o limite da API)
- Verifique o console do navegador (F12)
- Teste o link manualmente: `https://api.github.com/users/marcosferreira/repos`

### Customizar aparência dos cards

Edite os estilos em `assets/css/styles.css` na seção Box Components.

## 💡 Dicas

1. **Projetos Destacados**: Use o HTML estático (atual) para projetos principais
2. **Outros Projetos**: Deixe carregar automaticamente do GitHub
3. **Descrições**: Sempre adicione descrições nos repositórios GitHub
4. **Homepage**: Configure URLs de demo nos settings do repo
5. **Topics**: Adicione topics nos repos para melhor organização

## 🔄 Atualização

O sistema busca automaticamente sempre que alguém acessa o site. Não precisa fazer deploy novamente quando adicionar novos repositórios no GitHub!
