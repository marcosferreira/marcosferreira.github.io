/**
 * Arquivo JavaScript principal do portfolio
 * Implementa animações modernas e interatividade
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elementos da UI
  const scrollTopBtn = document.getElementById('scrollTop');
  const animateElements = document.querySelectorAll('section, .card');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbar = document.querySelector('.navbar');
  
  // Contador de animação para delays escalonados
  let animationDelay = 0;

  // Função para mostrar/esconder o botão de voltar ao topo
  function toggleScrollTopButton() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  // Efeito de navbar ao rolar
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
      navbar.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    }
  }

  // Efeito de animação ao rolar com delays escalonados
  function handleScrollAnimations() {
    animateElements.forEach((el, index) => {
      const elementTop = el.getBoundingClientRect().top;
      const elementBottom = el.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // Verificar se o elemento está visível na tela
      if (elementTop < windowHeight - 100 && elementBottom > 0) {
        // Adicionar delay escalonado para cards dentro de uma seção
        if (el.classList.contains('card')) {
          setTimeout(() => {
            el.classList.add('animate-on-scroll', 'visible');
          }, index * 50);
        } else {
          el.classList.add('animate-on-scroll', 'visible');
        }
      }
    });
  }

  // Atualizar nav-link ativo ao rolar
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
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

  // Smooth scroll para links internos
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar links vazios
        if (href === '#' || href === '#!') {
          e.preventDefault();
          return;
        }
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const offsetTop = target.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Fechar navbar mobile se estiver aberto
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
          }
        }
      });
    });
  }

  // Fechar navbar mobile ao clicar em link
  function setupNavbarMobile() {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

  // Adicionar efeito ripple aos botões
  function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.classList.add('btn-ripple');
    });
  }

  // Lazy loading para imagens
  function setupLazyLoading() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Adicionar efeito de hover nas imagens dos cards
  function setupCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      const cardImg = card.querySelector('.card-img-top');
      
      if (cardImg) {
        // Efeito de movimento da imagem seguindo o mouse
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const moveX = (x - centerX) / 20;
          const moveY = (y - centerY) / 20;
          
          cardImg.style.transform = `scale(1.15) translate(${moveX}px, ${moveY}px)`;
        });
        
        card.addEventListener('mouseleave', () => {
          cardImg.style.transform = '';
        });
      }
    });
  }

  // Parallax effect para header
  function setupParallax() {
    const header = document.querySelector('header');
    
    if (header) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          header.style.transform = `translateY(${scrolled * 0.5}px)`;
          header.style.opacity = 1 - (scrolled / 600);
        }
      });
    }
  }

  // Adicionar contadores animados (se houver)
  function setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.counter);
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          
          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    });
    
    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Adicionar a classe para habilitar as animações iniciais
  function initAnimations() {
    setTimeout(() => {
      handleScrollAnimations();
    }, 100);
  }

  // Adicionar loading class para prevenção de FOUC
  function removeLoadingState() {
    document.body.classList.add('loaded');
  }

  // Event Listeners
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    toggleScrollTopButton();
    handleNavbarScroll();
    updateActiveNavLink();
    
    // Debounce para animações
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      handleScrollAnimations();
    }, 50);
  });

  // Inicialização
  toggleScrollTopButton();
  initAnimations();
  setupNavbarMobile();
  setupSmoothScroll();
  addRippleEffect();
  setupLazyLoading();
  setupCardEffects();
  setupParallax();
  setupCounters();
  
  // Remover estado de loading após tudo carregar
  window.addEventListener('load', () => {
    removeLoadingState();
  });
  
  // Log de inicialização (apenas para desenvolvimento)
  console.log('🚀 Portfolio carregado com sucesso!');
});

/**
 * Função para enviar mensagem via WhatsApp
 * @param {Event} event - Evento de submit do formulário
 * @returns {boolean} - Retorna false para evitar o comportamento padrão do formulário
 */
function sendWhatsApp(event) {
  // Previne o comportamento padrão do formulário
  event.preventDefault();
  
  // Obter os valores dos campos
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const assunto = document.getElementById('assunto').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  
  // Número de telefone para envio (adicione seu número aqui com código do país)
  const telefone = "5583981074503"; // Formato: DDI + DDD + número (sem espaços ou caracteres especiais)
  
  // Formatar a mensagem para o WhatsApp
  const texto = `*Contato via Portfolio*%0A%0A*Nome:* ${encodeURIComponent(nome)}%0A*E-mail:* ${encodeURIComponent(email)}%0A*Assunto:* ${encodeURIComponent(assunto)}%0A%0A*Mensagem:*%0A${encodeURIComponent(mensagem)}`;
  
  // Criar a URL do WhatsApp
  const whatsappURL = `https://wa.me/${telefone}?text=${texto}`;
  
  // Abrir o WhatsApp em uma nova aba
  window.open(whatsappURL, '_blank');
  
  // Limpar o formulário após o envio
  document.getElementById('whatsappForm').reset();
  
  return false;
}