
<script>
	import { onMount } from 'svelte';

	let pedidos = $state([]);
	let cargando = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const respuesta = await fetch('/api/extranet/historial');
			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				error = resultado.error || 'Error al cargar el historial.';
				return;
			}

			pedidos = resultado.pedidos || [];
		} catch {
			error = 'Error de conexión.';
		} finally {
			cargando = false;
		}
	});

	function fecha(valor) {
		return new Date(valor).toLocaleString('es-DO');
	}
</script>

<svelte:head>
	<title>Mi historial | Gavy Pechurina</title>
</svelte:head>

<main>
	<a href="/extranet">← Volver</a>
	<h1>Mi historial de pedidos</h1>
	<p>Consulta tus pedidos y su estado.</p>

	{#if cargando}
		<p>Cargando pedidos...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if pedidos.length === 0}
		<p>Todavía no tienes pedidos registrados.</p>
	{:else}
		{#each pedidos as pedido (pedido.id)}
			<article>
				<h2>Pedido #{pedido.id.slice(0, 8)}</h2>
				<p>Fecha: {fecha(pedido.created_at)}</p>
				<p class="estado">Estado: {pedido.estado || 'Pendiente'}</p>

				<h3>Productos</h3>
				{#each pedido.gavy_pedido_items || [] as item}
					<p>
						{item.nombre} — Cantidad: {item.cantidad}
						— RD$ {(Number(item.precio_unit) * item.cantidad).toFixed(2)}
					</p>
				{/each}

				<strong>Total: RD$ {Number(pedido.total).toFixed(2)}</strong>
			</article>
		{/each}
	{/if}
</main>

<style>
	main {
		max-width: 900px;
		margin: auto;
		padding: 30px 20px;
	}
	a {
		color: #e87520;
		text-decoration: none;
		font-weight: bold;
	}
	h1, .estado { color: #e87520; }
	article {
		background: white;
		padding: 22px;
		margin: 20px 0;
		border-radius: 12px;
		box-shadow: 0 4px 15px #00000010;
	}
	.error { color: #c62828; }
</style>
