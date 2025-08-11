-- JIRAO Database Schema
-- Run this SQL to create the database structure

CREATE DATABASE IF NOT EXISTS jirao_db;
USE jirao_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Simple password storage (no hashing)
    role ENUM('guest', 'host', 'admin') NOT NULL,
    status ENUM('active', 'banned', 'pending') DEFAULT 'active',
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nid_image TEXT NULL
);

-- Spaces table
CREATE TABLE spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    type ENUM('room', 'parking') NOT NULL,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    rate_per_hour DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    availability ENUM('available', 'on_hold', 'not_available') DEFAULT 'available',
    dimensions JSON NULL, -- For parking spaces: {"length": 20, "width": 10, "height": 8}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Interests table
CREATE TABLE interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    space_id INT NOT NULL,
    hours_requested INT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    host_response_date TIMESTAMP NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_space (user_id, space_id)
);

-- Reports table
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_id INT NOT NULL,
    reporter_role ENUM('guest', 'host') NOT NULL,
    reported_role ENUM('guest', 'host') NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pending hosts table
CREATE TABLE pending_hosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nid_image TEXT NOT NULL,
    date_applied TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, status) VALUES 
('admin_user', 'admin@jirao.com', 'admin123', 'admin', 'active');

-- Sample data for testing
INSERT INTO users (username, email, password, role, status) VALUES 
('john_guest', 'john@example.com', 'password123', 'guest', 'active'),
('sarah_host', 'sarah@example.com', 'password123', 'host', 'active'),
('mike_host', 'mike@example.com', 'password123', 'host', 'active');

-- Sample spaces
INSERT INTO spaces (owner_id, type, title, location, rate_per_hour, description, availability) VALUES 
(3, 'room', 'Cozy Downtown Room', 'Downtown NYC', 15.00, 'A comfortable room in the heart of the city with great amenities.', 'available'),
(4, 'parking', 'Secure Parking Space', 'Manhattan', 8.00, 'Safe and secure parking space close to subway station.', 'available');

-- Update parking space with dimensions
UPDATE spaces SET dimensions = '{"length": 20, "width": 10, "height": 8}' WHERE type = 'parking';