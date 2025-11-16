/**
 * GitHub Repositories Loader
 * Carrega e exibe repositórios automaticamente do GitHub
 */

class GitHubReposLoader {
  constructor(username, containerId, options = {}) {
    this.username = username;
    this.container = document.getElementById(containerId);
    this.options = {
      exclude: options.exclude || [], // Repos para excluir
      maxRepos: options.maxRepos || 6,
      sortBy: options.sortBy || 'created', // 'updated', 'stars', 'created'
      showForks: options.showForks || false,
      includeOrgs: options.includeOrgs !== undefined ? options.includeOrgs : true,
      ...options
    };
  }

  async fetchUserOrgs() {
    try {
      const response = await fetch(`https://api.github.com/users/${this.username}/orgs`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar organizações:', error);
      return [];
    }
  }

  async fetchOrgRepos(orgName) {
    try {
      const response = await fetch(
        `https://api.github.com/orgs/${orgName}/repos?per_page=100`
      );
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar repos da org ${orgName}:`, error);
      return [];
    }
  }

  async fetchRepositories() {
    try {
      // Buscar repos do usuário
      const userReposResponse = await fetch(
        `https://api.github.com/users/${this.username}/repos?per_page=100&sort=${this.options.sortBy}`
      );

      if (!userReposResponse.ok) {
        throw new Error(`GitHub API error: ${userReposResponse.status}`);
      }

      let allRepos = await userReposResponse.json();
      console.log(`📦 Repositórios do usuário: ${allRepos.length}`);

      // Buscar repos das organizações
      if (this.options.includeOrgs) {
        const orgs = await this.fetchUserOrgs();
        console.log(`🏢 Organizações encontradas: ${orgs.length}`, orgs.map(o => o.login));
        
        for (const org of orgs) {
          const orgRepos = await this.fetchOrgRepos(org.login);
          console.log(`📦 Repositórios da org ${org.login}: ${orgRepos.length}`);
          
          // Filtrar apenas repos públicos da organização
          const publicOrgRepos = orgRepos.filter(repo => !repo.private);
          allRepos = allRepos.concat(publicOrgRepos);
        }
      }

      console.log(`📊 Total de repositórios antes do filtro: ${allRepos.length}`);
      const filtered = this.filterRepositories(allRepos);
      console.log(`✅ Repositórios após filtro: ${filtered.length}`);
      
      return filtered;
    } catch (error) {
      console.error('Erro ao buscar repositórios:', error);
      this.showError();
      return [];
    }
  }

  filterRepositories(repos) {
    const filtered = repos.filter(repo => {
      // Filtrar forks se não quiser mostrar
      if (!this.options.showForks && repo.fork) {
        console.log(`🚫 Excluído (fork): ${repo.name}`);
        return false;
      }
      
      // Excluir repositórios específicos
      if (this.options.exclude.includes(repo.name)) {
        console.log(`🚫 Excluído (lista exclude): ${repo.name}`);
        return false;
      }
      
      // Apenas repositórios públicos
      if (repo.private) {
        console.log(`🚫 Excluído (privado): ${repo.name}`);
        return false;
      }
      
      // Apenas com descrição
      if (!repo.description) {
        console.log(`🚫 Excluído (sem descrição): ${repo.name}`);
        return false;
      }
      
      console.log(`✅ Incluído: ${repo.name} (${repo.owner.login})`);
      return true;
    });

    // Ordenar por data de criação (mais recentes primeiro)
    const sorted = filtered.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return sorted.slice(0, this.options.maxRepos);
  }

  getLanguageColor(language) {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572a5',
      'Java': '#b07219',
      'HTML': '#e34c26',
      'CSS': '#1572b6',
      'PHP': '#777bb4',
      'Ruby': '#701516',
      'Go': '#00add8',
      'Rust': '#dea584',
      'C++': '#f34b7d',
      'C': '#555555',
      'Shell': '#89e051',
      'Dart': '#00b4ab',
      'Swift': '#ffac45',
      'Kotlin': '#A97BFF',
      'Vue': '#41b883',
      'React': '#61dafb',
      'Default': '#858585'
    };
    
