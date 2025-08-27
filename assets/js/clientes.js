(() => {
  // Elementos del DOM
  const clientesList = document.getElementById('clientesList');
  const clienteForm = document.getElementById('clienteForm');
  const btnNuevoCliente = document.getElementById('btnNuevoCliente');
  const btnCancelarCliente = document.getElementById('btnCancelarCliente');
  const btnGuardarBorradorCliente = document.getElementById('btnGuardarBorradorCliente');

  // Datos de ejemplo basados en CLIENTE del modelo
  const clientesEjemplo = [
    {
      id: 1,
      nit: '800987654-3',
      razon_social: 'CLIENTE PRUEBA LTDA.',
      direccion: 'Av 5 # 10-15 Medellín',
      email: 'contacto@cliente.com'
    }
  ];

  function crearClienteHTML(c) {
    return `
      <div class="resolucion-item" data-id="${c.id}">
        <div class="resolucion-header">
          <div class="resolucion-info">
            <h3>${c.razon_social}</h3>
            <p class="resolucion-empresa">NIT: ${c.nit}</p>
          </div>
          <div class="resolucion-actions">
            <button class="btn btn-secondary btn-sm" onclick="editarCliente(${c.id})">Editar</button>
            <button class="btn btn-outline btn-sm" onclick="eliminarCliente(${c.id})">Eliminar</button>
          </div>
        </div>
        <div class="resolucion-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Dirección:</span>
              <span class="detail-value">${c.direccion || '-'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${c.email || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function cargarClientes() {
    if (!clientesEjemplo.length) {
      clientesList.innerHTML = `
        <div class="empty-state">
          <p>No hay clientes registrados</p>
          <button class="btn btn-primary" onclick="mostrarFormularioCliente()">Crear primer cliente</button>
        </div>
      `;
      return;
    }
    clientesList.innerHTML = clientesEjemplo.map(c => crearClienteHTML(c)).join('');
  }

  function mostrarFormularioCliente() {
    clienteForm.style.display = 'block';
    clienteForm.scrollIntoView({ behavior: 'smooth' });
  }

  function ocultarFormularioCliente() {
    clienteForm.style.display = 'none';
    clienteForm.reset();
  }

  // Validaciones básicas
  function validarNIT(nit) {
    const nitRegex = /^\d{9,10}(-\d{1})?$/;
    return nitRegex.test(nit);
  }
  function validarEmail(email) {
    if (!email) return true; // opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function validarFormularioCliente() {
    const nit = document.getElementById('clienteNitForm').value.trim();
    const razon = document.getElementById('clienteRazonForm').value.trim();
    const email = document.getElementById('clienteEmailForm').value.trim();
    if (!nit) { alert('El NIT es obligatorio.'); return false; }
    if (!validarNIT(nit)) { alert('El NIT no tiene un formato válido.'); return false; }
    if (!razon) { alert('La razón social es obligatoria.'); return false; }
    if (email && !validarEmail(email)) { alert('El email no tiene un formato válido.'); return false; }
    return true;
  }

  function obtenerDatosCliente() {
    return {
      nit: document.getElementById('clienteNitForm').value.trim(),
      razon_social: document.getElementById('clienteRazonForm').value.trim(),
      direccion: document.getElementById('clienteDireccionForm').value.trim(),
      email: document.getElementById('clienteEmailForm').value.trim()
    };
  }

  // Event listeners
  btnNuevoCliente?.addEventListener('click', () => mostrarFormularioCliente());
  btnCancelarCliente?.addEventListener('click', () => ocultarFormularioCliente());

  btnGuardarBorradorCliente?.addEventListener('click', () => {
    const datos = obtenerDatosCliente();
    btnGuardarBorradorCliente.disabled = true;
    btnGuardarBorradorCliente.textContent = 'Guardando...';
    setTimeout(() => {
      btnGuardarBorradorCliente.disabled = false;
      btnGuardarBorradorCliente.textContent = 'Guardar Borrador';
      localStorage.setItem('cliente_borrador', JSON.stringify(datos));
      alert('Borrador guardado exitosamente.');
    }, 1000);
  });

  clienteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarFormularioCliente()) return;
    const datos = obtenerDatosCliente();
    const submitButton = clienteForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Cliente';
      alert('Cliente guardado exitosamente.');
      localStorage.removeItem('cliente_borrador');
      console.log('Datos del cliente a guardar:', datos);
      ocultarFormularioCliente();
      // Simular inserción en lista
      clientesEjemplo.push({
        id: Date.now(),
        nit: datos.nit,
        razon_social: datos.razon_social,
        direccion: datos.direccion,
        email: datos.email
      });
      cargarClientes();
    }, 1200);
  });

  // Cargar borrador si existe y clientes ejemplo
  window.addEventListener('load', () => {
    const borrador = localStorage.getItem('cliente_borrador');
    if (borrador) {
      const datos = JSON.parse(borrador);
      document.getElementById('clienteNitForm').value = datos.nit || '';
      document.getElementById('clienteRazonForm').value = datos.razon_social || '';
      document.getElementById('clienteDireccionForm').value = datos.direccion || '';
      document.getElementById('clienteEmailForm').value = datos.email || '';
    }
    cargarClientes();
  });

  // Exponer funciones globales para acciones inline
  window.editarCliente = function(id) {
    const c = clientesEjemplo.find(x => x.id === id);
    if (c) {
      mostrarFormularioCliente();
      document.getElementById('clienteNitForm').value = c.nit;
      document.getElementById('clienteRazonForm').value = c.razon_social;
      document.getElementById('clienteDireccionForm').value = c.direccion || '';
      document.getElementById('clienteEmailForm').value = c.email || '';
    }
  };

  window.eliminarCliente = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      const index = clientesEjemplo.findIndex(x => x.id === id);
      if (index > -1) {
        clientesEjemplo.splice(index, 1);
        cargarClientes();
        alert('Cliente eliminado exitosamente.');
      }
    }
  };
})();


