<script>
	let { data } = $props();

	let carrito = $state([]);
	let productoSeleccionado = $state(null);
	let opcionSeleccionada = $state('');
	let cantidadSeleccionada = $state(1);

	// Datos del cliente
	let nombreCliente = $state('');
	let telefonoCliente = $state('');
	let direccionCliente = $state('');
	let notasPedido = $state('');

	// Estado del envío y confirmación del pedido
	let enviandoPedido = $state(false);
	let mensajePedido = $state('');
	let errorPedido = $state('');
	let pedidoId = $state('');
	let mensajeCopiado = $state('');

	let productos = $derived(data.productos ?? []);

	let total = $derived(
		carrito.reduce(
			(suma, item) => suma + item.precio * item.cantidad,
			0
		)
	);

	let cantidadTotal = $derived(
		carrito.reduce((suma, item) => suma + item.cantidad, 0)
	);

	function abrirOpciones(producto) {
		productoSeleccionado = producto;
		opcionSeleccionada = producto.opciones?.[0] ?? '';
		cantidadSeleccionada = 1;
	}

	function confirmarProducto() {
		if (!productoSeleccionado) return;

		const cantidad = Number(cantidadSeleccionada);

		if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 50) {
			alert('Selecciona una cantidad entre 1 y 50.');
			return;
		}

		const producto = productoSeleccionado;

		carrito = [
			...carrito,
			{
				idCarrito: crypto.randomUUID(),
				id: producto.id,
				nombre: producto.nombre,
				precio: Number(producto.precio),
				opcion: opcionSeleccionada,
				cantidad
			}
		];

		mensajePedido = '';
		errorPedido = '';
		pedidoId = '';
		mensajeCopiado = '';
		productoSeleccionado = null;
		opcionSeleccionada = '';
		cantidadSeleccionada = 1;
	}

	function quitarProducto(idCarrito) {
		carrito = carrito.filter(
			(item) => item.idCarrito !== idCarrito
		);
		mensajePedido = '';
		errorPedido = '';
		pedidoId = '';
		mensajeCopiado = '';
	}

	async function copiarNumeroPedido() {
		if (!pedidoId) return;

		try {
			await navigator.clipboard.writeText(pedidoId);
			mensajeCopiado = 'Número copiado correctamente.';
		} catch {
			mensajeCopiado = 'No se pudo copiar. Selecciona el número manualmente.';
		}
	}

	async function validarDatosCliente() {
		if (enviandoPedido) return;

		mensajePedido = '';
		errorPedido = '';
		pedidoId = '';
		mensajeCopiado = '';

		if (carrito.length === 0) {
			errorPedido = 'Agrega productos a tu pedido.';
			return;
		}

		if (
			!nombreCliente.trim() ||
			!telefonoCliente.trim() ||
			!direccionCliente.trim()
		) {
			errorPedido = 'Completa tu nombre, teléfono y dirección.';
			return;
		}

		enviandoPedido = true;

		try {
			const respuesta = await fetch('/api/pedidos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nombreCliente: nombreCliente.trim(),
					telefonoCliente: telefonoCliente.trim(),
					direccionCliente: direccionCliente.trim(),
					notasPedido: notasPedido.trim(),
					items: carrito.map((item) => ({
						producto_id: item.id,
						opcion: item.opcion || null,
						cantidad: item.cantidad
					}))
				})
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				throw new Error(
					resultado.error || 'No se pudo registrar el pedido.'
				);
			}

			if (!resultado.pedidoId) {
				throw new Error('El pedido se registró, pero no recibimos su número. Contacta con el negocio antes de repetir la compra.');
			}

			pedidoId = resultado.pedidoId;
			mensajePedido = '¡Tu pedido fue registrado correctamente!';
			errorPedido = '';

			carrito = [];
			nombreCliente = '';
			telefonoCliente = '';
			direccionCliente = '';
			notasPedido = '';
		} catch (error) {
			errorPedido =
				error.message || 'Ocurrió un error al registrar el pedido.';
		} finally {
			enviandoPedido = false;
		}
	}
