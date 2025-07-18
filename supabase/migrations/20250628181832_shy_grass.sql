-- Check current database structure and fix if needed
USE dubai_marketplace;

-- Check if profile_image column exists, if not add it
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dubai_marketplace' 
AND TABLE_NAME = 'agents' 
AND COLUMN_NAME = 'profile_image';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE agents ADD COLUMN profile_image VARCHAR(255) AFTER name;', 
    'SELECT "Column profile_image already exists" as message;');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show current table structure
DESCRIBE agents;
DESCRIBE posts;