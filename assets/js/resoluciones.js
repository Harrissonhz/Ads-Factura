(() => {
  // Elementos del DOM
  const resolucionesList = document.getElementById('resolucionesList');
  const resolucionForm = document.getElementById('resolucionForm');
  const btnNuevaResolucion = document.getElementById('btnNuevaResolucion');
  const btnCancelarResolucion = document.getElementById('btnCancelarResolucion');
  const btnGuardarBorradorResolucion = document.getElementById('btnGuardarBorradorResolucion');

  // Datos de ejemplo de resoluciones
  const resolucionesEjemplo = [
    {
      id: 1,
      empresa: 'EMPRESA DEMO S.A.S.',
      prefijo: 'FE',
      rangoInicial: 1,
      rangoFinal: 1000,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      estado: 'ACTIVA',
      numeroDIAN: 'RES-00000001',
      tipoDocumento: 'FACTURA',
      descripcion: 'Resolución para facturación electrónica',
      consecutivoActual: 45
    },
    {
      id: 2,
      empresa: 'EMPRESA DEMO S.A.S.',
      prefijo: 'NC',
      rangoInicial: 1,
      rangoFinal: 500,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      estado: 'ACTIVA',
      numeroDIAN: 'RES-00000002',
      tipoDocumento: 'NOTA_CREDITO',
      descripcion: 'Resolución para notas crédito',
      consecutivoActual: 12
    }
  ];

  // Función para validar fechas
  function validarFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();

    if (inicio >= fin) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      return false;
    }

    if (fin < hoy) {
      alert('La fecha de fin no puede ser anterior a hoy.');
      return false;
    }

    return true;
  }

  // Función para validar rangos
  function validarRangos(rangoInicial, rangoFinal) {
    if (rangoInicial >= rangoFinal) {
      alert('El rango final debe ser mayor al rango inicial.');
      return false;
    }

    if (rangoInicial < 1) {
      alert('El rango inicial debe ser mayor a 0.');
      return false;
    }

    return true;
  }

  // Función para validar el formulario
  function validarFormularioResolucion() {
    const empresa = document.getElementById('resolucionEmpresa').value;
    const prefijo = document.getElementById('resolucionPrefijo').value.trim();
    const rangoInicial = parseInt(document.getElementById('resolucionRangoInicial').value);
    const rangoFinal = parseInt(document.getElementById('resolucionRangoFinal').value);
    const fechaInicio = document.getElementById('resolucionFechaInicio').value;
    const fechaFin = document.getElementById('resolucionFechaFin').value;
    const estado = document.getElementById('resolucionEstado').value;

    if (!empresa) {
      alert('Debe seleccionar una empresa.');
      return false;
    }

    if (!prefijo) {
      alert('El prefijo es obligatorio.');
      return false;
    }

    if (!validarRangos(rangoInicial, rangoFinal)) {
      return false;
    }

    if (!fechaInicio || !fechaFin) {
      alert('Las fechas de inicio y fin son obligatorias.');
      return false;
    }

    if (!validarFechas(fechaInicio, fechaFin)) {
      return false;
    }

    if (!estado) {
      alert('Debe seleccionar un estado.');
      return false;
    }

    return true;
  }

  // Función para obtener datos del formulario
  function obtenerDatosResolucion() {
    return {
      empresa_id: document.getElementById('resolucionEmpresa').value,
      prefijo: document.getElementById('resolucionPrefijo').value.trim(),
      rango_inicial: parseInt(document.getElementById('resolucionRangoInicial').value),
      rango_final: parseInt(document.getElementById('resolucionRangoFinal').value),
      fecha_inicio: document.getElementById('resolucionFechaInicio').value,
      fecha_fin: document.getElementById('resolucionFechaFin').value,
      estado: document.getElementById('resolucionEstado').value,
      numero_dian: document.getElementById('resolucionNumeroDIAN').value.trim(),
      tipo_documento: document.getElementById('resolucionTipoDocumento').value,
      descripcion: document.getElementById('resolucionDescripcion').value.trim(),
      observaciones: document.getElementById('resolucionObservaciones').value.trim()
    };
  }

  // Función para crear el HTML de una resolución
  function crearResolucionHTML(resolucion) {
    const estadoClass = resolucion.estado.toLowerCase();
    const porcentajeUso = Math.round((resolucion.consecutivoActual / resolucion.rangoFinal) * 100);
    
    return `
      <div class="resolucion-item" data-id="${resolucion.id}">
        <div class="resolucion-header">
          <div class="resolucion-info">
            <h3>${resolucion.prefijo} - ${resolucion.numeroDIAN}</h3>
            <p class="resolucion-empresa">${resolucion.empresa}</p>
          </div>
          <div class="resolucion-actions">
            <span class="estado-badge ${estadoClass}">${resolucion.estado}</span>
            <button class="btn btn-secondary btn-sm" onclick="editarResolucion(${resolucion.id})">Editar</button>
            <button class="btn btn-outline btn-sm" onclick="eliminarResolucion(${resolucion.id})">Eliminar</button>
          </div>
        </div>
        
        <div class="resolucion-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Rango:</span>
              <span class="detail-value">${resolucion.rangoInicial} - ${resolucion.rangoFinal}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Consecutivo Actual:</span>
              <span class="detail-value">${resolucion.consecutivoActual}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Uso:</span>
              <span class="detail-value">${porcentajeUso}%</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Vigencia:</span>
              <span class="detail-value">${formatearFecha(resolucion.fechaInicio)} - ${formatearFecha(resolucion.fechaFin)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <span class="detail-value">${resolucion.tipoDocumento}</span>
            </div>
          </div>
          
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${porcentajeUso}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Función para formatear fecha
  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO');
  }

  // Función para cargar resoluciones
  function cargarResoluciones() {
    if (resolucionesEjemplo.length === 0) {
      resolucionesList.innerHTML = `
        <div class="empty-state">
          <p>No hay resoluciones registradas</p>
          <button class="btn btn-primary" onclick="mostrarFormulario()">Crear primera resolución</button>
        </div>
      `;
      return;
    }

    resolucionesList.innerHTML = resolucionesEjemplo.map(resolucion => 
      crearResolucionHTML(resolucion)
    ).join('');
  }

  // Función para mostrar formulario
  function mostrarFormulario() {
    resolucionForm.style.display = 'block';
    resolucionForm.scrollIntoView({ behavior: 'smooth' });
  }

  // Función para ocultar formulario
  function ocultarFormulario() {
    resolucionForm.style.display = 'none';
    resolucionForm.reset();
  }

  // Función para limpiar formulario
  function limpiarFormulario() {
    resolucionForm.reset();
    // Establecer fecha de inicio por defecto (hoy)
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('resolucionFechaInicio').value = hoy;
  }

  // Event listeners
  btnNuevaResolucion?.addEventListener('click', () => {
    mostrarFormulario();
    limpiarFormulario();
  });

  btnCancelarResolucion?.addEventListener('click', () => {
    ocultarFormulario();
  });

  btnGuardarBorradorResolucion?.addEventListener('click', () => {
    const datos = obtenerDatosResolucion();
    
    btnGuardarBorradorResolucion.disabled = true;
    btnGuardarBorradorResolucion.textContent = 'Guardando...';

    setTimeout(() => {
      btnGuardarBorradorResolucion.disabled = false;
      btnGuardarBorradorResolucion.textContent = 'Guardar Borrador';
      
      localStorage.setItem('resolucion_borrador', JSON.stringify(datos));
      alert('Borrador guardado exitosamente.');
    }, 1000);
  });

  // Event listener para el formulario principal
  resolucionForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarFormularioResolucion()) {
      return;
    }

    const datos = obtenerDatosResolucion();
    const submitButton = resolucionForm.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Resolución';
      
      // Simular guardado exitoso
      alert('Resolución guardada exitosamente.');
      
      // Limpiar borrador
      localStorage.removeItem('resolucion_borrador');
      
      // Aquí se enviarían los datos al servidor
      console.log('Datos de la resolución a guardar:', datos);
      
      // Ocultar formulario y recargar lista
      ocultarFormulario();
      cargarResoluciones();
    }, 1500);
  });

  // Validación en tiempo real para rangos
  const rangoInicialInput = document.getElementById('resolucionRangoInicial');
  const rangoFinalInput = document.getElementById('resolucionRangoFinal');
  
  rangoInicialInput?.addEventListener('input', validarRangosEnTiempoReal);
  rangoFinalInput?.addEventListener('input', validarRangosEnTiempoReal);

  function validarRangosEnTiempoReal() {
    const rangoInicial = parseInt(rangoInicialInput.value);
    const rangoFinal = parseInt(rangoFinalInput.value);
    
    if (rangoInicial && rangoFinal && rangoInicial >= rangoFinal) {
      rangoFinalInput.style.borderColor = '#ef4444';
    } else {
      rangoFinalInput.style.borderColor = '';
    }
  }

  // Validación en tiempo real para fechas
  const fechaInicioInput = document.getElementById('resolucionFechaInicio');
  const fechaFinInput = document.getElementById('resolucionFechaFin');
  
  fechaInicioInput?.addEventListener('input', validarFechasEnTiempoReal);
  fechaFinInput?.addEventListener('input', validarFechasEnTiempoReal);

  function validarFechasEnTiempoReal() {
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;
    
    if (fechaInicio && fechaFin && fechaInicio >= fechaFin) {
      fechaFinInput.style.borderColor = '#ef4444';
    } else {
      fechaFinInput.style.borderColor = '';
    }
  }

  // Funciones globales para editar y eliminar
  window.editarResolucion = function(id) {
    const resolucion = resolucionesEjemplo.find(r => r.id === id);
    if (resolucion) {
      mostrarFormulario();
      // Llenar formulario con datos de la resolución
      document.getElementById('resolucionEmpresa').value = '1'; // Asumiendo empresa_id = 1
      document.getElementById('resolucionPrefijo').value = resolucion.prefijo;
      document.getElementById('resolucionRangoInicial').value = resolucion.rangoInicial;
      document.getElementById('resolucionRangoFinal').value = resolucion.rangoFinal;
      document.getElementById('resolucionFechaInicio').value = resolucion.fechaInicio;
      document.getElementById('resolucionFechaFin').value = resolucion.fechaFin;
      document.getElementById('resolucionEstado').value = resolucion.estado;
      document.getElementById('resolucionNumeroDIAN').value = resolucion.numeroDIAN;
      document.getElementById('resolucionTipoDocumento').value = resolucion.tipoDocumento;
      document.getElementById('resolucionDescripcion').value = resolucion.descripcion;
    }
  };

  window.eliminarResolucion = function(id) {
    if (confirm('¿Está seguro de que desea eliminar esta resolución?')) {
      // Simular eliminación
      const index = resolucionesEjemplo.findIndex(r => r.id === id);
      if (index > -1) {
        resolucionesEjemplo.splice(index, 1);
        cargarResoluciones();
        alert('Resolución eliminada exitosamente.');
      }
    }
  };

  // Cargar datos al iniciar la página
  window.addEventListener('load', () => {
    // Intentar cargar borrador guardado
    const borrador = localStorage.getItem('resolucion_borrador');
    if (borrador) {
      const datos = JSON.parse(borrador);
      // Llenar formulario con datos del borrador
      Object.keys(datos).forEach(key => {
        const elemento = document.getElementById(`resolucion${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (elemento) {
          elemento.value = datos[key];
        }
      });
    }

    // Cargar resoluciones
    cargarResoluciones();
  });

})();
