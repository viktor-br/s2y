CREATE DATABASE IF NOT EXISTS `send2yourself` CHARSET 'utf8';

USE `send2yourself`;

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `uuid` varchar(64) NOT NULL,
  `auth_provider` enum('google') NOT NULL,
  `external_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `picture` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `account_auth_provider_external_id_uindex` (`auth_provider`,`external_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `uuid` varchar(255) NOT NULL,
  `user_uuid` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `message_uuid_uindex` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

