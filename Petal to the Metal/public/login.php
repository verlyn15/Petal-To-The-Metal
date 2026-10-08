<?php
require_once dirname(__DIR__) . '/app/init.php';
if (current_user()) { redirect(current_user()['role'] === 'admin' ? '/admin/index.php' : '/shop.php'); }
$pageTitle = 'Welcome back'; $state = $_SESSION['_login_form'] ?? []; unset($_SESSION['_login_form']);
$return = $_GET['return'] ?? ($_SESSION['_login_return'] ?? '/shop.php'); $return = in_array($return, ['/cart.php','/checkout.php','/orders.php','/shop.php'], true) ? $return : '/shop.php';
require dirname(__DIR__) . '/templates/header.php';
?>
<section class="auth-section"><div class="auth-visual"><img src="<?= e(url('/assets/images/tulip-bouquet.jpg')) ?>" alt="A fresh bouquet of tulips" width="700" height="900"><div class="auth-caption">Something lovely<br>is waiting for you.</div></div><div class="auth-panel"><p class="eyebrow">Good to see you again</p><h1>Welcome back.</h1><p class="muted">Log in to pick up where you left off.</p>
<?php if (!empty($state['error'])): ?><div class="notice error" role="alert"><?= e($state['error']) ?></div><?php endif; ?>
<form action="<?= e(url('/actions/login.php')) ?>" method="post"><?= csrf_field() ?><input type="hidden" name="return" value="<?= e($return) ?>"><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" maxlength="190" value="<?= e($state['email'] ?? '') ?>" required></div><div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="200" required></div><button class="button" type="submit">Log in <span aria-hidden="true">↗</span></button></form><p class="auth-switch">New around here? <a href="<?= e(url('/register.php')) ?>">Create an account</a></p></div></section><?php require dirname(__DIR__) . '/templates/footer.php'; ?>
