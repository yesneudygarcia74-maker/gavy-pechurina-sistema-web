
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
	<title>Productos suministrados | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<header>
		<a href="/extranet">← Volver al panel</a>
		<h1>Productos suministrados</h1>
		<p>Consulta los productos relacionados con tus suministros a Gavy Pechurina.</p>
	</header>

	{#if cargando}
		<p class="estado">Cargando productos...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if productos.length === 0}
		<div class="vacio">
			<span>📦</span>
			<h2>No hay productos registrados</h2>
			<p>Todavía no tienes productos suministrados para consultar.</p>
		</div>
	{:else}
		<div class="catalogo">
			{#each productos as producto (producto.id)}
				<article class="producto">
					<span class="categoria">{producto.categoria || 'General'}</span>
					<h2>{producto.nombre}</h2>
					<p>{producto.descripcion || 'Sin descripción disponible.'}</p>
					<div class="pie">
						<strong>RD$ {Number(producto.precio).toFixed(2)}</strong>
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

	header p {
		color: #777;
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
		margin-top: 20px;
	}

	.pie strong {
		color: #e87520;
	}

	.estado {
		text-align: center;
	}

	.error {
		color: #c62828;
		text-align: center;
	}

	.vacio {
		background: white;
		max-width: 500px;
		margin: 50px auto;
		padding: 35px;
		border-radius: 14px;
		text-align: center;
	}

	.vacio span {
		font-size: 40px;
	}

	.vacio h2 {
		color: #e87520;
	}

	.vacio p {
		color: #777;
	}
</style>
