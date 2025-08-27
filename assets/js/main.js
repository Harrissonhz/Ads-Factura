(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');

  // Navegación móvil para páginas normales
  navToggle?.addEventListener('click', () => {
    nav?.classList.toggle('open');
  });

  // Dropdown functionality for mobile (páginas normales)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 720) {
        e.preventDefault();
        const dropdownMenu = toggle.nextElementSibling;
        const isOpen = dropdownMenu.style.display === 'block';
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
        
        // Toggle current dropdown
        dropdownMenu.style.display = isOpen ? 'none' : 'block';
      }
    });
  });

  // Hamburger menu functionality (solo para crear-factura.html)
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenu = document.getElementById('closeMenu');

  if (hamburgerMenu) {
    // Abrir menú hamburguesa
    navToggle?.addEventListener('click', () => {
      hamburgerMenu?.classList.add('open');
      menuOverlay?.classList.add('open');
      navToggle?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Cerrar menú hamburguesa
    const closeHamburgerMenu = () => {
      hamburgerMenu?.classList.remove('open');
      menuOverlay?.classList.remove('open');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeMenu?.addEventListener('click', closeHamburgerMenu);
    menuOverlay?.addEventListener('click', closeHamburgerMenu);

    // Submenús del hamburger menu
    const menuCategories = document.querySelectorAll('.menu-category');
    menuCategories.forEach(category => {
      category.addEventListener('click', () => {
        const submenu = category.nextElementSibling;
        const isOpen = submenu.classList.contains('open');
        
        // Cerrar todos los submenús
        document.querySelectorAll('.submenu').forEach(menu => {
          menu.classList.remove('open');
        });
        document.querySelectorAll('.menu-category').forEach(cat => {
          cat.classList.remove('open');
        });
        
        // Abrir el submenú actual si no estaba abierto
        if (!isOpen) {
          submenu.classList.add('open');
          category.classList.add('open');
        }
      });
    });
  }

  // Login page form (solo en login.html)
  const loginPageForm = document.querySelector('.login-form');
  loginPageForm?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const emailValue = email?.value?.trim();
    const passwordValue = password?.value;

    const emailValid = !!emailValue && /.+@.+\..+/.test(emailValue);
    const passwordValid = !!passwordValue && passwordValue.length >= 6;

    if (!emailValid) {
      alert('Ingresa un correo válido.');
      return;
    }
    if (!passwordValid) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Simulación de autenticación
    const submitButton = loginPageForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Ingresando...';

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Ingresar al sistema';
      alert('Inicio de sesión exitoso. Redirigiendo al sistema...');
      
      // Redirigir a la página de crear factura
      window.location.href = 'crear-factura.html';
    }, 900);
  });

  // Forgot password form (solo en forgot-password.html)
  const forgotForm = document.getElementById('forgotForm');
  forgotForm?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = document.getElementById('email');

    const emailValue = email?.value?.trim();
    const emailValid = !!emailValue && /.+@.+\..+/.test(emailValue);

    if (!emailValid) {
      alert('Ingresa un correo válido.');
      return;
    }

    // Simulación de envío de instrucciones
    const submitButton = forgotForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar instrucciones';
      alert(`Se han enviado las instrucciones de recuperación a ${emailValue}. Revisa tu bandeja de entrada.`);
    }, 1500);
  });
})();

