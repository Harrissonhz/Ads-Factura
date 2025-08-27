(() => {
  // Datos mock de usuarios
  let usuarios = [
    {
      id: 1,
      empresa: "EMPRESA DEMO S.A.S.",
      empresa_id: 1,
      username: "admin",
      email: "admin@empresa.com",
      estado: "ACTIVO",
      perfil: {
        nombre: "Administrador",
        apellido: "Sistema",
        telefono: "+57 300 123 4567",
        cargo: "Administrador del Sistema"
      },
      roles: ["ADMIN", "FACTURADOR"]
    },
    {
      id: 2,
      empresa: "EMPRESA DEMO S.A.S.",
      empresa_id: 1,
      username: "juan.perez",
      email: "juan.perez@empresa.com",
      estado: "ACTIVO",
      perfil: {
        nombre: "Juan",
        apellido: "Pérez",
        telefono: "+57 300 987 6543",
        cargo: "Analista de Facturación"
      },
      roles: ["FACTURADOR", "CONSULTA"]
    },
    {
      id: 3,
      empresa: "EMPRESA DEMO S.A.S.",
      empresa_id: 1,
      username: "maria.garcia",
      email: "maria.garcia@empresa.com",
      estado: "ACTIVO",
      perfil: {
        nombre: "María",
        apellido: "García",
        telefono: "+57 300 555 1234",
        cargo: "Contador"
      },
      roles: ["CONTADOR", "CONSULTA"]
    }
  ];

  // Datos mock de roles disponibles
  const rolesDisponibles = [
    { id: "ADMIN", nombre: "Administrador", descripcion: "Acceso completo al sistema" },
    { id: "FACTURADOR", nombre: "Facturador", descripcion: "Crear y gestionar facturas" },
    { id: "CONTADOR", nombre: "Contador", descripcion: "Acceso a reportes y contabilidad" },
    { id: "CONSULTA", nombre: "Consulta", descripcion: "Solo consultas y reportes" }
  ];

  // Elementos del DOM
  const usuariosList = document.getElementById('usuariosList');
  const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
  const usuarioFormSection = document.getElementById('usuarioFormSection');
  const usuarioForm = document.getElementById('usuarioForm');
  const btnCancelarUsuario = document.getElementById('btnCancelarUsuario');
  const rolesGrid = document.getElementById('rolesGrid');

  // Estado del formulario
  let modoEdicion = false;
  let usuarioEditando = null;

  // Inicialización
  function init() {
    renderizarUsuarios();
    renderizarRolesGrid();
    setupEventListeners();
  }

  // Renderizar lista de usuarios
  function renderizarUsuarios() {
    if (usuarios.length === 0) {
      usuariosList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-users fa-3x" style="color: var(--muted); margin-bottom: 16px;"></i>
          <p>No hay usuarios registrados</p>
          <p>Haz clic en "Nuevo Usuario" para comenzar</p>
        </div>
      `;
      return;
    }

    usuariosList.innerHTML = usuarios.map(usuario => `
      <div class="usuario-item" data-id="${usuario.id}">
        <div class="usuario-header">
          <div class="usuario-info">
            <h3>${usuario.perfil.nombre} ${usuario.perfil.apellido}</h3>
            <p class="usuario-empresa">${usuario.empresa}</p>
            <p class="usuario-username">@${usuario.username}</p>
          </div>
          <div class="usuario-actions">
            <span class="estado-badge ${usuario.estado.toLowerCase()}">${usuario.estado}</span>
            <button class="btn btn-sm btn-secondary" onclick="editarUsuario(${usuario.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline" onclick="toggleEstadoUsuario(${usuario.id})">
              <i class="fas fa-power-off"></i>
            </button>
          </div>
        </div>
        <div class="usuario-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value">${usuario.email}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Teléfono</span>
              <span class="detail-value">${usuario.perfil.telefono}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cargo</span>
              <span class="detail-value">${usuario.perfil.cargo}</span>
            </div>
          </div>
          <div class="usuario-roles">
            <span class="detail-label">Roles:</span>
            ${usuario.roles.map(rol => `<span class="role-badge">${rol}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Renderizar grid de roles
  function renderizarRolesGrid() {
    rolesGrid.innerHTML = rolesDisponibles.map(rol => `
      <label class="role-checkbox">
        <input type="checkbox" value="${rol.id}" id="rol_${rol.id}">
        <span class="role-info">
          <strong>${rol.nombre}</strong>
          <small>${rol.descripcion}</small>
        </span>
      </label>
    `).join('');
  }

  // Configurar event listeners
  function setupEventListeners() {
    btnNuevoUsuario?.addEventListener('click', mostrarFormularioNuevo);
    btnCancelarUsuario?.addEventListener('click', ocultarFormulario);
    usuarioForm?.addEventListener('submit', manejarSubmitUsuario);
  }

  // Mostrar formulario para nuevo usuario
  function mostrarFormularioNuevo() {
    modoEdicion = false;
    usuarioEditando = null;
    document.getElementById('usuarioFormTitle').textContent = 'Nuevo Usuario';
    usuarioForm.reset();
    limpiarSeleccionRoles();
    usuarioFormSection.style.display = 'block';
    btnNuevoUsuario.style.display = 'none';
  }

  // Mostrar formulario para editar usuario
  function mostrarFormularioEdicion(usuario) {
    modoEdicion = true;
    usuarioEditando = usuario;
    document.getElementById('usuarioFormTitle').textContent = 'Editar Usuario';
    
    // Llenar campos del usuario
    document.getElementById('usuarioEmpresa').value = usuario.empresa_id;
    document.getElementById('usuarioUsername').value = usuario.username;
    document.getElementById('usuarioEmail').value = usuario.email;
    document.getElementById('usuarioEstado').value = usuario.estado;
    
    // Llenar campos del perfil
    document.getElementById('perfilNombre').value = usuario.perfil.nombre;
    document.getElementById('perfilApellido').value = usuario.perfil.apellido;
    document.getElementById('perfilTelefono').value = usuario.perfil.telefono;
    document.getElementById('perfilCargo').value = usuario.perfil.cargo;
    
    // Seleccionar roles
    limpiarSeleccionRoles();
    usuario.roles.forEach(rolId => {
      const checkbox = document.getElementById(`rol_${rolId}`);
      if (checkbox) checkbox.checked = true;
    });
    
    usuarioFormSection.style.display = 'block';
    btnNuevoUsuario.style.display = 'none';
  }

  // Ocultar formulario
  function ocultarFormulario() {
    usuarioFormSection.style.display = 'none';
    btnNuevoUsuario.style.display = 'inline-flex';
    usuarioForm.reset();
    limpiarSeleccionRoles();
  }

  // Limpiar selección de roles
  function limpiarSeleccionRoles() {
    rolesDisponibles.forEach(rol => {
      const checkbox = document.getElementById(`rol_${rol.id}`);
      if (checkbox) checkbox.checked = false;
    });
  }

  // Manejar submit del formulario
  function manejarSubmitUsuario(ev) {
    ev.preventDefault();
    
    if (!validarFormulario()) return;
    
    const datosUsuario = obtenerDatosFormulario();
    
    if (modoEdicion) {
      editarUsuarioExistente(datosUsuario);
    } else {
      crearNuevoUsuario(datosUsuario);
    }
  }

  // Validar formulario
  function validarFormulario() {
    const password = document.getElementById('usuarioPassword').value;
    const passwordConfirm = document.getElementById('usuarioPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return false;
    }
    
    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    return true;
  }

  // Obtener datos del formulario
  function obtenerDatosFormulario() {
    const rolesSeleccionados = Array.from(document.querySelectorAll('#rolesGrid input:checked'))
      .map(checkbox => checkbox.value);
    
    return {
      empresa_id: parseInt(document.getElementById('usuarioEmpresa').value),
      empresa: document.getElementById('usuarioEmpresa').selectedOptions[0].text,
      username: document.getElementById('usuarioUsername').value.trim(),
      email: document.getElementById('usuarioEmail').value.trim(),
      password: document.getElementById('usuarioPassword').value,
      estado: document.getElementById('usuarioEstado').value,
      perfil: {
        nombre: document.getElementById('perfilNombre').value.trim(),
        apellido: document.getElementById('perfilApellido').value.trim(),
        telefono: document.getElementById('perfilTelefono').value.trim(),
        cargo: document.getElementById('perfilCargo').value.trim()
      },
      roles: rolesSeleccionados
    };
  }

  // Crear nuevo usuario
  function crearNuevoUsuario(datos) {
    const nuevoUsuario = {
      id: Date.now(),
      ...datos
    };
    
    usuarios.push(nuevoUsuario);
    renderizarUsuarios();
    ocultarFormulario();
    
    // Simulación de guardado
    setTimeout(() => {
      alert('Usuario creado exitosamente');
    }, 500);
  }

  // Editar usuario existente
  function editarUsuarioExistente(datos) {
    const index = usuarios.findIndex(u => u.id === usuarioEditando.id);
    if (index !== -1) {
      usuarios[index] = { ...usuarioEditando, ...datos };
      renderizarUsuarios();
      ocultarFormulario();
      
      setTimeout(() => {
        alert('Usuario actualizado exitosamente');
      }, 500);
    }
  }

  // Función global para editar usuario
  window.editarUsuario = function(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      mostrarFormularioEdicion(usuario);
    }
  };

  // Función global para cambiar estado de usuario
  window.toggleEstadoUsuario = function(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      const nuevosEstados = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];
      const estadoActual = usuario.estado;
      const indexActual = nuevosEstados.indexOf(estadoActual);
      const nuevoEstado = nuevosEstados[(indexActual + 1) % nuevosEstados.length];
      
      usuario.estado = nuevoEstado;
      renderizarUsuarios();
      
      setTimeout(() => {
        alert(`Usuario ${usuario.perfil.nombre} ${usuario.perfil.apellido} ahora está ${nuevoEstado.toLowerCase()}`);
      }, 300);
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
