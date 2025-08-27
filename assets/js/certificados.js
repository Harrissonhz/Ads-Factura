(() => {
  // Elementos del DOM
  const certificadosList = document.getElementById('certificadosList');
  const certificadoForm = document.getElementById('certificadoForm');
  const btnNuevoCertificado = document.getElementById('btnNuevoCertificado');
  const btnCancelarCertificado = document.getElementById('btnCancelarCertificado');
  const btnGuardarBorradorCert = document.getElementById('btnGuardarBorradorCert');

  // Datos de ejemplo basados en CERTIFICADO_DIGITAL del modelo
  const certificadosEjemplo = [
    {
      id: 1,
      empresa: 'EMPRESA DEMO S.A.S.',
      nombre: 'Certificado Demo',
      serie: 'SERIE12345',
      fechaInicio: '2025-01-01',
      fechaFin: '2027-01-01',
      ubicacion: '/certs/empresa_demo.pfx',
      estado: 'VIGENTE'
    }
  ];

  // Valida fechas
  function validarFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (isNaN(inicio) || isNaN(fin)) return false;
    if (inicio >= fin) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.');
      return false;
    }
    return true;
  }

  // Determina estado por vigencia
  function obtenerEstadoPorVigencia(fechaInicio, fechaFin) {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (hoy < inicio) return 'NO_VIGENTE';
    if (hoy > fin) return 'VENCIDO';
    return 'VIGENTE';
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO');
  }

  function crearCertificadoHTML(cert) {
    const estadoClass = cert.estado.toLowerCase();
    return `
      <div class="resolucion-item" data-id="${cert.id}">
        <div class="resolucion-header">
          <div class="resolucion-info">
            <h3>${cert.nombre} — ${cert.serie}</h3>
            <p class="resolucion-empresa">${cert.empresa}</p>
          </div>
          <div class="resolucion-actions">
            <span class="estado-badge ${estadoClass}">${cert.estado}</span>
            <button class="btn btn-secondary btn-sm" onclick="editarCertificado(${cert.id})">Editar</button>
            <button class="btn btn-outline btn-sm" onclick="eliminarCertificado(${cert.id})">Eliminar</button>
          </div>
        </div>
        <div class="resolucion-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Vigencia:</span>
              <span class="detail-value">${formatearFecha(cert.fechaInicio)} - ${formatearFecha(cert.fechaFin)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ubicación:</span>
              <span class="detail-value">${cert.ubicacion}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function cargarCertificados() {
    if (!certificadosEjemplo.length) {
      certificadosList.innerHTML = `
        <div class="empty-state">
          <p>No hay certificados registrados</p>
          <button class="btn btn-primary" onclick="mostrarFormularioCert()">Crear primer certificado</button>
        </div>
      `;
      return;
    }
    certificadosList.innerHTML = certificadosEjemplo
      .map(cert => crearCertificadoHTML(cert))
      .join('');
  }

  function mostrarFormularioCert() {
    certificadoForm.style.display = 'block';
    certificadoForm.scrollIntoView({ behavior: 'smooth' });
  }

  function ocultarFormularioCert() {
    certificadoForm.style.display = 'none';
    certificadoForm.reset();
  }

  function obtenerDatosCertificado() {
    return {
      empresa_id: document.getElementById('certEmpresa').value,
      nombre_certificado: document.getElementById('certNombre').value.trim(),
      serie: document.getElementById('certSerie').value.trim(),
      fecha_inicio: document.getElementById('certFechaInicio').value,
      fecha_fin: document.getElementById('certFechaFin').value,
      ubicacion: document.getElementById('certUbicacion').value.trim()
    };
  }

  function validarFormularioCert() {
    const datos = obtenerDatosCertificado();
    if (!datos.empresa_id) {
      alert('Debe seleccionar una empresa.');
      return false;
    }
    if (!datos.nombre_certificado) {
      alert('El nombre del certificado es obligatorio.');
      return false;
    }
    if (!datos.serie) {
      alert('La serie del certificado es obligatoria.');
      return false;
    }
    if (!datos.ubicacion) {
      alert('La ubicación del certificado es obligatoria.');
      return false;
    }
    if (!datos.fecha_inicio || !datos.fecha_fin) {
      alert('Las fechas de inicio y fin son obligatorias.');
      return false;
    }
    if (!validarFechas(datos.fecha_inicio, datos.fecha_fin)) {
      return false;
    }
    return true;
  }

  // Event listeners
  btnNuevoCertificado?.addEventListener('click', () => {
    mostrarFormularioCert();
  });

  btnCancelarCertificado?.addEventListener('click', () => {
    ocultarFormularioCert();
  });

  btnGuardarBorradorCert?.addEventListener('click', () => {
    const datos = obtenerDatosCertificado();
    btnGuardarBorradorCert.disabled = true;
    btnGuardarBorradorCert.textContent = 'Guardando...';
    setTimeout(() => {
      btnGuardarBorradorCert.disabled = false;
      btnGuardarBorradorCert.textContent = 'Guardar Borrador';
      localStorage.setItem('certificado_borrador', JSON.stringify(datos));
      alert('Borrador guardado exitosamente.');
    }, 1000);
  });

  certificadoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarFormularioCert()) return;
    const datos = obtenerDatosCertificado();
    const submitButton = certificadoForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Certificado';
      alert('Certificado guardado exitosamente.');
      localStorage.removeItem('certificado_borrador');
      console.log('Datos del certificado a guardar:', datos);
      ocultarFormularioCert();
      cargarCertificados();
    }, 1500);
  });

  // Cargar borrador si existe y datos de ejemplo
  window.addEventListener('load', () => {
    const borrador = localStorage.getItem('certificado_borrador');
    if (borrador) {
      const datos = JSON.parse(borrador);
      Object.keys(datos).forEach(key => {
        const el = document.getElementById(`cert${key.split('_').map((p, i) => i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1)).join('')}`);
        if (el) el.value = datos[key];
      });
    }

    // Actualizar estado por vigencia en ejemplo
    certificadosEjemplo.forEach(c => {
      c.estado = obtenerEstadoPorVigencia(c.fechaInicio, c.fechaFin);
    });
    cargarCertificados();
  });

  // Exponer funciones globales para botones inline
  window.editarCertificado = function(id) {
    const cert = certificadosEjemplo.find(c => c.id === id);
    if (cert) {
      mostrarFormularioCert();
      document.getElementById('certEmpresa').value = '1';
      document.getElementById('certNombre').value = cert.nombre;
      document.getElementById('certSerie').value = cert.serie;
      document.getElementById('certUbicacion').value = cert.ubicacion;
      document.getElementById('certFechaInicio').value = cert.fechaInicio;
      document.getElementById('certFechaFin').value = cert.fechaFin;
    }
  };

  window.eliminarCertificado = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este certificado?')) {
      const index = certificadosEjemplo.findIndex(c => c.id === id);
      if (index > -1) {
        certificadosEjemplo.splice(index, 1);
        cargarCertificados();
        alert('Certificado eliminado exitosamente.');
      }
    }
  };
})();


