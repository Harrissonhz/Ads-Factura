(() => {
  // Elementos del formulario
  const empresaForm = document.getElementById('empresaForm');
  const btnGuardarBorrador = document.getElementById('btnGuardarBorrador');

  // Función para validar NIT colombiano
  function validarNIT(nit) {
    // Formato básico: números y guión opcional
    const nitRegex = /^\d{9,10}(-\d{1})?$/;
    return nitRegex.test(nit);
  }

  // Función para validar email
  function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para validar URL
  function validarURL(url) {
    if (!url) return true; // URL es opcional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Función para validar el formulario
  function validarFormulario() {
    const nit = document.getElementById('empresaNit').value.trim();
    const razonSocial = document.getElementById('empresaRazon').value.trim();
    const email = document.getElementById('empresaEmail').value.trim();
    const website = document.getElementById('empresaWebsite').value.trim();

    // Validar NIT
    if (!nit) {
      alert('El NIT es obligatorio.');
      return false;
    }
    if (!validarNIT(nit)) {
      alert('El formato del NIT no es válido. Use el formato: 123456789 o 123456789-0');
      return false;
    }

    // Validar razón social
    if (!razonSocial) {
      alert('La razón social es obligatoria.');
      return false;
    }

    // Validar email si se proporciona
    if (email && !validarEmail(email)) {
      alert('El formato del email no es válido.');
      return false;
    }

    // Validar website si se proporciona
    if (website && !validarURL(website)) {
      alert('El formato de la URL del sitio web no es válido.');
      return false;
    }

    return true;
  }

  // Función para obtener datos del formulario
  function obtenerDatosEmpresa() {
    return {
      nit: document.getElementById('empresaNit').value.trim(),
      razon_social: document.getElementById('empresaRazon').value.trim(),
      direccion: document.getElementById('empresaDireccion').value.trim(),
      regimen: document.getElementById('empresaRegimen').value,
      email: document.getElementById('empresaEmail').value.trim(),
      telefono: document.getElementById('empresaTelefono').value.trim(),
      website: document.getElementById('empresaWebsite').value.trim(),
      representante: document.getElementById('empresaRepresentante').value.trim(),
      ciiu: document.getElementById('empresaCIIU').value.trim(),
      actividad: document.getElementById('empresaActividad').value.trim(),
      ciudad: document.getElementById('empresaCiudad').value.trim(),
      departamento: document.getElementById('empresaDepartamento').value.trim(),
      prefijo: document.getElementById('empresaPrefijo').value.trim(),
      consecutivo: document.getElementById('empresaConsecutivo').value,
      moneda: document.getElementById('empresaMoneda').value,
      idioma: document.getElementById('empresaIdioma').value
    };
  }

  // Función para cargar datos de ejemplo (simulación)
  function cargarDatosEjemplo() {
    const datosEjemplo = {
      nit: '900123456-7',
      razon_social: 'EMPRESA DEMO S.A.S.',
      direccion: 'Cra 10 # 20-30, Bogotá D.C.',
      regimen: 'REGIMEN COMUN',
      email: 'contacto@empresademo.com',
      telefono: '+57 1 234 5678',
      website: 'https://www.empresademo.com',
      representante: 'Juan Pérez',
      ciiu: '6201',
      actividad: 'Desarrollo de software',
      ciudad: 'Bogotá D.C.',
      departamento: 'Cundinamarca',
      prefijo: 'FE',
      consecutivo: '1',
      moneda: 'COP',
      idioma: 'es'
    };

    // Llenar campos con datos de ejemplo
    Object.keys(datosEjemplo).forEach(key => {
      const elemento = document.getElementById(`empresa${key.charAt(0).toUpperCase() + key.slice(1)}`);
      if (elemento) {
        elemento.value = datosEjemplo[key];
      }
    });
  }

  // Event listener para guardar borrador
  btnGuardarBorrador?.addEventListener('click', () => {
    const datos = obtenerDatosEmpresa();
    
    // Simular guardado de borrador
    btnGuardarBorrador.disabled = true;
    btnGuardarBorrador.textContent = 'Guardando...';

    setTimeout(() => {
      btnGuardarBorrador.disabled = false;
      btnGuardarBorrador.textContent = 'Guardar Borrador';
      
      // Guardar en localStorage como borrador
      localStorage.setItem('empresa_borrador', JSON.stringify(datos));
      
      alert('Borrador guardado exitosamente.');
    }, 1000);
  });

  // Event listener para el formulario principal
  empresaForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const datos = obtenerDatosEmpresa();
    const submitButton = empresaForm.querySelector('button[type="submit"]');
    
    // Simular envío al servidor
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Datos';
      
      // Simular respuesta exitosa
      alert('Datos de la empresa guardados exitosamente.');
      
      // Limpiar borrador
      localStorage.removeItem('empresa_borrador');
      
      // Aquí se enviarían los datos al servidor
      console.log('Datos de la empresa a guardar:', datos);
      
      // Redirigir a la página principal o mostrar mensaje de éxito
      // window.location.href = 'crear-factura.html';
    }, 1500);
  });

  // Cargar datos guardados al iniciar la página
  window.addEventListener('load', () => {
    // Intentar cargar borrador guardado
    const borrador = localStorage.getItem('empresa_borrador');
    if (borrador) {
      const datos = JSON.parse(borrador);
      Object.keys(datos).forEach(key => {
        const elemento = document.getElementById(`empresa${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (elemento) {
          elemento.value = datos[key];
        }
      });
    }

    // Para desarrollo, cargar datos de ejemplo si no hay datos guardados
    if (!borrador) {
      // Descomentar la siguiente línea para cargar datos de ejemplo automáticamente
      // cargarDatosEjemplo();
    }
  });

  // Validación en tiempo real para NIT
  const nitInput = document.getElementById('empresaNit');
  nitInput?.addEventListener('input', (e) => {
    const nit = e.target.value;
    if (nit && !validarNIT(nit)) {
      e.target.style.borderColor = '#ef4444';
    } else {
      e.target.style.borderColor = '';
    }
  });

  // Validación en tiempo real para email
  const emailInput = document.getElementById('empresaEmail');
  emailInput?.addEventListener('input', (e) => {
    const email = e.target.value;
    if (email && !validarEmail(email)) {
      e.target.style.borderColor = '#ef4444';
    } else {
      e.target.style.borderColor = '';
    }
  });

  // Validación en tiempo real para website
  const websiteInput = document.getElementById('empresaWebsite');
  websiteInput?.addEventListener('input', (e) => {
    const website = e.target.value;
    if (website && !validarURL(website)) {
      e.target.style.borderColor = '#ef4444';
    } else {
      e.target.style.borderColor = '';
    }
  });

})();
