<?php $messages = take_flash(); if ($messages): ?>
<div class="flash-wrap container" aria-live="polite">
<?php foreach ($messages as $message): ?><div class="notice <?= e($message['type'] ?? 'info') ?>"><?= e($message['message'] ?? '') ?></div><?php endforeach; ?>
</div>
<?php endif; ?>
