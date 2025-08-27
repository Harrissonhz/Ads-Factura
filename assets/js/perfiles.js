(() => {
  // Datos mock de perfiles
  let perfiles = [
    {
      id: 1,
      usuario_id: 1,
      usuario: "admin",
      nombre: "Administrador",
      apellido: "Sistema",
      telefono: "+57 300 123 4567",
      cargo: "Administrador del Sistema",
      departamento: "Tecnología",
      fecha_nacimiento: "1985-03-15",
      genero: "MASCULINO",
      direccion: "Calle 123 # 45-67, Bogotá",
      notas: "Usuario administrador principal del sistema"
    },
    {
      id: 2,
      usuario_id: 2,
      usuario: "juan.perez",
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "+57 300 987 6543",
      cargo: "Analista de Facturación",
      departamento: "Facturación",
      fecha_nacimiento: "1990-07-22",
      genero: "MASCULINO",
      direccion: "Carrera 78 # 12-34, Medellín",
      notas: "Analista especializado en facturación electrónica"
    },
    {
      id: 3,
      usuario_id: 3,
      usuario: "maria.garcia",
      nombre: "María",
      apellido: "García",
      telefono: "+57 300 555 1234",
      cargo: "Contador",
      departamento: "Contabilidad",
      fecha_nacimiento: "1988-11-08",
      genero: "FEMENINO",
      direccion: "Avenida 5 # 23-45, Cali",
      notas: "Contadora pública con experiencia en sistemas contables"
    }
  ];

  // Elementos del DOM
  const perfilesList = document.getElementById('perfilesList');
  const btnNuevoPerfil = document.getElementById('btnNuevoPerfil');
  const perfilFormSection = document.getElementById('perfilFormSection');
  const perfilForm = document.getElementById('perfilForm');
  const btnCancelarPerfil = document.getElementById('btnCancelarPerfil');

  // Estado del formulario
  let modoEdicion = false;
  let perfilEditando = null;

  // Inicialización
  function init() {
    renderizarPerfiles();
    setupEventListeners();
  }

  // Renderizar lista de perfiles
  function renderizarPerfiles() {
    if (perfiles.length === 0) {
      perfilesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-user-circle fa-3x" style="color: var(--muted); margin-bottom: 16px;"></i>
          <p>No hay perfiles registrados</p>
          <p>Haz clic en "Nuevo Perfil" para comenzar</p>
        </div>
      `;
      return;
    }

    perfilesList.innerHTML = perfiles.map(perfil => `
      <div class="perfil-item" data-id="${perfil.id}">
        <div class="perfil-header">
          <div class="perfil-info">
            <h3>${perfil.nombre} ${perfil.apellido}</h3>
            <p class="perfil-usuario">@${perfil.usuario}</p>
            <p class="perfil-cargo">${perfil.cargo}</p>
          </div>
          <div class="perfil-actions">
            <button class="btn btn-sm btn-secondary" onclick="editarPerfil(${perfil.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline" onclick="verPerfilCompleto(${perfil.id})">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="perfil-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Departamento</span>
              <span class="detail-value">${perfil.departamento || 'No especificado'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Teléfono</span>
              <span class="detail-value">${perfil.telefono || 'No especificado'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Género</span>
              <span class="detail-value">${perfil.genero || 'No especificado'}</span>
            </div>
          </div>
          ${perfil.notas ? `
            <div class="perfil-notas">
              <span class="detail-label">Notas:</span>
              <span class="detail-value">${perfil.notas}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // Configurar event listeners
  function setupEventListeners() {
    btnNuevoPerfil?.addEventListener('click', mostrarFormularioNuevo);
    btnCancelarPerfil?.addEventListener('click', ocultarFormulario);
    perfilForm?.addEventListener('submit', manejarSubmitPerfil);
  }

  // Mostrar formulario para nuevo perfil
  function mostrarFormularioNuevo() {
    modoEdicion = false;
    perfilEditando = null;
    document.getElementById('perfilFormTitle').textContent = 'Nuevo Perfil';
    perfilForm.reset();
    perfilFormSection.style.display = 'block';
    btnNuevoPerfil.style.display = 'none';
  }

  // Mostrar formulario para editar perfil
  function mostrarFormularioEdicion(perfil) {
    modoEdicion = true;
    perfilEditando = perfil;
    document.getElementById('perfilFormTitle').textContent = 'Editar Perfil';
    
    // Llenar campos del perfil
    document.getElementById('perfilUsuario').value = perfil.usuario_id;
    document.getElementById('perfilNombre').value = perfil.nombre;
    document.getElementById('perfilApellido').value = perfil.apellido;
    document.getElementById('perfilTelefono').value = perfil.telefono || '';
    document.getElementById('perfilCargo').value = perfil.cargo || '';
    document.getElementById('perfilDepartamento').value = perfil.departamento || '';
    document.getElementById('perfilFechaNacimiento').value = perfil.fecha_nacimiento || '';
    document.getElementById('perfilGenero').value = perfil.genero || '';
    document.getElementById('perfilDireccion').value = perfil.direccion || '';
    document.getElementById('perfilNotas').value = perfil.notas || '';
    
    perfilFormSection.style.display = 'block';
    btnNuevoPerfil.style.display = 'none';
  }

  // Ocultar formulario
  function ocultarFormulario() {
    perfilFormSection.style.display = 'none';
    btnNuevoPerfil.style.display = 'inline-flex';
    perfilForm.reset();
  }

  // Manejar submit del formulario
  function manejarSubmitPerfil(ev) {
    ev.preventDefault();
    
    if (!validarFormulario()) return;
    
    const datosPerfil = obtenerDatosFormulario();
    
    if (modoEdicion) {
      editarPerfilExistente(datosPerfil);
    } else {
      crearNuevoPerfil(datosPerfil);
    }
  }

  // Validar formulario
  function validarFormulario() {
    const nombre = document.getElementById('perfilNombre').value.trim();
    const apellido = document.getElementById('perfilApellido').value.trim();
    const usuario = document.getElementById('perfilUsuario').value;
    
    if (!nombre) {
      alert('El nombre es obligatorio');
      return false;
    }
    
    if (!apellido) {
      alert('El apellido es obligatorio');
      return false;
    }
    
    if (!usuario) {
      alert('Debe seleccionar un usuario');
      return false;
    }
    
    return true;
  }

  // Obtener datos del formulario
  function obtenerDatosFormulario() {
    return {
      usuario_id: parseInt(document.getElementById('perfilUsuario').value),
      usuario: document.getElementById('perfilUsuario').selectedOptions[0].text.split(' ')[0],
      nombre: document.getElementById('perfilNombre').value.trim(),
      apellido: document.getElementById('perfilApellido').value.trim(),
      telefono: document.getElementById('perfilTelefono').value.trim() || null,
      cargo: document.getElementById('perfilCargo').value.trim() || null,
      departamento: document.getElementById('perfilDepartamento').value.trim() || null,
      fecha_nacimiento: document.getElementById('perfilFechaNacimiento').value || null,
      genero: document.getElementById('perfilGenero').value || null,
      direccion: document.getElementById('perfilDireccion').value.trim() || null,
      notas: document.getElementById('perfilNotas').value.trim() || null
    };
  }

  // Crear nuevo perfil
  function crearNuevoPerfil(datos) {
    const nuevoPerfil = {
      id: Date.now(),
      ...datos
    };
    
    perfiles.push(nuevoPerfil);
    renderizarPerfiles();
    ocultarFormulario();
    
    // Simulación de guardado
    setTimeout(() => {
      alert('Perfil creado exitosamente');
    }, 500);
  }

  // Editar perfil existente
  function editarPerfilExistente(datos) {
    const index = perfiles.findIndex(p => p.id === perfilEditando.id);
    if (index !== -1) {
      perfiles[index] = { ...perfilEditando, ...datos };
      renderizarPerfiles();
      ocultarFormulario();
      
      setTimeout(() => {
        alert('Perfil actualizado exitosamente');
      }, 500);
    }
  }

  // Función global para editar perfil
  window.editarPerfil = function(id) {
    const perfil = perfiles.find(p => p.id === id);
    if (perfil) {
      mostrarFormularioEdicion(perfil);
    }
  };

  // Función global para ver perfil completo
  window.verPerfilCompleto = function(id) {
    const perfil = perfiles.find(p => p.id === id);
    if (perfil) {
      const detalles = `
        <strong>Información Personal:</strong>
        • Nombre: ${perfil.nombre} ${perfil.apellido}
        • Usuario: @${perfil.usuario}
        • Fecha de Nacimiento: ${perfil.fecha_nacimiento || 'No especificada'}
        • Género: ${perfil.genero || 'No especificado'}
        
        <strong>Información Profesional:</strong>
        • Cargo: ${perfil.cargo || 'No especificado'}
        • Departamento: ${perfil.departamento || 'No especificado'}
        • Teléfono: ${perfil.telefono || 'No especificado'}
        
        <strong>Dirección:</strong>
        ${perfil.direccion || 'No especificada'}
        
        <strong>Notas:</strong>
        ${perfil.notas || 'Sin notas adicionales'}
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
