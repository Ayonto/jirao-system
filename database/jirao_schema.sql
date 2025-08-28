-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2025 at 06:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jirao_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `user_id` int(11) NOT NULL,
  `space_id` int(11) NOT NULL,
  `hours_requested` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `host_response_date` timestamp NULL DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interests`
--

INSERT INTO `interests` (`user_id`, `space_id`, `hours_requested`, `status`, `host_response_date`, `timestamp`, `id`) VALUES
(6, 83, 3, 'pending', NULL, '2025-08-11 16:05:40', 2),
(6, 84, 3, 'pending', NULL, '2025-08-25 11:34:21', 3),
(6, 89, 5, 'pending', NULL, '2025-08-11 14:31:41', 4),
(6, 92, 1, 'pending', NULL, '2025-08-25 11:34:55', 5),
(6, 95, 1, 'pending', NULL, '2025-08-25 11:42:27', 8),
(6, 117, 2, 'pending', NULL, '2025-08-25 11:53:15', 13),
(6, 119, 3, 'accepted', '2025-08-25 11:55:13', '2025-08-25 11:53:20', 14),
(6, 120, 3, 'accepted', '2025-08-15 18:54:30', '2025-08-15 18:54:14', 6),
(76, 83, 2, 'pending', NULL, '2025-08-25 11:44:14', 9),
(76, 104, 2, 'pending', NULL, '2025-08-25 11:45:16', 11),
(76, 117, 2, 'accepted', '2025-08-11 11:14:12', '2025-08-11 11:13:56', 7),
(76, 119, 1, 'rejected', '2025-08-25 11:55:11', '2025-08-25 11:45:23', 12),
(76, 120, 1, 'pending', NULL, '2025-08-25 11:44:58', 10);

-- --------------------------------------------------------

--
-- Table structure for table `pending_hosts`
--

CREATE TABLE `pending_hosts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_applied` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `nid` varchar(25) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_hosts`
--

INSERT INTO `pending_hosts` (`id`, `username`, `email`, `password`, `date_applied`, `phone`, `nid`, `admin_id`) VALUES
(3, 'amir', 'amir@gmail.com', '1234', '2025-08-25 11:35:56', '0987654321', '1234567890', 5);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `reporter_id` int(11) NOT NULL,
  `reported_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`reporter_id`, `reported_id`, `reason`, `timestamp`) VALUES
(3, 2, 'This is a test report', '2025-08-09 14:08:45'),
(78, 76, 'reporting shakibul', '2025-08-11 11:14:33'),
(78, 6, 'test report', '2025-08-15 18:54:41');

-- --------------------------------------------------------

--
-- Table structure for table `spaces`
--

CREATE TABLE `spaces` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `type` enum('room','parking') NOT NULL,
  `title` varchar(200) NOT NULL,
  `location` varchar(200) NOT NULL,
  `rate_per_hour` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `availability` enum('available','on_hold','not_available') DEFAULT 'available',
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spaces`
--

