
<script>
	import { onMount } from 'svelte';

	let entregas = $state([]);
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

			entregas = resultado.entregas || [];
		} catch {
			error = 'Error de conexión.';
		} finally {
			cargando = false;
		}
	});

	function fecha(valor) {
		return valor ? new Date(valor).toLocaleString('es-DO') : 'No disponible';
	}
</script>

<svelte:head>
	<title>Historial de entregas | Gavy Pechurina</title>
</svelte:head>

<main>
	<a href="/extranet">← Volver al panel</a>

	<h1>Historial de entregas</h1>
	<p>Consulta tus entregas anteriores y sus estados.</p>

	{#if cargando}
		<p class="estado">Cargando historial...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if entregas.length === 0}
		<div class="vacio">
			<span>📋</span>
			<h2>Sin entregas registradas</h2>
			<p>Todavía no tienes entregas anteriores para consultar.</p>
		</div>
	{:else}
		{#each entregas as entrega (entrega.id)}
			<article>
				<h2>Entrega #{entrega.id}</h2>
				<p><strong>Fecha:</strong> {fecha(entrega.created_at)}</p>
				<p><strong>Estado:</strong> {entrega.estado || 'Pendiente'}</p>
				<p><strong>Descripción:</strong> {entrega.descripcion || 'Sin descripción disponible.'}</p>
			</article>
		{/each}
	{/if}
</main>

<style>
	main {
		max-width: 900px;
		min-height: 100vh;
		margin: auto;
		padding: 30px 20px;
		background: #fff5ec;
		color: #333;
	}

	a {
		color: #e87520;
		text-decoration: none;
		font-weight: bold;
	}

	h1, article h2 {
		color: #e87520;
	}

	article, .vacio {
		background: white;
		padding: 22px;
		margin: 20px 0;
		border-radius: 12px;
		box-shadow: 0 4px 15px #00000010;
	}

	.estado {
		text-align: center;
	}

	.error {
		color: #c62828;
	}

	.vacio {
		text-align: center;
		margin-top: 35px;
	}

	.vacio span {
		font-size: 40px;
	}

	.vacio h2 {
		color: #e87520;
	}
</style>
