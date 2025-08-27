(() => {
  let lineasFactura = [];
  let contadorLineas = 0;

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
    const requiredFields = facturaForm.querySelectorAll('[required]');
    let isValid = true;
    
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
    
    if (validarFormulario()) {
      const datos = obtenerDatosFactura();
      
      // Simulación de envío a DIAN
      const submitButton = facturaForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando a DIAN...';
      
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Crear y Enviar a DIAN';
        alert('Factura creada y enviada a DIAN exitosamente.');
        console.log('Datos de la factura:', datos);
        
        // Generar CUFE simulado
        const cufe = `CUFE${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        alert(`CUFE generado: ${cufe}`);
      }, 2000);
    }
  });

  // Crear primera línea por defecto
  if (btnAgregarLinea) {
    crearLinea();
  }

  // Hacer la función eliminarLinea global para que funcione desde el HTML
  window.eliminarLinea = eliminarLinea;

})();