INSERT INTO `spaces` (`id`, `owner_id`, `type`, `title`, `location`, `rate_per_hour`, `description`, `availability`, `dimensions`, `created_at`, `updated_at`, `latitude`, `longitude`) VALUES
(83, 56, 'room', 'Modern Studio in Dhanmondi', 'Dhanmondi, Dhaka', 250.00, 'Fully furnished modern studio apartment in the heart of Dhanmondi. Features AC, WiFi, kitchen access, and 24/7 security. Perfect for business travelers and students. Close to Dhanmondi Lake and shopping centers.', 'available', NULL, '2024-01-15 04:30:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(84, 57, 'room', 'Cozy Room in Gulshan', 'Gulshan-2, Dhaka', 350.00, 'Comfortable room in upscale Gulshan area. Premium location with easy access to diplomatic zone, restaurants, and shopping malls. Includes breakfast, WiFi, and parking space.', 'available', NULL, '2024-01-20 08:15:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(85, 58, 'room', 'Budget Room in Old Dhaka', 'Lalbagh, Old Dhaka', 150.00, 'Affordable accommodation in historic Old Dhaka. Walking distance to Lalbagh Fort, Ahsan Manzil, and traditional markets. Basic amenities with authentic Dhaka experience.', 'on_hold', NULL, '2024-01-25 03:45:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(86, 59, 'room', 'Executive Suite in Banani', 'Banani, Dhaka', 450.00, 'Luxury executive suite in prime Banani location. High-end furnishing, city view, gym access, and concierge service. Ideal for corporate executives and VIP guests.', 'available', NULL, '2024-02-01 05:20:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(87, 60, 'room', 'Student Room in Shahbag', 'Shahbag, Dhaka', 180.00, 'Perfect for students and researchers. Near Dhaka University, medical college, and National Museum. Quiet study environment with high-speed internet and library access.', 'available', NULL, '2024-02-05 10:30:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(88, 61, 'room', 'Family Room in Uttara', 'Uttara Sector-7, Dhaka', 300.00, 'Spacious family room in planned Uttara area. Close to Hazrat Shahjalal International Airport. Family-friendly amenities, playground nearby, and safe neighborhood.', 'not_available', NULL, '2024-02-10 02:15:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(89, 62, 'room', 'Business Room in Motijheel', 'Motijheel, Dhaka', 280.00, 'Strategic location in commercial Motijheel area. Walking distance to banks, offices, and business centers. Professional atmosphere with meeting room access.', 'available', NULL, '2024-02-15 07:45:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(90, 63, 'room', 'Artistic Loft in Wari', 'Wari, Dhaka', 220.00, 'Creative space in historic Wari area. High ceilings, natural light, and artistic ambiance. Perfect for artists, photographers, and creative professionals.', 'available', NULL, '2024-02-20 04:25:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(91, 56, 'parking', 'Secure Parking in Dhanmondi', 'Dhanmondi-27, Dhaka', 80.00, 'Safe and secure covered parking in busy Dhanmondi area. 24/7 CCTV surveillance, security guard, and easy access to main roads. Perfect for shopping and business visits.', 'available', '{\"length\": 20, \"width\": 10, \"height\": 8}', '2024-01-16 03:15:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(92, 57, 'parking', 'Premium Parking Gulshan', 'Gulshan Avenue, Dhaka', 120.00, 'Premium underground parking in upscale Gulshan. Climate controlled, valet service available, and direct mall access. Ideal for luxury car owners.', 'available', '{\"length\": 22, \"width\": 11, \"height\": 9}', '2024-01-21 07:30:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(93, 58, 'parking', 'Budget Parking Old Dhaka', 'Sadarghat, Dhaka', 50.00, 'Affordable street-level parking near Buriganga River. Basic security, good for short visits to Old Dhaka attractions and river port area.', 'on_hold', '{\"length\": 18, \"width\": 9, \"height\": 7}', '2024-01-26 04:45:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(94, 59, 'parking', 'Business District Parking', 'Motijheel C/A, Dhaka', 100.00, 'Strategic parking in commercial heart of Dhaka. Walking distance to banks, offices, and government buildings. Professional parking with business facilities.', 'available', '{\"length\": 21, \"width\": 10, \"height\": 8}', '2024-02-02 08:20:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(95, 60, 'parking', 'Airport Parking Uttara', 'Uttara Sector-15, Dhaka', 60.00, 'Convenient parking near Hazrat Shahjalal International Airport. Shuttle service to terminal, long-term parking rates available, and 24/7 operation.', 'available', '{\"length\": 19, \"width\": 9, \"height\": 8}', '2024-02-06 05:35:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(96, 61, 'parking', 'University Area Parking', 'TSC, Dhaka University', 40.00, 'Student-friendly parking near Dhaka University campus. Affordable rates, bicycle parking also available, and safe environment for students.', 'not_available', '{\"length\": 18, \"width\": 8, \"height\": 7}', '2024-02-11 10:50:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(97, 62, 'parking', 'Shopping Mall Parking', 'Bashundhara City, Dhaka', 90.00, 'Multi-level parking at largest shopping mall. Direct mall access, food court nearby, and family-friendly facilities. Perfect for shopping trips.', 'available', '{\"length\": 20, \"width\": 10, \"height\": 8}', '2024-02-16 02:25:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(98, 63, 'parking', 'Hospital Area Parking', 'Dhaka Medical College', 70.00, 'Convenient parking for hospital visitors. Close to major hospitals, pharmacy nearby, and patient-friendly services. Compassionate pricing for long stays.', 'available', '{\"length\": 19, \"width\": 9, \"height\": 8}', '2024-02-21 06:40:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(99, 64, 'parking', 'Port City Parking', 'Chittagong Port Area', 85.00, 'Strategic parking near Chittagong Port. Business district access, customs office nearby, and commercial vehicle friendly. Essential for port-related business.', 'available', '{\"length\": 23, \"width\": 12, \"height\": 9}', '2024-02-26 09:15:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(100, 65, 'parking', 'Beach Area Parking', 'Patenga Beach, Chittagong', 60.00, 'Beachside parking with sea view. Perfect for beach visits, seafood restaurants nearby, and sunset viewing. Popular during weekends and holidays.', 'available', '{\"length\": 20, \"width\": 10, \"height\": 8}', '2024-03-02 03:30:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(101, 66, 'parking', 'Hill Station Parking', 'Foy\'s Lake, Chittagong', 55.00, 'Scenic parking at popular hill station. Amusement park access, lake view, and family recreation facilities. Great for weekend family outings.', 'on_hold', '{\"length\": 19, \"width\": 9, \"height\": 8}', '2024-03-06 07:45:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(102, 67, 'parking', 'Tea Garden Parking', 'Srimangal Tea Estate', 45.00, 'Unique parking surrounded by tea gardens. Nature tour access, tea factory visits, and eco-tourism facilities. Perfect for nature photography.', 'available', '{\"length\": 18, \"width\": 9, \"height\": 7}', '2024-03-11 04:20:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(103, 68, 'parking', 'Shrine Area Parking', 'Shah Jalal Mazar, Sylhet', 35.00, 'Respectful parking near holy shrine. Pilgrimage facilities, religious bookstore nearby, and peaceful environment. Special rates for devotees.', 'available', '{\"length\": 17, \"width\": 8, \"height\": 7}', '2024-03-16 08:55:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(104, 69, 'parking', 'Silk City Parking', 'Rajshahi Silk Factory', 50.00, 'Cultural parking near silk production area. Handicraft shopping, traditional weaving demonstrations, and cultural center access. Educational tourism friendly.', 'available', '{\"length\": 19, \"width\": 9, \"height\": 8}', '2024-03-21 05:10:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(105, 70, 'parking', 'Mango Market Parking', 'Chapai Nawabganj Market', 40.00, 'Seasonal parking at famous mango market. Fresh fruit shopping, wholesale rates available, and farmer-direct purchases. Busy during mango season.', 'not_available', '{\"length\": 20, \"width\": 10, \"height\": 8}', '2024-03-26 10:25:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(106, 71, 'parking', 'Sundarbans Gateway Parking', 'Khulna Launch Terminal', 65.00, 'Essential parking for Sundarbans visitors. Launch booking facilities, tour operator offices, and wildlife equipment rental. Adventure tourism hub.', 'available', '{\"length\": 21, \"width\": 10, \"height\": 8}', '2024-04-01 02:40:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(107, 72, 'parking', 'Shrimp Processing Parking', 'Bagerhat Industrial Area', 55.00, 'Industrial area parking for business visitors. Seafood processing plants, export facilities, and business meeting venues. Commercial vehicle friendly.', 'available', '{\"length\": 22, \"width\": 11, \"height\": 9}', '2024-04-06 07:15:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(108, 73, 'parking', 'River Port Parking', 'Barisal Launch Ghat', 45.00, 'Waterfront parking at river port. Launch terminal access, river cruise booking, and floating market visits. Traditional river transport hub.', 'available', '{\"length\": 19, \"width\": 9, \"height\": 8}', '2024-04-11 04:30:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(109, 74, 'parking', 'Floating Market Parking', 'Pirojpur Floating Market', 40.00, 'Unique parking for floating market experience. Early morning vegetable market, boat rides, and traditional river commerce. Cultural experience included.', 'on_hold', '{\"length\": 18, \"width\": 9, \"height\": 7}', '2024-04-16 09:45:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(110, 75, 'parking', 'Agricultural Fair Parking', 'Rangpur Krishi Mela Ground', 35.00, 'Seasonal parking during agricultural fairs. Farming equipment displays, organic produce sales, and rural technology exhibitions. Educational and commercial.', 'available', '{\"length\": 20, \"width\": 10, \"height\": 8}', '2024-04-21 06:20:00', '2025-08-14 11:35:36', 23.8103, 90.4125),
(117, 78, 'parking', 'Parking for brac student', 'Badda, brac er pashe ', 100.00, 'this is a test, update 3', 'available', '{\"length\": 100, \"width\": 9, \"height\": 10}', '2025-08-11 11:12:41', '2025-08-14 11:35:36', 23.8103, 90.4125),
(119, 78, 'parking', 'Brac er pashe parking', 'Badda', 150.00, 'Test 2', 'available', '{\"length\": 20, \"width\": 30, \"height\": 40}', '2025-08-14 11:37:28', '2025-08-14 11:38:01', 23.772969950470607, 90.42537420988084),
(120, 78, 'room', 'Brac er pashe room', 'Badda', 100.00, 'test', 'available', NULL, '2025-08-15 18:53:26', '2025-08-15 18:53:26', 23.77298145651742, 90.42522132396698),
(121, 79, 'room', 'Tongi', 'Tongi', 100.00, 'Test Description ', 'available', NULL, '2025-08-25 11:37:15', '2025-08-25 11:37:50', 23.819284584220302, 90.42214751243593);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('guest','host','admin') NOT NULL,
  `status` enum('active','banned','pending') DEFAULT 'active',
  `date_joined` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `nid` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `status`, `date_joined`, `phone`, `nid`) VALUES
(1, 'admin_user', 'admin@jirao.com', 'admin123', 'admin', 'active', '2025-08-08 10:46:34', NULL, NULL),
(2, 'john_guest', 'john@example.com', 'password123', 'guest', 'active', '2025-08-08 10:46:39', NULL, NULL),
(3, 'sarah_host', 'sarah@example.com', 'password123', 'host', 'active', '2025-08-08 10:46:39', NULL, NULL),
(4, 'mike_host', 'mike@example.com', 'password123', 'host', 'active', '2025-08-08 10:46:39', NULL, NULL),
(5, 'admin_jirao', 'admin@jirao.bd', 'admin123', 'admin', 'active', '2024-01-01 04:00:00', NULL, NULL),
(6, 'ratul', 'ratul@gmail.com', '1234', 'guest', 'active', '2024-01-15 03:30:00', NULL, NULL),
(7, 'fatima', 'fatima@yahoo.com', '1234', 'guest', 'active', '2024-01-20 08:15:00', NULL, NULL),
(8, 'karimbd', 'karim@outlook.com', '1234', 'guest', 'active', '2024-01-25 05:45:00', NULL, NULL),
(9, 'nasirdhaka', 'nasir@gmail.com', '1234', 'guest', 'active', '2024-02-01 10:20:00', NULL, NULL),
(10, 'ruma', 'ruma@hotmail.com', '1234', 'guest', 'active', '2024-02-05 02:10:00', NULL, NULL),
(11, 'hassan', 'hassan@gmail.com', '1234', 'guest', 'active', '2024-02-10 07:30:00', NULL, NULL),
(12, 'salmabd', 'salma@yahoo.com', '1234', 'guest', 'active', '2024-02-15 04:45:00', NULL, NULL),
(13, 'arif', 'arif@outlook.com', '1234', 'guest', 'active', '2024-02-20 09:20:00', NULL, NULL),
(14, 'nadia', 'nadia@gmail.com', '1234', 'guest', 'active', '2024-02-25 06:15:00', NULL, NULL),
(15, 'ibrahimbd', 'ibrahim@hotmail.com', '1234', 'guest', 'active', '2024-03-01 03:40:00', NULL, NULL),
(16, 'rashida', 'rashida@gmail.com', '1234', 'guest', 'active', '2024-03-05 08:25:00', NULL, NULL),
(17, 'omar', 'omar@yahoo.com', '1234', 'guest', 'active', '2024-03-10 05:10:00', NULL, NULL),
(18, 'shahanabd', 'shahana@outlook.com', '1234', 'guest', 'active', '2024-03-15 10:35:00', NULL, NULL),
(19, 'rafiq', 'rafiq@gmail.com', '1234', 'guest', 'active', '2024-03-20 02:50:00', NULL, NULL),
(20, 'amina', 'amina@hotmail.com', '1234', 'guest', 'active', '2024-03-25 07:15:00', NULL, NULL),
(21, 'tariqbd', 'tariq@gmail.com', '1234', 'guest', 'active', '2024-04-01 04:30:00', NULL, NULL),
(22, 'sultana', 'sultana@yahoo.com', '1234', 'guest', 'active', '2024-04-05 09:45:00', NULL, NULL),
(23, 'mamun', 'mamun@outlook.com', '1234', 'guest', 'active', '2024-04-10 06:20:00', NULL, NULL),
(24, 'rehanabd', 'rehana@gmail.com', '1234', 'guest', 'active', '2024-04-15 03:15:00', NULL, NULL),
(25, 'shakil', 'shakil@hotmail.com', '1234', 'guest', 'active', '2024-04-20 08:40:00', NULL, NULL),
(26, 'yasmin', 'yasmin@gmail.com', '1234', 'guest', 'banned', '2024-04-25 05:25:00', NULL, NULL),
(27, 'monirbd', 'monir@yahoo.com', '1234', 'guest', 'active', '2024-05-01 10:10:00', NULL, NULL),
(28, 'rubina', 'rubina@outlook.com', '1234', 'guest', 'active', '2024-05-05 02:35:00', NULL, NULL),
(29, 'zahir', 'zahir@gmail.com', '1234', 'guest', 'active', '2024-05-10 07:50:00', NULL, NULL),
(30, 'sabinabd', 'sabina@hotmail.com', '1234', 'guest', 'active', '2024-05-15 04:15:00', NULL, NULL),
(31, 'hanif', 'hanif@gmail.com', '1234', 'guest', 'active', '2024-05-20 09:30:00', NULL, NULL),
(32, 'nasreen', 'nasreen@yahoo.com', '1234', 'guest', 'active', '2024-05-25 06:45:00', NULL, NULL),
(33, 'rashedbd', 'rashed@outlook.com', '1234', 'guest', 'active', '2024-06-01 03:20:00', NULL, NULL),
(34, 'shireen', 'shireen@gmail.com', '1234', 'guest', 'active', '2024-06-05 08:15:00', NULL, NULL),
(35, 'alamgir', 'alamgir@hotmail.com', '1234', 'guest', 'active', '2024-06-10 05:40:00', NULL, NULL),
(56, 'ahmed', 'ahmed@jiraohost.com', '1234', 'host', 'active', '2024-01-10 04:00:00', NULL, NULL),
(57, 'rashidproperty', 'rashid@properties.bd', '1234', 'host', 'active', '2024-01-12 05:30:00', NULL, NULL),
(58, 'sultan', 'sultan@rentals.com', '1234', 'host', 'active', '2024-01-18 08:20:00', NULL, NULL),
(59, 'kamalrentals', 'kamal@dhakahomes.bd', '1234', 'host', 'active', '2024-01-22 03:45:00', NULL, NULL),
(60, 'farida', 'farida@chittagongspaces.com', '1234', 'host', 'active', '2024-01-28 10:15:00', NULL, NULL),
(61, 'nazrulproperty', 'nazrul@sylhetrentals.bd', '1234', 'host', 'active', '2024-02-03 06:30:00', NULL, NULL),
(62, 'rahima', 'rahima@barisalrooms.com', '1234', 'host', 'active', '2024-02-08 02:20:00', NULL, NULL),
(63, 'shafiqrentals', 'shafiq@rangpurspaces.bd', '1234', 'host', 'active', '2024-02-14 09:40:00', NULL, NULL),
(64, 'nasir', 'nasir@khulnahomes.com', '1234', 'host', 'active', '2024-02-19 05:15:00', NULL, NULL),
(65, 'salinaproperty', 'salina@rajshahirentals.bd', '1234', 'host', 'active', '2024-02-24 07:50:00', NULL, NULL),
(66, 'habib', 'habib@mymensinghspaces.com', '1234', 'host', 'active', '2024-03-02 04:25:00', NULL, NULL),
(67, 'rashidarentals', 'rashida@comillarooms.bd', '1234', 'host', 'active', '2024-03-07 08:35:00', NULL, NULL),
(68, 'ibrahim', 'ibrahim@jessoreproperties.com', '1234', 'host', 'active', '2024-03-12 03:10:00', NULL, NULL),
(69, 'fatemaproperty', 'fatema@bograhomes.bd', '1234', 'host', 'active', '2024-03-17 10:45:00', NULL, NULL),
(70, 'mizanur', 'mizanur@pabnarentals.com', '1234', 'host', 'active', '2024-03-22 06:20:00', NULL, NULL),
(71, 'shahidarentals', 'shahida@natorespaces.bd', '1234', 'host', 'active', '2024-03-27 02:55:00', NULL, NULL),
(72, 'rafiqul', 'rafiqul@tangailrooms.com', '1234', 'host', 'banned', '2024-04-03 09:30:00', NULL, NULL),
(73, 'nasreenproperty', 'nasreen@gazipur.properties.bd', '1234', 'host', 'active', '2024-04-08 05:05:00', NULL, NULL),
(74, 'shahjalal', 'shahjalal@narayanganjhomes.com', '1234', 'host', 'active', '2024-04-13 07:40:00', NULL, NULL),
(75, 'roksanarentals', 'roksana@manikganjspaces.bd', '1234', 'host', 'active', '2024-04-18 04:15:00', NULL, NULL),
(76, 'Shakibul Islam', 'shakibul@gmail.com', '1234', 'guest', 'active', '2025-08-11 10:37:50', '0987654321', NULL),
(78, 'Mehedi Hasan', 'mehedi12@gmail.com', '1234', 'host', 'active', '2025-08-11 11:11:39', '1234567890', '1093874509'),
(79, 'amir', 'amir@gmail.com', '1234', 'host', 'active', '2025-08-25 11:36:12', '0987654321', '1234567890');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD UNIQUE KEY `unique_user_space` (`user_id`,`space_id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `id_2` (`id`),
  ADD KEY `space_id` (`space_id`);

--
-- Indexes for table `pending_hosts`
--
ALTER TABLE `pending_hosts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_pendinghost_admin` (`admin_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `reported_id` (`reported_id`);

--
-- Indexes for table `spaces`
--
ALTER TABLE `spaces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interests`
--
ALTER TABLE `interests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `pending_hosts`
--
ALTER TABLE `pending_hosts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `spaces`
--
ALTER TABLE `spaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `interests`
--
ALTER TABLE `interests`
  ADD CONSTRAINT `interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interests_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pending_hosts`
--
ALTER TABLE `pending_hosts`
  ADD CONSTRAINT `fk_pendinghost_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spaces`
--
ALTER TABLE `spaces`
  ADD CONSTRAINT `spaces_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
