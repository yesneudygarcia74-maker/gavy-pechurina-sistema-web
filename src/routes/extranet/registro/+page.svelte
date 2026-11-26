
<script>
	import { goto } from '$app/navigation';

	let nombre = $state('');
	let email = $state('');
	let password = $state('');
	let telefono = $state('');
	let error = $state('');
	let mensaje = $state('');
	let cargando = $state(false);

	async function registrar() {
		error = '';
		mensaje = '';
		cargando = true;

		try {
			const respuesta = await fetch('/api/extranet/registro', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nombre, email, password, telefono })
			});

			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				error = resultado.error || 'No se pudo crear la cuenta.';
				return;
			}

			mensaje = resultado.mensaje || 'Cuenta creada correctamente.';
			if (resultado.correcto) {
				setTimeout(() => goto('/extranet/login'), 1500);
			}
		} catch {
			error = 'Error de conexión.';
		} finally {
			cargando = false;
		}
	}
</script>

<svelte:head>
	<title>Registro de clientes | Gavy Pechurina</title>
</svelte:head>

<div class="pagina">
	<form onsubmit={(e) => { e.preventDefault(); registrar(); }}>
		<h1>Gavy Pechurina</h1>
		<p>Crear cuenta de cliente</p>

		<label>Nombre completo</label>
		<input bind:value={nombre} required placeholder="Tu nombre" />

		<label>Correo electrónico</label>
		<input type="email" bind:value={email} required placeholder="Tu correo" />

		<label>Teléfono</label>
		<input bind:value={telefono} required placeholder="Tu teléfono" />

		<label>Contraseña</label>
		<input type="password" bind:value={password} required minlength="6" placeholder="Mínimo 6 caracteres" />

		{#if error}<p class="error">{error}</p>{/if}
		{#if mensaje}<p class="mensaje">{mensaje}</p>{/if}

		<button type="submit" disabled={cargando}>
			{cargando ? 'Registrando...' : 'Crear cuenta'}
		</button>

		<p class="enlace">¿Ya tienes cuenta? <a href="/extranet/login">Inicia sesión</a></p>
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
		max-width: 420px;
		padding: 35px;
		border-radius: 16px;
		box-shadow: 0 8px 30px #00000012;
	}

	h1 { color: #e87520; text-align: center; }
	form > p { text-align: center; color: #777; }

	label {
		display: block;
		margin-top: 15px;
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

	.error { color: #c62828; }
	.mensaje { color: #238447; }
	a { color: #e87520; font-weight: bold; }
</style>
