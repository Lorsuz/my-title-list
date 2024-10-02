CREATE DATABASE my_title_list CHARACTER SET utf8 COLLATE utf8_general_ci;
USE my_title_list;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
	_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	fullName VARCHAR(150) NOT NULL,
	nickname VARCHAR(100) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	profileImage VARCHAR(255) DEFAULT 'https://ui-avatars.com/api/?background=008025&color=ffffff&name=Profile&size=100',
	backgroundImage VARCHAR(255) DEFAULT 'https://static.vecteezy.com/system/resources/previews/004/968/002/non_2x/cute-abstract-modern-background-free-vector.jpg',
	gender ENUM('m', 'f') NOT NULL,
	phone VARCHAR(20),
	birth DATE NOT NULL,
	verified BOOLEAN DEFAULT FALSE,
	isAdmin BOOLEAN DEFAULT FALSE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de seguidores (sistema de seguir perfis)
CREATE TABLE IF NOT EXISTS follows (
	follower_id INTEGER NOT NULL,
	followed_id INTEGER NOT NULL,
	followedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (follower_id, followed_id),
	FOREIGN KEY (follower_id) REFERENCES users(_id) ON DELETE CASCADE,
	FOREIGN KEY (followed_id) REFERENCES users(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de tokens para recuperação/verificação de conta
CREATE TABLE IF NOT EXISTS tokens (
	user_id INTEGER NOT NULL,
	token VARCHAR(255) NOT NULL,
	dueDate DATE NOT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id),
	FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de caixas (listas de títulos)
CREATE TABLE IF NOT EXISTS boxes (
	_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	name VARCHAR(255) NOT NULL,
	`desc` VARCHAR(255) DEFAULT NULL,
	public BOOLEAN DEFAULT TRUE,
	coverImage VARCHAR(255) DEFAULT 'https://static6.depositphotos.com/1112859/621/i/450/depositphotos_6219942-stock-photo-search-of-data-isolated-3d.jpg',
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de títulos
CREATE TABLE IF NOT EXISTS titles (
	_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	box_id INTEGER NOT NULL,
	name VARCHAR(255) NOT NULL,
	alternativeName VARCHAR(255) DEFAULT NULL,
	translation VARCHAR(255) DEFAULT NULL,
	rate INTEGER NOT NULL DEFAULT 0,
	review TEXT DEFAULT NULL,
	recommended BOOLEAN NOT NULL DEFAULT FALSE,
	favorite BOOLEAN NOT NULL DEFAULT FALSE,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (box_id) REFERENCES boxes(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    _id INTEGER AUTO_INCREMENT PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    title_id INTEGER NOT NULL,
    message TEXT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (title_id) REFERENCES titles(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de notas (grades)
CREATE TABLE IF NOT EXISTS grades (
	_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	box_id INTEGER NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`weight` INTEGER DEFAULT NULL,
	`desc` VARCHAR(255) DEFAULT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (box_id) REFERENCES boxes(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
	_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	box_id INTEGER NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`desc` VARCHAR(100) DEFAULT NULL,
	color VARCHAR(20) DEFAULT '#FFFFFF',
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (box_id) REFERENCES boxes(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de associação entre títulos e categorias
CREATE TABLE IF NOT EXISTS title_category (
	title_id INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	ranking INTEGER DEFAULT NULL,
	PRIMARY KEY (title_id, category_id), 
	FOREIGN KEY (title_id) REFERENCES titles(_id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de associação entre títulos e boxes
CREATE TABLE IF NOT EXISTS title_box (
	title_id INTEGER NOT NULL,
	box_id INTEGER NOT NULL,
	ranking INTEGER DEFAULT NULL,
	PRIMARY KEY (title_id, box_id), 
	FOREIGN KEY (title_id) REFERENCES titles(_id) ON DELETE CASCADE,
	FOREIGN KEY (box_id) REFERENCES boxes(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Tabela de associação entre títulos e notas
CREATE TABLE IF NOT EXISTS title_grade (
	title_id INTEGER NOT NULL,
	grade_id INTEGER NOT NULL,
	rate INTEGER NOT NULL DEFAULT 0,
	reason VARCHAR(255) DEFAULT NULL,
	PRIMARY KEY (title_id, grade_id),
	FOREIGN KEY (title_id) REFERENCES titles(_id) ON DELETE CASCADE,
	FOREIGN KEY (grade_id) REFERENCES grades(_id) ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;


SELECT t._id, t.name, tc.ranking 
FROM titles t 
JOIN title_category tc ON t._id = tc.title_id 
WHERE tc.category_id = ? 
ORDER BY tc.ranking ASC;


