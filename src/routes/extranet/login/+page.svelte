
<script>
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let cargando = $state(false);

	async function iniciarSesion() {
		error = '';
		cargando = true;

		try {
			const respuesta = await fetch('/api/extranet/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				error = resultado.error || 'No se pudo iniciar sesión.';
				return;
			}

			await goto('/extranet');
		} catch {
			error = 'Error de conexión. Inténtalo nuevamente.';
		} finally {
			cargando = false;
		}
	}
</script>

<svelte:head>
	<title>Acceso de clientes | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<form onsubmit={(e) => { e.preventDefault(); iniciarSesion(); }}>
		<h1>Gavy Pechurina</h1>
		<p>Acceso para clientes</p>

		<label>Correo electrónico</label>
		<input type="email" bind:value={email} placeholder="Tu correo" required />

		<label>Contraseña</label>
		<input type="password" bind:value={password} placeholder="Tu contraseña" required />

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<button type="submit" disabled={cargando}>
			{cargando ? 'Ingresando...' : 'Iniciar sesión'}
		</button>

		<p class="registro">
			¿No tienes cuenta? <a href="/extranet/registro">Regístrate</a>
		</p>
	</form>
</div>

<style>
	.pagina {
		min-height: 100vh;
		display: grid;
		place-items: center;
		background: #fff5ec;
		padding: 20px;
	}

	form {
		background: white;
		width: 100%;
		max-width: 400px;
		padding: 35px;
		border-radius: 16px;
		box-shadow: 0 8px 30px #00000012;
	}

	h1 {
		color: #e87520;
		text-align: center;
	}

	form > p {
		text-align: center;
		color: #777;
	}

	label {
		display: block;
		margin-top: 18px;
		font-weight: bold;
	}

	input {
		width: 100%;
		padding: 12px;
		margin-top: 7px;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-sizing: border-box;
	}

	button {
		width: 100%;
		padding: 13px;
		margin-top: 22px;
		background: #e87520;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: bold;
		cursor: pointer;
	}

	.error {
		color: #c62828;
	}

	.registro {
		margin-top: 20px;
	}

	a {
		color: #e87520;
		font-weight: bold;
	}
</style>
