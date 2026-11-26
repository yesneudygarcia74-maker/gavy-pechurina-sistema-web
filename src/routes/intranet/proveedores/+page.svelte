
<script>
	import { onMount } from 'svelte';

	let proveedores = $state([]);
	let proveedorSeleccionado = $state('');
	let productos = $state([]);
	let asignados = $state([]);
	let cargando = $state(true);
	let guardando = $state(false);
	let error = $state('');
	let mensaje = $state('');

	async function cargarProveedores() {
		try {
			const respuesta = await fetch('/api/intranet/proveedores');
			const resultado = await respuesta.json();

			if (!respuesta.ok) throw new Error(resultado.error);

			proveedores = (resultado.proveedores || []).filter(
				p => p.rol === 'proveedor'
			);
		} catch (e) {
			error = e.message;
		} finally {
			cargando = false;
		}
	}

	async function seleccionarProveedor(id) {
		proveedorSeleccionado = id;
		productos = [];
		asignados = [];
		error = '';
		mensaje = '';

		try {
			const respuesta = await fetch(
				`/api/intranet/proveedores/asignaciones?proveedor_id=${id}`
			);
			const resultado = await respuesta.json();

			if (!respuesta.ok) throw new Error(resultado.error);

			productos = resultado.productos || [];
			asignados = resultado.asignados || [];
		} catch (e) {
			error = e.message;
		}
	}

	async function cambiarAsignacion(productoId, seleccionado) {
		if (guardando) return;

		guardando = true;
		error = '';
		mensaje = '';

		try {
			const respuesta = await fetch(
				'/api/intranet/proveedores/asignaciones',
				{
					method: seleccionado ? 'POST' : 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						proveedor_id: proveedorSeleccionado,
						producto_id: productoId
					})
				}
			);

			const resultado = await respuesta.json();

			if (!respuesta.ok) throw new Error(resultado.error);

			if (seleccionado) {
				asignados = [...asignados, productoId];
				mensaje = 'Producto asignado correctamente.';
			} else {
				asignados = asignados.filter(id => id !== productoId);
				mensaje = 'Asignación eliminada correctamente.';
			}
		} catch (e) {
			error = e.message;
		} finally {
			guardando = false;
		}
	}

	onMount(cargarProveedores);
</script>

<svelte:head>
	<title>Proveedores | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<header class="encabezado">
		<div>
			<a href="/intranet" class="volver">← Volver al Intranet</a>
			<p class="etiqueta">GAVY PECHURINA / ADMINISTRACIÓN</p>
			<h1>Gestión de proveedores</h1>
			<p class="subtitulo">Administra las cuentas y los productos asignados.</p>
		</div>
		<div class="icono">🚚</div>
	</header>

	<section class="resumen">
		<div class="tarjeta">
			<span>👥</span>
			<div>
				<p>Proveedores autorizados</p>
				<strong>{proveedores.length}</strong>
			</div>
		</div>
	</section>

	<section class="contenido">
		<h2>Asignación de productos</h2>
		<p class="descripcion">Selecciona un proveedor para administrar sus productos.</p>

		<label for="proveedor">Seleccionar proveedor</label>

		<select
			id="proveedor"
			bind:value={proveedorSeleccionado}
			onchange={() => seleccionarProveedor(proveedorSeleccionado)}
		>
			<option value="">Selecciona un proveedor</option>
			{#each proveedores as proveedor (proveedor.id)}
				<option value={proveedor.id}>
					{proveedor.nombre} — {proveedor.email}
				</option>
			{/each}
		</select>

		{#if cargando}
			<p class="mensaje">Cargando proveedores...</p>
		{:else if proveedores.length === 0}
			<p class="mensaje">No hay proveedores aprobados.</p>
		{/if}

		{#if proveedorSeleccionado}
			<div class="seccion-productos">
				<h2>Productos disponibles</h2>
				<p class="descripcion">
					Marca los productos que tendrá asignados este proveedor.
				</p>

				{#if productos.length === 0}
					<p class="mensaje">No hay productos activos disponibles.</p>
				{:else}
					<div class="lista-productos">
						{#each productos as producto (producto.id)}
							<label class="producto">
								<div>
									<strong>{producto.nombre}</strong>
									<small>{producto.categoria || 'Sin categoría'}</small>
								</div>

								<input
									type="checkbox"
									checked={asignados.includes(producto.id)}
									disabled={guardando}
									onchange={(event) =>
										cambiarAsignacion(producto.id, event.currentTarget.checked)}
								/>
							</label>
						{/each}
					</div>
				{/if}

				<p class="contador">
					Productos asignados: <strong>{asignados.length}</strong>
				</p>
			</div>
		{/if}

		{#if mensaje}
			<div class="exito">{mensaje}</div>
		{/if}

		{#if error}
			<div class="error">{error}</div>
		{/if}
	</section>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f7f7f8;
		font-family: Arial, sans-serif;
		color: #292929;
	}

	.pagina {
		max-width: 1100px;
		margin: auto;
		padding: 35px;
	}

	.encabezado {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.volver {
		color: #e87520;
		text-decoration: none;
		font-size: 13px;
		font-weight: bold;
	}

	.etiqueta {
		color: #e87520;
		font-size: 10px;
		font-weight: bold;
		letter-spacing: 1px;
		margin-top: 25px;
	}

	h1 {
		font-size: 28px;
		margin: 8px 0;
	}

	.subtitulo, .descripcion {
		color: #888;
		font-size: 13px;
	}

	.icono {
		font-size: 55px;
	}

	.tarjeta, .contenido {
		background: white;
		border: 1px solid #eee;
		border-radius: 12px;
		padding: 22px;
		margin-bottom: 22px;
	}

	.tarjeta {
		display: flex;
		align-items: center;
		gap: 15px;
		max-width: 280px;
	}

	.tarjeta span {
		font-size: 30px;
	}

	.tarjeta p {
		color: #888;
		font-size: 12px;
		margin: 0 0 7px;
	}

	.tarjeta strong {
		font-size: 24px;
	}

	.contenido h2 {
		font-size: 19px;
	}

	.descripcion {
		margin-bottom: 20px;
	}

	select {
		width: 100%;
		padding: 13px;
		border: 1px solid #ddd;
		border-radius: 8px;
		margin-top: 9px;
		font-size: 14px;
		background: white;
	}

	.seccion-productos {
		margin-top: 30px;
	}

	.lista-productos {
		display: grid;
		gap: 10px;
	}

	.producto {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px;
		border: 1px solid #eee;
		border-radius: 9px;
		cursor: pointer;
	}

	.producto strong, .producto small {
		display: block;
	}

	.producto small {
		color: #888;
		margin-top: 5px;
	}

	.producto input {
		width: 19px;
		height: 19px;
		accent-color: #e87520;
	}

	.contador {
		margin-top: 20px;
		font-size: 13px;
	}

	.mensaje {
		color: #888;
		padding: 20px 0;
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
	}
</style>
