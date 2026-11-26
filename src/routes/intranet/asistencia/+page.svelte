<script>
	let asistencias = $state([]);
	let cargando = $state(true);
	let mensaje = $state('');
	let observacion = $state('');

	async function cargarAsistencias() {
		cargando = true;

		const res = await fetch('/api/intranet/asistencia');
		const data = await res.json();

		if (res.ok) asistencias = data.asistencias || [];
		else mensaje = data.error;

		cargando = false;
	}

	async function registrarEntrada() {
		mensaje = '';

		const res = await fetch('/api/intranet/asistencia', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ observacion })
		});

		const data = await res.json();

		if (!res.ok) {
			mensaje = data.error;
			return;
		}

		observacion = '';
		mensaje = 'Entrada registrada correctamente.';
		await cargarAsistencias();
	}

	async function registrarSalida(id) {
		const res = await fetch('/api/intranet/asistencia', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		const data = await res.json();
		mensaje = res.ok ? 'Salida registrada correctamente.' : data.error;
		await cargarAsistencias();
	}

	cargarAsistencias();
</script>

<svelte:head>
	<title>Asistencia | Gavy Pechurina</title>
</svelte:head>

<main class="contenedor">
	<h1>Control de asistencia</h1>
	<p>Registro y seguimiento de entradas y salidas.</p>

	<section class="panel">
		<h2>Registrar entrada</h2>
		<textarea bind:value={observacion} placeholder="Observación (opcional)"></textarea>
		<button onclick={registrarEntrada}>Registrar entrada</button>
		{#if mensaje}<p>{mensaje}</p>{/if}
	</section>

	<section class="panel">
		<h2>Historial de asistencia</h2>

		{#if cargando}
			<p>Cargando...</p>
		{:else if asistencias.length === 0}
			<p>No hay registros de asistencia.</p>
		{:else}
			{#each asistencias as a}
				<div class="registro">
					<div>
						<strong>{a.fecha}</strong>
						<p>Entrada: {a.hora_entrada ? new Date(a.hora_entrada).toLocaleTimeString() : 'Pendiente'}</p>
						<p>Salida: {a.hora_salida ? new Date(a.hora_salida).toLocaleTimeString() : 'Pendiente'}</p>
						<small>{a.estado}</small>
					</div>

					{#if !a.hora_salida}
						<button class="secundario" onclick={() => registrarSalida(a.id)}>Registrar salida</button>
					{/if}
				</div>
			{/each}
		{/if}
	</section>
</main>

<style>
	.contenedor { max-width: 1000px; margin: 35px auto; padding: 20px; color: #292929; }
	.contenedor > p { color: #777; }
	.panel { background: white; padding: 24px; border-radius: 14px; margin: 22px 0; box-shadow: 0 3px 15px #0000000d; }
	h2 { font-size: 19px; }
	textarea { display: block; width: 100%; box-sizing: border-box; min-height: 75px; padding: 12px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 8px; font: inherit; }
	button { background: #e87520; color: white; border: 0; border-radius: 8px; padding: 11px 16px; cursor: pointer; font-weight: bold; }
	.secundario { background: #f2f2f2; color: #333; }
	.registro { display: flex; justify-content: space-between; align-items: center; gap: 15px; padding: 16px 0; border-bottom: 1px solid #eee; }
	.registro p { margin: 5px 0; color: #777; }
	small { color: #e87520; }
</style>