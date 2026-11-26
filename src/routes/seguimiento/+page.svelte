
<script>
	let pedidoId = $state('');
	let telefono = $state('');
	let pedido = $state(null);
	let error = $state('');
	let cargando = $state(false);

	async function consultarPedido(event) {
		event.preventDefault();
		pedido = null;
		error = '';

		if (!pedidoId.trim() || !telefono.trim()) {
			error = 'Completa el código del pedido y el teléfono.';
			return;
		}

		cargando = true;

		try {
			const respuesta = await fetch('/api/seguimiento', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pedidoId: pedidoId.trim(),
					telefono: telefono.trim()
				})
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				error = resultado.error || 'No se pudo consultar el pedido.';
				return;
			}

			pedido = resultado.pedido;
		} catch (err) {
			error = 'Error de conexión. Inténtalo nuevamente.';
		} finally {
			cargando = false;
		}
	}

	function dinero(valor) {
		return new Intl.NumberFormat('es-DO', {
			style: 'currency',
			currency: 'DOP'
		}).format(Number(valor || 0));
	}

	function estadoLegible(estado) {
		const estados = {
			pendiente: 'Pendiente',
			confirmado: 'Confirmado',
			preparando: 'En preparación',
			listo: 'Listo',
			en_camino: 'En camino',
			entregado: 'Entregado',
			cancelado: 'Cancelado'
		};

		return estados[estado] || estado || 'Sin estado';
	}
</script>

<svelte:head>
	<title>Seguimiento de pedido | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<header>
		<a href="/" class="marca">Gavy <strong>Pechurina</strong></a>
		<a href="/" class="volver">Volver al menú</a>
	</header>

	<main>
		<section class="introduccion">
			<span>GAVY PECHURINA</span>
			<h1>Seguimiento de <b>pedido</b></h1>
			<p>Consulta el estado de tu pedido utilizando tu código y teléfono.</p>
		</section>

		<section class="panel">
			<h2>Consulta tu pedido</h2>
			<p>Introduce los mismos datos que utilizaste al comprar.</p>

			<form onsubmit={consultarPedido}>
				<label for="pedido">Código del pedido</label>
				<input
					id="pedido"
					bind:value={pedidoId}
					placeholder="Pega el código de tu pedido"
					required
				/>

				<label for="telefono">Teléfono</label>
				<input
					id="telefono"
					type="tel"
					bind:value={telefono}
					placeholder="Ej. 8291234567"
					required
				/>

				{#if error}
					<div class="error">{error}</div>
				{/if}

				<button type="submit" disabled={cargando}>
					{cargando ? 'Consultando...' : 'Consultar pedido'}
				</button>
			</form>
		</section>

		{#if pedido}
			<section class="resultado">
				<div class="cabecera-resultado">
					<h2>Detalles del pedido</h2>
					<span class="estado">{estadoLegible(pedido.estado)}</span>
				</div>

				<p class="codigo">Código: {pedido.id}</p>

				<h3>Productos solicitados</h3>

				{#each pedido.items || [] as item, i (i)}
					<div class="producto">
						<div>
							<strong>{item.nombre}</strong>
							<small>Cantidad: {item.cantidad}</small>
							{#if item.opcion}
								<small>{item.opcion}</small>
							{/if}
						</div>
						<strong>
							{dinero(Number(item.precio_unit) * Number(item.cantidad))}
						</strong>
					</div>
				{/each}

				<div class="total">
					<span>Total</span>
					<strong>{dinero(pedido.total)}</strong>
				</div>
			</section>
		{/if}
	</main>

	<footer>
		<strong>Gavy Pechurina</strong>
		<p>Calidad y sabor en cada pedido.</p>
	</footer>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: #fffaf5;
		color: #29211c;
		font-family: Arial, sans-serif;
	}

	.pagina {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22px max(22px, calc((100% - 1050px) / 2));
		border-bottom: 1px solid #f0e5dc;
		background: white;
	}

	.marca {
		font-size: 20px;
		font-weight: bold;
		color: #29211c;
		text-decoration: none;
	}

	.marca strong,
	.introduccion b {
		color: #e87520;
	}

	.volver {
		color: #b85b18;
		text-decoration: none;
		font-weight: bold;
		font-size: 14px;
	}

	main {
		width: min(620px, calc(100% - 32px));
		margin: auto;
		padding: 50px 0;
		flex: 1;
	}

	.introduccion {
		text-align: center;
		margin-bottom: 28px;
	}

	.introduccion span {
		color: #e87520;
		font-size: 12px;
		font-weight: bold;
		letter-spacing: 2px;
	}

	h1 {
		font-size: clamp(30px, 6vw, 42px);
		margin: 12px 0;
	}

	.introduccion p,
	.panel p {
		color: #796e66;
		line-height: 1.6;
		font-size: 14px;
	}

	.panel,
	.resultado {
		background: white;
		border: 1px solid #f0e2d6;
		border-radius: 18px;
		padding: 28px;
		box-shadow: 0 10px 30px #4b2b1410;
	}

	.panel h2,
	.resultado h2 {
		margin-top: 0;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}

	label {
		font-weight: bold;
		font-size: 13px;
		margin-top: 8px;
	}

	input {
		padding: 14px;
		border: 1px solid #e8ddd4;
		border-radius: 9px;
		font-size: 14px;
		outline: none;
	}

	input:focus {
		border-color: #e87520;
	}

	button {
		margin-top: 12px;
		padding: 15px;
		border: 0;
		border-radius: 9px;
		background: #e87520;
		color: white;
		font-weight: bold;
		font-size: 15px;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.error {
		padding: 12px;
		background: #fff0ee;
		color: #b42318;
		border-radius: 8px;
		font-size: 13px;
	}

	.resultado {
		margin-top: 24px;
	}

	.cabecera-resultado {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

	.estado {
		background: #fff0df;
		color: #b85b18;
		border-radius: 30px;
		padding: 8px 12px;
		font-size: 12px;
		font-weight: bold;
	}

	.codigo {
		font-family: monospace;
		font-size: 12px;
		overflow-wrap: anywhere;
		color: #796e66;
	}

	.resultado h3 {
		margin-top: 25px;
	}

	.producto,
	.total {
		display: flex;
		justify-content: space-between;
		gap: 15px;
		padding: 14px 0;
		border-bottom: 1px solid #f0e5dc;
		font-size: 13px;
	}

	.producto div {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.producto small {
		color: #85786e;
	}

	.total {
		border: 0;
		font-size: 16px;
		font-weight: bold;
		margin-top: 12px;
	}

	.total strong {
		color: #e87520;
		font-size: 21px;
	}

	footer {
		padding: 25px;
		text-align: center;
		border-top: 1px solid #f0e5dc;
		color: #85786e;
		font-size: 12px;
	}

	footer strong {
		color: #e87520;
		font-size: 14px;
	}

	@media (max-width: 480px) {
		.panel,
		.resultado {
			padding: 20px;
		}

		.cabecera-resultado {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
