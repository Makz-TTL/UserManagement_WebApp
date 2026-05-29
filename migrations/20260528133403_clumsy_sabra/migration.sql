CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`userName` text NOT NULL UNIQUE,
	`lastName` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`phone` integer
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`authorId` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`image` text,
	CONSTRAINT `fk_posts_authorId_users_id_fk` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`)
);
