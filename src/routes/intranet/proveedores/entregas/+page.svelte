
<script>
	import { onMount } from 'svelte';

	let proveedores = $state([]);
	let entregas = $state([]);
	let proveedor_id = $state('');
	let descripcion = $state('');
	let observacion = $state('');
	let cargando = $state(true);
	let guardando = $state(false);
	let error = $state('');
	let mensaje = $state('');

	async function cargarDatos() {
		try {
			const [resProveedores, resEntregas] = await Promise.all([
				fetch('/api/intranet/proveedores'),
				fetch('/api/intranet/proveedores/entregas')
			]);

			const datosProveedores = await resProveedores.json();
			const datosEntregas = await resEntregas.json();

			if (!resProveedores.ok) throw new Error(datosProveedores.error);
			if (!resEntregas.ok) throw new Error(datosEntregas.error);

			proveedores = (datosProveedores.proveedores || []).filter(
				p => p.rol === 'proveedor'
			);
			entregas = datosEntregas.entregas || [];
		} catch (e) {
			error = e.message;
		} finally {
			cargando = false;
		}
	}

	async function registrarEntrega() {
		if (!proveedor_id || !descripcion.trim()) {
			error = 'Selecciona un proveedor y escribe la descripción.';
			return;
		}

		guardando = true;
		error = '';
		mensaje = '';

		try {
			const respuesta = await fetch('/api/intranet/proveedores/entregas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ proveedor_id, descripcion })
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) throw new Error(resultado.error);

			descripcion = '';
			mensaje = 'Entrega registrada correctamente.';
			await cargarDatos();
		} catch (e) {
			error = e.message;
		} finally {
			guardando = false;
		}
	}

	async function actualizarEntrega(id, estado) {
		guardando = true;
		error = '';
		mensaje = '';

		try {
			const respuesta = await fetch('/api/intranet/proveedores/entregas', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					entrega_id: id,
					estado,
					observacion
				})
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) throw new Error(resultado.error);

			mensaje = 'Entrega actualizada correctamente.';
			observacion = '';
			await cargarDatos();
		} catch (e) {
			error = e.message;
		} finally {
			guardando = false;
		}
	}

	function nombreProveedor(id) {
		return proveedores.find(p => p.id === id)?.nombre || 'Proveedor';
	}

	onMount(cargarDatos);
</script>

<svelte:head>
	<title>Entregas | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<a href="/intranet/proveedores" class="volver">← Volver a proveedores</a>

	<header>
		<p class="etiqueta">GAVY PECHURINA / ADMINISTRACIÓN</p>
		<h1>Gestión de entregas</h1>
		<p>Registra y controla las entregas de los proveedores.</p>
	</header>

	<section class="panel">
		<h2>Registrar nueva entrega</h2>

		<label for="proveedor">Proveedor</label>
		<select id="proveedor" bind:value={proveedor_id}>
			<option value="">Selecciona un proveedor</option>
			{#each proveedores as proveedor (proveedor.id)}
				<option value={proveedor.id}>
					{proveedor.nombre} — {proveedor.email}
				</option>
			{/each}
		</select>

		<label for="descripcion">Descripción de la entrega</label>
		<textarea
			id="descripcion"
			bind:value={descripcion}
			placeholder="Ej. Entrega de pollo y pechurina"
			rows="3"
		></textarea>

		<button onclick={registrarEntrega} disabled={guardando}>
			{guardando ? 'Guardando...' : 'Registrar entrega'}
		</button>
	</section>

	<section class="panel">
		<h2>Entregas registradas</h2>

		{#if cargando}
			<p>Cargando entregas...</p>
		{:else if entregas.length === 0}
			<p class="vacio">Todavía no hay entregas registradas.</p>
		{:else}
			<div class="lista">
				{#each entregas as entrega (entrega.id)}
					<article class="entrega">
						<div>
							<strong>{nombreProveedor(entrega.proveedor_id)}</strong>
							<p>{entrega.descripcion}</p>
							<small>
								Asignada: {new Date(entrega.fecha_asignacion).toLocaleString('es-DO')}
							</small>
							{#if entrega.fecha_entrega}
								<small>
									Entregada: {new Date(entrega.fecha_entrega).toLocaleString('es-DO')}
								</small>
							{/if}
						</div>

						<div class="acciones">
							<span class:completada={entrega.estado === 'Entregado'} class="estado">
								{entrega.estado}
							</span>

							{#if entrega.estado !== 'Entregado'}
								<button
									class="completar"
									onclick={() => actualizarEntrega(entrega.id, 'Entregado')}
									disabled={guardando}
								>
									Marcar entregada
								</button>
							{:else}
								<span class="confirmada">Finalizada</span>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>

	{#if mensaje}
		<div class="exito">{mensaje}</div>
	{/if}

	{#if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f7f7f8;
		font-family: Arial, sans-serif;
		color: #292929;
	}

	.pagina {
		max-width: 1050px;
		margin: auto;
		padding: 35px;
	}

	.volver {
		color: #e87520;
		text-decoration: none;
		font-weight: bold;
		font-size: 13px;
	}

	header {
		margin: 25px 0;
	}

	.etiqueta {
		color: #e87520;
		font-size: 11px;
		font-weight: bold;
		letter-spacing: 1px;
	}

	h1 {
		margin: 8px 0;
	}

	header p:last-child, .vacio {
		color: #888;
		font-size: 13px;
	}

	.panel {
		background: white;
		padding: 25px;
		border: 1px solid #eee;
		border-radius: 12px;
		margin-bottom: 22px;
	}

	h2 {
		font-size: 19px;
		margin-top: 0;
	}

	label {
		display: block;
		font-size: 13px;
		font-weight: bold;
		margin: 16px 0 8px;
	}

	select, textarea {
		width: 100%;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font: inherit;
		box-sizing: border-box;
	}

	button {
		background: #e87520;
		color: white;
		border: 0;
		padding: 12px 18px;
		border-radius: 8px;
		font-weight: bold;
		cursor: pointer;
		margin-top: 15px;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.entrega {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 18px 0;
		border-bottom: 1px solid #eee;
	}

	.entrega p {
		font-size: 13px;
	}

	.entrega small {
		display: block;
		color: #888;
		font-size: 11px;
		margin-top: 6px;
	}

	.acciones {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.estado {
		background: #fff4df;
		color: #a86600;
		padding: 6px 10px;
		border-radius: 20px;
		font-size: 11px;
	}

	.estado.completada {
		background: #e9f8ed;
		color: #238344;
	}

	.completar {
		background: #238344;
		margin: 0;
		font-size: 11px;
	}

	.confirmada {
		color: #238344;
		font-size: 12px;
	}

	.exito, .error {
		padding: 13px;
		border-radius: 8px;
		margin-top: 15px;
		font-size: 13px;
	}

	.exito {
		background: #e9f8ed;
		color: #238344;
	}

	.error {
		background: #fff0f0;
		color: #b42318;
	}

	@media (max-width: 600px) {
		.pagina {
			padding: 20px 14px;
		}

		.entrega {
			align-items: flex-start;
			flex-direction: column;
		}

		.acciones {
			align-items: flex-start;
		}
	}
</style>
