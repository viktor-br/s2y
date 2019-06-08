CREATE DATABASE `send2yourself` CHARSET 'utf8';

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `uuid` int(11) NOT NULL AUTO_INCREMENT,
  `auth_provider` enum('google') NOT NULL,
  `external_id` char(1) NOT NULL,
  `name` char(1) NOT NULL,
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

