CREATE DATABASE IF NOT EXISTS `send2yourself` CHARSET 'utf8';

USE `send2yourself`;

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` varchar(255) NOT NULL,
  `auth_provider` enum('google') NOT NULL,
  `external_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `picture` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_auth_provider_external_id_uindex` (`auth_provider`,`external_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_id_uindex` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

