
<script>
	import { goto } from '$app/navigation';

	let cerrando = $state(false);

	async function cerrarSesion() {
		cerrando = true;

		const respuesta = await fetch('/api/extranet/logout', {
			method: 'POST'
		});

		if (respuesta.ok) {
			await goto('/extranet/login');
			goto(0);
		} else {
			alert('No se pudo cerrar sesión.');
		}

		cerrando = false;
	}
</script>

<svelte:head>
	<title>Extranet | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<header>
		<h1>Gavy Pechurina</h1>
		<button onclick={cerrarSesion} disabled={cerrando}>
			{cerrando ? 'Cerrando...' : 'Cerrar sesión'}
		</button>
	</header>

	<section class="bienvenida">
		<h2>Bienvenido a nuestra Extranet</h2>
		<p>Realiza tus pedidos y consulta tus compras.</p>
	</section>

	<div class="opciones">
		<a href="/extranet/productos">
			<span>🛍️</span>
			<h3>Consultar productos</h3>
			<p>Explora nuestros productos disponibles.</p>
		</a>

		<a href="/extranet/pedidos">
			<span>🛒</span>
			<h3>Realizar pedidos</h3>
			<p>Selecciona tus productos y realiza tu pedido.</p>
		</a>

		<a href="/extranet/historial">
			<span>📋</span>
			<h3>Mis pedidos</h3>
			<p>Consulta el historial y estado de tus pedidos.</p>
		</a>
	</div>
</div>

<style>
	.pagina {
		min-height: 100vh;
		background: #fff5ec;
		padding: 25px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: white;
		padding: 20px;
		border-radius: 12px;
	}

	header h1 {
		color: #e87520;
	}

	button {
		background: #e87520;
		color: white;
		border: none;
		padding: 12px 18px;
		border-radius: 8px;
		cursor: pointer;
	}

	.bienvenida {
		text-align: center;
		padding: 45px 10px;
	}

	.bienvenida h2 {
		color: #333;
	}

	.opciones {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 20px;
		max-width: 1000px;
		margin: auto;
	}

	.opciones a {
		background: white;
		padding: 25px;
		border-radius: 14px;
		text-decoration: none;
		color: #333;
		box-shadow: 0 5px 20px #00000010;
	}

	.opciones a:hover {
		transform: translateY(-4px);
	}

	.opciones span {
		font-size: 35px;
	}

	.opciones h3 {
		color: #e87520;
	}
</style>
