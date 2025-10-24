-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 21 oct. 2025 à 21:23
-- Version du serveur : 12.0.2-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `condidat_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add User', 6, 'add_user'),
(22, 'Can change User', 6, 'change_user'),
(23, 'Can delete User', 6, 'delete_user'),
(24, 'Can view User', 6, 'view_user'),
(25, 'Can add social link', 7, 'add_sociallink'),
(26, 'Can change social link', 7, 'change_sociallink'),
(27, 'Can delete social link', 7, 'delete_sociallink'),
(28, 'Can view social link', 7, 'view_sociallink'),
(29, 'Can add language', 8, 'add_language'),
(30, 'Can change language', 8, 'change_language'),
(31, 'Can delete language', 8, 'delete_language'),
(32, 'Can view language', 8, 'view_language'),
(33, 'Can add category', 9, 'add_category'),
(34, 'Can change category', 9, 'change_category'),
(35, 'Can delete category', 9, 'delete_category'),
(36, 'Can view category', 9, 'view_category'),
(37, 'Can add formation', 10, 'add_formation'),
(38, 'Can change formation', 10, 'change_formation'),
(39, 'Can delete formation', 10, 'delete_formation'),
(40, 'Can view formation', 10, 'view_formation'),
(41, 'Can add quiz', 11, 'add_quiz'),
(42, 'Can change quiz', 11, 'change_quiz'),
(43, 'Can delete quiz', 11, 'delete_quiz'),
(44, 'Can view quiz', 11, 'view_quiz'),
(45, 'Can add quiz attempt', 12, 'add_quizattempt'),
(46, 'Can change quiz attempt', 12, 'change_quizattempt'),
(47, 'Can delete quiz attempt', 12, 'delete_quizattempt'),
(48, 'Can view quiz attempt', 12, 'view_quizattempt'),
(49, 'Can add course application', 13, 'add_courseapplication'),
(50, 'Can change course application', 13, 'change_courseapplication'),
(51, 'Can delete course application', 13, 'delete_courseapplication'),
(52, 'Can view course application', 13, 'view_courseapplication'),
(53, 'Can add notification', 14, 'add_notification'),
(54, 'Can change notification', 14, 'change_notification'),
(55, 'Can delete notification', 14, 'delete_notification'),
(56, 'Can view notification', 14, 'view_notification'),
(57, 'Can add candidature', 15, 'add_candidature'),
(58, 'Can change candidature', 15, 'change_candidature'),
(59, 'Can delete candidature', 15, 'delete_candidature'),
(60, 'Can view candidature', 15, 'view_candidature'),
(61, 'Can add association', 16, 'add_association'),
(62, 'Can change association', 16, 'change_association'),
(63, 'Can delete association', 16, 'delete_association'),
(64, 'Can view association', 16, 'view_association'),
(65, 'Can add code', 17, 'add_code'),
(66, 'Can change code', 17, 'change_code'),
(67, 'Can delete code', 17, 'delete_code'),
(68, 'Can view code', 17, 'view_code'),
(69, 'Can add nonce', 18, 'add_nonce'),
(70, 'Can change nonce', 18, 'change_nonce'),
(71, 'Can delete nonce', 18, 'delete_nonce'),
(72, 'Can view nonce', 18, 'view_nonce'),
(73, 'Can add user social auth', 19, 'add_usersocialauth'),
(74, 'Can change user social auth', 19, 'change_usersocialauth'),
(75, 'Can delete user social auth', 19, 'delete_usersocialauth'),
(76, 'Can view user social auth', 19, 'view_usersocialauth'),
(77, 'Can add partial', 20, 'add_partial'),
(78, 'Can change partial', 20, 'change_partial'),
(79, 'Can delete partial', 20, 'delete_partial'),
(80, 'Can view partial', 20, 'view_partial');

-- --------------------------------------------------------

--
-- Structure de la table `courses_category`
--

CREATE TABLE `courses_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses_category`
--

INSERT INTO `courses_category` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Python', '', '2025-10-03 10:18:08.830544', '2025-10-03 10:18:08.830577'),
(2, 'Mangment', '', '2025-10-03 10:19:44.366497', '2025-10-03 10:19:44.366563'),
(3, 'IA', '', '2025-10-03 10:20:18.251382', '2025-10-03 10:20:18.251405'),
(4, 'devl web', '', '2025-10-03 13:20:24.788361', '2025-10-03 13:20:24.788394'),
(5, 'mangment', '', '2025-10-10 13:28:10.653527', '2025-10-10 13:28:10.653666');

-- --------------------------------------------------------

--
-- Structure de la table `courses_courseapplication`
--

CREATE TABLE `courses_courseapplication` (
  `id` bigint(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `application_message` longtext DEFAULT NULL,
  `review_notes` longtext DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `candidate_id` bigint(20) NOT NULL,
  `formation_id` bigint(20) NOT NULL,
  `quiz_attempt_id` bigint(20) DEFAULT NULL,
  `reviewed_by_id` bigint(20) DEFAULT NULL,
  `cv` varchar(100) DEFAULT NULL,
  `quiz_score` int(10) UNSIGNED DEFAULT NULL CHECK (`quiz_score` >= 0),
  `cv_resume` longtext DEFAULT NULL,
  `cv_score` int(10) UNSIGNED DEFAULT NULL CHECK (`cv_score` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses_courseapplication`
--

