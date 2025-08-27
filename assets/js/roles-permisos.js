(() => {
  // Datos mock de roles
  let roles = [
    {
      id: 1,
      nombre: "ADMIN",
      descripcion: "Administrador del sistema con acceso completo a todas las funcionalidades",
      nivel_acceso: "ADMINISTRATIVO",
      estado: "ACTIVO",
      usuarios_asignados: 1,
      permisos_count: 24
    },
    {
      id: 2,
      nombre: "FACTURADOR",
      descripcion: "Usuario encargado de crear y gestionar facturas electrónicas",
      nivel_acceso: "ALTO",
      estado: "ACTIVO",
      usuarios_asignados: 2,
      permisos_count: 12
    },
    {
      id: 3,
      nombre: "CONTADOR",
      descripcion: "Usuario con acceso a reportes contables y estadísticas",
      nivel_acceso: "MEDIO",
      estado: "ACTIVO",
      usuarios_asignados: 1,
      permisos_count: 8
    },
    {
      id: 4,
      nombre: "CONSULTA",
      descripcion: "Usuario con acceso de solo lectura a reportes y consultas",
      nivel_acceso: "BAJO",
      estado: "ACTIVO",
      usuarios_asignados: 2,
      permisos_count: 4
    }
  ];

  // Datos mock de permisos
  let permisos = [
    {
      id: 1,
      rol_id: 1,
      rol: "ADMIN",
      modulo: "FACTURACION",
      accion: "CREAR",
      descripcion: "Crear facturas electrónicas"
    },
    {
      id: 2,
      rol_id: 1,
      rol: "ADMIN",
      modulo: "FACTURACION",
      accion: "LEER",
      descripcion: "Consultar facturas del sistema"
    },
    {
      id: 3,
      rol_id: 1,
      rol: "ADMIN",
      modulo: "USUARIOS",
      accion: "CREAR",
      descripcion: "Crear nuevos usuarios"
    },
    {
      id: 4,
      rol_id: 2,
      rol: "FACTURADOR",
      modulo: "FACTURACION",
      accion: "CREAR",
      descripcion: "Crear facturas electrónicas"
    },
    {
      id: 5,
      rol_id: 2,
      rol: "FACTURADOR",
      modulo: "FACTURACION",
      accion: "LEER",
      descripcion: "Consultar facturas propias"
    },
    {
      id: 6,
      rol_id: 3,
      rol: "CONTADOR",
      modulo: "REPORTES",
      accion: "LEER",
      descripcion: "Acceso a reportes contables"
    },
    {
      id: 7,
      rol_id: 4,
      rol: "CONSULTA",
      modulo: "REPORTES",
      accion: "LEER",
      descripcion: "Acceso básico a reportes"
    }
  ];

  // Elementos del DOM
  const rolesList = document.getElementById('rolesList');
  const permisosList = document.getElementById('permisosList');
  const btnNuevoRol = document.getElementById('btnNuevoRol');
  const btnNuevoPermiso = document.getElementById('btnNuevoPermiso');
  const rolFormSection = document.getElementById('rolFormSection');
  const permisoFormSection = document.getElementById('permisoFormSection');
  const rolForm = document.getElementById('rolForm');
  const permisoForm = document.getElementById('permisoForm');
  const btnCancelarRol = document.getElementById('btnCancelarRol');
  const btnCancelarPermiso = document.getElementById('btnCancelarPermiso');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Estado del formulario
  let modoEdicionRol = false;
  let modoEdicionPermiso = false;
  let rolEditando = null;
  let permisoEditando = null;

  // Inicialización
  function init() {
    renderizarRoles();
    renderizarPermisos();
    setupEventListeners();
    setupTabs();
  }

  // Configurar tabs
  function setupTabs() {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        cambiarTab(targetTab);
      });
    });
  }

  // Cambiar tab activo
  function cambiarTab(tabName) {
    // Remover clase active de todos los tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Activar tab seleccionado
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
  }

  // Renderizar lista de roles
  function renderizarRoles() {
    if (roles.length === 0) {
      rolesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-users fa-3x" style="color: var(--muted); margin-bottom: 16px;"></i>
          <p>No hay roles registrados</p>
          <p>Haz clic en "Nuevo Rol" para comenzar</p>
        </div>
      `;
      return;
    }

    rolesList.innerHTML = roles.map(rol => `
      <div class="rol-item" data-id="${rol.id}">
        <div class="rol-header">
          <div class="rol-info">
            <h3>${rol.nombre}</h3>
            <p class="rol-descripcion">${rol.descripcion}</p>
            <div class="rol-meta">
              <span class="nivel-badge ${rol.nivel_acceso.toLowerCase()}">${rol.nivel_acceso}</span>
              <span class="estado-badge ${rol.estado.toLowerCase()}">${rol.estado}</span>
            </div>
          </div>
          <div class="rol-actions">
            <button class="btn btn-sm btn-secondary" onclick="editarRol(${rol.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline" onclick="verPermisosRol(${rol.id})">
              <i class="fas fa-shield-alt"></i>
            </button>
          </div>
        </div>
        <div class="rol-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Usuarios Asignados</span>
              <span class="detail-value">${rol.usuarios_asignados}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Permisos</span>
              <span class="detail-value">${rol.permisos_count}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Renderizar lista de permisos
  function renderizarPermisos() {
    if (permisos.length === 0) {
      permisosList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-shield-alt fa-3x" style="color: var(--muted); margin-bottom: 16px;"></i>
          <p>No hay permisos registrados</p>
          <p>Haz clic en "Nuevo Permiso" para comenzar</p>
        </div>
      `;
      return;
    }

    permisosList.innerHTML = permisos.map(permiso => `
      <div class="permiso-item" data-id="${permiso.id}">
        <div class="permiso-header">
          <div class="permiso-info">
            <h3>${permiso.modulo} - ${permiso.accion}</h3>
            <p class="permiso-rol">Rol: ${permiso.rol}</p>
            <p class="permiso-descripcion">${permiso.descripcion}</p>
          </div>
          <div class="permiso-actions">
            <button class="btn btn-sm btn-secondary" onclick="editarPermiso(${permiso.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline" onclick="eliminarPermiso(${permiso.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Configurar event listeners
  function setupEventListeners() {
    btnNuevoRol?.addEventListener('click', mostrarFormularioNuevoRol);
    btnNuevoPermiso?.addEventListener('click', mostrarFormularioNuevoPermiso);
    btnCancelarRol?.addEventListener('click', ocultarFormularioRol);
    btnCancelarPermiso?.addEventListener('click', ocultarFormularioPermiso);
    rolForm?.addEventListener('submit', manejarSubmitRol);
    permisoForm?.addEventListener('submit', manejarSubmitPermiso);
  }

  // Mostrar formulario para nuevo rol
  function mostrarFormularioNuevoRol() {
    modoEdicionRol = false;
    rolEditando = null;
    document.getElementById('rolFormTitle').textContent = 'Nuevo Rol';
    rolForm.reset();
    rolFormSection.style.display = 'block';
    btnNuevoRol.style.display = 'none';
  }

  // Mostrar formulario para editar rol
  function mostrarFormularioEdicionRol(rol) {
    modoEdicionRol = true;
    rolEditando = rol;
    document.getElementById('rolFormTitle').textContent = 'Editar Rol';
    
    // Llenar campos del rol
    document.getElementById('rolNombre').value = rol.nombre;
    document.getElementById('rolDescripcion').value = rol.descripcion;
    document.getElementById('rolNivelAcceso').value = rol.nivel_acceso;
    document.getElementById('rolEstado').value = rol.estado;
    
    rolFormSection.style.display = 'block';
    btnNuevoRol.style.display = 'none';
  }

  // Mostrar formulario para nuevo permiso
  function mostrarFormularioNuevoPermiso() {
    modoEdicionPermiso = false;
    permisoEditando = null;
    document.getElementById('permisoFormTitle').textContent = 'Nuevo Permiso';
    permisoForm.reset();
    permisoFormSection.style.display = 'block';
    btnNuevoPermiso.style.display = 'none';
  }

  // Mostrar formulario para editar permiso
  function mostrarFormularioEdicionPermiso(permiso) {
    modoEdicionPermiso = true;
    permisoEditando = permiso;
    document.getElementById('permisoFormTitle').textContent = 'Editar Permiso';
    
    // Llenar campos del permiso
    document.getElementById('permisoRol').value = permiso.rol;
    document.getElementById('permisoModulo').value = permiso.modulo;
    document.getElementById('permisoAccion').value = permiso.accion;
    document.getElementById('permisoDescripcion').value = permiso.descripcion || '';
    
    permisoFormSection.style.display = 'block';
    btnNuevoPermiso.style.display = 'none';
  }

  // Ocultar formulario de rol
  function ocultarFormularioRol() {
    rolFormSection.style.display = 'none';
    btnNuevoRol.style.display = 'inline-flex';
    rolForm.reset();
  }

  // Ocultar formulario de permiso
  function ocultarFormularioPermiso() {
    permisoFormSection.style.display = 'none';
    btnNuevoPermiso.style.display = 'inline-flex';
    permisoForm.reset();
  }

  // Manejar submit del formulario de rol
  function manejarSubmitRol(ev) {
    ev.preventDefault();
    
    if (!validarFormularioRol()) return;
    
    const datosRol = obtenerDatosFormularioRol();
    
    if (modoEdicionRol) {
      editarRolExistente(datosRol);
    } else {
      crearNuevoRol(datosRol);
    }
  }

  // Manejar submit del formulario de permiso
  function manejarSubmitPermiso(ev) {
    ev.preventDefault();
    
    if (!validarFormularioPermiso()) return;
    
    const datosPermiso = obtenerDatosFormularioPermiso();
    
    if (modoEdicionPermiso) {
      editarPermisoExistente(datosPermiso);
    } else {
      crearNuevoPermiso(datosPermiso);
    }
  }

  // Validar formulario de rol
  function validarFormularioRol() {
    const nombre = document.getElementById('rolNombre').value.trim();
    const descripcion = document.getElementById('rolDescripcion').value.trim();
    
    if (!nombre) {
      alert('El nombre del rol es obligatorio');
      return false;
    }
    
    if (!descripcion) {
      alert('La descripción del rol es obligatoria');
      return false;
    }
    
    return true;
  }

  // Validar formulario de permiso
  function validarFormularioPermiso() {
    const rol = document.getElementById('permisoRol').value;
    const modulo = document.getElementById('permisoModulo').value;
    const accion = document.getElementById('permisoAccion').value;
    
    if (!rol) {
      alert('Debe seleccionar un rol');
      return false;
    }
    
    if (!modulo) {
      alert('Debe seleccionar un módulo');
      return false;
    }
    
    if (!accion) {
      alert('Debe seleccionar una acción');
      return false;
    }
    
    return true;
  }

  // Obtener datos del formulario de rol
  function obtenerDatosFormularioRol() {
    return {
      nombre: document.getElementById('rolNombre').value.trim(),
      descripcion: document.getElementById('rolDescripcion').value.trim(),
      nivel_acceso: document.getElementById('rolNivelAcceso').value,
      estado: document.getElementById('rolEstado').value
    };
  }

  // Obtener datos del formulario de permiso
  function obtenerDatosFormularioPermiso() {
    return {
      rol: document.getElementById('permisoRol').value,
      modulo: document.getElementById('permisoModulo').value,
      accion: document.getElementById('permisoAccion').value,
      descripcion: document.getElementById('permisoDescripcion').value.trim() || null
    };
  }

  // Crear nuevo rol
  function crearNuevoRol(datos) {
    const nuevoRol = {
      id: Date.now(),
      ...datos,
      usuarios_asignados: 0,
      permisos_count: 0
    };
    
    roles.push(nuevoRol);
    renderizarRoles();
    ocultarFormularioRol();
    
    setTimeout(() => {
      alert('Rol creado exitosamente');
    }, 500);
  }

  // Editar rol existente
  function editarRolExistente(datos) {
    const index = roles.findIndex(r => r.id === rolEditando.id);
    if (index !== -1) {
      roles[index] = { ...rolEditando, ...datos };
      renderizarRoles();
      ocultarFormularioRol();
      
      setTimeout(() => {
        alert('Rol actualizado exitosamente');
      }, 500);
    }
  }

  // Crear nuevo permiso
  function crearNuevoPermiso(datos) {
    const nuevoPermiso = {
      id: Date.now(),
      rol_id: roles.find(r => r.nombre === datos.rol)?.id || 1,
      ...datos
    };
    
    permisos.push(nuevoPermiso);
    actualizarContadorPermisos();
    renderizarPermisos();
    ocultarFormularioPermiso();
    
    setTimeout(() => {
      alert('Permiso creado exitosamente');
    }, 500);
  }

  // Editar permiso existente
  function editarPermisoExistente(datos) {
    const index = permisos.findIndex(p => p.id === permisoEditando.id);
    if (index !== -1) {
      permisos[index] = { ...permisoEditando, ...datos };
      renderizarPermisos();
      ocultarFormularioPermiso();
      
      setTimeout(() => {
        alert('Permiso actualizado exitosamente');
      }, 500);
    }
  }

  // Actualizar contador de permisos por rol
  function actualizarContadorPermisos() {
    roles.forEach(rol => {
      rol.permisos_count = permisos.filter(p => p.rol === rol.nombre).length;
    });
    renderizarRoles();
  }

  // Función global para editar rol
  window.editarRol = function(id) {
    const rol = roles.find(r => r.id === id);
    if (rol) {
      mostrarFormularioEdicionRol(rol);
    }
  };

  // Función global para editar permiso
  window.editarPermiso = function(id) {
    const permiso = permisos.find(p => p.id === id);
    if (permiso) {
      mostrarFormularioEdicionPermiso(permiso);
    }
  };

  // Función global para eliminar permiso
  window.eliminarPermiso = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este permiso?')) {
      permisos = permisos.filter(p => p.id !== id);
      actualizarContadorPermisos();
      renderizarPermisos();
      
      setTimeout(() => {
        alert('Permiso eliminado exitosamente');
      }, 300);
    }
  };

  // Función global para ver permisos de un rol
  window.verPermisosRol = function(id) {
    const rol = roles.find(r => r.id === id);
    if (rol) {
      const permisosRol = permisos.filter(p => p.rol === rol.nombre);
      const detalles = `
        <strong>Permisos del Rol: ${rol.nombre}</strong>
        
        ${permisosRol.length > 0 ? 
          permisosRol.map(p => `• ${p.modulo} - ${p.accion}: ${p.descripcion}`).join('\n') :
          'Este rol no tiene permisos asignados'
        }
        
        <strong>Total de Permisos:</strong> ${permisosRol.length}
      `;
      
      alert(detalles);
    }
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
