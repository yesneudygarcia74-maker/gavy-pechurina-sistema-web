
<script>
	import { onMount } from 'svelte';

	let productos = $state([]);
	let carrito = $state([]);
	let nombre = $state('');
	let telefono = $state('');
	let direccion = $state('');
	let notas = $state('');
	let mensaje = $state('');
	let cargando = $state(false);

	onMount(async () => {
		const r = await fetch('/api/extranet/productos');
		const d = await r.json();
		if (r.ok) productos = d.productos || [];
		else mensaje = d.error || 'No se pudieron cargar los productos.';
	});

	let total = $derived(
		carrito.reduce((s, item) => s + Number(item.precio) * item.cantidad, 0)
	);

	function agregar(producto) {
		const existente = carrito.find(i => i.producto_id === producto.id);
		if (existente) {
			carrito = carrito.map(i =>
				i.producto_id === producto.id
					? { ...i, cantidad: i.cantidad + 1 }
					: i
			);
		} else {
			carrito = [...carrito, {
				producto_id: producto.id,
				nombre: producto.nombre,
				precio: producto.precio,
				cantidad: 1
			}];
		}
	}

	function cambiarCantidad(id, cantidad) {
		if (cantidad < 1) {
			carrito = carrito.filter(i => i.producto_id !== id);
		} else {
			carrito = carrito.map(i =>
				i.producto_id === id ? { ...i, cantidad } : i
			);
		}
	}

	async function realizarPedido() {
		mensaje = '';

		if (!nombre || !telefono || !direccion || carrito.length === 0) {
			mensaje = 'Completa tus datos y agrega productos.';
			return;
		}

		cargando = true;

		try {
			const respuesta = await fetch('/api/extranet/pedidos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nombre_cliente: nombre,
					telefono,
					direccion,
					notas,
					items: carrito.map(i => ({
						producto_id: i.producto_id,
						cantidad: i.cantidad
					}))
				})
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				mensaje = resultado.error || 'No se pudo realizar el pedido.';
				return;
			}

			carrito = [];
			nombre = '';
			telefono = '';
			direccion = '';
			notas = '';
			mensaje = '¡Pedido realizado correctamente!';
		} catch {
			mensaje = 'Error de conexión.';
		} finally {
			cargando = false;
		}
	}
</script>

<svelte:head>
	<title>Realizar pedido | Gavy Pechurina</title>
</svelte:head>

<main>
	<a href="/extranet">← Volver</a>
	<h1>Realizar pedido</h1>

	<h2>Productos disponibles</h2>

	<div class="catalogo">
		{#each productos as producto (producto.id)}
			<article>
				<h3>{producto.nombre}</h3>
				<p>{producto.descripcion || ''}</p>
				<strong>RD$ {Number(producto.precio).toFixed(2)}</strong>
				<button onclick={() => agregar(producto)}>Agregar</button>
			</article>
		{/each}
	</div>

	<h2>Mi pedido</h2>

	{#each carrito as item (item.producto_id)}
		<div class="item">
			<span>{item.nombre} — RD$ {Number(item.precio).toFixed(2)}</span>
			<input
				type="number"
				min="0"
				max="50"
				value={item.cantidad}
				onchange={e => cambiarCantidad(item.producto_id, Number(e.currentTarget.value))}
			/>
		</div>
	{/each}

	<h3>Total: RD$ {total.toFixed(2)}</h3>

	<h2>Datos de entrega</h2>
	<input placeholder="Nombre completo" bind:value={nombre} />
	<input placeholder="Teléfono" bind:value={telefono} />
	<input placeholder="Dirección de entrega" bind:value={direccion} />
	<textarea placeholder="Notas del pedido (opcional)" bind:value={notas}></textarea>

	<button class="enviar" onclick={realizarPedido} disabled={cargando}>
		{cargando ? 'Enviando...' : 'Confirmar pedido'}
	</button>

	<p>{mensaje}</p>
</main>

<style>
	main {
		max-width: 1000px;
		margin: auto;
		padding: 30px 20px;
		color: #333;
	}
	body { background: #fff5ec; }
	a { color: #e87520; text-decoration: none; font-weight: bold; }
	h1, h2 { color: #e87520; }
	.catalogo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 18px;
	}
	article {
		background: white;
		padding: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 15px #00000010;
	}
	article strong { display: block; margin: 12px 0; }
	button {
		background: #e87520;
		color: white;
		border: 0;
		padding: 11px 15px;
		border-radius: 7px;
		cursor: pointer;
	}
	.item {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		margin: 12px 0;
	}
	input, textarea {
		display: block;
		width: 100%;
		box-sizing: border-box;
		padding: 12px;
		margin: 10px 0;
		border: 1px solid #ddd;
		border-radius: 7px;
	}
	.item input { width: 75px; }
	.enviar { margin-top: 15px; }
</style>
