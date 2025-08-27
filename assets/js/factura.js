(() => {
  let lineasFactura = [];
  let contadorLineas = 0;
  const docTipo = document.getElementById('docTipo');
  const docFacturaRelacionadaField = document.getElementById('docFacturaRelacionadaField');
  const docFacturaRelacionada = document.getElementById('docFacturaRelacionada');
  const facturaDatosSection = document.getElementById('facturaDatosSection');
  const notaDatosSection = document.getElementById('notaDatosSection');
  const documentoSoporteDatosSection = document.getElementById('documentoSoporteDatosSection');
  const lineasSection = document.getElementById('lineasSection');
  const facturaDatosTitle = facturaDatosSection?.querySelector('h2');
  const notaDatosTitle = notaDatosSection?.querySelector('h2');
  const pageTitleEl = document.querySelector('.factura-header h1');

  // Elementos del DOM
  const facturaForm = document.getElementById('facturaForm');
  const lineasContainer = document.getElementById('lineasFactura');
  const btnAgregarLinea = document.getElementById('btnAgregarLinea');
  const btnGuardarBorrador = document.getElementById('btnGuardarBorrador');
  const subtotalEl = document.getElementById('subtotal');
  const impuestosEl = document.getElementById('impuestos');
  const totalEl = document.getElementById('total');

  // Establecer fecha actual por defecto
  const fechaInput = document.getElementById('facturaFecha');
  if (fechaInput) {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    fechaInput.value = localDateTime;
  }

  // Establecer fecha default de Nota
  const notaFecha = document.getElementById('notaFecha');
  if (notaFecha) {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    notaFecha.value = local;
  }

  // Configurar fecha por defecto para Documento Soporte
  const documentoSoporteFecha = document.getElementById('documentoSoporteFecha');
  if (documentoSoporteFecha) {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    documentoSoporteFecha.value = local;
  }

  // Poblar facturas relacionadas (mock)
  if (docFacturaRelacionada) {
    const facturasMock = [
      { id: 1, etiqueta: 'FE-1001 — EMPRESA DEMO / CLIENTE PRUEBA' }
    ];
    docFacturaRelacionada.innerHTML = '<option value="">Sin selección</option>' + facturasMock.map(f => `<option value="${f.id}">${f.etiqueta}</option>`).join('');
  }

  function actualizarUIporTipo() {
    const tipo = docTipo?.value || 'FACTURA';
    const esFactura = tipo === 'FACTURA';
    const esNota = tipo === 'NOTA_CREDITO' || tipo === 'NOTA_DEBITO';
    const esDocumentoSoporte = tipo === 'DOCUMENTO_SOPORTE';
    
    // Ocultar todas las secciones primero
    facturaDatosSection.style.display = 'none';
    notaDatosSection.style.display = 'none';
    documentoSoporteDatosSection.style.display = 'none';
    
    // Mostrar la sección correspondiente
    if (esFactura) {
      facturaDatosSection.style.display = '';
    } else if (esNota) {
      notaDatosSection.style.display = '';
    } else if (esDocumentoSoporte) {
      documentoSoporteDatosSection.style.display = '';
    }
    
    // Mostrar líneas para todos los tipos
    lineasSection.style.display = '';
    
    // Mostrar campo de factura relacionada solo para notas
    docFacturaRelacionadaField.style.display = esNota ? '' : 'none';

    // Ajustar títulos según el tipo
    if (esFactura) {
      if (facturaDatosTitle) facturaDatosTitle.textContent = 'Datos de la Factura';
      if (pageTitleEl) pageTitleEl.textContent = 'Crear Factura Electrónica';
    } else if (esNota) {
      if (notaDatosTitle) notaDatosTitle.textContent = (tipo === 'NOTA_CREDITO') ? 'Datos de la Nota Crédito' : 'Datos de la Nota Débito';
      if (pageTitleEl) pageTitleEl.textContent = (tipo === 'NOTA_CREDITO') ? 'Crear Nota Crédito' : 'Crear Nota Débito';
    } else if (esDocumentoSoporte) {
      if (pageTitleEl) pageTitleEl.textContent = 'Crear Documento Soporte';
    }
  }

  docTipo?.addEventListener('change', actualizarUIporTipo);
  actualizarUIporTipo();

  // Función para crear una nueva línea de factura
  function crearLinea() {
    const lineaId = `linea-${contadorLineas++}`;
    const linea = {
      id: lineaId,
      producto: '',
      cantidad: 1,
      precioUnitario: 0,
      impuestos: 0,
      total: 0
    };

    const lineaHTML = `
      <div class="linea-item" id="${lineaId}">
        <div class="linea-col" data-label="Producto/Servicio">
          <input type="text" placeholder="Descripción del producto" class="linea-producto" required>
        </div>
        <div class="linea-col" data-label="Cantidad">
          <input type="number" placeholder="1" min="0.01" step="0.01" class="linea-cantidad" value="1" required>
        </div>
        <div class="linea-col" data-label="Precio Unit.">
          <input type="number" placeholder="0.00" min="0" step="0.01" class="linea-precio" value="0" required>
        </div>
        <div class="linea-col" data-label="Impuestos">
          <input type="number" placeholder="0.00" min="0" step="0.01" class="linea-impuestos" value="0" required>
        </div>
        <div class="linea-col" data-label="Total">
          <input type="number" placeholder="0.00" class="linea-total" readonly>
        </div>
        <div class="linea-col" data-label="Acciones">
          <button type="button" class="btn-remove" onclick="eliminarLinea('${lineaId}')">Eliminar</button>
        </div>
      </div>
    `;

    lineasContainer.insertAdjacentHTML('beforeend', lineaHTML);
    lineasFactura.push(linea);

    // Agregar event listeners a los inputs de la nueva línea
    const lineaElement = document.getElementById(lineaId);
    const inputs = lineaElement.querySelectorAll('input');
    
    inputs[1].addEventListener('input', () => calcularLinea(lineaId)); // cantidad
    inputs[2].addEventListener('input', () => calcularLinea(lineaId)); // precio
    inputs[3].addEventListener('input', () => calcularLinea(lineaId)); // impuestos

    return lineaId;
  }

  // Función para calcular el total de una línea
  function calcularLinea(lineaId) {
    const lineaElement = document.getElementById(lineaId);
    const cantidad = parseFloat(lineaElement.querySelector('.linea-cantidad').value) || 0;
    const precio = parseFloat(lineaElement.querySelector('.linea-precio').value) || 0;
    const impuestos = parseFloat(lineaElement.querySelector('.linea-impuestos').value) || 0;
    
    const subtotalLinea = cantidad * precio;
    const totalLinea = subtotalLinea + impuestos;
    
    lineaElement.querySelector('.linea-total').value = totalLinea.toFixed(2);
    
    // Actualizar el objeto de la línea
    const linea = lineasFactura.find(l => l.id === lineaId);
    if (linea) {
      linea.cantidad = cantidad;
      linea.precioUnitario = precio;
      linea.impuestos = impuestos;
      linea.total = totalLinea;
    }
    
    calcularTotales();
  }

  // Función para eliminar una línea
  function eliminarLinea(lineaId) {
    const lineaElement = document.getElementById(lineaId);
    if (lineaElement) {
      lineaElement.remove();
      lineasFactura = lineasFactura.filter(l => l.id !== lineaId);
      calcularTotales();
    }
  }

  // Función para calcular totales generales
  function calcularTotales() {
    const subtotal = lineasFactura.reduce((sum, linea) => {
      return sum + (linea.cantidad * linea.precioUnitario);
    }, 0);
    
    const impuestos = lineasFactura.reduce((sum, linea) => {
      return sum + linea.impuestos;
    }, 0);
    
    const total = subtotal + impuestos;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    impuestosEl.textContent = `$${impuestos.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  // Función para validar el formulario
  function validarFormulario() {
    const tipo = docTipo?.value || 'FACTURA';
    let isValid = true;
    if (tipo === 'FACTURA') {
      const requiredFields = facturaForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (lineasFactura.length === 0) {
        alert('Debes agregar al menos una línea de producto.');
        return false;
      }
    } else if (tipo === 'NOTA_CREDITO' || tipo === 'NOTA_DEBITO') {
      // Validación para notas (mismos campos que factura)
      const prefijo = document.getElementById('notaPrefijo')?.value.trim();
      const consecutivo = document.getElementById('notaConsecutivo')?.value;
      const fecha = document.getElementById('notaFecha')?.value;
      const estado = document.getElementById('notaEstado')?.value;
      if (!prefijo) { alert('El prefijo es obligatorio.'); return false; }
      if (!consecutivo) { alert('El consecutivo es obligatorio.'); return false; }
      if (!fecha) { alert('La fecha de emisión es obligatoria.'); return false; }
      if (!estado) { alert('El estado DIAN es obligatorio.'); return false; }
    } else if (tipo === 'DOCUMENTO_SOPORTE') {
      // Validación para documentos soporte (mismos campos que factura)
      const prefijo = document.getElementById('documentoSoportePrefijo')?.value.trim();
      const consecutivo = document.getElementById('documentoSoporteConsecutivo')?.value;
      const fecha = document.getElementById('documentoSoporteFecha')?.value;
      const estado = document.getElementById('documentoSoporteEstado')?.value;
      if (!prefijo) { alert('El prefijo es obligatorio.'); return false; }
      if (!consecutivo) { alert('El consecutivo es obligatorio.'); return false; }
      if (!fecha) { alert('La fecha de emisión es obligatoria.'); return false; }
      if (!estado) { alert('El estado DIAN es obligatorio.'); return false; }
    }
    return isValid;
  }

  // Función para obtener datos del formulario
  function obtenerDatosFactura() {
    return {
      empresa: {
        nit: document.getElementById('empresaNit').value,
        razonSocial: document.getElementById('empresaRazon').value,
        direccion: document.getElementById('empresaDireccion').value,
        regimen: document.getElementById('empresaRegimen').value
      },
      cliente: {
        nit: document.getElementById('clienteNit').value,
        razonSocial: document.getElementById('clienteRazon').value,
        direccion: document.getElementById('clienteDireccion').value,
        email: document.getElementById('clienteEmail').value
      },
      factura: {
        prefijo: document.getElementById('facturaPrefijo').value,
        consecutivo: document.getElementById('facturaConsecutivo').value,
        fechaEmision: document.getElementById('facturaFecha').value,
        estadoDian: document.getElementById('facturaEstado').value
      },
      lineas: lineasFactura,
      totales: {
        subtotal: parseFloat(subtotalEl.textContent.replace('$', '')) || 0,
        impuestos: parseFloat(impuestosEl.textContent.replace('$', '')) || 0,
        total: parseFloat(totalEl.textContent.replace('$', '')) || 0
      }
    };
  }

  // Event Listeners
  btnAgregarLinea?.addEventListener('click', crearLinea);
  
  btnGuardarBorrador?.addEventListener('click', () => {
    if (validarFormulario()) {
      const datos = obtenerDatosFactura();
      datos.factura.estadoDian = 'BORRADOR';
      
      // Simulación de guardado
      const submitButton = btnGuardarBorrador;
      submitButton.disabled = true;
      submitButton.textContent = 'Guardando...';
      
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Borrador';
        alert('Borrador guardado exitosamente.');
        console.log('Datos del borrador:', datos);
      }, 1000);
    }
  });

  facturaForm?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    
    if (!validarFormulario()) return;
    const tipo = docTipo?.value || 'FACTURA';
    const submitButton = facturaForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Procesando...';
    if (tipo === 'FACTURA') {
      const datos = obtenerDatosFactura();
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Crear y Enviar a DIAN';
        alert('Factura creada y enviada a DIAN exitosamente.');
        console.log('Datos de la factura:', datos);
        const cufe = `CUFE${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        alert(`CUFE generado: ${cufe}`);
      }, 2000);
    } else if (tipo === 'NOTA_CREDITO' || tipo === 'NOTA_DEBITO') {
      const datosNota = {
        tipo,
        factura_id: docFacturaRelacionada?.value ? parseInt(docFacturaRelacionada.value) : null,
        prefijo: document.getElementById('notaPrefijo')?.value.trim(),
        consecutivo: document.getElementById('notaConsecutivo')?.value,
        fecha_emision: document.getElementById('notaFecha')?.value,
        estado_dian: document.getElementById('notaEstado')?.value
      };
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Crear y Enviar a DIAN';
        alert(`${tipo === 'NOTA_CREDITO' ? 'Nota crédito' : 'Nota débito'} creada exitosamente.`);
        console.log('Datos de la nota:', datosNota);
      }, 1500);
    } else if (tipo === 'DOCUMENTO_SOPORTE') {
      const datosDocumentoSoporte = {
        tipo,
        prefijo: document.getElementById('documentoSoportePrefijo')?.value.trim(),
        consecutivo: document.getElementById('documentoSoporteConsecutivo')?.value,
        fecha_emision: document.getElementById('documentoSoporteFecha')?.value,
        estado_dian: document.getElementById('documentoSoporteEstado')?.value
      };
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Crear y Enviar a DIAN';
        alert('Documento Soporte creado exitosamente.');
        console.log('Datos del documento soporte:', datosDocumentoSoporte);
      }, 1500);
    }
  });

  // Crear primera línea por defecto
  if (btnAgregarLinea) {
    crearLinea();
  }

  // Hacer la función eliminarLinea global para que funcione desde el HTML
  window.eliminarLinea = eliminarLinea;

})();