</script>

<svelte:head>
	<title>Gavy Pechurina | Nuestro menú</title>
	<meta name="description" content="Descubre el menú de Gavy Pechurina." />
</svelte:head>

<header>
	<a class="logo" href="#inicio">
		<span class="logo-icon">G</span>
		<span>GAVY <b>PECHURINA</b></span>
	</a>

	<nav>
		<a href="#inicio">Inicio</a>
		<a href="#menu">Menú</a>
		<a href="#nosotros">Nosotros</a>
	</nav>

	<a href="/seguimiento" class="tracking-button">
		<span class="tracking-full">Seguir mi pedido</span>
		<span class="tracking-short">Seguir pedido</span>
	</a>

	<a class="cart-button" href="#pedido">
		🛒 Mi pedido ({cantidadTotal})
	</a>
	<a href="/intranet" class="access-button">Intranet</a>
	<a href="/extranet" class="access-button">Extranet</a>
</header>

<main>
	<section class="hero" id="inicio">
		<div>
			<span class="tag">BIENVENIDOS A GAVY PECHURINA</span>
			<h1>El sabor que<br />te hace <span>volver.</span></h1>
			<p>Disfruta de nuestras deliciosas pechurinas y mucho más.</p>
			<a href="#menu" class="main-button">Ver nuestro menú →</a>
		</div>

		<div class="hero-food">🍗</div>
	</section>

	<section class="menu" id="menu">
		<div class="heading">
			<span class="tag">PREPARADO PARA TI</span>
			<h2>Nuestro <span>menú</span></h2>
			<p>Elige tus favoritos y agrégalos a tu pedido.</p>
		</div>

		{#if data.error}
			<p class="message">{data.error}</p>
		{:else if productos.length === 0}
			<p class="message">Todavía no hay productos disponibles.</p>
		{:else}
			<div class="products">
				{#each productos as producto (producto.id)}
					<article class="product-card">
						<div class="product-image">
							{#if producto.categoria === 'Bebida'}
								🥤
							{:else}
								🍗
							{/if}
						</div>

						<div class="product-info">
							<span class="category">{producto.categoria}</span>
							<h3>{producto.nombre}</h3>
							<p>{producto.descripcion}</p>

							{#if producto.opciones?.length > 0}
								<div class="options">
									{#each producto.opciones as opcion}
										<span>{opcion}</span>
									{/each}
								</div>
							{/if}

							<div class="product-bottom">
								<strong>
									RD$ {Number(producto.precio).toFixed(2)}
								</strong>

								<button onclick={() => abrirOpciones(producto)}>
									+ Agregar
								</button>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>

	<section class="order-section" id="pedido">
		<div class="heading">
			<span class="tag">TU SELECCIÓN</span>
			<h2>Mi <span>pedido</span></h2>
		</div>

		{#if carrito.length === 0}
			{#if pedidoId}
				<div class="confirmation-box">
					<div class="confirmation-icon">✓</div>
					<h3>{mensajePedido}</h3>
					<p>Gracias por comprar en Gavy Pechurina.</p>

					<span class="confirmation-label">NÚMERO DE TU PEDIDO</span>
					<strong class="order-number">{pedidoId}</strong>

					<button class="copy-order" onclick={copiarNumeroPedido}>
						{mensajeCopiado ? 'Copiar nuevamente' : 'Copiar número del pedido'}
					</button>

					{#if mensajeCopiado}
						<p class="copy-feedback" role="status">{mensajeCopiado}</p>
					{/if}

					<p class="tracking-note">
						Guarda este número para consultar tu pedido más adelante.
						<a class="confirmation-tracking" href="/seguimiento">
						Consultar el estado de mi pedido
					</a>
					</p>
					
				</div>
			{:else}
				<p class="message">Todavía no has agregado productos.</p>
			{/if}

			{#if errorPedido}
				<p class="error-message" role="alert">{errorPedido}</p>
			{/if}
		{:else}
			<div class="order-list">
				{#each carrito as item (item.idCarrito)}
					<div class="order-item">
						<div>
							<strong>{item.nombre}</strong>

							{#if item.opcion}
								<p>Opción: {item.opcion}</p>
							{/if}

							<p>
								{item.cantidad} × RD$ {item.precio.toFixed(2)}
							</p>
						</div>

						<div class="order-actions">
							<b>
								RD$ {(item.precio * item.cantidad).toFixed(2)}
							</b>

							<button
								class="remove"
								onclick={() => quitarProducto(item.idCarrito)}
								disabled={enviandoPedido}
							>
								Quitar
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="total">
				<span>Total</span>
				<strong>RD$ {total.toFixed(2)}</strong>
			</div>

			<div class="customer-form">
				<span class="tag">INFORMACIÓN DE ENTREGA</span>
				<h3>Datos del cliente</h3>
				<p>Completa tus datos para preparar tu pedido.</p>

				<label for="nombre">Nombre completo</label>
				<input
					id="nombre"
					type="text"
					placeholder="Escribe tu nombre"
					bind:value={nombreCliente}
					maxlength="100"
					autocomplete="name"
					disabled={enviandoPedido}
				/>

				<label for="telefono">Teléfono</label>
				<input
					id="telefono"
					type="tel"
					placeholder="Ej. 8090000000"
					bind:value={telefonoCliente}
					maxlength="20"
					autocomplete="tel"
					disabled={enviandoPedido}
				/>

				<label for="direccion">Dirección</label>
				<input
					id="direccion"
					type="text"
					placeholder="¿Dónde entregaremos tu pedido?"
					bind:value={direccionCliente}
					maxlength="250"
					autocomplete="street-address"
					disabled={enviandoPedido}
				/>

				<label for="notas">Notas adicionales (opcional)</label>
				<textarea
					id="notas"
					placeholder="Escribe alguna indicación para tu pedido..."
					bind:value={notasPedido}
					maxlength="500"
					disabled={enviandoPedido}
				></textarea>

				{#if errorPedido}
					<p class="error-message" role="alert">{errorPedido}</p>
				{/if}

				<button
					class="send-order"
					onclick={validarDatosCliente}
					disabled={enviandoPedido}
				>
					{enviandoPedido ? 'Registrando pedido...' : 'Confirmar pedido'}
				</button>
			</div>
		{/if}
	</section>

	<section class="about" id="nosotros">
		<span class="tag">GAVY PECHURINA</span>
		<h2>Calidad y sabor en cada pedido.</h2>
		<p>Gracias por elegirnos. ¡Estamos para servirte!</p>
	</section>

	{#if productoSeleccionado}
		<div class="modal-fondo">
			<div class="modal">
				<button
					class="cerrar"
					aria-label="Cerrar"
					onclick={() => productoSeleccionado = null}
				>
					✕
				</button>

				<span class="tag">PERSONALIZA TU PEDIDO</span>
				<h2>{productoSeleccionado.nombre}</h2>

				{#if productoSeleccionado.opciones?.length > 0}
					<label for="opcion">Selecciona una opción:</label>
					<select id="opcion" bind:value={opcionSeleccionada}>
						{#each productoSeleccionado.opciones as opcion}
							<option value={opcion}>{opcion}</option>
						{/each}
					</select>
				{/if}

				<label for="cantidad">Cantidad:</label>
				<input
					id="cantidad"
					type="number"
					min="1"
					max="50"
					step="1"
					bind:value={cantidadSeleccionada}
				/>

				<p class="modal-price">
					Precio: RD$ {Number(productoSeleccionado.precio).toFixed(2)}
				</p>

				<button class="confirmar" onclick={confirmarProducto}>
					Agregar al pedido
				</button>
			</div>
		</div>
	{/if}
</main>

<footer>
	<strong>GAVY <span>PECHURINA</span></strong>
	<p>© 2026 Gavy Pechurina. Todos los derechos reservados.</p>
</footer>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		color: #211b18;
		background: #fff;
	}

	header {
		height: 78px;
		padding: 0 7%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		position: sticky;
		top: 0;
		z-index: 5;
		box-shadow: 0 2px 15px #0001;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: #211b18;
		font-weight: 900;
		font-size: 18px;
	}

	.logo b, footer span {
		color: #f47721;
	}

	.logo-icon {
		background: #f47721;
		color: white;
		width: 42px;
		height: 42px;
		border-radius: 12px;
		display: grid;
		place-items: center;
		font-size: 24px;
	}

	nav {
		display: flex;
		gap: 28px;
	}

	nav a {
		color: #333;
		text-decoration: none;
		font-weight: bold;
		font-size: 14px;
	}

	nav a:hover {
		color: #f47721;
	}

	.cart-button, .main-button {
		background: #f47721;
		color: white;
		text-decoration: none;
		padding: 13px 19px;
		border-radius: 8px;
		font-weight: bold;
		font-size: 14px;
	}

	.hero {
		background: #fff3e9;
		min-height: 420px;
		padding: 75px 10%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
	}

	.tag {
		color: #f47721;
		font-size: 12px;
		font-weight: bold;
		letter-spacing: 2px;
	}

	.hero h1 {
		font-size: clamp(45px, 6vw, 68px);
		margin: 20px 0;
		line-height: 1.05;
	}

	.hero h1 span, .heading h2 span {
		color: #f47721;
	}

	.hero p, .heading p, .about p {
		color: #777;
		line-height: 1.7;
		margin-bottom: 30px;
	}

	.hero-food {
		width: 280px;
		height: 280px;
		background: #f47721;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 130px;
		box-shadow: 0 15px 40px #f4772140;
	}

	.menu, .order-section {
		padding: 75px 8%;
	}

	.heading {
		text-align: center;
		margin-bottom: 40px;
	}

	.heading h2, .about h2 {
		font-size: 36px;
		margin: 14px 0;
	}

	.products {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 25px;
	}

	.product-card {
		border: 1px solid #eee;
		border-radius: 15px;
		overflow: hidden;
		background: white;
		transition: 0.2s;
	}

	.product-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 30px #00000012;
	}

	.product-image {
		height: 155px;
		background: #fff0e3;
		display: grid;
		place-items: center;
		font-size: 75px;
	}

	.product-info {
		padding: 20px;
	}

	.category {
		color: #f47721;
		font-size: 12px;
		font-weight: bold;
	}

	.product-info h3 {
		font-size: 20px;
		margin: 9px 0;
	}

	.product-info p {
		color: #777;
		font-size: 14px;
		min-height: 35px;
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 12px 0;
	}

	.options span {
		background: #fff1e5;
		color: #a94b0b;
		border-radius: 20px;
		padding: 6px 9px;
		font-size: 11px;
	}

	.product-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: 18px;
	}

	.product-bottom strong {
		color: #f47721;
		font-size: 17px;
	}

	button {
		cursor: pointer;
		border: none;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.product-bottom button {
		background: #211b18;
		color: white;
		border-radius: 7px;
		padding: 10px 12px;
		font-weight: bold;
	}

	.product-bottom button:hover {
		background: #f47721;
	}

	.order-section {
		background: #fff8f2;
	}

	.order-list {
		max-width: 700px;
		margin: auto;
	}

	.order-item {
		background: white;
		padding: 17px;
		border-radius: 10px;
		margin-bottom: 12px;
		display: flex;
		justify-content: space-between;
		gap: 15px;
		align-items: center;
	}

	.order-item p {
		color: #777;
		font-size: 13px;
		margin-bottom: 0;
	}

	.order-actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.remove {
		background: #ffe6df;
		color: #b43c20;
		padding: 8px;
		border-radius: 6px;
	}

	.total {
		max-width: 700px;
		margin: 20px auto;
		padding: 20px;
		border-top: 2px solid #f47721;
		display: flex;
		justify-content: space-between;
		font-size: 20px;
	}

	.total strong {
		color: #f47721;
	}

	.customer-form {
		max-width: 700px;
		margin: 35px auto 0;
		padding: 25px;
		background: white;
		border-radius: 14px;
		box-shadow: 0 5px 20px #0000000c;
	}

	.customer-form h3 {
		font-size: 23px;
		margin-bottom: 8px;
	}

	.customer-form p {
		color: #777;
		margin-bottom: 22px;
	}

	.customer-form label {
		display: block;
		font-weight: bold;
		margin: 16px 0 8px;
	}

	.customer-form input,
	.customer-form textarea {
		width: 100%;
		padding: 13px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 15px;
		font-family: Arial, sans-serif;
	}

	.customer-form textarea {
		min-height: 90px;
		resize: vertical;
	}

	.send-order {
		width: 100%;
		margin-top: 22px;
		padding: 15px;
		border-radius: 8px;
		background: #f47721;
		color: white;
		font-weight: bold;
		font-size: 15px;
	}

	.send-order:hover:not(:disabled) {
		background: #d95e0c;
	}

	.success-message {
		background: #e7f8ec;
		color: #176b32;
		padding: 14px;
		border-radius: 8px;
		font-weight: bold;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	.error-message {
		background: #ffe9e5;
		color: #b42318;
		padding: 14px;
		border-radius: 8px;
		font-weight: bold;
		line-height: 1.5;
	}

	.confirmation-box {
		max-width: 600px;
		margin: 25px auto;
		padding: 30px;
		background: #fff;
		border: 1px solid #f47721;
		border-radius: 16px;
		text-align: center;
		box-shadow: 0 8px 25px #0000000c;
	}

	.confirmation-icon {
		width: 55px;
		height: 55px;
		margin: 0 auto 15px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #e7f8ec;
		color: #176b32;
		font-size: 30px;
		font-weight: bold;
	}

	.confirmation-box h3 {
		color: #176b32;
		margin-bottom: 10px;
	}

	.confirmation-box > p {
		color: #777;
	}

	.confirmation-label {
		display: block;
		margin-top: 20px;
		color: #f47721;
		font-size: 12px;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.order-number {
		display: block;
		margin: 12px 0;
		padding: 14px;
		background: #fff3e9;
		border-radius: 8px;
		overflow-wrap: anywhere;
		font-size: 14px;
		color: #211b18;
		user-select: all;
	}

	.copy-order {
		padding: 13px 20px;
		background: #f47721;
		color: white;
		border-radius: 8px;
		font-weight: bold;
	}

	.copy-order:hover {
		background: #d95e0c;
	}

	.confirmation-box .copy-feedback {
		color: #176b32;
		font-weight: bold;
		font-size: 13px;
		margin: 12px 0;
	}

	.confirmation-box .tracking-note {
		margin-top: 18px;
		color: #777;
		font-size: 13px;
		line-height: 1.5;
	}

	.about {
		padding: 70px 20px;
		text-align: center;
	}

	.modal-fondo {
		position: fixed;
		inset: 0;
		background: #0009;
		display: grid;
		place-items: center;
		z-index: 100;
		padding: 20px;
	}

	.modal {
		background: white;
		width: 100%;
		max-width: 420px;
		padding: 30px;
		border-radius: 16px;
		position: relative;
		box-shadow: 0 15px 50px #0003;
	}

	.modal h2 {
		margin: 15px 0 25px;
	}

	.modal label {
		display: block;
		font-weight: bold;
		margin: 15px 0 8px;
	}

	.modal select, .modal input {
		width: 100%;
		padding: 13px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: white;
		font-size: 15px;
	}

	.cerrar {
		position: absolute;
		right: 15px;
		top: 15px;
		background: #fff0e5;
		padding: 9px;
		border-radius: 8px;
	}

	.confirmar {
		width: 100%;
		margin-top: 20px;
		padding: 14px;
		border-radius: 8px;
		background: #f47721;
		color: white;
		font-weight: bold;
	}

	.confirmar:hover {
		background: #d95e0c;
	}

	.modal-price {
		font-weight: bold;
		color: #f47721;
		margin-top: 20px;
	}

	footer {
		background: #211b18;
		color: white;
		padding: 30px 7%;
		display: flex;
		justify-content: space-between;
		gap: 20px;
		align-items: center;
	}

	footer p {
		color: #bbb;
		font-size: 12px;
	}

	@media (max-width: 650px) {
		header {
			padding: 0 4%;
			gap: 10px;
		}

		nav {
			display: none;
		}

		.logo {
			font-size: 14px;
		}

		.cart-button {
			padding: 11px;
			font-size: 12px;
		}

		.hero {
			flex-direction: column;
			text-align: center;
			padding: 55px 7%;
		}

		.hero-food {
			width: 210px;
			height: 210px;
			font-size: 95px;
		}

		.order-item, .order-actions {
			flex-wrap: wrap;
		}

		footer {
			flex-direction: column;
			text-align: center;
		}

		.confirmation-box {
			padding: 22px 16px;
		}
	}
	.tracking-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: #fff0e3;
	color: #e87520 !important;
	padding: 11px 15px;
	border-radius: 8px;
	border: 1px solid #f47721;
	font-weight: bold;
	font-size: 13px;
	text-decoration: none;
	white-space: nowrap;
	transition: 0.2s;
}

.tracking-button:hover {
	background: #f47721;
	color: white !important;
}

.tracking-short {
	display: none;
}

.confirmation-tracking {
	display: inline-block;
	margin-top: 8px;
	padding: 12px 18px;
	border-radius: 8px;
	background: #fff0e3;
	border: 1px solid #f47721;
	color: #e87520;
	font-weight: bold;
	text-decoration: none;
}

.confirmation-tracking:hover {
	background: #f47721;
	color: white;
}

@media (max-width: 900px) {
	header {
		padding-left: 4%;
		padding-right: 4%;
		gap: 10px;
	}

	nav {
		gap: 14px;
	}

	nav a {
		font-size: 12px;
	}

	.tracking-button {
		padding: 10px 11px;
	}
}

@media (max-width: 650px) {
	header {
		min-height: 70px;
		padding: 10px 4%;
		gap: 8px;
	}

	nav {
		display: none;
	}

	.logo {
		font-size: 12px;
		gap: 6px;
	}

	.logo-icon {
		width: 34px;
		height: 34px;
		font-size: 20px;
	}

	.tracking-button {
		padding: 9px 8px;
		font-size: 11px;
	}

	.tracking-full {
		display: none;
	}

	.tracking-short {
		display: inline;
	}

	.cart-button {
		padding: 10px 8px;
		font-size: 11px;
	}
}

@media (max-width: 360px) {
	.logo {
		font-size: 10px;
	}

	.tracking-button {
		padding: 8px 6px;
		font-size: 10px;
	}

	.cart-button {
		padding: 9px 6px;
		font-size: 10px;
	}
}
.access-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 11px 14px;
	border: 1px solid #f47721;
	border-radius: 8px;
	color: #e87520;
	background: white;
	text-decoration: none;
	font-weight: bold;
	font-size: 13px;
	white-space: nowrap;
	transition: 0.2s;
}

.access-button:hover {
	background: #f47721;
	color: white;
}
</style>
