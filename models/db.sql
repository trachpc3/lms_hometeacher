-- Crear base de datos
CREATE DATABASE IF NOT EXISTS lms;
USE lms;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('estudiante', 'profesor', 'administrador') NOT NULL,
    imagen VARCHAR(255) DEFAULT '/default-profile.png',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP NULL,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    ultima_sesion TIMESTAMP NULL,
    metodo_registro ENUM('manual', 'google', 'facebook') DEFAULT 'manual',
    telefono VARCHAR(20),
    pais VARCHAR(50),
    idioma_preferido VARCHAR(20) DEFAULT 'es',
    notas_staff TEXT,
    referido_por INT NULL,
    progreso_global DECIMAL(5,2) DEFAULT 0.00,
    estado_formacion ENUM('demo', 'matriculado', 'completado', 'expirado') DEFAULT 'demo',
    FOREIGN KEY (referido_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

ALTER TABLE usuarios MODIFY rol 
  ENUM('estudiante', 'profesor', 'administrador', 'fundae', 'gestion') NOT NULL;

-- Inserción de usuarios 
INSERT INTO usuarios (nombre, email, password, rol, metodo_registro, apellidos, profesor_asignado, curso_matriculado)
VALUES (
  'Daniela',
  'daniela.depetris@hometeacher.es',
  '$2b$10$E9vKRoCkns9/9RHYG9zMour74Ip38.ERKbK/9CvVKU71.vIb/5jeK', -- ← reemplazar con hash real
  'gestion',
  'manual',
  'Depetris',
    0, -- profesor asignado (0 si no hay)
    0 -- curso matriculado (0 si no hay)
  
);

-- Inserción de usuarios 
INSERT INTO usuarios (nombre, email, password, rol, metodo_registro, apellidos, profesor_asignado, curso_matriculado)
VALUES (
  'Fundae',
  'fundae@hometeacher.es',
  '$2b$10$E9vKRoCkns9/9RHYG9zMour74Ip38.ERKbK/9CvVKU71.vIb/5jeK', -- ← reemplazar con hash real
  'fundae',
  'manual',
  'Supervisor',
    0, -- profesor asignado (0 si no hay)
    0 -- curso matriculado (0 si no hay)
  
);
-- Tabla sesiones (logins)
CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla niveles
CREATE TABLE IF NOT EXISTS niveles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Inserción de niveles
INSERT IGNORE INTO niveles (id, nombre, descripcion) VALUES
(1, 'Beginners', 'Nivel básico sin conocimientos previos'),
(2, 'Lower Intermediate', 'Nivel básico avanzado'),
(3, 'Intermediate', 'Nivel intermedio general'),
(4, 'Upper Intermediate', 'Nivel intermedio alto'),
(5, 'Advanced', 'Nivel avanzado'),
(6, 'Business', 'Inglés para negocios');

-- Tabla unidades
CREATE TABLE IF NOT EXISTS unidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel_id INT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE
);

-- Inserción de las 144 unidades reales
-- Asegúrate de que ya tienes creada la base de datos y seleccionada:
-- CREATE DATABASE IF NOT EXISTS lms;
-- USE lms;

-- Nivel 1: Beginners
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A day at the beach', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A new friend', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A chat in the subway', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'At breakfast', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The hotel doorman', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The party', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The medical conference', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'Mr. Memory', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The delay', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The question', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A quiet baby', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The disguised identities', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A funny chat in the pub', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The house next week', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The jealous friend', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The grumpy grandpa', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The men all very different', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'An unnecessary question', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A call from Juarez', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A desperate couple', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A happy birthday', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'Each one teaches', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'A meat diary', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (1, 'The emails', '');

-- Nivel 2: Lower Intermediate
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'A good combination', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The watch', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The dessert', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'A chat in the fruit shop', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The sales', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The mountain bike', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The twins', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The Christmas tree', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The househusband', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Boss or lover', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Allan’s girlfriend', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The good life', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Mum’s on strike', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Ben’s birthday', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Vacation in Bahia', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The efficient secretary', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Video and spaghetti', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'A big favour', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'A wonderful waiter', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Wedding in Bali', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Tom suggestions', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The birthday present', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'Living together', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (2, 'The weekend', '');

