/**
 * Arquivo JavaScript principal do portfolio
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elementos da UI
  const scrollTopBtn = document.getElementById('scrollTop');
  const animateElements = document.querySelectorAll('section, .card');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  // Função para mostrar/esconder o botão de voltar ao topo
  function toggleScrollTopButton() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  // Efeito de animação ao rolar
  function handleScrollAnimations() {
    animateElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementBottom = el.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // Verificar se o elemento está visível na tela
      if (elementTop < windowHeight - 100 && elementBottom > 0) {
        el.classList.add('animate-on-scroll', 'visible');
      }
    });
  }

  // Atualizar nav-link ativo ao rolar
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Fechar navbar mobile ao clicar em link
  function setupNavbarMobile() {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      });
    });
  }

  // Adicionar a classe para habilitar as animações iniciais
  function initAnimations() {
    setTimeout(() => {
      handleScrollAnimations();
    }, 100);
  }

  // Event Listeners
  window.addEventListener('scroll', () => {
    toggleScrollTopButton();
    handleScrollAnimations();
    updateActiveNavLink();
  });

  // Inicialização
  toggleScrollTopButton();
  initAnimations();
  setupNavbarMobile();
});