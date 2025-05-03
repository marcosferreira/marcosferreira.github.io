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