/* Nivel 3 */
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'A terrific teacher', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'A brilliant idea', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Two secretaries', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The boss’ mother', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Fashion café', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'A small argument', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The football match', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The phantom', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Incompatible food', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The power is within you', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Linda’s worries', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Sam’s intuition', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'A new look', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Too late', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Misunderstanding', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'God’s punishment', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Carol’s new book', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The mystery', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Singing in the school', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The solution', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Kenya', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'Memories', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'The stressed husband', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (3, 'An incredible arrangement', '');

/* Nivel 4 */
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'The boss in love', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Driving by night', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Albert, The Robot', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'The full restaurant', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'British pride', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Two friends', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Dinner and Dominoes', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Our dear Edward', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Appreciate what you have', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Boys', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'The hospital', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'A seductive woman', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'A village in Africa', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'George is absent-minded', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Good advice', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'The debt', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Matthew’s cars', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'The last chance', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'The blonde dream', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Alecki men', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Breakfast in bed', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Hannah', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'A novel affair', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (4, 'Dancing in the rain', '');

/* Nivel 5 */
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The invitation', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The weekly schedule', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Sundays', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Prince Charming', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The vanity case', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The beach bar', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The hairdresser', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, '20th February', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Irena’s story', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Listening to music', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Lady in red', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Supper in Sam’s house', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The journalist and the architect', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'The zodiac', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Sunshine village', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Emotions', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Multiscreen movie theaters', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Tobacco', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Moving in', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Mister Door', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Vacations', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Flat exchange', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Francis doubts', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (5, 'Mexico City', '');

/* Nivel 6 */
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Newspapers', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'An exciting future', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Anne and languages', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'The opening', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Noel’s sixty years of age', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Jenny, the baby-sitter', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Little sparks of life', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Melatonin', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Midnight Train', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Total success', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'The mayor of New Rock', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Grosvenor house', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Children’s encyclopedia', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'The advertisement', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Big lemon', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Dominique', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Agree - Alistair & Graham', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'How to speak in public', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Theresa shares', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'My husband’s ex', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Sailing around the Aegean', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'The budget', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'Tramonti', '');
INSERT INTO unidades (nivel_id, titulo, descripcion) VALUES (6, 'The European Union', '');



-- Tabla actividades
CREATE TABLE IF NOT EXISTS actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unidad_id INT,
    tipo ENUM('Situation', 'Practice', 'Listening', 'Grammar', 'Assessment', 'Vocabulary', 'Speaking', 'Writing') NOT NULL,
    descripcion TEXT,
    enlace_contenido VARCHAR(255),
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE
);

-- Tabla avance_usuario
CREATE TABLE IF NOT EXISTS avance_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nivel_id INT,
    unidad_id INT,
    actividad_id INT,
    completado BOOLEAN DEFAULT FALSE,
    calificacion DECIMAL(5,2),
    fecha_completado TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

-- Tabla matriculas
CREATE TABLE IF NOT EXISTS matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    nivel_id INT NOT NULL,
    profesor_id INT NOT NULL,
    fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago ENUM('transferencia', 'tarjeta', 'paypal') DEFAULT 'tarjeta',
    plan ENUM('único', 'mensual', 'trimestral', 'anual') DEFAULT 'único',
    precio DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'activa', 'expirada', 'cancelada') DEFAULT 'pendiente',
    contrato_aceptado BOOLEAN DEFAULT FALSE,
    clausulas TEXT,
    firma_digital VARCHAR(255),
    ip_registro VARCHAR(45),
    acepto_lopd BOOLEAN DEFAULT FALSE,
    acepto_politica_privacidad BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (alumno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

USE lms;

-- Administrador principal
INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) VALUES
('Admin', 'admin@lms.com', '$2b$10$KIXQ2d0lNEZf6sPQafIf7em9wLP4KY2fZZC8k9iZfO7oJ7BPP.x5G', 'administrador', 'manual');

