
<script>
	const modulos = [
		{
			nombre: 'Pedidos',
			descripcion: 'Consultar pedidos y gestionar sus estados.',
			icono: '🛒',
			ruta: '/intranet/pedidos',
			numero: '01'
		},
		{
			nombre: 'Productos',
			descripcion: 'Registrar, editar y administrar productos.',
			icono: '🍗',
			ruta: '/intranet/productos',
			numero: '02'
		},
		{
			nombre: 'Asistencia',
			descripcion: 'Controlar entradas y salidas del personal.',
			icono: '🕒',
			ruta: '/intranet/asistencia',
			numero: '03'
		},
		{
			nombre: 'Facturación',
			descripcion: 'Consultar y gestionar las facturas.',
			icono: '🧾',
			ruta: '/intranet/facturacion',
			numero: '04'
		}
	];
</script>

<svelte:head>
	<title>Intranet | Gavy Pechurina</title>
	<meta
		name="description"
		content="Panel administrativo de Gavy Pechurina"
	/>
</svelte:head>

<div class="admin-layout">
	<aside class="sidebar">
		<a href="/" class="brand">
			<span class="brand-icon">G</span>
			<span>GAVY <b>PECHURINA</b></span>
		</a>

		<div class="sidebar-label">MENÚ PRINCIPAL</div>

		<a href="/intranet" class="side-link active">
			<span>▦</span> Panel principal
		</a>

		{#each modulos as modulo}
			<a href={modulo.ruta} class="side-link">
				<span>{modulo.icono}</span>
				{modulo.nombre}
			</a>
		{/each}

		<div class="sidebar-bottom">
			<a href="/" class="side-link">
				<span>↩</span> Volver a la tienda
			</a>
		</div>
	</aside>

	<main class="main-content">
		<header class="topbar">
			<div>
				<p class="top-label">GAVY PECHURINA / ADMINISTRACIÓN</p>
				<h1>Panel principal</h1>
			</div>

			<div class="admin-user">
				<div class="avatar">A</div>
				<div>
					<strong>Administración</strong>
					<small>Panel interno</small>
				</div>
			</div>
		</header>

		<section class="welcome">
			<div>
				<span class="welcome-tag">SISTEMA ADMINISTRATIVO</span>
				<h2>¡Bienvenido a Gavy Pechurina!</h2>
				<p>Administra las operaciones de tu negocio desde un solo lugar.</p>
			</div>
			<div class="welcome-icon">🍗</div>
		</section>

		<section class="section-heading">
			<div>
				<h2>Módulos del sistema</h2>
				<p>Selecciona el área que deseas administrar.</p>
			</div>
			<span class="module-count">04 MÓDULOS</span>
		</section>

		<div class="module-grid">
			{#each modulos as modulo}
				<a href={modulo.ruta} class="module-card">
					<div class="card-top">
						<span class="module-icon">{modulo.icono}</span>
						<span class="module-number">{modulo.numero}</span>
					</div>

					<h3>{modulo.nombre}</h3>
					<p>{modulo.descripcion}</p>

					<div class="card-footer">
						<span>Entrar al módulo</span>
						<span class="arrow">→</span>
					</div>
				</a>
			{/each}
		</div>

		<footer>
			<strong>GAVY PECHURINA</strong>
			<span>Calidad y sabor en cada pedido.</span>
		</footer>
	</main>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		background: #f7f7f8;
		color: #292929;
	}

	.admin-layout {
		min-height: 100vh;
		display: flex;
	}

	.sidebar {
		width: 255px;
		background: #fff;
		border-right: 1px solid #eee;
		padding: 28px 18px;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #292929;
		font-size: 16px;
		text-decoration: none;
		font-weight: 800;
		margin-bottom: 48px;
	}

	.brand b {
		color: #e87520;
	}

	.brand-icon {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 12px;
		background: #f47721;
		color: white;
		font-size: 25px;
	}

	.sidebar-label {
		font-size: 10px;
		color: #999;
		font-weight: bold;
		letter-spacing: 1.2px;
		margin: 0 0 15px 10px;
	}

	.side-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 13px 12px;
		margin-bottom: 7px;
		border-radius: 9px;
		color: #666;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		transition: .2s;
	}

	.side-link:hover,
	.side-link.active {
		background: #fff0e3;
		color: #e87520;
	}

	.sidebar-bottom {
		margin-top: auto;
	}

	.main-content {
		flex: 1;
		min-width: 0;
		padding: 30px 4%;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		margin-bottom: 30px;
	}

	.top-label {
		font-size: 10px;
		font-weight: bold;
		color: #e87520;
		letter-spacing: 1px;
		margin: 0 0 8px;
	}

	h1 {
		font-size: 27px;
		margin: 0;
	}

	.admin-user {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #fff0e3;
		color: #e87520;
		font-weight: bold;
	}

	.admin-user strong,
	.admin-user small {
		display: block;
	}

	.admin-user strong {
		font-size: 12px;
	}

	.admin-user small {
		font-size: 11px;
		color: #999;
		margin-top: 4px;
	}

	.welcome {
		background: linear-gradient(110deg, #f47721, #f59a4d);
		color: white;
		border-radius: 16px;
		padding: 35px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 38px;
	}

	.welcome-tag {
		font-size: 10px;
		font-weight: bold;
		letter-spacing: 1.5px;
		opacity: .85;
	}

	.welcome h2 {
		font-size: 25px;
		margin: 12px 0 8px;
	}

	.welcome p {
		font-size: 13px;
		margin: 0;
		opacity: .9;
	}

	.welcome-icon {
		font-size: 65px;
	}

	.section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 20px;
	}

	.section-heading h2 {
		font-size: 19px;
		margin: 0 0 6px;
	}

	.section-heading p {
		font-size: 12px;
		color: #888;
		margin: 0;
	}

	.module-count {
		font-size: 10px;
		font-weight: bold;
		color: #e87520;
		background: #fff0e3;
		padding: 9px 12px;
		border-radius: 20px;
	}

	.module-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}

	.module-card {
		background: white;
		padding: 23px;
		border: 1px solid #eee;
		border-radius: 13px;
		text-decoration: none;
		color: inherit;
		transition: .2s;
	}

	.module-card:hover {
		transform: translateY(-3px);
		border-color: #f47721;
		box-shadow: 0 8px 25px #0000000a;
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.module-icon {
		width: 48px;
		height: 48px;
		display: grid;
		place-items: center;
		background: #fff0e3;
		border-radius: 12px;
		font-size: 23px;
	}

	.module-number {
		font-size: 12px;
		color: #bbb;
		font-weight: bold;
	}

	.module-card h3 {
		font-size: 17px;
		margin: 19px 0 8px;
	}

	.module-card p {
		font-size: 12px;
		color: #888;
		line-height: 1.6;
		min-height: 38px;
		margin: 0;
	}

	.card-footer {
		border-top: 1px solid #f1f1f1;
		margin-top: 18px;
		padding-top: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #e87520;
		font-size: 12px;
		font-weight: bold;
	}

	.arrow {
		font-size: 20px;
	}

	footer {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-top: 50px;
		padding-top: 20px;
		border-top: 1px solid #eee;
		color: #999;
		font-size: 11px;
	}

	footer strong {
		color: #e87520;
	}

	@media (max-width: 750px) {
		.admin-layout {
			display: block;
		}

		.sidebar {
			width: 100%;
			padding: 15px;
		}

		.brand {
			margin-bottom: 15px;
		}

		.sidebar-label,
		.sidebar-bottom {
			display: none;
		}

		.sidebar {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 5px;
		}

		.brand {
			grid-column: 1 / -1;
		}

		.main-content {
			padding: 22px 5%;
		}

		.module-grid {
			grid-template-columns: 1fr;
		}

		.welcome {
			padding: 25px;
		}

		.welcome h2 {
			font-size: 20px;
		}

		.welcome-icon {
			font-size: 42px;
		}
	}

	@media (max-width: 400px) {
		.admin-user {
			display: none;
		}

		.welcome-icon {
			display: none;
		}

		footer {
			flex-direction: column;
		}
	}
</style>
