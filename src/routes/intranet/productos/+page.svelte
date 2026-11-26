<script>
	let productos = $state([]);
	let cargando = $state(true);
	let mensaje = $state('');
	let nombre = $state('');
	let descripcion = $state('');
	let precio = $state('');
	let categoria = $state('');
	let editando = $state(null);

	async function cargarProductos() {
		cargando = true;
		const res = await fetch('/api/intranet/productos');
		const data = await res.json();

		if (res.ok) productos = data.productos || [];
		else mensaje = data.error || 'Error al cargar productos';

		cargando = false;
	}

	async function guardarProducto() {
		mensaje = '';

		const producto = {
			nombre,
			descripcion,
			precio: Number(precio),
			categoria,
			activo: true
		};

		const res = await fetch('/api/intranet/productos', {
			method: editando ? 'PUT' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(editando ? { ...producto, id: editando } : producto)
		});

		const data = await res.json();

		if (!res.ok) {
			mensaje = data.error || 'No se pudo guardar';
			return;
		}

		limpiar();
		await cargarProductos();
		mensaje = 'Producto guardado correctamente';
	}

	function prepararEdicion(p) {
		editando = p.id;
		nombre = p.nombre || '';
		descripcion = p.descripcion || '';
		precio = p.precio ?? '';
		categoria = p.categoria || '';
	}

	function limpiar() {
		editando = null;
		nombre = '';
		descripcion = '';
		precio = '';
		categoria = '';
	}

	async function cambiarEstado(p) {
		const res = await fetch('/api/intranet/productos', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: p.id, activo: !p.activo })
		});

		const data = await res.json();
		if (!res.ok) mensaje = data.error || 'No se pudo actualizar';
		await cargarProductos();
	}

	cargarProductos();
</script>

<svelte:head>
	<title>Productos | Intranet Gavy Pechurina</title>
</svelte:head>

<main class="contenedor">
	<header>
		<h1>Gestión de productos</h1>
		<p>Administra el catálogo de Gavy Pechurina.</p>
	</header>

	<section class="panel">
		<h2>{editando ? 'Editar producto' : 'Agregar producto'}</h2>

		<form onsubmit={(e) => { e.preventDefault(); guardarProducto(); }}>
			<input bind:value={nombre} placeholder="Nombre del producto" required />
			<input bind:value={categoria} placeholder="Categoría" required />
			<input bind:value={precio} type="number" min="0" step="0.01" placeholder="Precio" required />
			<textarea bind:value={descripcion} placeholder="Descripción"></textarea>

			<div class="acciones">
				<button type="submit">{editando ? 'Actualizar' : 'Guardar producto'}</button>
				{#if editando}
					<button type="button" class="secundario" onclick={limpiar}>Cancelar</button>
				{/if}
			</div>
		</form>
		{#if mensaje}<p>{mensaje}</p>{/if}
	</section>

	<section class="panel">
		<h2>Productos registrados</h2>

		{#if cargando}
			<p>Cargando productos...</p>
		{:else if productos.length === 0}
			<p>No hay productos registrados.</p>
		{:else}
			{#each productos as p}
				<div class="producto">
					<div>
						<strong>{p.nombre}</strong>
						<p>{p.categoria} · RD$ {p.precio}</p>
						<small>{p.activo ? 'Activo' : 'Inactivo'}</small>
					</div>
					<div class="acciones">
						<button class="secundario" onclick={() => prepararEdicion(p)}>Editar</button>
						<button class="secundario" onclick={() => cambiarEstado(p)}>
							{p.activo ? 'Desactivar' : 'Activar'}
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</section>
</main>

<style>
	.contenedor { max-width: 1000px; margin: 35px auto; padding: 20px; color: #292929; }
	header { margin-bottom: 25px; }
	header p { color: #777; }
	.panel { background: white; padding: 24px; border-radius: 14px; margin-bottom: 22px; box-shadow: 0 3px 15px #0000000d; }
	h2 { font-size: 19px; margin-top: 0; }
	form { display: grid; gap: 13px; }
	input, textarea { width: 100%; box-sizing: border-box; padding: 13px; border: 1px solid #ddd; border-radius: 8px; font: inherit; }
	textarea { min-height: 85px; resize: vertical; }
	button { background: #e87520; color: white; border: 0; border-radius: 8px; padding: 11px 16px; cursor: pointer; font-weight: bold; }
	.secundario { background: #f2f2f2; color: #333; }
	.acciones { display: flex; gap: 9px; flex-wrap: wrap; }
	.producto { display: flex; justify-content: space-between; align-items: center; gap: 15px; padding: 16px 0; border-bottom: 1px solid #eee; }
	.producto p { margin: 5px 0; color: #777; }
	small { color: #e87520; }
</style>