-- Profesor: Ana
INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) VALUES
('Ana', 'ana@lms.com', '$2b$10$hRaaWtMebLusRCH3yV9YlOUnHccAW2YmkTveMY8Pcf7h6wU/Nltai', 'profesor', 'manual');

-- Alumno: Pepe
INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) VALUES
('Pepe', 'pepe@lms.com', '$2b$10$7Ni3T5OsvuY.FOLP4B4v/utZdQ3JDw0yb0p8bEw98cXTZQ8OPN8Ve', 'estudiante', 'manual');

TRUNCATE TABLE usuarios;

INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) VALUES
('Admin Principal', 'admin@lms.com', '$2b$10$5D5y/UvV1Oo7uvXL3pAwneCNqWPh1L40p2Sp9GFwUTr7WLmB5wINi', 'administrador', 'manual'),
('Ana', 'ana@lms.com', '$2b$10$z.P/NwXz83TbfHE6T1RJ1e7hFgVnlTOW3bOGZZYbCOu5rUJGGI4XS', 'profesor', 'manual'),
('Pepe', 'pepe@lms.com', '$2b$10$zH.EsmkkZcTUXU48lYgEWuzADuF.KcRzEjtowu26mKzIrxLqCJlLy', 'estudiante', 'manual');

UPDATE usuarios
SET password = '$2a$10$BN3U2tHeZcsVwOBgU6AXwujWkwhPVUQUSe77gT/AtX9J2RE/muOly'
WHERE email = 'ana@lms.com';

INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) VALUES
('Javi', 'javi@lms.com', '$2a$10$DxRbAEf.KhYIt.BP4OAKiOImVHiRrRnnILlvgIfiaRI8eHo7Unmoa', 'administrador', 'manual');

INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) VALUES
('Javi', 'javi@lms.com', '$2b$10$jjy3bnb/X0zgILOXL3PziOgg7tW5zT6zIR5N6rV0jGxw7BEmkrZ6K', 'administrador', 'manual');

CREATE TABLE IF NOT EXISTS situations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unidad_id INT,
    actividad_id INT,
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

INSERT INTO situations (unidad_id, actividad_id, title, video_url) VALUES 
(1, 1, "A Day at the Beach", "https://player.vimeo.com/video/288377193");

CREATE TABLE IF NOT EXISTS listening_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unidad_id INT NOT NULL,
    actividad_id INT NOT NULL,
    audio VARCHAR(255) NOT NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listening_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES listening_questions(id) ON DELETE CASCADE
);

SELECT id FROM actividades WHERE unidad_id = 1 AND tipo = 'Listening';
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES
(1, 3, 'https://campusvirtualhometeacher.es/AUDIO%20STUDY/1/111.mp3'),
(1, 3, 'https://campusvirtualhometeacher.es/LISTENING/1/q2.mp3');

SELECT id FROM listening_questions WHERE unidad_id = 1 AND actividad_id = 3;

INSERT INTO listening_options (question_id, text, correct) VALUES
(1, "It is very nice there", 0),
(1, "It is very nice here", 1),
(1, "It's very nice here", 0);

INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES 
(1, 3, 'https://campusvirtualhometeacher.es/LISTENING/1/q2.mp3');

INSERT INTO listening_options (question_id, text, correct) VALUES
(2, 'She is at home', 1),
(2, 'She is at school', 0),
(2, 'She is in the park', 0);

CREATE TABLE IF NOT EXISTS grammar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unidad_id INT NOT NULL,
    actividad_id INT NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    explicacion TEXT NOT NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

SELECT id FROM actividades WHERE unidad_id = 1 AND tipo = 'Grammar';

