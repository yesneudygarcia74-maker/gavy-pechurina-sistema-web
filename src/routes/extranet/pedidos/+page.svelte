
<script>
	import { onMount } from 'svelte';

	let entregas = $state([]);
	let cargando = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const respuesta = await fetch('/api/extranet/pedidos');
			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				error = resultado.error || 'No se pudieron cargar las entregas.';
				return;
			}

			entregas = resultado.entregas || [];
		} catch {
			error = 'Error de conexión.';
		} finally {
			cargando = false;
		}
	});
</script>

<svelte:head>
	<title>Entregas asignadas | Gavy Pechurina</title>
</svelte:head>

<main>
	<a href="/extranet">← Volver al panel</a>

	<h1>Entregas asignadas</h1>
	<p class="descripcion">
		Consulta las entregas que Gavy Pechurina te ha asignado.
	</p>

	{#if cargando}
		<p class="estado">Cargando entregas...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if entregas.length === 0}
		<div class="vacio">
			<span>🚚</span>
			<h2>No tienes entregas asignadas</h2>
			<p>Cuando el administrador te asigne una entrega, aparecerá aquí.</p>
		</div>
	{:else}
		<div class="lista">
			{#each entregas as entrega (entrega.id)}
				<article>
					<div class="encabezado">
						<h2>Entrega #{entrega.id}</h2>
						<span class="estado-entrega">
							{entrega.estado || 'Pendiente'}
						</span>
					</div>

					<p><strong>Fecha:</strong> {entrega.created_at
						? new Date(entrega.created_at).toLocaleDateString('es-DO')
						: 'No disponible'}</p>

					<p><strong>Descripción:</strong> {entrega.descripcion || 'Sin descripción'}</p>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 1000px;
		margin: auto;
		padding: 30px 20px;
		min-height: 100vh;
		color: #333;
		background: #fff5ec;
	}

	a {
		color: #e87520;
		text-decoration: none;
		font-weight: bold;
	}

	h1 {
		color: #e87520;
		margin-top: 25px;
	}

	.descripcion {
		color: #777;
	}

	.lista {
		display: grid;
		gap: 18px;
		margin-top: 25px;
	}

	article, .vacio {
		background: white;
		padding: 22px;
		border-radius: 12px;
		box-shadow: 0 4px 15px #00000010;
	}

	.encabezado {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.encabezado h2 {
		color: #e87520;
	}

	.estado-entrega {
		background: #fff0e3;
		color: #e87520;
		padding: 7px 12px;
		border-radius: 20px;
		font-size: 13px;
	}

	.estado {
		text-align: center;
		margin-top: 40px;
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
