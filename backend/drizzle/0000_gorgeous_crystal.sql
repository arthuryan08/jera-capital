CREATE TABLE `simulations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`initial_amount` real NOT NULL,
	`monthly_contribution` real NOT NULL,
	`period_months` integer NOT NULL,
	`fixed_annual_rate` real NOT NULL,
	`variable_expected_annual_rate` real NOT NULL,
	`variable_volatility` real NOT NULL,
	`fixed_income_result` text NOT NULL,
	`variable_income_result` text NOT NULL,
	`tax_summary` text NOT NULL,
	`comparison_pct_diff` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);