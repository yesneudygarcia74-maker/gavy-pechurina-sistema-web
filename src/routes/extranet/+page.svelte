
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
	<title>Panel de proveedores | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<header>
		<div>
			<h1>Gavy Pechurina</h1>
			<span>Portal de proveedores</span>
		</div>

		<button onclick={cerrarSesion} disabled={cerrando}>
			{cerrando ? 'Cerrando...' : 'Cerrar sesión'}
		</button>
	</header>

	<section class="bienvenida">
		<h2>Bienvenido al portal de proveedores</h2>
		<p>Gestiona tus entregas y consulta la información relacionada con tus suministros.</p>
	</section>

	<div class="opciones">
		<a href="/extranet/productos">
			<span>📦</span>
			<h3>Productos suministrados</h3>
			<p>Consulta los productos relacionados con tus suministros.</p>
		</a>

		<a href="/extranet/pedidos">
			<span>🚚</span>
			<h3>Entregas asignadas</h3>
			<p>Consulta las entregas que te han sido asignadas.</p>
		</a>

		<a href="/extranet/historial">
			<span>📋</span>
			<h3>Historial de entregas</h3>
			<p>Consulta el registro y estado de tus entregas anteriores.</p>
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
		margin-bottom: 5px;
	}

	header span {
		color: #777;
	}

	button {
		background: #e87520;
		color: white;
		border: none;
		padding: 12px 18px;
		border-radius: 8px;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.bienvenida {
		text-align: center;
		padding: 45px 10px;
	}

	.bienvenida h2 {
		color: #333;
	}

	.bienvenida p {
		color: #777;
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
		transition: transform 0.2s;
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
