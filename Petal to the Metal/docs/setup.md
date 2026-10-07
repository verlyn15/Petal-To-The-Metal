# Local setup with XAMPP

## Verified environment

- PHP executable: C:/xampp/php/php.exe, version 8.0.30.
- PDO MySQL driver is available.
- Database server executable: C:/xampp/mysql/bin/mysqld.exe.
- Running database server: MariaDB 10.4.32 on local port 3306, verified using SELECT VERSION().

XAMPP labels its database service MySQL, but this installation bundles MariaDB. The project uses MySQL-compatible PDO and SQL. If your rubric requires Oracle MySQL, point the connection settings at that server and verify it separately.

## Start the database

Open XAMPP Control Panel and start the service labeled MySQL. If it is already running, use that instance; do not launch another server on the same port. This setup session has started the existing database server.

Use PowerShell from the flower shop project folder. PHP and the database client are not on PATH, so the examples use full executable paths.

## Create private configuration

If config/local.php does not exist, copy the example:

```powershell
Copy-Item -LiteralPath 'config/local.example.php' -Destination 'config/local.php'
```

Edit local.php to match your actual credentials. It must return two connection arrays, database and test_database, each with host, port, database, username, and password. The application database is petal_to_the_metal and the separate test database is petal_to_the_metal_test. Tests must never point at the application database.

Do not overwrite an existing local.php or commit it. The current workstation configuration was written only after its connection was verified. Passwords are not shown by the environment check.

## Create the project databases

The two empty project databases are created during this setup task. For a fresh installation, use phpMyAdmin from XAMPP or your database administrator account to create petal_to_the_metal and petal_to_the_metal_test with utf8mb4 / utf8mb4_unicode_ci. Do not replace existing databases containing data.

Database tables and demo products will be added in Task 2. Do not run application checkout or integration tests until those tables exist.

## Verify setup

```powershell
& 'C:\xampp\php\php.exe' scripts/check-environment.php
```

Expected: PHP and PDO pass, and both configured database connections report their actual server version. If no local.php is present, database checks are explicitly skipped. A failed connection produces a nonzero exit code; check that the service is running and that the configured port, credentials, and database name are correct.

## Future website startup

After public pages have been implemented, serve only public/:

```powershell
& 'C:\xampp\php\php.exe' -S 127.0.0.1:8000 -t public
```

Then open http://127.0.0.1:8000/. Task 1 does not yet contain a public website. Do not use the repository root as the document root: application configuration, SQL, and tests belong outside the public directory.
