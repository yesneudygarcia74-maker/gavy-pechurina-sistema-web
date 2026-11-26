
<script>

	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let cargando = $state(false);
	let errorMensaje = $state('');

	async function iniciarSesion() {
	errorMensaje = '';
	cargando = true;

	try {
		const respuesta = await fetch('/api/intranet/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const resultado = await respuesta.json();

		if (!respuesta.ok) {
			throw new Error(resultado.error);
		}

		await goto('/intranet');
	} catch (error) {
		errorMensaje = error.message || 'No se pudo iniciar sesión.';
	} finally {
		cargando = false;
	}
}
</script>

<svelte:head>
	<title>Acceso administrador | Gavy Pechurina</title>
</svelte:head>

<div class="login">
	<div class="panel">
		<div class="logo">GP</div>
		<h1>Gavy Pechurina</h1>
		<p>Panel de administración</p>

		<form onsubmit={(e) => { e.preventDefault(); iniciarSesion(); }}>
			<label>Correo electrónico</label>
			<input type="email" bind:value={email} placeholder="admin@ejemplo.com" required />

			<label>Contraseña</label>
			<input type="password" bind:value={password} placeholder="Tu contraseña" required />

			{#if errorMensaje}
				<div class="error">{errorMensaje}</div>
			{/if}

			<button type="submit" disabled={cargando}>
				{cargando ? 'Ingresando...' : 'Iniciar sesión'}
			</button>
		</form>

		<a href="/">Volver a la tienda</a>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		background: #fff7f0;
	}

	.login {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.panel {
		width: 100%;
		max-width: 410px;
		background: white;
		padding: 38px;
		border-radius: 18px;
		box-shadow: 0 10px 40px #00000012;
		text-align: center;
	}

	.logo {
		width: 65px;
		height: 65px;
		margin: auto;
		display: grid;
		place-items: center;
		border-radius: 17px;
		background: #f47721;
		color: white;
		font-size: 24px;
		font-weight: bold;
	}

	h1 { color: #292929; margin-bottom: 8px; }
	p { color: #777; margin-bottom: 30px; }

	form { text-align: left; }

	label {
		display: block;
		margin: 17px 0 8px;
		font-weight: bold;
		color: #444;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		padding: 14px;
		border: 1px solid #ddd;
		border-radius: 9px;
		font-size: 15px;
	}

	button {
		width: 100%;
		margin-top: 25px;
		padding: 15px;
		background: #f47721;
		border: none;
		border-radius: 9px;
		color: white;
		font-weight: bold;
		cursor: pointer;
	}

	button:disabled { opacity: .6; }

	.error {
		margin-top: 15px;
		padding: 12px;
		background: #fff0f0;
		color: #b42318;
		border-radius: 8px;
		font-size: 14px;
	}

	a {
		display: inline-block;
		margin-top: 25px;
		color: #e87520;
		text-decoration: none;
	}
</style>
