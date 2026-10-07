# Petal to the Metal

A flower shop school project using HTML, CSS, vanilla JavaScript, PHP, and MySQL-compatible SQL with XAMPP.

The approved scope includes customer accounts, a flower catalog, a cart, simulated payment, delivery/pickup, order history, and an admin panel. Payment is a classroom simulation and does not charge real money.

## Current progress

Task 1 is implemented: application configuration, a lazy PDO connection, secure session bootstrap, a CLI environment check, and local setup instructions. Storefront pages and database tables are the next tasks; a website is not available yet.

## Setup

Follow [the XAMPP setup guide](docs/setup.md). From this project folder, verify the environment with:

```powershell
& 'C:\xampp\php\php.exe' scripts/check-environment.php
& 'C:\xampp\php\php.exe' tests/bootstrap-error-logging.php
```

Shop name, currency, timezone, and fulfillment fees are editable in config/app.php. Database credentials belong in config/local.php, which is excluded from Git.

## Planning

- [Approved design](docs/plans/2026-10-08-flower-shop-design.md)
- [Implementation plan](docs/plans/2026-10-08-flower-shop-implementation-plan.md)
