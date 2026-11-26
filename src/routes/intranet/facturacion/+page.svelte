
<script>
	let facturas = $state([]);
	let pedidos = $state([]);
	let cargando = $state(true);
	let mensaje = $state('');

	async function cargarDatos() {
		cargando = true;
		mensaje = '';

		try {
			const res = await fetch('/api/intranet/facturacion');
			const data = await res.json();

			if (!res.ok) throw new Error(data.error);

			facturas = data.facturas || [];
			pedidos = data.pedidos || [];
		} catch (error) {
			mensaje = error.message || 'Error al cargar la información.';
		} finally {
			cargando = false;
		}
	}

	async function generarFactura(pedido) {
		mensaje = '';

		try {
			const res = await fetch('/api/intranet/facturacion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pedido_id: pedido.id })
			});

			const data = await res.json();

			if (!res.ok) throw new Error(data.error);

			mensaje = 'Factura generada correctamente.';
			await cargarDatos();
		} catch (error) {
			mensaje = error.message || 'No se pudo generar la factura.';
		}
	}

	cargarDatos();
</script>

<svelte:head>
	<title>Facturación | Gavy Pechurina</title>
</svelte:head>

<main class="contenedor">
	<header>
		<h1>Facturación</h1>
		<p>Control de facturas y pedidos de Gavy Pechurina.</p>
	</header>

	{#if mensaje}
		<div class="mensaje">{mensaje}</div>
	{/if}

	<section class="estadisticas">
		<div class="estadistica">
			<span>Facturas emitidas</span>
			<strong>{facturas.length}</strong>
		</div>
		<div class="estadistica">
			<span>Pedidos pendientes</span>
			<strong>{pedidos.length}</strong>
		</div>
	</section>

	<section class="panel">
		<h2>Pedidos pendientes de facturar</h2>

		{#if cargando}
			<p>Cargando información...</p>
		{:else if pedidos.length === 0}
			<p>No hay pedidos pendientes de facturación.</p>
		{:else}
			{#each pedidos as pedido}
				<div class="registro">
					<div>
						<strong>{pedido.nombre_cliente}</strong>
						<p>Pedido: {pedido.id}</p>
						<p>Total: RD$ {Number(pedido.total || 0).toFixed(2)}</p>
					</div>
					<button onclick={() => generarFactura(pedido)}>
						Generar factura
					</button>
				</div>
			{/each}
		{/if}
	</section>

	<section class="panel">
		<h2>Facturas emitidas</h2>

		{#if cargando}
			<p>Cargando facturas...</p>
		{:else if facturas.length === 0}
			<p>No hay facturas registradas.</p>
		{:else}
			{#each facturas as factura}
				<div class="registro">
					<div>
						<strong>{factura.numero_factura}</strong>
						<p>Cliente: {factura.cliente}</p>
						<p>Total: RD$ {Number(factura.total || 0).toFixed(2)}</p>
						<small>{factura.estado}</small>
					</div>
					<span>
						{new Date(factura.fecha_emision).toLocaleDateString('es-DO')}
					</span>
				</div>
			{/each}
		{/if}
	</section>
</main>

<style>
	.contenedor {
		max-width: 1050px;
		margin: 35px auto;
		padding: 20px;
		color: #292929;
	}

	header {
		margin-bottom: 25px;
	}

	header p {
		color: #777;
	}

	.estadisticas {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 18px;
		margin-bottom: 22px;
	}

	.estadistica, .panel {
		background: white;
		padding: 24px;
		border-radius: 14px;
		box-shadow: 0 3px 15px #0000000d;
	}

	.estadistica span {
		display: block;
		color: #777;
		margin-bottom: 10px;
	}

	.estadistica strong {
		font-size: 28px;
		color: #e87520;
	}

	.panel {
		margin-bottom: 22px;
	}

	h2 {
		font-size: 19px;
		margin-top: 0;
	}

	.registro {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 15px;
		padding: 16px 0;
		border-bottom: 1px solid #eee;
	}

	.registro p {
		margin: 5px 0;
		color: #777;
		overflow-wrap: anywhere;
	}

	button {
		background: #e87520;
		color: white;
		border: 0;
		border-radius: 8px;
		padding: 11px 16px;
		cursor: pointer;
		font-weight: bold;
	}

	small {
		color: #e87520;
	}

	.mensaje {
		background: #fff0e3;
		padding: 13px;
		border-radius: 8px;
		margin-bottom: 18px;
	}

	@media (max-width: 600px) {
		.estadisticas {
			grid-template-columns: 1fr;
		}

		.registro {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