    return colors[language] || colors['Default'];
  }

  createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'col-12 col-md-6 col-lg-4 mb-4';
    
    const createdDate = new Date(repo.created_at).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const isOrg = repo.owner.type === 'Organization';
    const ownerBadge = isOrg ? `
      <span class="Label Label--accent" style="background-color: #0969da; color: white; font-size: 11px;">
        <i class="bi bi-building mr-1"></i>${repo.owner.login}
      </span>
    ` : '';

    card.innerHTML = `
      <div class="Box height-full m-2 animate-on-scroll">
        <div class="Box-body">
          <div class="d-flex flex-items-center flex-justify-between mb-3">
            <i class="bi bi-folder color-fg-muted" style="font-size: 1.5rem;"></i>
            <div class="d-flex gap-2 flex-items-center">
              ${ownerBadge}
              ${repo.stargazers_count > 0 ? `
                <span class="d-flex flex-items-center color-fg-muted">
                  <i class="bi bi-star mr-1"></i>
                  <span class="f6">${repo.stargazers_count}</span>
                </span>
              ` : ''}
              ${repo.forks_count > 0 ? `
                <span class="d-flex flex-items-center color-fg-muted">
                  <i class="bi bi-diagram-3 mr-1"></i>
                  <span class="f6">${repo.forks_count}</span>
                </span>
              ` : ''}
            </div>
          </div>
          
          <h3 class="h4 mb-2">
            <a href="${repo.html_url}" target="_blank" class="Link--primary text-bold" rel="noopener noreferrer">
              ${repo.name}
            </a>
          </h3>
          
          <p class="f6 color-fg-muted mb-3" style="min-height: 2.8em;">
            ${repo.description || 'Sem descrição'}
          </p>
          
          <div class="d-flex flex-items-center flex-justify-between mt-auto">
            ${repo.language ? `
              <span class="d-flex flex-items-center">
                <span class="circle" style="width: 12px; height: 12px; background-color: ${this.getLanguageColor(repo.language)}; display: inline-block; margin-right: 6px;"></span>
                <span class="f6 color-fg-muted">${repo.language}</span>
              </span>
            ` : '<span></span>'}
            
            <span class="f6 color-fg-muted">
              <i class="bi bi-calendar-plus mr-1"></i>${createdDate}
            </span>
          </div>
        </div>
        
        <div class="Box-footer">
          <div class="d-flex flex-wrap gap-2">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
               class="btn btn-sm flex-1" aria-label="Ver repositório">
              <i class="bi bi-github mr-2"></i>Repositório
            </a>
            ${repo.homepage ? `
              <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" 
                 class="btn btn-sm btn-primary flex-1" aria-label="Ver demo">
                <i class="bi bi-box-arrow-up-right mr-2"></i>Demo
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    return card;
  }

  showError() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="col-12">
        <div class="Box p-4 text-center">
          <i class="bi bi-exclamation-triangle color-fg-attention mb-3" style="font-size: 3rem;"></i>
          <h3 class="h4 mb-2">Não foi possível carregar os repositórios</h3>
          <p class="color-fg-muted mb-3">Tente novamente mais tarde ou visite meu perfil no GitHub.</p>
          <a href="https://github.com/${this.username}" target="_blank" class="btn btn-primary">
            <i class="bi bi-github mr-2"></i>Ver no GitHub
          </a>
        </div>
      </div>
    `;
  }

  showLoading() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="col-12 text-center py-6">
        <div class="AnimatedEllipsis">Carregando repositórios</div>
      </div>
    `;
  }

  async render() {
    if (!this.container) {
      console.error(`Container #${this.containerId} não encontrado`);
      return;
    }

    this.showLoading();
    
    const repos = await this.fetchRepositories();
    
    if (repos.length === 0) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = '';
    
    repos.forEach((repo, index) => {
      const card = this.createRepoCard(repo);
      this.container.appendChild(card);
      
      // Adicionar animação escalonada
      setTimeout(() => {
        card.querySelector('.Box').classList.add('visible');
      }, index * 100);
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const githubRepos = new GitHubReposLoader('marcosferreira', 'github-repos-container', {
    exclude: [
      'marcosferreira.github.io', // Excluir o próprio portfolio
      'marcosferreira', // Excluir repo de perfil
      'netflix-web', // Já está nos projetos destacados
      'nnlanches-web' // Já está nos projetos destacados
    ],
    maxRepos: 6,
    sortBy: 'created', // Ordenar por data de criação
    showForks: false,
    includeOrgs: true // Incluir repositórios de organizações
  });

  // Renderizar os repositórios
  githubRepos.render();
});
