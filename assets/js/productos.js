(() => {
  const productosList = document.getElementById('productosList');
  const productoForm = document.getElementById('productoForm');
  const btnNuevoProducto = document.getElementById('btnNuevoProducto');
  const btnCancelarProducto = document.getElementById('btnCancelarProducto');
  const btnGuardarBorradorProducto = document.getElementById('btnGuardarBorradorProducto');

  // Datos de ejemplo de catálogo (inspirado en FACTURA_LINEA pero como maestro)
  const catalogoEjemplo = [
    { id: 1, tipo: 'SERVICIO', nombre: 'Soporte anual', descripcion: 'Soporte y mantenimiento 12 meses', precio_unitario: 500000.00, impuestos: 95000.00 },
    { id: 2, tipo: 'PRODUCTO', nombre: 'Licencia Software', descripcion: 'Licencia perpetua 1 usuario', precio_unitario: 1200000.00, impuestos: 228000.00 }
  ];

  function crearProductoHTML(p) {
    return `
      <div class="resolucion-item" data-id="${p.id}">
        <div class="resolucion-header">
          <div class="resolucion-info">
            <h3>${p.nombre} — ${p.tipo}</h3>
            <p class="resolucion-empresa">${p.descripcion || ''}</p>
          </div>
          <div class="resolucion-actions">
            <button class="btn btn-secondary btn-sm" onclick="editarProducto(${p.id})">Editar</button>
            <button class="btn btn-outline btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button>
          </div>
        </div>
        <div class="resolucion-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Precio Unitario:</span>
              <span class="detail-value">$${p.precio_unitario.toFixed(2)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Impuestos:</span>
              <span class="detail-value">$${(p.impuestos || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function cargarProductos() {
    if (!catalogoEjemplo.length) {
      productosList.innerHTML = `
        <div class="empty-state">
          <p>No hay productos/servicios registrados</p>
          <button class="btn btn-primary" onclick="mostrarFormularioProducto()">Crear primer ítem</button>
        </div>
      `;
      return;
    }
    productosList.innerHTML = catalogoEjemplo.map(p => crearProductoHTML(p)).join('');
  }

  function mostrarFormularioProducto() {
    productoForm.style.display = 'block';
    productoForm.scrollIntoView({ behavior: 'smooth' });
  }

  function ocultarFormularioProducto() {
    productoForm.style.display = 'none';
    productoForm.reset();
  }

  function obtenerDatosProducto() {
    return {
      tipo: document.getElementById('prodTipo').value,
      nombre: document.getElementById('prodNombre').value.trim(),
      descripcion: document.getElementById('prodDescripcion').value.trim(),
      precio_unitario: parseFloat(document.getElementById('prodPrecio').value) || 0,
      impuestos: parseFloat(document.getElementById('prodImpuestos').value) || 0
    };
  }

  function validarProducto() {
    const d = obtenerDatosProducto();
    if (!d.tipo) { alert('El tipo es obligatorio.'); return false; }
    if (!d.nombre) { alert('El nombre es obligatorio.'); return false; }
    if (d.precio_unitario < 0) { alert('El precio no puede ser negativo.'); return false; }
    if (d.impuestos < 0) { alert('Los impuestos no pueden ser negativos.'); return false; }
    return true;
  }

  // Listeners
  btnNuevoProducto?.addEventListener('click', () => mostrarFormularioProducto());
  btnCancelarProducto?.addEventListener('click', () => ocultarFormularioProducto());

  btnGuardarBorradorProducto?.addEventListener('click', () => {
    const d = obtenerDatosProducto();
    btnGuardarBorradorProducto.disabled = true;
    btnGuardarBorradorProducto.textContent = 'Guardando...';
    setTimeout(() => {
      btnGuardarBorradorProducto.disabled = false;
      btnGuardarBorradorProducto.textContent = 'Guardar Borrador';
      localStorage.setItem('producto_borrador', JSON.stringify(d));
      alert('Borrador guardado exitosamente.');
    }, 1000);
  });

  productoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarProducto()) return;
    const d = obtenerDatosProducto();
    const submitButton = productoForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar';
      alert('Ítem guardado exitosamente.');
      localStorage.removeItem('producto_borrador');
      catalogoEjemplo.push({ id: Date.now(), ...d });
      ocultarFormularioProducto();
      cargarProductos();
    }, 1200);
  });

  // Carga inicial
  window.addEventListener('load', () => {
    const borrador = localStorage.getItem('producto_borrador');
    if (borrador) {
      const d = JSON.parse(borrador);
      document.getElementById('prodTipo').value = d.tipo || '';
      document.getElementById('prodNombre').value = d.nombre || '';
      document.getElementById('prodDescripcion').value = d.descripcion || '';
      document.getElementById('prodPrecio').value = d.precio_unitario ?? '';
      document.getElementById('prodImpuestos').value = d.impuestos ?? '';
    }
    cargarProductos();
  });

  // Exponer funciones globales para acciones inline
  window.editarProducto = function(id) {
    const p = catalogoEjemplo.find(x => x.id === id);
    if (p) {
      mostrarFormularioProducto();
      document.getElementById('prodTipo').value = p.tipo;
      document.getElementById('prodNombre').value = p.nombre;
      document.getElementById('prodDescripcion').value = p.descripcion || '';
      document.getElementById('prodPrecio').value = p.precio_unitario;
      document.getElementById('prodImpuestos').value = p.impuestos || 0;
    }
  };

  window.eliminarProducto = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este ítem?')) {
      const index = catalogoEjemplo.findIndex(x => x.id === id);
      if (index > -1) {
        catalogoEjemplo.splice(index, 1);
        cargarProductos();
        alert('Ítem eliminado exitosamente.');
      }
    }
  };
})();


