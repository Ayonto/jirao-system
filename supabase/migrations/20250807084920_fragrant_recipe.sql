@@ .. @@
 -- Interests table
--  CREATE TABLE interests (
--      id INT AUTO_INCREMENT PRIMARY KEY,
--      user_id INT NOT NULL,
--      space_id INT NOT NULL,
-- +    hours_requested INT NULL,
-- +    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
-- +    host_response_date TIMESTAMP NULL,
--      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--      FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
--      UNIQUE KEY unique_user_space (user_id, space_id)
--  );

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