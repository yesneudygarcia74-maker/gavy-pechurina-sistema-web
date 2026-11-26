
<script>
	import { goto } from '$app/navigation';

	let { children } = $props();
	let cerrando = $state(false);

	async function cerrarSesion() {
		cerrando = true;

		try {
			const respuesta = await fetch('/api/intranet/logout', {
				method: 'POST'
			});

			if (respuesta.ok) {
				await goto('/intranet/login');
				goto(0);
			} else {
				alert('No se pudo cerrar la sesión.');
			}
		} catch {
			alert('Error al cerrar la sesión.');
		} finally {
			cerrando = false;
		}
	}
</script>

<div class="intranet">
	<header>
		<strong>Gavy Pechurina | Intranet</strong>
		<button onclick={cerrarSesion} disabled={cerrando}>
			{cerrando ? 'Cerrando...' : 'Cerrar sesión'}
		</button>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.intranet header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		background: #242424;
		color: white;
	}

	button {
		background: #e87520;
		color: white;
		border: none;
		padding: 10px 16px;
		border-radius: 7px;
		cursor: pointer;
		font-weight: bold;
	}

	button:disabled {
		opacity: 0.6;
	}

	main {
		padding: 20px;
	}
</style>
