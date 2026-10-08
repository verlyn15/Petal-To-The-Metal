<?php $viewer = current_user(); $siteName = app_config()['shop_name']; $activePage = basename($_SERVER['SCRIPT_NAME'] ?? ''); ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Thoughtfully arranged flowers for everyday gestures and the moments that matter. Explore Petal to the Metal.">
  <title><?= e(($pageTitle ?? 'Flowers for the feeling') . ' · ' . $siteName) ?></title>
  <link rel="stylesheet" href="<?= e(url('/assets/css/styles.css')) ?>">
  <script src="<?= e(url('/assets/js/main.js')) ?>" defer></script>
  <?php foreach (($pageScripts ?? []) as $script): ?><script src="<?= e(url('/assets/js/' . $script . '.js')) ?>" defer></script><?php endforeach; ?>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="announcement">A little love, in full bloom. <span>Delivery &amp; store pickup</span></div>
<header class="site-header">
  <div class="header-inner">
    <a class="wordmark" href="<?= e(url('/')) ?>" aria-label="<?= e($siteName) ?> home"><span class="brand-flower" aria-hidden="true">✳</span><span><?= e($siteName) ?><span class="brand-tagline">FLOWERS &amp; LITTLE JOYS</span></span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" hidden>Menu <span aria-hidden="true">☰</span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">
      <a <?= $activePage === 'index.php' ? 'aria-current="page"' : '' ?> href="<?= e(url('/')) ?>">Home</a>
      <a <?= $activePage === 'shop.php' ? 'aria-current="page"' : '' ?> href="<?= e(url('/shop.php')) ?>">The flower shop</a>
      <?php if ($viewer): ?>
        <?php if ($viewer['role'] === 'admin'): ?><a href="<?= e(url('/admin/index.php')) ?>">Admin panel</a><?php else: ?><a href="<?= e(url('/orders.php')) ?>">My orders</a><?php endif; ?>
        <form class="inline-form" action="<?= e(url('/logout.php')) ?>" method="post"><?= csrf_field() ?><button class="nav-button" type="submit">Log out</button></form>
      <?php else: ?><a href="<?= e(url('/login.php')) ?>">Log in</a><?php endif; ?>
      <?php if (!$viewer || $viewer['role'] === 'customer'): ?><a class="cart-link" href="<?= e(url('/cart.php')) ?>">Bag <span class="cart-count"><?= array_sum(get_cart()) ?></span></a><?php endif; ?>
    </nav>
  </div>
</header>
<?php require __DIR__ . '/flash.php'; ?>
<main id="main">
