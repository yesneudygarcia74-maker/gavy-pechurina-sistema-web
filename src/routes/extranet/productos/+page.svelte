
<script>
	import { onMount } from 'svelte';

	let productos = $state([]);
	let cargando = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const respuesta = await fetch('/api/extranet/productos');
			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				error = resultado.error || 'No se pudieron cargar los productos.';
				return;
			}

			productos = resultado.productos || [];
		} catch {
			error = 'Error de conexión.';
		} finally {
			cargando = false;
		}
	});
</script>

<svelte:head>
	<title>Productos | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<header>
		<a href="/extranet">← Volver</a>
		<h1>Nuestros productos</h1>
		<p>Calidad y sabor en cada pedido.</p>
	</header>

	{#if cargando}
		<p class="estado">Cargando productos...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if productos.length === 0}
		<p class="estado">No hay productos disponibles.</p>
	{:else}
		<div class="catalogo">
			{#each productos as producto (producto.id)}
				<article class="producto">
					<span class="categoria">{producto.categoria || 'General'}</span>
					<h2>{producto.nombre}</h2>
					<p>{producto.descripcion || 'Delicioso producto de Gavy Pechurina.'}</p>

					<div class="pie">
						<strong>RD$ {Number(producto.precio).toFixed(2)}</strong>
						<a href="/extranet/pedidos">Realizar pedido</a>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.pagina {
		min-height: 100vh;
		padding: 30px;
		background: #fff5ec;
	}

	header {
		text-align: center;
		margin-bottom: 35px;
	}

	header a {
		display: block;
		text-align: left;
		color: #e87520;
		text-decoration: none;
		font-weight: bold;
	}

	h1 {
		color: #e87520;
	}

	.catalogo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 22px;
		max-width: 1100px;
		margin: auto;
	}

	.producto {
		background: white;
		padding: 23px;
		border-radius: 14px;
		box-shadow: 0 5px 20px #00000010;
	}

	.categoria {
		color: #e87520;
		font-size: 13px;
		font-weight: bold;
	}

	.producto h2 {
		color: #333;
	}

	.producto p {
		color: #777;
		min-height: 45px;
	}

	.pie {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-top: 20px;
	}

	.pie strong {
		color: #e87520;
	}

	.pie a {
		background: #e87520;
		color: white;
		padding: 10px;
		border-radius: 7px;
		text-decoration: none;
		font-size: 13px;
	}

	.estado {
		text-align: center;
	}

	.error {
		color: #c62828;
		text-align: center;
	}
</style>