INSERT INTO `courses_courseapplication` (`id`, `status`, `application_message`, `review_notes`, `reviewed_at`, `created_at`, `updated_at`, `candidate_id`, `formation_id`, `quiz_attempt_id`, `reviewed_by_id`, `cv`, `quiz_score`, `cv_resume`, `cv_score`) VALUES
(7, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-10 11:21:51.480231', '2025-10-10 11:20:34.816045', '2025-10-10 11:21:51.483659', 4, 9, NULL, 2, 'applications/cv/810682192-Lesen-Teil-3-TELC-1_2_1.pdf', 100, NULL, NULL),
(8, 'rejected', NULL, 'manque d??experiences', '2025-10-13 20:20:11.594121', '2025-10-10 13:37:07.742917', '2025-10-13 20:20:11.595493', 7, 8, NULL, 2, 'applications/cv/cvahlem.pdf', 75, NULL, NULL),
(9, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-10 13:54:09.431311', '2025-10-10 13:39:56.913825', '2025-10-10 13:54:09.432431', 4, 8, NULL, 2, 'applications/cv/cvahlem_iUrrMSg.pdf', 75, NULL, NULL),
(10, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-18 21:56:35.718903', '2025-10-10 13:40:52.881632', '2025-10-18 21:56:35.719934', 4, 8, NULL, 7, 'applications/cv/cvahlem_L3jp3Ru.pdf', 75, NULL, NULL),
(12, 'rejected', NULL, 'manque des annees d??experiences', '2025-10-12 17:50:27.019181', '2025-10-12 14:05:37.783236', '2025-10-12 17:50:27.019873', 4, 12, NULL, 7, 'applications/cv/810682192-Lesen-Teil-3-TELC-1_2_1_vJ7C7IO.pdf', 100, NULL, NULL),
(13, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-12 23:33:38.913974', '2025-10-12 23:33:07.607474', '2025-10-12 23:33:38.914478', 8, 12, NULL, 7, 'applications/cv/candidat_CV_3.pdf', 100, NULL, NULL),
(15, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-19 09:53:29.217311', '2025-10-13 20:03:15.292781', '2025-10-19 09:53:29.218882', 8, 8, NULL, 7, 'applications/cv/candidat_CV_3_lUc02RX.pdf', 100, NULL, NULL),
(16, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-19 12:04:13.978090', '2025-10-13 20:10:32.492999', '2025-10-19 12:04:13.994345', 2, 13, NULL, 7, 'applications/cv/cvahlem_pEMqPlk.pdf', 100, NULL, NULL),
(17, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-19 09:55:14.327127', '2025-10-13 20:11:27.433944', '2025-10-19 09:55:14.327603', 8, 13, NULL, 7, 'applications/cv/candidat_CV_3_yIGgBxW.pdf', 100, NULL, NULL),
(18, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-19 12:04:16.407960', '2025-10-14 21:18:55.642832', '2025-10-19 12:04:16.408861', 4, 13, NULL, 7, 'applications/cv/cvahlem_EtiNmyY.pdf', 100, NULL, NULL),
(19, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-19 12:06:23.986038', '2025-10-14 21:29:58.000520', '2025-10-19 12:06:23.987067', 4, 14, NULL, 7, 'applications/cv/cvahlem_bKZWA04.pdf', 100, NULL, NULL),
(20, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-19 15:14:19.159373', '2025-10-17 22:31:22.348352', '2025-10-19 15:14:19.165174', 9, 13, NULL, 7, 'applications/cv/cvahlem_OOgzZzD.pdf', 75, NULL, NULL),
(21, 'approved', NULL, 'Application approved. Welcome to the formation!', '2025-10-20 18:56:36.333818', '2025-10-18 11:12:45.343231', '2025-10-20 18:56:36.340369', 9, 12, NULL, 7, 'applications/cv/cvahlem_QcRItFo.pdf', 100, 'Compétences identifiées : Ai. Profil junior ou débutant. Formation : FORMATION.', 2),
(22, 'rejected', NULL, 'Application not suitable for this formation.', '2025-10-19 12:31:35.312213', '2025-10-18 11:17:34.276213', '2025-10-19 12:31:35.312965', 9, 8, NULL, 7, 'applications/cv/cvahlem_oJ9b1dM.pdf', 100, 'Compétences identifiées : Ai. Profil junior ou débutant. Formation : FORMATION.', 0);

-- --------------------------------------------------------

--
-- Structure de la table `courses_formation`
--

CREATE TABLE `courses_formation` (
  `id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `level` varchar(20) NOT NULL,
  `duration` int(10) UNSIGNED NOT NULL CHECK (`duration` >= 0),
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `language` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) NOT NULL,
  `location` varchar(100) NOT NULL,
  `max_participants` int(10) UNSIGNED NOT NULL CHECK (`max_participants` >= 0),
  `current_participants` int(10) UNSIGNED NOT NULL CHECK (`current_participants` >= 0),
  `image` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `instructor_id` bigint(20) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses_formation`
--

INSERT INTO `courses_formation` (`id`, `title`, `description`, `level`, `duration`, `start_date`, `end_date`, `language`, `price`, `discount`, `location`, `max_participants`, `current_participants`, `image`, `created_at`, `updated_at`, `instructor_id`, `category_id`) VALUES
(8, 'Foemation de HTML et CSS', 'La formation HTML & CSS a pour objectif de permettre aux participants d???acqu??rir les comp??tences essentielles pour cr??er, structurer et styliser des pages web.\r\n?? travers des cours th??oriques et des exercices pratiques, les apprenants d??couvriront comment concevoir des sites web modernes, responsive et conformes aux standards du web.', 'intermediate', 60, '2025-11-01', '2025-12-30', 'English', 80.00, 0.00, 'Online', 3, 3, 'formations/OIP_1.webp', '2025-10-10 11:02:37.763311', '2025-10-19 09:53:29.257018', 2, 4),
(9, 'Formation Intelligence Artificielle', 'La formation Introduction ?? l???Intelligence Artificielle (IA) a pour objectif d???initier les participants aux fondamentaux de l???IA, ?? ses domaines d???application et aux technologies cl??s qui la composent.\r\n?? travers des cours th??oriques, des d??monstrations et des exercices pratiques, les apprenants d??couvriront comment les machines peuvent apprendre, raisonner, comprendre le langage humain et r??soudre des probl??mes complexes.', 'intermediate', 45, '2026-02-01', '2026-04-04', 'English', 100.00, 0.00, 'Hybrid', 1, 1, 'formations/Formations-Metiers-IA-1024x683.webp', '2025-10-10 11:16:55.035411', '2025-10-10 11:21:51.523070', 2, 3),
(12, 'formation python', 'formation pythonformation python formation pythonformation pythonformation pythonvvformation pythonformation pythonformation pythonformation python', 'advanced', 50, '2026-03-03', '2026-07-30', 'English', 45.00, 0.00, 'Online', 5, 2, 'formations/OIP_9mIhjfO.webp', '2025-10-12 14:05:04.578101', '2025-10-20 18:56:36.409886', 7, 1),
(13, 'formation dev web2', 'formation dev web2 formation dev web2formation dev web2 formation dev web2 formation dev web2 formation dev web2 formation dev web2 formation dev web2 formation dev web2', 'intermediate', 45, '2026-02-02', '2026-05-30', 'English', 29.00, 0.00, 'On-site', 5, 4, 'formations/OIP_1_38qzufn.webp', '2025-10-13 20:09:05.918459', '2025-10-19 15:14:19.206536', 2, 4),
(14, 'formation python', 'formation python formation python formation python formation python formation python formation python formation python formation python', 'beginner', 60, '2026-01-02', '2026-04-30', 'English', 29.00, 0.00, 'On-site', 7, 1, 'formations/ChatGPT_Image_14_oct._2025_16_58_51.png', '2025-10-14 21:28:48.237449', '2025-10-19 12:06:24.025113', 7, 1);

-- --------------------------------------------------------

--
-- Structure de la table `courses_formation_participants`
--

CREATE TABLE `courses_formation_participants` (
  `id` bigint(20) NOT NULL,
  `formation_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses_formation_participants`
--

INSERT INTO `courses_formation_participants` (`id`, `formation_id`, `user_id`) VALUES
(5, 8, 4),
(8, 8, 8),
(4, 9, 4),
(6, 12, 8),
(14, 12, 9),
(10, 13, 2),
(11, 13, 4),
(9, 13, 8),
(13, 13, 9),
(12, 14, 4);

-- --------------------------------------------------------

--
-- Structure de la table `courses_quiz`
--

CREATE TABLE `courses_quiz` (
  `id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext DEFAULT NULL,
  `passing_score` int(10) UNSIGNED NOT NULL CHECK (`passing_score` >= 0),
  `time_limit` int(10) UNSIGNED DEFAULT NULL CHECK (`time_limit` >= 0),
  `is_active` tinyint(1) NOT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`questions`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses_quiz`
--

INSERT INTO `courses_quiz` (`id`, `title`, `description`, `passing_score`, `time_limit`, `is_active`, `questions`, `created_at`, `updated_at`, `category_id`) VALUES
(1, 'Formation en Mangment', '', 70, 15, 1, '[{\"id\": 1759487210114, \"text\": \"wie heisssen sie\", \"options\": [{\"id\": 1, \"text\": \"ahlem\", \"is_correct\": false}, {\"id\": 2, \"text\": \"amin\", \"is_correct\": true}, {\"id\": 3, \"text\": \"sarra\", \"is_correct\": false}, {\"id\": 4, \"text\": \"mariem\", \"is_correct\": false}]}, {\"id\": 1759487261000, \"text\": \"wo wohnst du\", \"options\": [{\"id\": 1, \"text\": \"ariana\", \"is_correct\": false}, {\"id\": 2, \"text\": \"mahdia\", \"is_correct\": true}, {\"id\": 3, \"text\": \"sousse\", \"is_correct\": false}, {\"id\": 4, \"text\": \"tunis\", \"is_correct\": false}]}]', '2025-10-03 10:28:17.554991', '2025-10-03 10:28:17.555014', 2),
(2, 'devloppement web', 'jhgffgjkj', 70, 15, 1, '[{\"id\": 1759498284842, \"text\": \"9adech omrk\", \"options\": [{\"id\": 1, \"text\": \"22\", \"is_correct\": false}, {\"id\": 2, \"text\": \"25\", \"is_correct\": true}, {\"id\": 3, \"text\": \"17\", \"is_correct\": false}, {\"id\": 4, \"text\": \"28\", \"is_correct\": false}]}, {\"id\": 1759498315308, \"text\": \"win nosken\", \"options\": [{\"id\": 1, \"text\": \"ariana\", \"is_correct\": false}, {\"id\": 2, \"text\": \"kef\", \"is_correct\": false}, {\"id\": 3, \"text\": \"sousse\", \"is_correct\": false}, {\"id\": 4, \"text\": \"seliana\", \"is_correct\": true}]}]', '2025-10-03 13:32:36.623455', '2025-10-03 13:32:36.623527', 4),
(3, 'IA FORMATION', 'Le quiz a pour objectif d?????valuer les connaissances acquises par les apprenants ?? la suite de la formation.\nIl permet de v??rifier la compr??hension des notions th??oriques et pratiques abord??es, tout en renfor??ant la m??morisation des concepts essentiels.', 70, 10, 1, '[{\"id\": 1759510218519, \"text\": \"Quel domaine n\\u2019est pas directement li\\u00e9 \\u00e0 l\\u2019IA ?\", \"options\": [{\"id\": 1, \"text\": \"Le Machine Learning\", \"is_correct\": false}, {\"id\": 2, \"text\": \"Le Deep Learning\", \"is_correct\": false}, {\"id\": 3, \"text\": \"Le Cloud Computing\", \"is_correct\": true}, {\"id\": 4, \"text\": \"Le Traitement du langage naturel\", \"is_correct\": false}]}, {\"id\": 1759510262720, \"text\": \"Le Machine Learning permet \\u00e0 une machine de :\", \"options\": [{\"id\": 1, \"text\": \"Apprendre automatiquement \\u00e0 partir de donn\\u00e9es \", \"is_correct\": true}, {\"id\": 2, \"text\": \"Modifier son mat\\u00e9riel physique\", \"is_correct\": false}, {\"id\": 3, \"text\": \"Copier le comportement d\\u2019un humain sans donn\\u00e9es\", \"is_correct\": false}, {\"id\": 4, \"text\": \"Ex\\u00e9cuter des calculs uniquement\", \"is_correct\": false}]}, {\"id\": 1760094388371, \"text\": \"Quel langage de programmation est le plus utilis\\u00e9 pour d\\u00e9velopper des mod\\u00e8les d\\u2019IA ?\", \"options\": [{\"id\": 1, \"text\": \"JAVA\", \"is_correct\": false}, {\"id\": 2, \"text\": \"PYTHON\", \"is_correct\": true}, {\"id\": 3, \"text\": \"C++\", \"is_correct\": false}, {\"id\": 4, \"text\": \"PHP\", \"is_correct\": false}]}]', '2025-10-03 16:53:06.480105', '2025-10-10 11:09:00.390921', 3),
(4, 'Les Fondamentaux du HTML et CSS', 'ce quiz evalue vos connaissances de base en structuration et mise en forme des pages web avec HTML et CSS', 70, 20, 1, '[{\"id\": 1760093082619, \"text\": \"Quelle balise HTML est utulisee pour insere une image\", \"options\": [{\"id\": 1, \"text\": \"<img>\", \"is_correct\": true}, {\"id\": 2, \"text\": \"<src>\", \"is_correct\": false}, {\"id\": 3, \"text\": \"<image>\", \"is_correct\": false}, {\"id\": 4, \"text\": \"<pic>\", \"is_correct\": false}]}, {\"id\": 1760093186559, \"text\": \"Quelle balise HTML contient les metadonnees d\\u00b4une page\", \"options\": [{\"id\": 1, \"text\": \"<meta>\", \"is_correct\": false}, {\"id\": 2, \"text\": \"<head>\", \"is_correct\": true}, {\"id\": 3, \"text\": \"<body>\", \"is_correct\": false}, {\"id\": 4, \"text\": \"<header>\", \"is_correct\": false}]}, {\"id\": 1760093186741, \"text\": \"Que signifie HTML ?\", \"options\": [{\"id\": 1, \"text\": \"HyperText Markup Language \\u2705\", \"is_correct\": true}, {\"id\": 2, \"text\": \"HighText Machine Language\", \"is_correct\": false}, {\"id\": 3, \"text\": \"HyperTransfer Main Language\", \"is_correct\": false}, {\"id\": 4, \"text\": \"HyperTransfer Main Link\", \"is_correct\": false}]}, {\"id\": 1760093614042, \"text\": \"Quel attribut d\\u00e9finit le lien d\\u2019une image ?\", \"options\": [{\"id\": 1, \"text\": \"alt\", \"is_correct\": false}, {\"id\": 2, \"text\": \"src\", \"is_correct\": true}, {\"id\": 3, \"text\": \"href\", \"is_correct\": false}, {\"id\": 4, \"text\": \"link\", \"is_correct\": false}]}]', '2025-10-10 10:56:16.895248', '2025-10-10 10:56:16.895300', 4),
(5, 'quiz python', '', 70, 20, 1, '[{\"id\": 1760277608029, \"text\": \"print(type(5))\\n\", \"options\": [{\"id\": 1, \"text\": \"<class \'int\'>\", \"is_correct\": true}, {\"id\": 2, \"text\": \"<class \'str\'>\", \"is_correct\": false}, {\"id\": 3, \"text\": \"<class \'float\'>\", \"is_correct\": false}, {\"id\": 4, \"text\": \"<class \'bool\'>\", \"is_correct\": false}]}, {\"id\": 1760277719892, \"text\": \"Quelle m\\u00e9thode permet d\\u2019ajouter un \\u00e9l\\u00e9ment \\u00e0 la fin d\\u2019une liste\\u202f?\", \"options\": [{\"id\": 1, \"text\": \"add()\", \"is_correct\": false}, {\"id\": 2, \"text\": \"insert()\", \"is_correct\": false}, {\"id\": 3, \"text\": \"extend()\", \"is_correct\": false}, {\"id\": 4, \"text\": \"append()\", \"is_correct\": true}]}]', '2025-10-12 14:03:17.022259', '2025-10-12 14:03:17.022290', 1);

-- --------------------------------------------------------

--
-- Structure de la table `courses_quizattempt`
--

CREATE TABLE `courses_quizattempt` (
  `id` bigint(20) NOT NULL,
  `score` int(10) UNSIGNED NOT NULL CHECK (`score` >= 0),
  `total_questions` int(10) UNSIGNED NOT NULL CHECK (`total_questions` >= 0),
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answers`)),
  `is_passed` tinyint(1) NOT NULL,
  `started_at` datetime(6) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `quiz_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses_quizattempt`
--

INSERT INTO `courses_quizattempt` (`id`, `score`, `total_questions`, `answers`, `is_passed`, `started_at`, `completed_at`, `quiz_id`, `user_id`) VALUES
(2, 100, 2, '{\"0\": 2, \"1\": 2}', 1, '2025-10-03 10:47:32.479964', '2025-10-03 10:47:54.209111', 1, 4),
(6, 0, 2, '{\"0\": 4, \"1\": 1}', 0, '2025-10-03 11:07:00.862201', '2025-10-03 11:07:08.072480', 1, 4),
(14, 100, 2, '{\"0\": 2, \"1\": 2}', 1, '2025-10-03 11:12:41.636452', '2025-10-03 11:12:51.878408', 1, 4),
(16, 100, 2, '{\"0\": 2, \"1\": 2}', 1, '2025-10-03 11:44:31.764190', '2025-10-03 11:44:40.346393', 1, 4),
(18, 100, 2, '{\"0\": 2, \"1\": 4}', 1, '2025-10-03 13:42:46.886071', '2025-10-03 13:43:02.695056', 2, 4),
(22, 100, 2, '{\"0\": 2, \"1\": 4}', 1, '2025-10-03 16:41:21.231442', '2025-10-03 16:41:47.363550', 2, 4),
(24, 0, 2, '{}', 0, '2025-10-06 10:16:40.576595', NULL, 3, 7),
(26, 0, 2, '{}', 0, '2025-10-10 10:38:52.449360', NULL, 3, 2),
(28, 100, 3, '{\"0\": 3, \"1\": 1, \"2\": 2}', 1, '2025-10-10 11:20:02.622326', '2025-10-10 11:20:34.690168', 3, 4),
(32, 75, 4, '{\"0\": 1, \"1\": 2, \"2\": 3, \"3\": 2}', 1, '2025-10-10 13:36:13.712879', '2025-10-10 13:37:07.577684', 4, 7),
(34, 75, 4, '{\"0\": 1, \"1\": 2, \"2\": 3, \"3\": 2}', 1, '2025-10-10 13:39:37.995774', '2025-10-10 13:39:56.784632', 4, 4),
(36, 75, 4, '{\"0\": 1, \"1\": 2, \"2\": 3, \"3\": 2}', 1, '2025-10-10 13:40:24.168900', '2025-10-10 13:40:52.802799', 4, 4),
(38, 100, 2, '{\"0\": 2, \"1\": 2}', 1, '2025-10-12 11:30:14.293915', '2025-10-12 11:30:22.187037', 1, 4),
(40, 0, 2, '{}', 0, '2025-10-12 11:32:27.341022', NULL, 1, 4),
(42, 100, 2, '{\"0\": 1, \"1\": 4}', 1, '2025-10-12 14:05:30.514406', '2025-10-12 14:05:37.600864', 5, 4),
(44, 100, 2, '{\"0\": 1, \"1\": 4}', 1, '2025-10-12 23:32:58.126352', '2025-10-12 23:33:07.536332', 5, 8),
(46, 100, 2, '{\"0\": 2, \"1\": 2}', 1, '2025-10-13 19:56:37.399309', '2025-10-13 19:56:45.093313', 1, 8),
(48, 0, 2, '{}', 0, '2025-10-13 20:00:53.125599', NULL, 1, 8),
(50, 100, 4, '{\"0\": 1, \"1\": 2, \"2\": 1, \"3\": 2}', 1, '2025-10-13 20:02:49.218734', '2025-10-13 20:03:15.175907', 4, 8),
(52, 100, 4, '{\"0\": 1, \"1\": 2, \"2\": 1, \"3\": 2}', 1, '2025-10-13 20:10:13.776293', '2025-10-13 20:10:32.389884', 4, 2),
(54, 100, 4, '{\"0\": 1, \"1\": 2, \"2\": 1, \"3\": 2}', 1, '2025-10-13 20:11:13.290341', '2025-10-13 20:11:27.281752', 4, 8),
(56, 100, 4, '{\"0\": 1, \"1\": 2, \"2\": 1, \"3\": 2}', 1, '2025-10-14 21:18:34.483461', '2025-10-14 21:18:55.511091', 4, 4),
(58, 100, 2, '{\"0\": 1, \"1\": 4}', 1, '2025-10-14 21:29:41.214132', '2025-10-14 21:29:57.899067', 5, 4),
(60, 75, 4, '{\"0\": 3, \"1\": 2, \"2\": 1, \"3\": 2}', 1, '2025-10-17 22:31:06.944385', '2025-10-17 22:31:22.285698', 4, 9),
(62, 100, 2, '{\"0\": 1, \"1\": 4}', 1, '2025-10-18 11:12:29.717756', '2025-10-18 11:12:45.194743', 5, 9),
(64, 100, 4, '{\"0\": 1, \"1\": 2, \"2\": 1, \"3\": 2}', 1, '2025-10-18 11:17:11.711601', '2025-10-18 11:17:34.219109', 4, 9);

-- --------------------------------------------------------

--
-- Structure de la table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(15, 'accounts', 'candidature'),
(8, 'accounts', 'language'),
(7, 'accounts', 'sociallink'),
(6, 'accounts', 'user'),
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(9, 'courses', 'category'),
(13, 'courses', 'courseapplication'),
(10, 'courses', 'formation'),
(11, 'courses', 'quiz'),
(12, 'courses', 'quizattempt'),
(14, 'notifications', 'notification'),
(5, 'sessions', 'session'),
(16, 'social_django', 'association'),
(17, 'social_django', 'code'),
(18, 'social_django', 'nonce'),
(20, 'social_django', 'partial'),
(19, 'social_django', 'usersocialauth');

-- --------------------------------------------------------

--
-- Structure de la table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-10-03 10:08:17.932022'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-10-03 10:08:18.041459'),
(3, 'auth', '0001_initial', '2025-10-03 10:08:18.434055'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-10-03 10:08:18.543147'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-10-03 10:08:18.553236'),
(6, 'auth', '0004_alter_user_username_opts', '2025-10-03 10:08:18.565122'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-10-03 10:08:18.576986'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-10-03 10:08:18.584483'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-10-03 10:08:18.600613'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-10-03 10:08:18.620334'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-10-03 10:08:18.644468'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-10-03 10:08:18.666581'),
(13, 'auth', '0011_update_proxy_permissions', '2025-10-03 10:08:18.685089'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-10-03 10:08:18.701963'),
(15, 'accounts', '0001_initial', '2025-10-03 10:08:19.605611'),
(16, 'admin', '0001_initial', '2025-10-03 10:08:19.877652'),
(17, 'admin', '0002_logentry_remove_auto_add', '2025-10-03 10:08:19.892595'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2025-10-03 10:08:19.914218'),
(19, 'courses', '0001_initial', '2025-10-03 10:08:20.156467'),
(20, 'courses', '0002_remove_formation_category_formation_participants', '2025-10-03 10:08:21.012763'),
(21, 'courses', '0003_formation_category', '2025-10-03 10:08:21.238084'),
(22, 'courses', '0004_quiz_quizattempt', '2025-10-03 10:08:21.827667'),
(23, 'courses', '0005_courseapplication', '2025-10-03 10:08:23.424226'),
(24, 'courses', '0006_alter_courseapplication_options_and_more', '2025-10-03 10:08:25.428341'),
(25, 'courses', '0007_courseapplication_quiz_score_and_more', '2025-10-03 10:08:25.764550'),
(26, 'courses', '0008_alter_quizattempt_unique_together', '2025-10-03 10:08:27.645477'),
(27, 'notifications', '0001_initial', '2025-10-03 10:08:27.979676'),
(28, 'notifications', '0002_remove_notification_data_notification_application_and_more', '2025-10-03 10:08:28.792508'),
(29, 'sessions', '0001_initial', '2025-10-03 10:08:29.054344'),
(30, 'accounts', '0002_candidature', '2025-10-12 12:51:45.510475'),
(31, 'accounts', '0003_delete_candidature_alter_sociallink_unique_together_and_more', '2025-10-12 23:14:48.926903'),
(32, 'courses', '0009_courseapplication_cv_resume_and_more', '2025-10-12 23:14:49.012551'),
(33, 'accounts', '0004_alter_sociallink_unique_together_and_more', '2025-10-13 20:00:28.767882'),
(34, 'default', '0001_initial', '2025-10-16 00:08:26.244528'),
(35, 'social_auth', '0001_initial', '2025-10-16 00:08:26.251798'),
(36, 'default', '0002_add_related_name', '2025-10-16 00:08:26.283411'),
(37, 'social_auth', '0002_add_related_name', '2025-10-16 00:08:26.288753'),
(38, 'default', '0003_alter_email_max_length', '2025-10-16 00:08:26.335918'),
(39, 'social_auth', '0003_alter_email_max_length', '2025-10-16 00:08:26.338553'),
(40, 'default', '0004_auto_20160423_0400', '2025-10-16 00:08:26.363799'),
(41, 'social_auth', '0004_auto_20160423_0400', '2025-10-16 00:08:26.366750'),
(42, 'social_auth', '0005_auto_20160727_2333', '2025-10-16 00:08:26.428947'),
(43, 'social_django', '0006_partial', '2025-10-16 00:08:26.499124'),
(44, 'social_django', '0007_code_timestamp', '2025-10-16 00:08:26.621128'),
(45, 'social_django', '0008_partial_timestamp', '2025-10-16 00:08:26.715421'),
(46, 'social_django', '0009_auto_20191118_0520', '2025-10-16 00:08:26.950253'),
(47, 'social_django', '0010_uid_db_index', '2025-10-16 00:08:27.030560'),
(48, 'social_django', '0011_alter_id_fields', '2025-10-16 00:08:27.371046'),
(49, 'social_django', '0012_usersocialauth_extra_data_new', '2025-10-16 00:08:27.555445'),
(50, 'social_django', '0013_migrate_extra_data', '2025-10-16 00:08:27.617496'),
(51, 'social_django', '0014_remove_usersocialauth_extra_data', '2025-10-16 00:08:27.738729'),
(52, 'social_django', '0015_rename_extra_data_new_usersocialauth_extra_data', '2025-10-16 00:08:27.862228'),
(53, 'social_django', '0016_alter_usersocialauth_extra_data', '2025-10-16 00:08:27.896874'),
(54, 'social_django', '0017_usersocialauth_user_social_auth_uid_required', '2025-10-16 00:08:27.985957'),
(55, 'social_django', '0004_auto_20160423_0400', '2025-10-16 00:08:27.993437'),
(56, 'social_django', '0005_auto_20160727_2333', '2025-10-16 00:08:27.995920'),
(57, 'social_django', '0001_initial', '2025-10-16 00:08:27.998430'),
(58, 'social_django', '0003_alter_email_max_length', '2025-10-16 00:08:28.001178'),
(59, 'social_django', '0002_add_related_name', '2025-10-16 00:08:28.003638'),
(60, 'accounts', '0005_remove_user_resume_text_user_cv_resume', '2025-10-17 17:44:35.601006'),
(61, 'courses', '0010_add_indexes_for_performance', '2025-10-20 16:58:50.938092');

-- --------------------------------------------------------

--
-- Structure de la table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications_notification`
--

CREATE TABLE `notifications_notification` (
  `id` bigint(20) NOT NULL,
  `notification_type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `recipient_id` bigint(20) NOT NULL,
  `application_id` bigint(20) DEFAULT NULL,
  `read_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications_notification`
--

INSERT INTO `notifications_notification` (`id`, `notification_type`, `title`, `message`, `is_read`, `created_at`, `recipient_id`, `application_id`, `read_at`) VALUES
(12, 'application_submitted', 'New Application Received', 'candidat has applied for Formation Intelligence Artificielle', 1, '2025-10-10 11:20:36.272270', 2, 7, '2025-10-10 11:20:53.688362'),
(13, 'application_approved', 'Application Approved!', 'Congratulations! Your application for Formation Intelligence Artificielle has been approved.', 1, '2025-10-10 11:21:52.698842', 4, 7, NULL),
(14, 'application_approved', 'Application Approved!', 'Congratulations! Your application for Foemation de HTML et CSS has been approved.', 1, '2025-10-10 13:54:11.273682', 4, 9, NULL),
(17, 'application_submitted', 'New Application Received', 'candidat has applied for formation python', 1, '2025-10-12 14:05:40.139370', 7, 12, '2025-10-12 14:05:52.983179'),
(18, 'application_rejected', 'Application Update', 'Your application for formation python has been reviewed.', 1, '2025-10-12 17:50:30.231831', 4, 12, '2025-10-12 17:50:45.538446'),
(19, 'application_submitted', 'New Application Received', 'candidat3 has applied for formation python', 1, '2025-10-12 23:33:09.371141', 7, 13, '2025-10-12 23:33:30.650413'),
(20, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation python has been approved.', 1, '2025-10-12 23:33:40.636204', 8, 13, '2025-10-13 20:20:29.832700'),
(22, 'application_submitted', 'New Application Received', 'candidat3 has applied for Foemation de HTML et CSS', 1, '2025-10-13 20:03:16.655984', 2, 15, '2025-10-13 20:03:32.377587'),
(23, 'application_submitted', 'New Application Received', 'Admin User 2 has applied for formation dev web2', 0, '2025-10-13 20:10:33.905293', 2, 16, NULL),
(24, 'application_submitted', 'New Application Received', 'candidat3 has applied for formation dev web2', 0, '2025-10-13 20:11:28.696532', 2, 17, NULL),
(25, 'application_rejected', 'Application Update', 'Your application for Foemation de HTML et CSS has been reviewed.', 1, '2025-10-13 20:20:13.065838', 7, 8, '2025-10-14 21:19:23.511605'),
(26, 'application_submitted', 'New Application Received', 'ASMA has applied for formation dev web2', 0, '2025-10-17 22:31:24.106999', 2, 20, NULL),
(27, 'application_submitted', 'New Application Received', 'ASMA has applied for formation python', 1, '2025-10-18 11:12:47.076408', 7, 21, '2025-10-19 11:42:51.401151'),
(28, 'application_submitted', 'New Application Received', 'ASMA has applied for Foemation de HTML et CSS', 0, '2025-10-18 11:17:35.673728', 2, 22, NULL),
(29, 'application_approved', 'Application Approved!', 'Congratulations! Your application for Foemation de HTML et CSS has been approved.', 0, '2025-10-18 21:56:37.203158', 4, 10, NULL),
(30, 'application_approved', 'Application Approved!', 'Congratulations! Your application for Foemation de HTML et CSS has been approved.', 0, '2025-10-19 09:53:31.088327', 8, 15, NULL),
(31, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation dev web2 has been approved.', 0, '2025-10-19 09:55:15.484847', 8, 17, NULL),
(32, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation dev web2 has been approved.', 0, '2025-10-19 12:04:15.852589', 2, 16, NULL),
(33, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation dev web2 has been approved.', 0, '2025-10-19 12:04:17.616186', 4, 18, NULL),
(34, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation python has been approved.', 0, '2025-10-19 12:06:25.245260', 4, 19, NULL),
(35, 'application_rejected', 'Application Update', 'Your application for Foemation de HTML et CSS has been reviewed.', 0, '2025-10-19 12:31:36.747507', 9, 22, NULL),
(36, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation dev web2 has been approved.', 0, '2025-10-19 15:14:20.557037', 9, 20, NULL),
(37, 'application_approved', 'Application Approved!', 'Congratulations! Your application for formation python has been approved.', 0, '2025-10-20 18:56:38.646828', 9, 21, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `social_auth_association`
--

CREATE TABLE `social_auth_association` (
  `id` bigint(20) NOT NULL,
  `server_url` varchar(255) NOT NULL,
  `handle` varchar(255) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `issued` int(11) NOT NULL,
  `lifetime` int(11) NOT NULL,
  `assoc_type` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `social_auth_code`
--

CREATE TABLE `social_auth_code` (
  `id` bigint(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `code` varchar(32) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `timestamp` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `social_auth_nonce`
--

CREATE TABLE `social_auth_nonce` (
  `id` bigint(20) NOT NULL,
  `server_url` varchar(255) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `salt` varchar(65) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `social_auth_partial`
--

CREATE TABLE `social_auth_partial` (
  `id` bigint(20) NOT NULL,
  `token` varchar(32) NOT NULL,
  `next_step` smallint(5) UNSIGNED NOT NULL CHECK (`next_step` >= 0),
  `backend` varchar(32) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `social_auth_usersocialauth`
--

CREATE TABLE `social_auth_usersocialauth` (
  `id` bigint(20) NOT NULL,
  `provider` varchar(32) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created` datetime(6) NOT NULL,
  `modified` datetime(6) NOT NULL,
  `extra_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`extra_data`))
) ;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `role` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone_number` varchar(17) NOT NULL,
  `photo_profile` varchar(100) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` varchar(1) NOT NULL,
  `address` longtext NOT NULL,
  `skills` longtext NOT NULL,
  `annees_experience` int(10) UNSIGNED DEFAULT NULL CHECK (`annees_experience` >= 0),
  `bio` longtext NOT NULL,
  `website` varchar(200) NOT NULL,
  `portfolio_url` varchar(200) NOT NULL,
  `linkedin_url` varchar(200) NOT NULL,
  `github_url` varchar(200) NOT NULL,
  `cv` varchar(100) DEFAULT NULL,
  `projects` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `cv_score` int(11) DEFAULT NULL,
  `cv_resume` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `is_staff`, `is_active`, `date_joined`, `role`, `email`, `fullname`, `phone_number`, `photo_profile`, `birthdate`, `gender`, `address`, `skills`, `annees_experience`, `bio`, `website`, `portfolio_url`, `linkedin_url`, `github_url`, `cv`, `projects`, `created_at`, `updated_at`, `cv_score`, `cv_resume`) VALUES
(2, 'pbkdf2_sha256$1000000$qVyPmmFVkyfR7qyEO3oc49$bQHT1K51vPOe0ykJhsyREoG7MqORQXx3BAT/26vP84Y=', NULL, 1, 'admin2', '', '', 1, 1, '2025-09-19 22:52:22.824121', 'Admin', 'admin2@example.com', 'Admin User 2', '+999999999', '', '2025-09-16', 'F', 'ksouressef mahdia', '', NULL, '', '', '', '', '', '', '', '2025-09-19 22:52:23.745918', '2025-09-25 12:03:20.880357', 0, ''),
(4, 'pbkdf2_sha256$1000000$jBeSyid3f9gLNWPutyxiPW$/eT4+CNWeO8iDhi1WUM0ky38H2gztw0dYtDstmz/18I=', NULL, 0, 'candidat', '', '', 1, 1, '2025-10-03 10:46:40.131207', 'Candidat', 'candidat1@yopmail.com', 'candidat', '+21612345678', '', '1998-10-06', 'M', 'ARIANA TUNISIE', 'React', 5, '5 ans de experience', '', '', '', '', '', '', '2025-10-03 10:46:41.263637', '2025-10-17 19:09:24.490617', 0, ''),
(5, 'pbkdf2_sha256$1000000$LRk34t0KK2hmlUpoQcZRrQ$DEFA2D0XJZGcdG5BMaOGmYNEYkVUyM5CcBpPS6DrqNY=', NULL, 1, 'admin', '', '', 1, 1, '2025-10-03 11:24:42.932697', 'Admin', 'testadmin@gmail.com', 'admin1', '', '', NULL, '', '', '', NULL, '', '', '', '', '', '', '', '2025-10-03 11:24:43.871221', '2025-10-03 11:24:43.871243', 0, ''),
(7, 'pbkdf2_sha256$1000000$nYkVlBej6X4NAmZKpyZ3d3$b5pfQ3PIjCJPTwaCThCpsbNS5UVUUAKiTwAFlLJM/vk=', NULL, 0, 'ahlem', '', '', 1, 1, '2025-10-05 20:49:48.337438', 'Recruteur', 'gantassiahlem@gmail.com', 'recruteur', '+21622103061', '', NULL, '', '', '', NULL, 'best company ever', 'https://company.com', '', 'https://linkedIn.con/in', '', '', '', '2025-10-05 20:49:49.299147', '2025-10-17 19:10:50.145876', 0, ''),
(8, 'pbkdf2_sha256$1000000$BCnslM6A7BniUf6TuY8ycp$6BihJOCo/JgK7VrJ4oo+XY6OS3VSlblzHaL+fl55F+I=', NULL, 0, 'cond', '', '', 1, 1, '2025-10-12 23:30:49.902613', 'Candidat', 'candidat3@yopmail.com', 'candidat3', '+21622159357', '', NULL, '', '', 'python', 5, 'gdhdzed', '', '', '', '', '', '', '2025-10-12 23:30:50.762159', '2025-10-17 19:10:50.157925', NULL, ''),
(9, 'pbkdf2_sha256$1000000$HIMdmPp7QrgiIZqMHcZ0KF$bOBjyYeyPgaP4/jRhGEVrAM/bwvjoxDLClpQklpy8xw=', NULL, 0, 'GANTASSI', '', '', 1, 1, '2025-10-17 17:47:58.813741', 'Candidat', 'asma@yopmail.com', 'ASMA', '+21622123456', '', NULL, '', '', 'React,Python,pringboot', 8, 'bio bio', '', '', '', '', '', '', '2025-10-17 17:47:59.997793', '2025-10-17 19:10:50.163544', NULL, ''),
(10, 'pbkdf2_sha256$1000000$6cT4vPjvqVGCpmey4uyhri$I6l5Jo3w+Qb+pBaItavrQD9zl+XVcAS44nR41zbNimY=', NULL, 0, 'RUTEUR', '', '', 1, 1, '2025-10-17 17:51:50.548610', 'Recruteur', 'ahlem@yopmail.com', 'REC', '+21622103061', '', NULL, '', '', '', NULL, 'best company ever', 'https://company.com', '', 'https://linkedIn.con/in', '', '', '', '2025-10-17 17:51:51.960474', '2025-10-17 19:10:50.169506', NULL, '');

-- --------------------------------------------------------

--
-- Structure de la table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users_user_permissions`
--

CREATE TABLE `users_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_languages`
--

CREATE TABLE `user_languages` (
  `id` bigint(20) NOT NULL,
  `language` varchar(100) NOT NULL,
  `proficiency` varchar(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_social_links`
--

CREATE TABLE `user_social_links` (
  `id` bigint(20) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(200) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Index pour la table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Index pour la table `courses_category`
--
ALTER TABLE `courses_category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `courses_courseapplication`
--
ALTER TABLE `courses_courseapplication`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_courseapplic_formation_id_a8e93a2a_fk_courses_f` (`formation_id`),
  ADD KEY `courses_courseapplic_quiz_attempt_id_387bf5b1_fk_courses_q` (`quiz_attempt_id`),
  ADD KEY `courses_courseapplication_reviewed_by_id_aa42c970_fk_users_id` (`reviewed_by_id`),
  ADD KEY `courses_courseapplication_candidate_id_c1794bb0` (`candidate_id`),
  ADD KEY `app_form_status_idx` (`formation_id`,`status`),
  ADD KEY `app_candidate_idx` (`candidate_id`),
  ADD KEY `app_created_idx` (`created_at` DESC);

--
-- Index pour la table `courses_formation`
--
ALTER TABLE `courses_formation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_formation_instructor_id_f085bc62_fk_users_id` (`instructor_id`),
  ADD KEY `courses_formation_category_id_8d43df1b_fk_courses_category_id` (`category_id`);

--
-- Index pour la table `courses_formation_participants`
--
ALTER TABLE `courses_formation_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `courses_formation_partic_formation_id_user_id_3fe99e53_uniq` (`formation_id`,`user_id`),
  ADD KEY `courses_formation_participants_user_id_9969529f_fk_users_id` (`user_id`);

--
-- Index pour la table `courses_quiz`
--
ALTER TABLE `courses_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_quiz_category_id_dd01261f_fk_courses_category_id` (`category_id`);

--
-- Index pour la table `courses_quizattempt`
--
ALTER TABLE `courses_quizattempt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_quizattempt_user_id_c8575b36_fk_users_id` (`user_id`),
  ADD KEY `courses_quizattempt_quiz_id_b289d1d8` (`quiz_id`);

--
-- Index pour la table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`);

--
-- Index pour la table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Index pour la table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Index pour la table `notifications_notification`
--
ALTER TABLE `notifications_notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifi_application_id_245149e6_fk_courses_c` (`application_id`),
  ADD KEY `notificatio_recipie_a972ce_idx` (`recipient_id`,`created_at`),
  ADD KEY `notificatio_recipie_4e3567_idx` (`recipient_id`,`is_read`);

--
-- Index pour la table `social_auth_association`
--
ALTER TABLE `social_auth_association`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `social_auth_association_server_url_handle_078befa2_uniq` (`server_url`,`handle`);

--
-- Index pour la table `social_auth_code`
--
ALTER TABLE `social_auth_code`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `social_auth_code_email_code_801b2d02_uniq` (`email`,`code`),
  ADD KEY `social_auth_code_code_a2393167` (`code`),
  ADD KEY `social_auth_code_timestamp_176b341f` (`timestamp`);

--
-- Index pour la table `social_auth_nonce`
--
ALTER TABLE `social_auth_nonce`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `social_auth_nonce_server_url_timestamp_salt_f6284463_uniq` (`server_url`,`timestamp`,`salt`);

--
-- Index pour la table `social_auth_partial`
--
ALTER TABLE `social_auth_partial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `social_auth_partial_token_3017fea3` (`token`),
  ADD KEY `social_auth_partial_timestamp_50f2119f` (`timestamp`);

--
-- Index pour la table `social_auth_usersocialauth`
--
ALTER TABLE `social_auth_usersocialauth`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `social_auth_usersocialauth_provider_uid_e6b5e668_uniq` (`provider`,`uid`),
  ADD KEY `social_auth_usersocialauth_user_id_17d28448_fk_users_id` (`user_id`),
  ADD KEY `social_auth_usersocialauth_uid_796e51dc` (`uid`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_groups_user_id_group_id_fc7788e8_uniq` (`user_id`,`group_id`),
  ADD KEY `users_groups_group_id_2f3517aa_fk_auth_group_id` (`group_id`);

--
-- Index pour la table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_user_permissions_user_id_permission_id_3b86cbdf_uniq` (`user_id`,`permission_id`),
  ADD KEY `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` (`permission_id`);

--
-- Index pour la table `user_languages`
--
ALTER TABLE `user_languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_languages_user_id_language_85449b6a_uniq` (`user_id`,`language`);

--
-- Index pour la table `user_social_links`
--
ALTER TABLE `user_social_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `candidatures_user_id_platform_45cf7e8a_uniq` (`user_id`,`platform`),
  ADD KEY `user_social_links_user_id_17c06499` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT pour la table `courses_category`
--
ALTER TABLE `courses_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `courses_courseapplication`
--
ALTER TABLE `courses_courseapplication`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `courses_formation`
--
ALTER TABLE `courses_formation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `courses_formation_participants`
--
ALTER TABLE `courses_formation_participants`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `courses_quiz`
--
ALTER TABLE `courses_quiz`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `courses_quizattempt`
--
ALTER TABLE `courses_quizattempt`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT pour la table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT pour la table `notifications_notification`
--
ALTER TABLE `notifications_notification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT pour la table `social_auth_association`
--
ALTER TABLE `social_auth_association`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `social_auth_code`
--
ALTER TABLE `social_auth_code`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `social_auth_nonce`
--
ALTER TABLE `social_auth_nonce`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `social_auth_partial`
--
ALTER TABLE `social_auth_partial`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `social_auth_usersocialauth`
--
ALTER TABLE `social_auth_usersocialauth`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_languages`
--
ALTER TABLE `user_languages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_social_links`
--
ALTER TABLE `user_social_links`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Contraintes pour la table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Contraintes pour la table `courses_courseapplication`
--
ALTER TABLE `courses_courseapplication`
  ADD CONSTRAINT `courses_courseapplic_formation_id_a8e93a2a_fk_courses_f` FOREIGN KEY (`formation_id`) REFERENCES `courses_formation` (`id`),
  ADD CONSTRAINT `courses_courseapplic_quiz_attempt_id_387bf5b1_fk_courses_q` FOREIGN KEY (`quiz_attempt_id`) REFERENCES `courses_quizattempt` (`id`),
  ADD CONSTRAINT `courses_courseapplication_candidate_id_c1794bb0_fk_users_id` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `courses_courseapplication_reviewed_by_id_aa42c970_fk_users_id` FOREIGN KEY (`reviewed_by_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `courses_formation`
--
ALTER TABLE `courses_formation`
  ADD CONSTRAINT `courses_formation_category_id_8d43df1b_fk_courses_category_id` FOREIGN KEY (`category_id`) REFERENCES `courses_category` (`id`),
  ADD CONSTRAINT `courses_formation_instructor_id_f085bc62_fk_users_id` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `courses_formation_participants`
--
ALTER TABLE `courses_formation_participants`
  ADD CONSTRAINT `courses_formation_pa_formation_id_0eb1d417_fk_courses_f` FOREIGN KEY (`formation_id`) REFERENCES `courses_formation` (`id`),
  ADD CONSTRAINT `courses_formation_participants_user_id_9969529f_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `courses_quiz`
--
ALTER TABLE `courses_quiz`
  ADD CONSTRAINT `courses_quiz_category_id_dd01261f_fk_courses_category_id` FOREIGN KEY (`category_id`) REFERENCES `courses_category` (`id`);

--
-- Contraintes pour la table `courses_quizattempt`
--
ALTER TABLE `courses_quizattempt`
  ADD CONSTRAINT `courses_quizattempt_quiz_id_b289d1d8_fk_courses_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `courses_quiz` (`id`),
  ADD CONSTRAINT `courses_quizattempt_user_id_c8575b36_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `notifications_notification`
--
ALTER TABLE `notifications_notification`
  ADD CONSTRAINT `notifications_notifi_application_id_245149e6_fk_courses_c` FOREIGN KEY (`application_id`) REFERENCES `courses_courseapplication` (`id`),
  ADD CONSTRAINT `notifications_notification_recipient_id_d055f3f0_fk_users_id` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `social_auth_usersocialauth`
--
ALTER TABLE `social_auth_usersocialauth`
  ADD CONSTRAINT `social_auth_usersocialauth_user_id_17d28448_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `users_groups_group_id_2f3517aa_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `users_groups_user_id_f500bee5_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD CONSTRAINT `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `users_user_permissions_user_id_92473840_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `user_languages`
--
ALTER TABLE `user_languages`
  ADD CONSTRAINT `user_languages_user_id_1fcf7f3b_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `user_social_links`
--
ALTER TABLE `user_social_links`
  ADD CONSTRAINT `user_social_links_user_id_17c06499_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
