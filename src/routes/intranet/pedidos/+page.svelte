
<script>
	import { onMount } from 'svelte';

	let pedidos = $state([]);
	let cargando = $state(true);
	let error = $state('');
	let busqueda = $state('');
	let pedidoSeleccionado = $state(null);

	async function cargarPedidos() {
		cargando = true;
		error = '';

		try {
			const respuesta = await fetch('/api/intranet/pedidos');
			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				throw new Error(resultado.error || 'No se pudieron cargar los pedidos.');
			}

			pedidos = resultado.pedidos || [];
		} catch (e) {
			error = e.message;
		} finally {
			cargando = false;
		}
	}

	const pedidosFiltrados = $derived(
		pedidos.filter((pedido) => {
			const texto = busqueda.toLowerCase();

			return (
				pedido.nombre_cliente?.toLowerCase().includes(texto) ||
				pedido.telefono?.toLowerCase().includes(texto) ||
				pedido.id?.toLowerCase().includes(texto)
			);
		})
	);

	function formatoFecha(fecha) {
		return new Date(fecha).toLocaleString('es-DO', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}

	function formatoPrecio(precio) {
		return Number(precio || 0).toLocaleString('es-DO', {
			style: 'currency',
			currency: 'DOP'
		});
	}

	onMount(cargarPedidos);
</script>

<svelte:head>
	<title>Pedidos | Gavy Pechurina</title>
</svelte:head>

<div class="page">
	<header class="header">
		<div>
			<a href="/intranet" class="back">← Volver al panel</a>
			<h1>Gestión de pedidos</h1>
			<p>Consulta y administra los pedidos de tus clientes.</p>
		</div>

		<button class="refresh" onclick={cargarPedidos}>
			↻ Actualizar
		</button>
	</header>

	<div class="summary">
		<div class="summary-card">
			<span>Total de pedidos</span>
			<strong>{pedidos.length}</strong>
		</div>

		<div class="summary-card">
			<span>Pendientes</span>
			<strong>
				{pedidos.filter((p) => p.estado === 'pendiente').length}
			</strong>
		</div>

		<div class="summary-card">
			<span>Entregados</span>
			<strong>
				{pedidos.filter((p) => p.estado === 'entregado').length}
			</strong>
		</div>
	</div>

	<section class="content">
		<div class="list-header">
			<div>
				<h2>Pedidos registrados</h2>
				<p>Listado de pedidos de Gavy Pechurina.</p>
			</div>

			<input
				type="search"
				placeholder="Buscar cliente, teléfono o ID..."
				bind:value={busqueda}
			/>
		</div>

		{#if cargando}
			<div class="message">Cargando pedidos...</div>
		{:else if error}
			<div class="message error">{error}</div>
			<button class="refresh" onclick={cargarPedidos}>Intentar nuevamente</button>
		{:else if pedidosFiltrados.length === 0}
			<div class="empty">
				<div class="empty-icon">🛒</div>
				<h3>No hay pedidos para mostrar</h3>
				<p>
					{pedidos.length === 0
						? 'Cuando tus clientes realicen pedidos, aparecerán aquí.'
						: 'No encontramos pedidos con esa búsqueda.'}
				</p>
			</div>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Cliente</th>
							<th>Teléfono</th>
							<th>Fecha</th>
							<th>Total</th>
							<th>Estado</th>
							<th>Detalles</th>
						</tr>
					</thead>

					<tbody>
						{#each pedidosFiltrados as pedido (pedido.id)}
							<tr>
								<td><strong>{pedido.nombre_cliente}</strong></td>
								<td>{pedido.telefono}</td>
								<td>{formatoFecha(pedido.created_at)}</td>
								<td class="price">{formatoPrecio(pedido.total)}</td>
								<td>
									<span class="status">{pedido.estado}</span>
								</td>
								<td>
									<button
										class="details"
										onclick={() => pedidoSeleccionado = pedido}
									>
										Ver pedido
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	{#if pedidoSeleccionado}
		<div class="overlay" role="presentation" onclick={(e) => {
			if (e.target === e.currentTarget) pedidoSeleccionado = null;
		}}>
			<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
				<div class="modal-header">
					<div>
						<span class="modal-label">DETALLES DEL PEDIDO</span>
						<h2 id="modal-title">Información del cliente</h2>
					</div>
					<button class="close" onclick={() => pedidoSeleccionado = null}>×</button>
				</div>

				<div class="customer">
					<p><strong>Cliente:</strong> {pedidoSeleccionado.nombre_cliente}</p>
					<p><strong>Teléfono:</strong> {pedidoSeleccionado.telefono}</p>
					<p><strong>Dirección:</strong> {pedidoSeleccionado.direccion || 'No indicada'}</p>
					<p><strong>Fecha:</strong> {formatoFecha(pedidoSeleccionado.created_at)}</p>
					<p><strong>Notas:</strong> {pedidoSeleccionado.notas || 'Sin notas'}</p>
				</div>

				<h3>Productos solicitados</h3>

				{#each pedidoSeleccionado.gavy_pedido_items || [] as item}
					<div class="item">
						<div>
							<strong>{item.nombre}</strong>
							<small>{item.opcion || 'Sin opción'} · Cantidad: {item.cantidad}</small>
						</div>
						<strong>{formatoPrecio(item.precio_unit * item.cantidad)}</strong>
					</div>
				{/each}

				<div class="total">
					<span>Total del pedido</span>
					<strong>{formatoPrecio(pedidoSeleccionado.total)}</strong>
				</div>

				<p class="notice">
					La consulta de detalles está habilitada. La actualización de estados
					se conectará en el siguiente paso.
				</p>
			</section>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f7f7f8;
		font-family: Arial, sans-serif;
		color: #292929;
	}

	.page {
		padding: 35px 5%;
		max-width: 1500px;
		margin: auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 15px;
		margin-bottom: 28px;
	}

	.back {
		text-decoration: none;
		color: #e87520;
		font-size: 12px;
		font-weight: bold;
	}

	h1 {
		font-size: 27px;
		margin: 12px 0 6px;
	}

	.header p, .list-header p {
		color: #888;
		font-size: 13px;
		margin: 0;
	}

	.refresh, .details {
		border: 0;
		border-radius: 8px;
		padding: 12px 17px;
		background: #f47721;
		color: white;
		font-weight: bold;
		cursor: pointer;
	}

	.summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-bottom: 25px;
	}

	.summary-card, .content {
		background: white;
		border: 1px solid #eee;
		border-radius: 12px;
		padding: 22px;
	}

	.summary-card span {
		color: #888;
		font-size: 12px;
	}

	.summary-card strong {
		display: block;
		font-size: 27px;
		margin-top: 10px;
		color: #e87520;
	}

	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		margin-bottom: 22px;
	}

	.list-header h2 {
		font-size: 18px;
		margin: 0 0 6px;
	}

	input {
		width: min(350px, 100%);
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		outline-color: #f47721;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 750px;
	}

	th, td {
		text-align: left;
		padding: 15px 12px;
		border-bottom: 1px solid #eee;
		font-size: 12px;
	}

	th {
		color: #888;
		background: #fafafa;
	}

	.price {
		color: #e87520;
		font-weight: bold;
	}

	.status {
		background: #fff0e3;
		color: #e87520;
		padding: 7px 10px;
		border-radius: 20px;
		font-size: 11px;
	}

	.details {
		padding: 9px 12px;
		font-size: 11px;
	}

	.empty, .message {
		text-align: center;
		padding: 55px 15px;
		color: #888;
	}

	.empty-icon {
		font-size: 42px;
	}

	.empty h3 {
		color: #333;
	}

	.error {
		color: #b42318;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: #0008;
		display: grid;
		place-items: center;
		padding: 15px;
		z-index: 20;
	}

	.modal {
		background: white;
		width: 100%;
		max-width: 550px;
		max-height: 85vh;
		overflow-y: auto;
		padding: 25px;
		border-radius: 15px;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-label {
		font-size: 10px;
		color: #e87520;
		font-weight: bold;
	}

	.modal h2 {
		font-size: 19px;
	}

	.close {
		border: 0;
		background: #f5f5f5;
		font-size: 24px;
		cursor: pointer;
		border-radius: 7px;
	}

	.customer {
		background: #fafafa;
		padding: 15px;
		border-radius: 9px;
		font-size: 12px;
		line-height: 1.5;
	}

	.modal h3 {
		font-size: 14px;
		margin-top: 22px;
	}

	.item {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid #eee;
		font-size: 12px;
	}

	.item small {
		display: block;
		color: #888;
		margin-top: 5px;
	}

	.total {
		display: flex;
		justify-content: space-between;
		padding-top: 18px;
		font-size: 15px;
	}

	.total strong {
		color: #e87520;
	}

	.notice {
		margin-top: 20px;
		padding: 12px;
		background: #fff0e3;
		color: #a85a1b;
		border-radius: 8px;
		font-size: 11px;
		line-height: 1.5;
	}

	@media (max-width: 650px) {
		.page {
			padding: 22px 4%;
		}

		.header, .list-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.summary {
			gap: 8px;
		}

		.summary-card {
			padding: 13px;
		}

		.summary-card strong {
			font-size: 22px;
		}

		input {
			width: 100%;
		}
	}
</style>