INSERT INTO grammar (unidad_id, actividad_id, video_url, explicacion) VALUES 
(1, 4, 'https://player.vimeo.com/video/287979486', 
 'Los pronombres personales y el verbo "to be" en presente simple.');

CREATE TABLE IF NOT EXISTS vocabulary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unidad_id INT NOT NULL,
    actividad_id INT NOT NULL,
    word VARCHAR(50) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    audio_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE
);

INSERT INTO vocabulary (unidad_id, actividad_id, word, translation, audio_url) VALUES 
(1, 6, "a", "Un, una (art.)", "https://campusvirtualhometeacher.es/VOCABULARY/1/a.mp3"),
(1, 6, "afraid", "Asustado (adj.)", "https://campusvirtualhometeacher.es/VOCABULARY/1/afraid.mp3"),
(1, 6, "and", "Y, e (conj.)", "https://campusvirtualhometeacher.es/VOCABULARY/1/and.mp3"),
(1, 6, "at", "En, a (prep.)", "https://campusvirtualhometeacher.es/VOCABULARY/1/at.mp3"),
(1, 6, "bad", "Malo (adj.)", "https://campusvirtualhometeacher.es/VOCABULARY/1/bad.mp3"),
(1, 6, "be", "Ser, estar (verb.)", "https://campusvirtualhometeacher.es/VOCABULARY/1/be.mp3");
ALTER TABLE usuarios
ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_expira BIGINT DEFAULT NULL;

DESCRIBE usuarios;

CREATE TABLE fundae_envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  curso_id VARCHAR(100) NOT NULL,
  respuesta TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fundae_respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  envio_id INT NOT NULL,
  pregunta VARCHAR(255) NOT NULL,
  respuesta TEXT NOT NULL,
  FOREIGN KEY (envio_id) REFERENCES fundae_envios(id) ON DELETE CASCADE
);
SELECT * FROM unidades WHERE nivel_id = '1';

CREATE TABLE `speaking_dialogues` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actividad_id` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`actividad_id`) REFERENCES `actividades`(`id`) ON DELETE CASCADE

);

CREATE TABLE `speaking_lines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dialogue_id` INT NOT NULL,
  `line_order` INT NOT NULL,
  `speaker` ENUM('A', 'B') NOT NULL,
  `texto` TEXT NOT NULL,
  `audio_url` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dialogue_id`) REFERENCES `speaking_dialogues`(`id`) ON DELETE CASCADE
);

-- 1. Insertar diálogo principal para actividad_id = 7
INSERT INTO speaking_dialogues (actividad_id, titulo, descripcion)
VALUES (
  7,
  'A Day at the Beach (Karen & Paul)',
  'Role-play practice between Karen and Paul on a sunny beach day.'
);

-- 2. Obtener el ID del nuevo diálogo insertado
SET @dialogue_id = LAST_INSERT_ID();

ALTER TABLE speaking_lines
MODIFY COLUMN speaker VARCHAR(50) NOT NULL;



-- 3. Insertar las líneas del diálogo con nombres reales y audios
INSERT INTO speaking_lines (dialogue_id, line_order, speaker, texto, audio_url)
VALUES

(@dialogue_id, 1, 'Karen', 'It''s very nice here.', '/uploads/speaking/fd001.wav'),
(@dialogue_id, 2, 'Paul', 'Yes, the weather is wonderful.', '/uploads/speaking/fd002.wav'),
(@dialogue_id, 3, 'Karen', 'I''m thirsty.', '/uploads/speaking/fd003.wav'),
(@dialogue_id, 4, 'Paul', 'Well, it is hot today!', '/uploads/speaking/fd004.wav'),
(@dialogue_id, 5, 'Paul', 'I am very lucky!', '/uploads/speaking/fd005.wav'),
(@dialogue_id, 6, 'Paul', 'A blue sea, white sand, and a beautiful girl. And ...', '/uploads/speaking/fd006.wav'),
(@dialogue_id, 7, 'Karen', 'a very cold orange juice.', '/uploads/speaking/fd007.wav'),
(@dialogue_id, 8, 'Paul', 'Oh, darling, you are a treasure.', '/uploads/speaking/fd008.wav'),
(@dialogue_id, 9, 'Karen', 'Yes, I know.', '/uploads/speaking/fd009.wav'),
(@dialogue_id, 10, 'Karen', 'Here you are!', '/uploads/speaking/fd010.wav');

