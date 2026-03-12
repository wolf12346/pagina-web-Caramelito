// --- Buscador de productos (copied from the buscador section) ---
(function() {
  const input = document.getElementById('buscador');
  const productos = document.querySelectorAll('.producto');
  const mensajeVacio = document.getElementById('mensaje-vacio');

  if (input) {
    input.addEventListener('input', function () {
      const texto = this.value.toLowerCase();
      let encontrados = 0;

      productos.forEach(producto => {
        const nombre = (producto.dataset.nombre || '').toLowerCase();
        if (nombre.includes(texto)) {
          producto.style.display = '';
          encontrados++;
        } else {
          producto.style.display = 'none';
        }
      });

      if (mensajeVacio) mensajeVacio.style.display = encontrados === 0 ? 'block' : 'none';
    });
  }
})();

// --- Script principal (moved from bottom of original HTML) ---
// --- Pantalla Login ---
let usuariosGuardados = JSON.parse(localStorage.getItem("usuariosCaramelito")) || {};
let modoRegistro = false;
function cambiarModo(registro) {
  modoRegistro = registro;
  document.getElementById("tituloLogin").textContent = registro ? "Crear Cuenta" : "Iniciar Sesión";
  document.getElementById("botonLogin").textContent = registro ? "Registrarse" : "Entrar";
  document.getElementById("mensajeLogin").textContent = "";
}
document.getElementById('formLogin')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const mensaje = document.getElementById("mensajeLogin");
  if (!email || !pass) {
    mensaje.textContent = "Completa todos los campos.";
    return;
  }
  if (modoRegistro) {
    if (usuariosGuardados[email]) {
      mensaje.textContent = "Ese correo ya está registrado.";
    } else {
      usuariosGuardados[email] = pass;
      localStorage.setItem("usuariosCaramelito", JSON.stringify(usuariosGuardados));
      mensaje.textContent = "¡Cuenta creada con éxito!";
      setTimeout(() => cambiarModo(false), 1000);
    }
  } else {
    if (usuariosGuardados[email] === pass) {
      localStorage.setItem("usuarioActivo", email);
      document.getElementById("pantallaLogin").classList.add("oculto");
      document.body.classList.remove("bloqueado");
      actualizarCuentasLista();
    } else {
      mensaje.textContent = "Correo o contraseña incorrectos.";
    }
  }
});
function mostrar(id) {
  const secciones = document.querySelectorAll('main section');
  secciones.forEach(sec => sec.classList.add('hidden'));
  const activa = document.getElementById(id);
  if (activa) activa.classList.remove('hidden');
  if(id === 'personalizarCuenta') {
    let cuenta = JSON.parse(localStorage.getItem("datosCuenta")||"{}");
    document.getElementById("cuentaNombre").value = cuenta.nombre||'';
    document.getElementById("cuentaEmail").value = cuenta.email||localStorage.getItem("usuarioActivo")||'';
    document.getElementById("cuentaColor").value = cuenta.color||'#ff6f91';
    actualizarCuentasLista();
  }
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  if(id === 'productosPrincipales') document.querySelector('.nav-links a:nth-child(1)').classList.add('active');
  if(id === 'catalogo') document.querySelector('.nav-links a:nth-child(2)').classList.add('active');
  if(id === 'about') document.querySelector('.nav-links a:nth-child(3)').classList.add('active');
  if(id === 'personalizarCuenta') document.querySelector('.nav-links a:nth-child(4)').classList.add('active');
  if(id === 'formasPago') document.querySelector('.nav-links a:nth-child(5)').classList.add('active');
}
function actualizarCuentasLista() {
  let cuentasLista = document.getElementById('cuentasLista');
  let usuarioActivo = localStorage.getItem("usuarioActivo");
  let cuentas = Object.keys(usuariosGuardados);
  cuentasLista.innerHTML = cuentas.length
    ? 'Cuentas:&nbsp;' + cuentas.map(email =>
      `<span ${usuarioActivo===email?'class="seleccionada"':''} onclick="cambiarCuenta('${email}')">${email}</span>`
    ).join('')
    : 'Sin cuentas registradas.';
}
function cambiarCuenta(email) {
  if (usuariosGuardados[email]) {
    localStorage.setItem("usuarioActivo", email);
    mostrar('personalizarCuenta');
  }
}
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  document.getElementById("pantallaLogin").classList.remove("oculto");
  mostrar('productosPrincipales');
}
document.getElementById('formCuenta')?.addEventListener('submit', function(e){
  e.preventDefault();
  const nombre = document.getElementById('cuentaNombre').value.trim();
  const email = document.getElementById('cuentaEmail').value.trim();
  const color = document.getElementById('cuentaColor').value;
  const mensajeCuenta = document.getElementById('mensajeCuenta');
  if(!nombre || !email){
    mensajeCuenta.textContent = "Completa todos los campos.";
    mensajeCuenta.style.color = "red";
    return;
  }
  localStorage.setItem("datosCuenta", JSON.stringify({nombre,email,color}));
  mensajeCuenta.textContent = "¡Cambios guardados!";
  mensajeCuenta.style.color = "green";
  setTimeout(() => { mensajeCuenta.textContent = ""; }, 3000);
  document.body.style.background = color === "#ffe0eb" ? 
    "linear-gradient(120deg, #ffe0eb 0%, #fff7ae 100%)" :
    color === "#fff7ae" ? "linear-gradient(120deg, #fff7ae 0%, #ff6f91 100%)" :
    color === "#aeefff" ? "linear-gradient(120deg, #aeefff 0%, #fff7ae 100%)" :
    color === "#f5f5f5" ? "linear-gradient(120deg, #f5f5f5 0%, #ff6f91 100%)" :
    "linear-gradient(120deg, #ff6f91 0%, #fff7ae 100%)";
});
document.getElementById('formAñadirCuenta')?.addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById("nuevoEmail").value.trim();
  const pass = document.getElementById("nuevoPass").value.trim();
  const mensaje = document.getElementById("mensajeAñadirCuenta");
  if (!email || !pass) {
    mensaje.textContent = "Completa todos los campos.";
    mensaje.style.color = "red";
    return;
  }
  if (usuariosGuardados[email]) {
    mensaje.textContent = "Ese correo ya está registrado.";
    mensaje.style.color = "red";
  } else {
    usuariosGuardados[email] = pass;
    localStorage.setItem("usuariosCaramelito", JSON.stringify(usuariosGuardados));
    mensaje.textContent = "¡Cuenta añadida con éxito!";
    mensaje.style.color = "green";
    setTimeout(() => { mensaje.textContent = ""; mostrar('personalizarCuenta'); actualizarCuentasLista(); }, 1200);
  }
  this.reset();
});
document.getElementById('pedidoForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const direccion = document.getElementById('direccion').value.trim();
  const departamento = document.getElementById('departamento').value.trim();
  const municipio = document.getElementById('municipio').value.trim();
  const pais = document.getElementById('pais').value.trim();
  const detalles = document.getElementById('detalles').value.trim();
  const mensajePedido = document.getElementById('mensajePedido');
  if (!direccion || !departamento || !municipio || !pais || !detalles) {
    mensajePedido.textContent = "Por favor, completa todos los campos.";
    mensajePedido.style.color = "red";
    return;
  }
  // Enviar a WhatsApp
  const mensaje =
    `¡Hola! Quiero personalizar un pedido:%0A` +
    `Dirección: ${direccion}%0A` +
    `Departamento: ${departamento}%0A` +
    `Municipio: ${municipio}%0A` +
    `País: ${pais}%0A` +
    `Detalles: ${detalles}`;
  const numero = "573207514140";
  const enlace = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(enlace, "_blank");
  mensajePedido.textContent = "Redirigiendo a WhatsApp...";
  mensajePedido.style.color = "green";
  this.reset();
  setTimeout(() => { mensajePedido.textContent = ""; }, 3000);
});
if(localStorage.getItem("usuarioActivo")) actualizarCuentasLista();
mostrar('productosPrincipales');
// --- SISTEMA DE CARRITO DE COMPRAS ---
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("caramelitoCarrito") || "[]");
}
function guardarCarrito(carrito) {
  localStorage.setItem("caramelitoCarrito", JSON.stringify(carrito));
}
function agregarAlCarrito(nombre, precio) {
  const mensajeError = document.getElementById("carritoMensajeError");
  if (
    !nombre ||
    typeof nombre !== "string" ||
    nombre.trim() === "" ||
    nombre === "null" ||
    isNaN(precio) ||
    precio <= 0
  ) {
    if (mensajeError) {
      mensajeError.textContent = "¡Error al agregar producto! Verifica el nombre y precio.";
      mensajeError.style.color = "#e35336";
      mensajeError.style.margin = "10px 0 10px 0";
      mensajeError.style.fontWeight = "bold";
    }
    return;
  }
  if (mensajeError) mensajeError.textContent = "";
  let carrito = obtenerCarrito();
  let existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito(carrito);
  actualizarCarritoUI();
}
function quitarDelCarrito(nombre) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(p => p.nombre !== nombre);
  guardarCarrito(carrito);
  actualizarCarritoUI();  
}
function actualizarCarritoUI() {
  const contenido = document.getElementById("contenidoCarrito");
  let carrito = obtenerCarrito();
  let btnPagar = document.getElementById("btnPagarCarrito");
  if (!contenido) return;
  if (carrito.length === 0) {
    contenido.innerHTML = "No hay productos en el carrito.";
    if(btnPagar) btnPagar.style.display = "none";
    document.getElementById("metodosPagoCarrito").style.display = "none";
    document.getElementById("qrNequiPago").style.display = "none";
    document.getElementById("pasarelaWompi").style.display = "none";
    document.getElementById("mensajePagoCarrito").textContent = "";
    return;
  }
  contenido.innerHTML = carrito.map(prod => `
    <div style="margin-bottom:8px;">
      <b>${prod.nombre}</b> x${prod.cantidad} – $${(prod.precio*prod.cantidad).toLocaleString()}
      ${prod.personalizado ? `<br><img src="${prod.imagen}" alt="Personalización" style="max-width:80px;max-height:80px;border-radius:8px;margin-top:5px;">
      <br><i>${prod.detalles}</i>` : ''}
      <button class="boton-quitar-carrito" data-nombre="${encodeURIComponent(prod.nombre)}" style="margin-left:10px;color:#e35336;">Quitar</button>
    </div>
  `).join("");
  if(btnPagar) btnPagar.style.display = "block";
  document.getElementById("metodosPagoCarrito").style.display = "none";
  document.getElementById("qrNequiPago").style.display = "none";
  document.getElementById("pasarelaWompi").style.display = "none";
  document.getElementById("mensajePagoCarrito").textContent = "";
  document.querySelectorAll('.boton-quitar-carrito').forEach(boton => {
    boton.onclick = function() {
      quitarDelCarrito(decodeURIComponent(this.dataset.nombre));
    }
  });
}
// --- BOTÓN PAGAR Y PROCESAR PEDIDO ---
document.getElementById('btnPagarCarrito').onclick = function() {
  document.getElementById("metodosPagoCarrito").style.display = "block";
  document.getElementById("mensajePagoCarrito").textContent = "";
}
// Nuevo: mostrar QR o pasarela
function mostrarPago(metodo) {
  if(metodo === 'Nequi') {
    document.getElementById("qrNequiPago").style.display = "block";
    document.getElementById("pasarelaWompi").style.display = "none";
  } else if(metodo === 'Bancolombia') {
    document.getElementById("pasarelaWompi").style.display = "block";
    document.getElementById("qrNequiPago").style.display = "none";
  }
}
// Confirmar pago QR
document.getElementById('btnConfirmarPagoQR').onclick = function() {
  procesarPago('Nequi');
  document.getElementById("qrNequiPago").style.display = "none";
};
// Pagar con Wompi
document.getElementById('btnPayWompi').onclick = function() {
  procesarPago('Bancolombia');
  document.getElementById("pasarelaWompi").style.display = "none";
};
function procesarPago(metodo) {
  let carrito = obtenerCarrito();
  if (!carrito.length) return;
  let pedidos = JSON.parse(localStorage.getItem("caramelitoPedidos") || "[]");
  const fecha = new Date();
  pedidos.push({
    productos: carrito,
    metodo: metodo,
    fecha: fecha.toLocaleString()
  });
  localStorage.setItem("caramelitoPedidos", JSON.stringify(pedidos));
  guardarCarrito([]);
  actualizarCarritoUI();
  document.getElementById("metodosPagoCarrito").style.display = "none";
  document.getElementById("mensajePagoCarrito").textContent = `¡Pago exitoso con ${metodo}! Tu pedido fue registrado.`;
  actualizarPedidosUI();
}
function actualizarPedidosUI() {
  const cont = document.getElementById("contenidoPedidos");
  let pedidos = JSON.parse(localStorage.getItem("caramelitoPedidos") || "[]");
  if (!cont) return;
  if (pedidos.length === 0) {
    cont.textContent = "No se encuentra ningún pedido registrado.";
    return;
  }
  cont.innerHTML = pedidos.map(ped =>
    `<div style="margin-bottom:20px;border-bottom:1px solid #f38c81;padding-bottom:10px;">
      <b>Fecha:</b> ${ped.fecha}<br>
      <b>Método:</b> ${ped.metodo}<br>
      <b>Productos:</b><br>
      ${ped.productos.map(pr => `- ${pr.nombre} x${pr.cantidad} ($${(pr.precio*pr.cantidad).toLocaleString()})${pr.personalizado ? `<br><img src="${pr.imagen}" alt="Personalización" style="max-width:80px;max-height:80px;border-radius:8px;margin:4px 0 2px 0;"><br><i>${pr.detalles}</i>` : ''}`).join('<br>')}
    </div>`
  ).join("");
}
// --- Eventos para los botones de carrito ---
function asignarEventosCarrito() {
  document.querySelectorAll('.boton-terracota').forEach(boton => {
    if (!boton.dataset.carritoReady) {
      boton.addEventListener('click', function() {
        const nombre = this.getAttribute('data-nombre');
        const precio = parseInt(this.getAttribute('data-precio'), 10);
        agregarAlCarrito(nombre, precio);
      });
      boton.dataset.carritoReady = "true";
    }
  });
}
asignarEventosCarrito();
const mostrarOriginal = window.mostrar || function() {};
window.mostrar = function(id) {
  mostrarOriginal(id);
  if (id === 'carrito') actualizarCarritoUI();
  if (id === 'pedidos') actualizarPedidosUI();
  asignarEventosCarrito();
}
// --- FIN SISTEMA DE CARRITO ---
// --- Personaliza tu pedido (modal) ---
document.querySelectorAll('.btn-personalizar').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('modalPersonaliza').style.display = 'flex';
    document.getElementById('nombreProductoPersonaliza').innerText = this.dataset.nombre;
    document.getElementById('formPersonaliza').dataset.nombre = this.dataset.nombre;
    document.getElementById('formPersonaliza').dataset.precio = this.dataset.precio;
    document.getElementById('msgPersonaliza').textContent = "";
    document.getElementById('inputImagenPersonaliza').value = '';
    document.getElementById('detallePersonaliza').value = '';
  });
});
function cerrarModalPersonaliza() {
  document.getElementById('modalPersonaliza').style.display = 'none';
}
document.querySelectorAll('.producto').forEach(prod => {
  prod.addEventListener('touchstart', function(e) {
    document.querySelectorAll('.personaliza-overlay').forEach(ov => ov.style.opacity = 0);
    const overlay = this.querySelector('.personaliza-overlay');
    if (overlay) overlay.style.opacity = 1;
    setTimeout(() => { overlay.style.opacity = 0; }, 3000);
    e.stopPropagation();
  });
});
document.getElementById('formPersonaliza').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = this.dataset.nombre;
  const precio = parseInt(this.dataset.precio, 10);
  const detalles = document.getElementById('detallePersonaliza').value.trim();
  const imagenInput = document.getElementById('inputImagenPersonaliza');
  const mensaje = document.getElementById('msgPersonaliza');
  if (!imagenInput.files[0]) {
    mensaje.textContent = "Por favor, sube una imagen.";
    mensaje.style.color = "red";
    return;
  }
  const reader = new FileReader();
  reader.onload = function(evt) {
    const imagenBase64 = evt.target.result;
    agregarAlCarritoPersonalizado(nombre, precio, detalles, imagenBase64);
    cerrarModalPersonaliza();
    mensaje.textContent = "";
  };
  reader.readAsDataURL(imagenInput.files[0]);
});
function agregarAlCarritoPersonalizado(nombre, precio, detalles, imagenBase64) {
  let carrito = obtenerCarrito();
  carrito.push({
    nombre,
    precio,
    cantidad: 1,
    personalizado: true,
    detalles,
    imagen: imagenBase64
  });
  guardarCarrito(carrito);
  actualizarCarritoUI();
}