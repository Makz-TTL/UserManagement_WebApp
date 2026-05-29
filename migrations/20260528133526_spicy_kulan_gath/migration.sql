CREATE TABLE `likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`userId` integer NOT NULL,
	`postId` integer NOT NULL,
	`like` integer NOT NULL
);