ALTER TABLE actividades 
MODIFY COLUMN tipo 
ENUM('Situation','Practice','Listening','Grammar','Assessment','Vocabulary','Speaking','ProductiveSkills') NOT NULL;

UPDATE actividades 
SET tipo = 'ProductiveSkills' 
WHERE tipo = 'Writing';

ALTER TABLE actividades 
MODIFY COLUMN tipo 
ENUM('Situation','Practice','Listening','Grammar','Assessment','Vocabulary','Speaking','Writing','ProductiveSkills') NOT NULL;

UPDATE actividades 
SET tipo = 'ProductiveSkills' 
WHERE tipo = 'Writing';

ALTER TABLE actividades 
MODIFY COLUMN tipo 
ENUM('Situation','Practice','Listening','Grammar','Assessment','Vocabulary','Speaking','ProductiveSkills') NOT NULL;

-- Pregunta 1
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp01.mp3');
SET @qid1 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid1, 'It is very nice here', 0),
(@qid1, "It's very nice here", 1),
(@qid1, 'It is very nice there', 0);

-- Pregunta 2
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp02.mp3');
SET @qid2 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid2, 'Yes, the weather is wonderful. I am thirsty', 1),
(@qid2, 'Yes, the weather is wonderful. I am thirty', 0),
(@qid2, "Yes, It's a good weather, I am thirsty", 0);

-- Pregunta 3
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp03.mp3');
SET @qid3 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid3, 'Well, It is hot today', 0),
(@qid3, 'Well, It is cold today', 0),
(@qid3, "Well, it's hot today", 1);

-- Pregunta 4
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp04.mp3');
SET @qid4 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid4, 'I am very lucky a blue see, which sand and a beautiful girl', 0),
(@qid4, "I'm very lucky a blue sea, white sand and a beautiful girl", 1),
(@qid4, 'I am very lucky a blue sea, white sand and a beautiful girl', 0);

-- Pregunta 5
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp05.mp3');
SET @qid5 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid5, 'and a very hot orange juice', 0),
(@qid5, 'and a very cold lemon juice', 0),
(@qid5, 'and a very cold orange juice', 1);

-- Pregunta 6
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp06.mp3');
SET @qid6 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid6, 'oh sweet you are a treasure', 0),
(@qid6, "oh darling you're a treasure", 0),
(@qid6, 'oh darling you are a treasure', 1);

-- Pregunta 7
INSERT INTO listening_questions (unidad_id, actividad_id, audio) VALUES (1, 1, '001rp07.mp3');
SET @qid7 = LAST_INSERT_ID();
INSERT INTO listening_options (question_id, text, correct) VALUES
(@qid7, 'Yes I know, Here you are', 1),
(@qid7, "Yes I know, Here you're", 0),
(@qid7, 'Yes I know, There you are', 0);

CREATE TABLE productive_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unidad_id INT NOT NULL,
  tipo ENUM('writing', 'speaking') NOT NULL,
  descripcion TEXT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE
);

INSERT INTO productive_skills (unidad_id, tipo, descripcion)
VALUES (1, 'writing', 'Describe el clima de tu ciudad durante las diferentes estaciones del año. Usa conectores, adjetivos descriptivos y estructuras en presente simple o pasado si es necesario.');

INSERT INTO productive_skills (unidad_id, tipo, descripcion)
VALUES (1, 'speaking', 'Habla sobre cómo cambia el clima en tu ciudad durante el año. ¿Qué actividades haces en cada estación? Usa vocabulario relacionado con el clima.');
