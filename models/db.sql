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
CREATE TABLE testnivel_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level ENUM('A1', 'A2', 'B1', 'B2') NOT NULL,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,
  variant_group_id INT NOT NULL, -- para agrupar variantes de una misma pregunta
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE testnivel_questions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES
('A1','What is the plural of "cat"?','cats','cates','catss','cati','A','1001'),
('A1','Choose the plural form of "cat".','cat','cats','cates','cati','B','1001'),
('A1','Select the correct plural: one cat, two ___?','cat','cats','cates','cati','B','1001'),

('A1','What is the opposite of "big"?','small','tall','long','fast','A','1002'),
('A1','Choose the opposite of "big".','big','small','tall','fast','B','1002'),
('A1','Select antonym of "big".','long','small','big','fast','B','1002'),

('A1','My name ___ John.','am','is','are','be','B','1003'),
('A1','Fill in: My name ___ John.','am','is','be','are','B','1003'),
('A1','Complete: My name ___ John.','are','is','am','be','B','1003'),

('A1','I ___ from Spain.','am','is','are','be','A','1004'),
('A1','Fill: I ___ from Spain.','is','are','am','be','C','1004'),
('A1','Complete: I ___ from Spain.','are','am','is','be','C','1004'),

('A1','She ___ a teacher.','is','are','am','be','A','1005'),
('A1','Choose: She ___ a teacher.','is','am','are','be','A','1005'),
('A1','Complete: She ___ a teacher.','are','am','is','be','C','1005'),

('A1','We ___ friends.','are','is','am','be','A','1006'),
('A1','Fill in: We ___ friends.','are','am','is','be','A','1006'),
('A1','Complete: We ___ friends.','is','are','am','be','B','1006'),

('A1','They ___ at home.','are','is','am','be','A','1007'),
('A1','Choose: They ___ at home.','are','am','is','be','A','1007'),
('A1','Complete: They ___ at home.','is','are','am','be','B','1007'),

('A1','He ___ in the garden.','is','are','am','be','A','1008'),
('A1','Fill: He ___ in the garden.','is','are','am','be','A','1008'),
('A1','Complete: He ___ in the garden.','are','am','is','be','B','1008'),

('A1','What ___ your name?','is','are','am','be','A','1009'),
('A1','Choose: What ___ your name?','am','is','are','be','B','1009'),
('A1','Complete: What ___ your name?','is','are','am','be','A','1009'),

('A1','Where ___ you from?','is','are','am','be','B','1010'),
('A1','Fill in: Where ___ you from?','is','am','are','be','C','1010'),
('A1','Complete: Where ___ you from?','are','am','is','be','C','1010'),

('A1','I ___ 20 years old.','am','is','are','be','A','1011'),
('A1','Choose: I ___ 20 years old.','am','is','are','be','A','1011'),
('A1','Complete: I ___ 20 years old.','is','are','am','be','C','1011'),

('A1','She has a cat. → She ___ a cat.','has','have','had','having','A','1012'),
('A1','Choose: She ___ a cat.','have','had','has','having','C','1012'),
('A1','Complete: She ___ a cat.','has','have','had','having','A','1012'),

('A1','We don’t ___ coffee.','drink','drinks','drank','drunk','A','1013'),
('A1','Select: We don’t ___ coffee.','drink','drinks','drank','drunk','A','1013'),
('A1','Fill: We don’t ___ coffee.','drinks','drink','drank','drunk','B','1013'),

('A1','He ___ a book.','reads','read','reading','rread','A','1014'),
('A1','Choose: He ___ a book.','reads','read','reading','rread','A','1014'),
('A1','Complete: He ___ a book.','read','reads','reading','rread','B','1014'),

('A1','They ___ football.','play','plays','played','playing','A','1015'),
('A1','Fill: They ___ football.','play','plays','playing','played','A','1015'),
('A1','Complete: They ___ football.','plays','play','played','playing','B','1015'),

('A1','Do you ___ tea?','like','likes','liking','liked','A','1016'),
('A1','Select: Do you ___ tea?','like','likes','liking','liked','A','1016'),
('A1','Fill: Do you ___ tea?','likes','like','liking','liked','B','1016'),

('A1','I ___ TV every evening.','watch','watches','watching','watched','A','1017'),
('A1','Choose: I ___ TV every evening.','watch','watches','watching','watched','A','1017'),
('A1','Complete: I ___ TV every evening.','watches','watch','watching','watched','B','1017'),

('A1','She ___ coffee in the morning.','drinks','drink','drank','drinking','A','1018'),
('A1','Fill: She ___ coffee in the morning.','drinks','drink','drank','drinking','A','1018'),
('A1','Complete: She ___ coffee in the morning.','drink','drinks','drank','drinking','B','1018'),

('A1','He ___ to school by bus.','goes','go','going','went','A','1019'),
('A1','Choose: He ___ to school by bus.','go','goes','going','went','B','1019'),
('A1','Complete: He ___ to school by bus.','goes','go','going','went','A','1019'),

('A1','Where ___ they live?','do','does','are','is','B','1020'),
('A1','Select: Where ___ they live?','do','does','is','are','B','1020'),
('A1','Fill: Where ___ they live?','do','does','are','is','A','1020'),

('A1','This is ___ apple.','an','a','the','no article','A','1021'),
('A1','Choose: This is ___ apple.','a','an','the','no article','B','1021'),
('A1','Complete: This is ___ apple.','an','a','the','no article','A','1021'),

('A1','I have ___ dog.','an','a','the','no article','B','1022'),
('A1','Choose: I have ___ dog.','a','an','the','no article','A','1022'),
('A1','Fill: I have ___ dog.','a','an','no article','the','A','1022'),

('A1','She is ___ artist.','a','an','the','no article','A','1023'),
('A1','Select: She is ___ artist.','an','a','the','no article','B','1023'),
('A1','Complete: She is ___ artist.','an','a','the','no article','B','1023'),

('A1','Are they ___ students?','a','an','the','no article','A','1024'),
('A1','Choose: Are they ___ students?','an','a','the','no article','C','1024'),
('A1','Fill: Are they ___ students?','a','an','the','no article','A','1024'),

('A1','Do you speak ___ English?','a','an','the','no article','D','1025'),
('A1','Select: Do you speak ___ English?','an','a','the','no article','D','1025'),
('A1','Fill: Do you speak ___ English?','a','an','the','no article','D','1025'),

('A1','This is ___ table.','a','an','the','no article','A','1026'),
('A1','Choose article: This is ___ table.','an','a','the','no article','B','1026'),
('A1','Complete: This is ___ table.','a','an','the','no article','A','1026'),

('A1','They have ___ car.','a','an','the','no article','A','1027'),
('A1','Select: They have ___ car.','an','a','the','no article','C','1027'),
('A1','Fill: They have ___ car.','a','an','the','no article','A','1027'),

('A1','I live ___ Madrid.','in','on','at','to','A','1028'),
('A1','Choose: I live ___ Madrid.','on','in','at','to','B','1028'),
('A1','Fill: I live ___ Madrid.','in','on','at','to','A','1028'),

('A1','They live ___ the city.','in','on','at','to','A','1029'),
('A1','Select: They live ___ the city.','on','in','at','to','C','1029'),
('A1','Fill: They live ___ the city.','in','on','at','to','A','1029'),

('A1','He is ___ engineer.','an','a','the','no article','A','1030'),
('A1','Choose: He is ___ engineer.','a','an','the','no article','B','1030'),
('A1','Complete: He is ___ engineer.','an','a','the','no article','A','1030');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES
('A1','There is ___ apple on the table.','an','a','the','some','A','1031'),
('A1','Choose: There is ___ apple on the table.','a','an','some','any','B','1031'),
('A1','Complete: There is ___ apple on the table.','an','some','a','the','A','1031'),

('A1','___ you like pizza?','Do','Does','Are','Is','A','1032'),
('A1','Choose: ___ you like pizza?','Is','Are','Do','Does','C','1032'),
('A1','Complete: ___ you like pizza?','Do','Are','Is','Does','A','1032'),

('A1','The sun ___ in the east.','rises','rise','rised','rising','A','1033'),
('A1','Choose: The sun ___ in the east.','rise','rises','rising','rose','B','1033'),
('A1','Complete: The sun ___ in the east.','rises','rising','rise','rose','A','1033'),

('A1','How ___ are you?','old','much','many','long','A','1034'),
('A1','Choose: How ___ are you?','many','old','much','long','B','1034'),
('A1','Complete: How ___ are you?','old','long','much','many','A','1034'),

('A1','She ___ go to school on Sundays.','doesn’t','don’t','isn’t','wasn’t','A','1035'),
('A1','Choose: She ___ go to school on Sundays.','doesn’t','don’t','isn’t','wasn’t','A','1035'),
('A1','Complete: She ___ go to school on Sundays.','doesn’t','don’t','isn’t','won’t','A','1035'),

('A1','I usually ___ coffee in the morning.','drink','drinks','drinking','drank','A','1036'),
('A1','Choose: I usually ___ coffee in the morning.','drinks','drink','drinking','drank','B','1036'),
('A1','Complete: I usually ___ coffee in the morning.','drink','drinking','drank','drinks','A','1036'),

('A1','Where ___ he live?','does','do','is','are','A','1037'),
('A1','Choose: Where ___ he live?','do','does','is','are','B','1037'),
('A1','Fill: Where ___ he live?','does','do','is','are','A','1037'),

('A1','How ___ sugar do you want?','much','many','few','little','A','1038'),
('A1','Choose: How ___ sugar do you want?','many','much','few','a lot','B','1038'),
('A1','Complete: How ___ sugar do you want?','much','many','few','some','A','1038'),

('A1','There ___ a book on the table.','is','are','was','were','A','1039'),
('A1','Choose: There ___ a book on the table.','are','is','were','be','B','1039'),
('A1','Complete: There ___ a book on the table.','is','was','are','be','A','1039'),

('A1','There ___ some apples in the basket.','are','is','be','was','A','1040'),
('A1','Choose: There ___ some apples in the basket.','is','are','was','be','B','1040'),
('A1','Complete: There ___ some apples in the basket.','are','is','be','were','A','1040'),

('A1','___ is your birthday?','When','Where','What','Why','A','1041'),
('A1','Choose: ___ is your birthday?','When','Where','Why','What','A','1041'),
('A1','Complete: ___ is your birthday?','When','Why','What','Where','A','1041'),

('A1','We have class ___ Monday.','on','at','in','to','A','1042'),
('A1','Choose: We have class ___ Monday.','in','on','at','to','B','1042'),
('A1','Complete: We have class ___ Monday.','on','in','at','to','A','1042'),

('A1','I go to bed ___ 10 p.m.','at','on','in','to','A','1043'),
('A1','Choose: I go to bed ___ 10 p.m.','at','on','in','to','A','1043'),
('A1','Complete: I go to bed ___ 10 p.m.','at','in','on','to','A','1043'),

('A1','We eat lunch ___ noon.','at','on','in','by','A','1044'),
('A1','Choose: We eat lunch ___ noon.','in','at','on','by','B','1044'),
('A1','Complete: We eat lunch ___ noon.','at','on','in','to','A','1044'),

('A1','The cat is ___ the table.','under','on','in','between','A','1045'),
('A1','Choose: The cat is ___ the table.','on','under','between','over','B','1045'),
('A1','Complete: The cat is ___ the table.','under','on','in','above','A','1045'),

('A1','The ball is ___ the box.','in','on','under','behind','A','1046'),
('A1','Choose: The ball is ___ the box.','on','in','under','behind','B','1046'),
('A1','Complete: The ball is ___ the box.','in','on','under','beside','A','1046'),

('A1','I brush my teeth ___ the morning.','in','on','at','to','A','1047'),
('A1','Choose: I brush my teeth ___ the morning.','on','in','at','to','B','1047'),
('A1','Complete: I brush my teeth ___ the morning.','in','on','at','by','A','1047'),

('A1','He is sitting ___ the chair.','on','in','under','over','A','1048'),
('A1','Choose: He is sitting ___ the chair.','on','in','under','by','A','1048'),
('A1','Complete: He is sitting ___ the chair.','on','under','in','between','A','1048'),

('A1','We go ___ school every day.','to','at','in','on','A','1049'),
('A1','Choose: We go ___ school every day.','at','to','in','on','B','1049'),
('A1','Complete: We go ___ school every day.','to','at','in','for','A','1049'),

('A1','I have two ___','brothers','brother','brotheres','broths','A','1050'),
('A1','Choose: I have two ___','brothers','brother','brotheres','broths','A','1050'),
('A1','Complete: I have two ___','brothers','brother','siblings','brotheres','A','1050');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES
('A2','I ___ to the gym twice a week.','go','goes','went','going','A','2001'),
('A2','Choose correct: I ___ to the gym twice a week.','goes','go','gone','went','B','2001'),
('A2','Complete: I ___ to the gym twice a week.','goes','went','go','going','B','2001'),

('A2','She ___ dinner when I arrived.','is cooking','was cooking','cooks','cooked','B','2002'),
('A2','Choose: She ___ dinner when I arrived.','cooked','was cooking','is cooking','cooks','B','2002'),
('A2','Complete: She ___ dinner when I arrived.','was cooking','cooked','is cooking','cooks','A','2002'),

('A2','They ___ in London since 2010.','live','lived','have lived','lives','C','2003'),
('A2','Choose: They ___ in London since 2010.','have lived','lived','live','lives','A','2003'),
('A2','Complete: They ___ in London since 2010.','live','have lived','lived','lives','B','2003'),

('A2','He doesn’t have ___ money.','many','much','few','little','B','2004'),
('A2','Choose: He doesn’t have ___ money.','much','many','some','any','A','2004'),
('A2','Complete: He doesn’t have ___ money.','many','much','few','some','B','2004'),

('A2','____ you ever been to Paris?','Have','Has','Did','Do','A','2005'),
('A2','Choose: ____ you ever been to Paris?','Have','Has','Did','Do','A','2005'),
('A2','Complete: ____ you ever been to Paris?','Have','Has','Did','Do','A','2005'),

('A2','I like ___ travel by train.','to','too','two','t','A','2006'),
('A2','Choose: I like ___ travel by train.','too','to','two','travell','B','2006'),
('A2','Complete: I like ___ travel by train.','to','too','two','travell','A','2006'),

('A2','She is ___ tallest in her class.','the','a','an','no article','A','2007'),
('A2','Choose: She is ___ tallest in her class.','tallest','the tallest','her tallest','the','B','2007'),
('A2','Complete: She is ___ tallest in her class.','the','a','no article','an','A','2007'),

('A2','I watched TV ___ I finished homework.','while','during','when','if','C','2008'),
('A2','Choose: I watched TV ___ I finished homework.','during','while','if','if','B','2008'),
('A2','Complete: I watched TV ___ I finished homework.','while','when','if','during','B','2008'),

('A2','He speaks English ___ than his brother.','good','better','well','best','B','2009'),
('A2','Choose: He speaks English ___ than his brother.','well','better','good','best','B','2009'),
('A2','Complete: He speaks English ___ than his brother.','better','well','good','best','A','2009'),

('A2','There ___ many people at the concert last night.','was','were','are','be','B','2010'),
('A2','Choose: There ___ many people at the concert last night.','were','was','are','is','A','2010'),
('A2','Complete: There ___ many people at the concert last night.','were','was','are','be','A','2010'),

('A2','I haven’t seen him ___ Monday.','since','for','from','by','A','2011'),
('A2','Choose: I haven’t seen him ___ Monday.','for','since','from','by','B','2011'),
('A2','Complete: I haven’t seen him ___ Monday.','since','for','from','by','A','2011'),

('A2','They ___ to the store before it closed.','have gone','had gone','went','go','B','2012'),
('A2','Choose: They ___ to the store before it closed.','had gone','have gone','went','gone','A','2012'),
('A2','Complete: They ___ to the store before it closed.','had gone','have gone','went','gone','A','2012'),

('A2','If I ___ time, I would travel more.','have','had','has','having','B','2013'),
('A2','Choose: If I ___ time, I would travel more.','had','have','has','having','A','2013'),
('A2','Complete: If I ___ time, I would travel more.','had','have','has','having','A','2013'),

('A2','It’s ___ cold outside than yesterday.','more','most','much','many','A','2014'),
('A2','Choose: It’s ___ cold outside than yesterday.','most','more','much','many','B','2014'),
('A2','Complete: It’s ___ cold outside than yesterday.','more','most','much','many','A','2014'),

('A2','Would you like ___ water?','some','any','a','the','A','2015'),
('A2','Choose: Would you like ___ water?','a','some','any','the','B','2015'),
('A2','Complete: Would you like ___ water?','some','any','a','the','A','2015'),

('A2','I’m looking ___ my keys.','for','at','to','in','A','2016'),
('A2','Choose: I’m looking ___ my keys.','at','for','to','in','B','2016'),
('A2','Complete: I’m looking ___ my keys.','for','at','to','in','A','2016'),

('A2','We ___ dinner when the phone rang.','had','were having','have','was having','B','2017'),
('A2','Choose: We ___ dinner when the phone rang.','were having','had','have','have had','A','2017'),
('A2','Complete: We ___ dinner when the phone rang.','were having','had','have','have had','A','2017'),

('A2','This is the ___ interesting film I’ve seen.','most','more','much','many','A','2018'),
('A2','Choose: This is the ___ interesting film I’ve seen.','more','most','much','many','B','2018'),
('A2','Complete: This is the ___ interesting film I’ve seen.','most','more','many','much','A','2018'),

('A2','She ___ just finished her homework.','has','have','had','does','A','2019'),
('A2','Choose: She ___ just finished her homework.','has','have','had','does','B','2019'),
('A2','Complete: She ___ just finished her homework.','has','have','had','does','A','2019'),

('A2','How long ___ you been here?','have','has','had','do','B','2020'),
('A2','Choose: How long ___ you been here?','has','have','had','do','A','2020'),
('A2','Complete: How long ___ you been here?','have','has','had','do','A','2020'),

('A2','He didn’t ___ meet her before.','used to','use to','used','using','A','2021'),
('A2','Choose: He didn’t ___ meet her before.','use to','used to','used','using','C','2021'),
('A2','Complete: He didn’t ___ meet her before.','used to','use to','used','using','A','2021'),

('A2','The movie was ___ than I expected.','more boring','bored','boring','most boring','A','2022'),
('A2','Choose: The movie was ___ than I expected.','bored','boring','more boring','most boring','C','2022'),
('A2','Complete: The movie was ___ than I expected.','more boring','boring','bored','most boring','A','2022'),

('A2','I’d like ___ a coffee, please.','to have','have','having','had','A','2023'),
('A2','Choose: I’d like ___ a coffee, please.','to have','have','having','had','A','2023'),
('A2','Complete: I’d like ___ a coffee, please.','to have','have','having','had','A','2023'),

('A2','I’m sorry ___ late.','for being','to be','for be','to being','A','2024'),
('A2','Choose: I’m sorry ___ late.','to be','for being','for be','to being','B','2024'),
('A2','Complete: I’m sorry ___ late.','for being','to be','being','to being','A','2024'),

('A2','They ___ already left by the time we arrived.','have','had','has','having','B','2025'),
('A2','Choose: They ___ already left by the time we arrived.','had','have','has','having','B','2025'),
('A2','Complete: They ___ already left by the time we arrived.','had','have','has','having','A','2025'),

('A2','What ___ your plans for next weekend?','are','is','do','does','A','2026'),
('A2','Choose: What ___ your plans for next weekend?','is','are','do','does','A','2026'),
('A2','Complete: What ___ your plans for next weekend?','are','is','do','does','A','2026'),

('A2','I can’t find my keys, I think I ___ them at home.','left','leaved','leave','has left','A','2027'),
('A2','Choose: I think I ___ my keys at home.','left','leave','leaved','leaving','A','2027'),
('A2','Complete: I think I ___ my keys at home.','left','leave','leaved','left them','A','2027'),

('A2','She enjoys ___ books in her free time.','read','reading','reads','reader','B','2028'),
('A2','Choose: She enjoys ___ books in her free time.','reading','read','reads','reader','A','2028'),
('A2','Complete: She enjoys ___ books in her free time.','reading','read','reads','reader','A','2028'),

('A2','We usually ___ lunch at 1 p.m.','have','has','having','had','A','2029'),
('A2','Choose: We usually ___ lunch at 1 p.m.','have','having','has','had','A','2029'),
('A2','Complete: We usually ___ lunch at 1 p.m.','have','has','having','had','A','2029'),

('A2','He ___ to music when I walked in.','listened','listens','listen','was listening','D','2030'),
('A2','Choose: He ___ to music when I walked in.','listened','listens','listening','was listening','D','2030'),
('A2','Complete: He ___ to music when I walked in.','was listening','listened','listens','listen','A','2030');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES
('A2','We haven’t seen that movie ___.','yet','already','still','just','A','2031'),
('A2','Choose: We haven’t seen that movie ___.','yet','already','just','still','A','2031'),
('A2','Complete: We haven’t seen that movie ___.','yet','already','just','still','A','2031'),

('A2','You must ___ a seat before the concert.','book','buy','call','make','A','2032'),
('A2','Choose: You must ___ a seat before the concert.','book','buy','make','call','A','2032'),
('A2','Complete: You must ___ a seat before the concert.','book','buy','call','make','A','2032'),

('A2','We arrived ___ time to catch the train.','in','on','at','with','A','2033'),
('A2','Choose: We arrived ___ time to catch the train.','on','in','at','with','B','2033'),
('A2','Complete: We arrived ___ time to catch the train.','in','on','at','with','A','2033'),

('A2','He’s not tall enough ___ reach the shelf.','to','for','at','in order','A','2034'),
('A2','Choose: He’s not tall enough ___ reach the shelf.','to','for','at','in','A','2034'),
('A2','Complete: He’s not tall enough ___ reach the shelf.','to','for','at','with','A','2034'),

('A2','They’re interested ___ learning Spanish.','in','on','to','for','A','2035'),
('A2','Choose: They’re interested ___ learning Spanish.','in','on','to','for','A','2035'),
('A2','Complete: They’re interested ___ learning Spanish.','in','on','to','for','A','2035'),

('A2','You should ___ your homework now.','do','make','made','have','A','2036'),
('A2','Choose: You should ___ your homework now.','do','make','have','done','A','2036'),
('A2','Complete: You should ___ your homework now.','do','make','have','did','A','2036'),

('A2','We didn’t go out ___ the rain.','because of','because','although','so','A','2037'),
('A2','Choose: We didn’t go out ___ the rain.','because','although','because of','so','C','2037'),
('A2','Complete: We didn’t go out ___ the rain.','because of','because','although','since','A','2037'),

('A2','The test was ___ than I expected.','easier','more easy','easy','easiest','A','2038'),
('A2','Choose: The test was ___ than I expected.','easier','easy','more easy','easiest','A','2038'),
('A2','Complete: The test was ___ than I expected.','easier','easy','easiest','more easy','A','2038'),

('A2','I’m not used to ___ early.','getting up','get up','gets up','got up','A','2039'),
('A2','Choose: I’m not used to ___ early.','get up','getting up','got up','gets up','B','2039'),
('A2','Complete: I’m not used to ___ early.','getting up','get up','gets up','got up','A','2039'),

('A2','He was late ___ the traffic.','because of','because','although','so','A','2040'),
('A2','Choose: He was late ___ the traffic.','because of','because','although','so','A','2040'),
('A2','Complete: He was late ___ the traffic.','because of','although','because','so','A','2040'),

('A2','My brother is ___ engineer.','an','a','the','no article','A','2041'),
('A2','Choose: My brother is ___ engineer.','a','an','the','no article','B','2041'),
('A2','Complete: My brother is ___ engineer.','an','a','the','no article','A','2041'),

('A2','The coffee is too ___ to drink.','hot','much','heat','hotter','A','2042'),
('A2','Choose: The coffee is too ___ to drink.','hot','heat','hotter','much','A','2042'),
('A2','Complete: The coffee is too ___ to drink.','hot','heat','hotter','much','A','2042'),

('A2','The hotel was ___ than we thought.','cheaper','cheap','cheapest','more cheap','A','2043'),
('A2','Choose: The hotel was ___ than we thought.','cheaper','cheap','cheapest','more cheap','A','2043'),
('A2','Complete: The hotel was ___ than we thought.','cheaper','cheap','cheapest','more cheap','A','2043'),

('A2','She has lived here ___ five years.','for','since','during','by','A','2044'),
('A2','Choose: She has lived here ___ five years.','for','since','during','by','A','2044'),
('A2','Complete: She has lived here ___ five years.','for','since','during','by','A','2044'),

('A2','We’ll go for a walk ___ it stops raining.','when','while','until','if','D','2045'),
('A2','Choose: We’ll go for a walk ___ it stops raining.','while','until','if','when','D','2045'),
('A2','Complete: We’ll go for a walk ___ it stops raining.','when','while','until','if','D','2045'),

('A2','I forgot ___ the window.','to close','close','closing','closed','A','2046'),
('A2','Choose: I forgot ___ the window.','to close','closing','closed','close','A','2046'),
('A2','Complete: I forgot ___ the window.','to close','closing','closed','close','A','2046'),

('A2','We’ll be late ___ we leave now.','unless','if','because','although','A','2047'),
('A2','Choose: We’ll be late ___ we leave now.','unless','although','if','because','A','2047'),
('A2','Complete: We’ll be late ___ we leave now.','unless','although','if','because','A','2047'),

('A2','She prefers coffee ___ tea.','to','than','over','instead','A','2048'),
('A2','Choose: She prefers coffee ___ tea.','to','than','instead','over','A','2048'),
('A2','Complete: She prefers coffee ___ tea.','to','than','instead','over','A','2048'),

('A2','He told me ___ quiet.','to be','be','being','been','A','2049'),
('A2','Choose: He told me ___ quiet.','to be','be','being','been','A','2049'),
('A2','Complete: He told me ___ quiet.','to be','be','being','been','A','2049'),

('A2','We’re thinking ___ moving to the countryside.','about','of','to','on','A','2050'),
('A2','Choose: We’re thinking ___ moving to the countryside.','about','to','on','in','A','2050'),
('A2','Complete: We’re thinking ___ moving to the countryside.','about','of','to','on','A','2050');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES
('B1','I wish I ___ more time yesterday.','have','had','would have','will have','B','3001'),
('B1','Choose: I wish I ___ more time yesterday.','had','have','would have','will have','A','3001'),
('B1','Complete: I wish I ___ more time yesterday.','had','would have','have','will have','A','3001'),

('B1','By the time she arrived, they ___ left.','will have','have already','had already','have','C','3002'),
('B1','Choose: By the time she arrived, they ___ left.','had already','have already','will have','had','A','3002'),
('B1','Complete: They ___ left when she arrived.','had already','have already','will have','had','A','3002'),

('B1','If I had known, I ___ told you.','would have','would','will have','had','A','3003'),
('B1','Choose: If I had known, I ___ told you.','would have','will have','had','would','A','3003'),
('B1','Complete: If I had known, I ___ told you.','would have','will have','had','would','A','3003'),

('B1','Despite ___ hard, he failed the exam.','study','studying','studied','to study','B','3004'),
('B1','Choose: Despite ___ hard, he failed the exam.','studying','study','studied','to study','A','3004'),
('B1','Complete: Despite ___ hard, he failed the exam.','studying','study','studied','to study','A','3004'),

('B1','They recommended ___ earlier.','start','starting','to start','started','C','3005'),
('B1','Choose: They recommended ___ earlier.','start','to start','starting','started','B','3005'),
('B1','Complete: They recommended ___ earlier.','starting','to start','start','started','A','3005'),

('B1','I prefer tea ___ coffee.','than','to','over','instead','B','3006'),
('B1','Choose: I prefer tea ___ coffee.','to','than','over','instead','A','3006'),
('B1','Complete: I prefer tea ___ coffee.','to','than','over','instead','A','3006'),

('B1','He is interested in ___ ancient history.','study','studying','studied','to study','B','3007'),
('B1','Choose: He is interested in ___ ancient history.','studying','study','studied','to study','A','3007'),
('B1','Complete: He is interested in ___ ancient history.','studying','study','studied','to study','A','3007'),

('B1','She ___ be working now—it’s 3 p.m.','must','should','may','might','A','3008'),
('B1','Choose: She ___ be working now—it’s 3 p.m.','might','must','should','may','B','3008'),
('B1','Complete: She ___ be working now—it’s 3 p.m.','must','might','should','may','A','3008'),

('B1','I suggest that she ___ at home more.','stay','stays','stayed','should stay','D','3009'),
('B1','Choose: I suggest that she ___ at home more.','should stay','stay','stays','stayed','A','3009'),
('B1','Complete: I suggest that she ___ at home more.','should stay','stay','stays','stayed','A','3009'),

('B1','He complained ___ the noise in the street.','about','of','on','for','A','3010'),
('B1','Choose: He complained ___ the noise in the street.','about','of','for','on','B','3010'),
('B1','Complete: He complained ___ the noise in the street.','about','of','for','on','A','3010'),

('B1','Unless you ___ earlier, you will be late.','left','leave','lefted','leave','B','3011'),
('B1','Choose: Unless you ___ earlier, you will be late.','leave','left','lefted','will leave','A','3011'),
('B1','Complete: Unless you ___ earlier, you will be late.','leave','left','lefted','will leave','A','3011'),

('B1','She’s used to ___ up early.','wake','waking','woken','wakes','B','3012'),
('B1','Choose: She’s used to ___ up early.','waking','wake','woken','wakes','A','3012'),
('B1','Complete: She’s used to ___ up early.','waking','wake','woken','wakes','A','3012'),

('B1','They’ll arrive before we ___ dinner.','have finished','finished','had finished','finish','A','3013'),
('B1','Choose: They’ll arrive before we ___ dinner.','have finished','finish','finished','had finished','B','3013'),
('B1','Complete: They’ll arrive before we ___ dinner.','have finished','finish','finished','had finished','A','3013'),

('B1','I would rather you ___ here tomorrow.','are','was','were','will be','C','3014'),
('B1','Choose: I would rather you ___ here tomorrow.','were','are','was','would be','A','3014'),
('B1','Complete: I would rather you ___ here tomorrow.','were','are','was','would be','A','3014'),

('B1','If she studied, she ___ pass the test.','would','will','would have','might','A','3015'),
('B1','Choose: If she studied, she ___ pass the test.','would','will','would have','might','A','3015'),
('B1','Complete: If she studied, she ___ pass the test.','would','will','would have','might','A','3015'),

('B1','Despite the rain, we ___ for a walk.','went','go','goes','gone','A','3016'),
('B1','Choose: Despite the rain, we ___ for a walk.','went','go','goes','gone','A','3016'),
('B1','Complete: Despite the rain, we ___ for a walk.','went','go','goes','gone','A','3016'),

('B1','We’re looking forward ___ our vacation.','to start','starting','to starting','start','A','3017'),
('B1','Choose: We’re looking forward ___ our vacation.','to start','starting','to starting','start','B','3017'),
('B1','Complete: We’re looking forward ___ our vacation.','to starting','to start','starting','start','A','3017'),

('B1','He had hardly ___ any sleep before the meeting.','got','having got','gotten','gets','A','3018'),
('B1','Choose: He had hardly ___ any sleep before the meeting.','gotten','got','has got','getting','A','3018'),
('B1','Complete: He had hardly ___ any sleep before the meeting.','got','gotten','has got','getting','A','3018'),

('B1','Neither of them ___ come to the party.','did','do','does','don\'t','D','3019'),
('B1','Choose: Neither of them ___ come to the party.','don\'t','did','does','do','D','3019'),
('B1','Complete: Neither of them ___ come to the party.','don\'t','did','does','do','A','3019'),

('B1','By next year I ___ written three chapters.','will have','have','had','will','A','3020'),
('B1','Choose: By next year I ___ written three chapters.','will have','have','had','will','A','3020'),
('B1','Complete: By next year I ___ written three chapters.','will have','have','had','will','A','3020'),

('B1','He speaks English more fluently ___ last year.','than','that','as','so','A','3021'),
('B1','Choose: He speaks English more fluently ___ last year.','than','that','as','so','A','3021'),
('B1','Complete: He speaks English more fluently ___ last year.','than','that','as','so','A','3021'),

('B1','I regret ___ that decision.','made','to make','making','will make','C','3022'),
('B1','Choose: I regret ___ that decision.','making','made','to make','will make','A','3022'),
('B1','Complete: I regret ___ that decision.','making','made','to make','will make','A','3022'),

('B1','She ___ live here since she was a child.','has been','had been','have been','is','A','3023'),
('B1','Choose: She ___ live here since she was a child.','has been','have been','had been','is','A','3023'),
('B1','Complete: She ___ live here since she was a child.','has been','have been','had been','is','A','3023'),

('B1','I don’t mind ___ the dishes.','doing','to do','did','do','A','3024'),
('B1','Choose: I don’t mind ___ the dishes.','doing','do','to do','did','A','3024'),
('B1','Complete: I don’t mind ___ the dishes.','doing','to do','do','did','A','3024'),

('B1','It’s time ___ bed.','for','go to','to go to','go','C','3025'),
('B1','Choose: It’s time ___ bed.','to go to','go','go to','for','A','3025'),
('B1','Complete: It’s time ___ bed.','to go to','go','go to','for','A','3025'),

('B1','He would rather I ___ earlier.','came','come','coming','comes','B','3026'),
('B1','Choose: He would rather I ___ earlier.','come','came','coming','comes','A','3026'),
('B1','Complete: He would rather I ___ earlier.','come','came','coming','comes','A','3026'),

('B1','If you had asked, I ___ helped you.','would have','might have','will have','had','A','3027'),
('B1','Choose: If you had asked, I ___ helped you.','would have','might have','will have','had','A','3027'),
('B1','Complete: I ___ helped you if you had asked.','would have','might have','will have','had','A','3027'),

('B1','The project was completed ___ time.','on','in','ahead of','by','C','3028'),
('B1','Choose: The project was completed ___ time.','ahead of','on','by','in','B','3028'),
('B1','Complete: It was completed ___ time.','ahead of','on','by','in','B','3028'),

('B1','She managed to finish the exam ___ time.','in','on','ahead of','by','D','3029'),
('B1','Choose: She managed to finish the exam ___ time.','ahead of','by','on','in','C','3029'),
('B1','Complete: She managed to finish ___ time.','ahead of','by','on','in','C','3029'),

('B1','___ he had studied, he passed the exam easily.','Although','Despite','Because','Though','A','3030'),
('B1','Choose: ___ he had studied, he passed the exam easily.','Although','Despite','Though','Because','A','3030'),
('B1','Complete: ___ he had studied, he passed the exam easily.','Although','Despite','Though','Because','A','3030');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES

('B1','I had my car ___ yesterday.','repaired','repair','repairing','repairs','A','3031'),
('B1','Choose: I had my car ___ yesterday.','repaired','repair','repairing','repairs','A','3031'),
('B1','Complete: I had my car ___ yesterday.','repaired','repair','repairing','repairs','A','3031'),

('B1','He said he ___ finish the report by Friday.','would','will','can','could','A','3032'),
('B1','Choose: He said he ___ finish the report by Friday.','will','would','can','could','B','3032'),
('B1','Complete: He said he ___ finish the report by Friday.','would','will','can','could','A','3032'),

('B1','She admitted ___ the window.','breaking','to break','broke','break','A','3033'),
('B1','Choose: She admitted ___ the window.','breaking','to break','broke','break','A','3033'),
('B1','Complete: She admitted ___ the window.','breaking','to break','broke','break','A','3033'),

('B1','I can’t help ___ when I watch that movie.','crying','to cry','cried','cry','A','3034'),
('B1','Choose: I can’t help ___ when I watch that movie.','crying','to cry','cried','cry','A','3034'),
('B1','Complete: I can’t help ___ when I watch that movie.','crying','to cry','cried','cry','A','3034'),

('B1','Let’s go out, ___?','shall we','will we','won’t we','shall','A','3035'),
('B1','Choose: Let’s go out, ___?','shall we','will we','won’t we','shall','A','3035'),
('B1','Complete: Let’s go out, ___?','shall we','will we','won’t we','shall','A','3035'),

('B1','He asked me where I ___ from.','came','come','had come','was coming','C','3036'),
('B1','Choose: He asked me where I ___ from.','came','come','had come','was coming','C','3036'),
('B1','Complete: He asked me where I ___ from.','came','come','had come','was coming','C','3036'),

('B1','We should have taken a map, we got ___.','lost','lose','losing','loses','A','3037'),
('B1','Choose: We should have taken a map, we got ___.','lost','lose','losing','loses','A','3037'),
('B1','Complete: We should have taken a map, we got ___.','lost','lose','losing','loses','A','3037'),

('B1','The book was so boring that I ___ it.','couldn’t finish','wouldn’t finish','didn’t finish','won’t finish','A','3038'),
('B1','Choose: The book was so boring that I ___ it.','couldn’t finish','didn’t finish','won’t finish','wouldn’t finish','A','3038'),
('B1','Complete: The book was so boring that I ___ it.','couldn’t finish','didn’t finish','won’t finish','wouldn’t finish','A','3038'),

('B1','You don’t have to come if you don’t ___.','want to','want','likes','like to','A','3039'),
('B1','Choose: You don’t have to come if you don’t ___.','want','want to','like to','likes','B','3039'),
('B1','Complete: You don’t have to come if you don’t ___.','want to','want','like to','likes','A','3039'),

('B1','The more you practice, the ___ you get.','better','good','best','well','A','3040'),
('B1','Choose: The more you practice, the ___ you get.','better','good','best','well','A','3040'),
('B1','Complete: The more you practice, the ___ you get.','better','good','best','well','A','3040'),

('B1','She ___ me she was tired.','told','said','says','tell','A','3041'),
('B1','Choose: She ___ me she was tired.','told','said','says','tell','A','3041'),
('B1','Complete: She ___ me she was tired.','told','said','says','tell','A','3041'),

('B1','There’s no point ___ about it now.','worrying','to worry','worry','worried','A','3042'),
('B1','Choose: There’s no point ___ about it now.','worrying','to worry','worry','worried','A','3042'),
('B1','Complete: There’s no point ___ about it now.','worrying','to worry','worry','worried','A','3042'),

('B1','He’s ___ to win the race.','likely','possible','certainly','perhaps','A','3043'),
('B1','Choose: He’s ___ to win the race.','likely','possible','certainly','perhaps','A','3043'),
('B1','Complete: He’s ___ to win the race.','likely','possible','certainly','perhaps','A','3043'),

('B1','You had better ___ home now.','go','to go','gone','going','A','3044'),
('B1','Choose: You had better ___ home now.','go','to go','gone','going','A','3044'),
('B1','Complete: You had better ___ home now.','go','to go','gone','going','A','3044'),

('B1','I regret not ___ the opportunity.','taking','take','taken','took','A','3045'),
('B1','Choose: I regret not ___ the opportunity.','taking','take','taken','took','A','3045'),
('B1','Complete: I regret not ___ the opportunity.','taking','take','taken','took','A','3045'),

('B1','It’s essential that she ___ on time.','arrive','arrives','arrived','arriving','A','3046'),
('B1','Choose: It’s essential that she ___ on time.','arrive','arrives','arrived','arriving','A','3046'),
('B1','Complete: It’s essential that she ___ on time.','arrive','arrives','arrived','arriving','A','3046'),

('B1','We were made ___ the floor.','to clean','clean','cleaned','cleaning','A','3047'),
('B1','Choose: We were made ___ the floor.','to clean','clean','cleaned','cleaning','A','3047'),
('B1','Complete: We were made ___ the floor.','to clean','clean','cleaned','cleaning','A','3047'),

('B1','He was accused of ___ the money.','stealing','to steal','stole','steal','A','3048'),
('B1','Choose: He was accused of ___ the money.','stealing','to steal','stole','steal','A','3048'),
('B1','Complete: He was accused of ___ the money.','stealing','to steal','stole','steal','A','3048'),

('B1','I’m not sure what she ___ by that.','meant','means','mean','is meaning','A','3049'),
('B1','Choose: I’m not sure what she ___ by that.','meant','means','mean','is meaning','A','3049'),
('B1','Complete: I’m not sure what she ___ by that.','meant','means','mean','is meaning','A','3049'),

('B1','She denied ___ anything wrong.','doing','do','to do','done','A','3050'),
('B1','Choose: She denied ___ anything wrong.','doing','do','to do','done','A','3050'),
('B1','Complete: She denied ___ anything wrong.','doing','do','to do','done','A','3050');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES
('B2','Hardly ___ had I sat down when the phone rang.','ever','even','just','scarcely','D','4001'),
('B2','Choose: Hardly ___ had I sat down when the phone rang.','even','just','ever','scarcely','D','4001'),
('B2','Complete: Hardly ___ had I sat down when the phone rang.','ever','even','just','scarcely','D','4001'),
('B2','He denied ___ anything wrong.','doing','to do','done','do','A','4002'),
('B2','Choose: He denied ___ anything wrong.','doing','done','to do','do','A','4002'),
('B2','Complete: He denied ___ anything wrong.','doing','done','to do','do','A','4002'),
('B2','It\'s high time you ___ home.','go','went','gone','going','B','4003'),
('B2','Choose: It\'s high time you ___ home.','went','go','gone','going','B','4003'),
('B2','Complete: It\'s high time you ___ home.','go','went','gone','going','B','4003'),
('B2','She wouldn’t have failed if she ___ harder.','studied','had studied','studies','was studying','B','4004'),
('B2','Choose: She wouldn’t have failed if she ___ harder.','studied','had studied','studies','was studying','B','4004'),
('B2','Complete: She wouldn’t have failed if she ___ harder.','studied','had studied','studies','was studying','B','4004'),
('B2','No sooner had I arrived ___ she started yelling.','than','when','that','then','A','4005'),
('B2','Choose: No sooner had I arrived ___ she started yelling.','than','when','that','then','A','4005'),
('B2','Complete: No sooner had I arrived ___ she started yelling.','than','when','that','then','A','4005'),
('B2','She speaks as if she ___ everything.','knows','knew','has known','know','B','4006'),
('B2','Choose: She speaks as if she ___ everything.','knew','knows','has known','know','B','4006'),
('B2','Complete: She speaks as if she ___ everything.','knew','knows','has known','know','B','4006'),
('B2','Scarcely had I left when it ___ to rain.','begin','began','had begun','begins','B','4007'),
('B2','Choose: Scarcely had I left when it ___ to rain.','began','begin','begins','had begun','B','4007'),
('B2','Complete: Scarcely had I left when it ___ to rain.','began','begin','begins','had begun','B','4007'),
('B2','Not only ___ he lie, but he also stole.','did','does','was','has','A','4008'),
('B2','Choose: Not only ___ he lie, but he also stole.','did','was','does','has','A','4008'),
('B2','Complete: Not only ___ he lie, but he also stole.','did','does','was','has','A','4008'),
('B2','She would have come if she ___ about it.','had known','knew','knows','has known','A','4009'),
('B2','Choose: She would have come if she ___ about it.','had known','knew','knows','has known','A','4009'),
('B2','Complete: She would have come if she ___ about it.','had known','knew','knows','has known','A','4009'),
('B2','Seldom ___ we seen such chaos.','have','had','do','are','A','4010'),
('B2','Choose: Seldom ___ we seen such chaos.','have','had','do','are','A','4010'),
('B2','Complete: Seldom ___ we seen such chaos.','have','had','do','are','A','4010'),
('B2','He acted as though he ___ nothing.','knew','knows','had known','knowing','A','4011'),
('B2','Choose: He acted as though he ___ nothing.','knew','knows','had known','knowing','A','4011'),
('B2','Complete: He acted as though he ___ nothing.','knew','knows','had known','knowing','A','4011'),
('B2','No matter how tired he was, he ___ up early.','would get','got','gets','was getting','A','4012'),
('B2','Choose: No matter how tired he was, he ___ up early.','would get','got','gets','was getting','A','4012'),
('B2','Complete: No matter how tired he was, he ___ up early.','would get','got','gets','was getting','A','4012'),
('B2','So difficult ___ the exam that nobody passed.','was','is','has been','were','A','4013'),
('B2','Choose: So difficult ___ the exam that nobody passed.','was','is','has been','were','A','4013'),
('B2','Complete: So difficult ___ the exam that nobody passed.','was','is','has been','were','A','4013'),
('B2','Had I known, I ___ you.','would have told','would tell','will have told','told','A','4014'),
('B2','Choose: Had I known, I ___ you.','would have told','would tell','will have told','told','A','4014'),
('B2','Complete: Had I known, I ___ you.','would have told','would tell','will have told','told','A','4014'),
('B2','Were he taller, he ___ be a model.','could','can','will','must','A','4015'),
('B2','Choose: Were he taller, he ___ be a model.','could','can','will','must','A','4015'),
('B2','Complete: Were he taller, he ___ be a model.','could','can','will','must','A','4015'),
('B2','Not until she arrived ___ the truth.','did we know','we knew','we had known','have we known','A','4016'),
('B2','Choose: Not until she arrived ___ the truth.','did we know','we knew','we had known','have we known','A','4016'),
('B2','Complete: Not until she arrived ___ the truth.','did we know','we knew','we had known','have we known','A','4016'),
('B2','Rarely ___ such a mistake.','does he make','he made','has he made','he makes','A','4017'),
('B2','Choose: Rarely ___ such a mistake.','does he make','he made','has he made','he makes','A','4017'),
('B2','Complete: Rarely ___ such a mistake.','does he make','he made','has he made','he makes','A','4017'),
('B2','So well ___ the team that they won easily.','did they play','played','play','have they played','A','4018'),
('B2','Choose: So well ___ the team that they won easily.','did they play','played','play','have they played','A','4018'),
('B2','Complete: So well ___ the team that they won easily.','did they play','played','play','have they played','A','4018'),
('B2','If only I ___ more careful.','had been','was','were','have been','A','4019'),
('B2','Choose: If only I ___ more careful.','had been','was','were','have been','A','4019'),
('B2','Complete: If only I ___ more careful.','had been','was','were','have been','A','4019'),
('B2','She insisted that he ___ present.','be','is','was','being','A','4020'),
('B2','Choose: She insisted that he ___ present.','be','is','was','being','A','4020'),
('B2','Complete: She insisted that he ___ present.','be','is','was','being','A','4020'),
('B2','He had to study hard ___ pass the exam.','to','for','in order to','so that','C','4021'),
('B2','Choose: He had to study hard ___ pass the exam.','in order to','to','for','so that','A','4021'),
('B2','Complete: He had to study hard ___ pass the exam.','in order to','to','for','so that','A','4021'),
('B2','I would rather you ___ at home tomorrow.','were','was','will be','are','A','4022'),
('B2','Choose: I would rather you ___ at home tomorrow.','were','was','will be','are','A','4022'),
('B2','Complete: I would rather you ___ at home tomorrow.','were','was','will be','are','A','4022');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES

('B2','I wish I ___ more confident.','am','was','were','be','C','4023'),
('B2','Choose: I wish I ___ more confident.','am','was','were','be','C','4023'),
('B2','Complete: I wish I ___ more confident.','am','was','were','be','C','4023'),
('B2','Had she left earlier, she ___ the train.','caught','would catch','would have caught','had caught','C','4024'),
('B2','Choose: Had she left earlier, she ___ the train.','would have caught','caught','had caught','would catch','C','4024'),
('B2','Complete: Had she left earlier, she ___ the train.','would have caught','caught','had caught','would catch','C','4024'),
('B2','Were it not for his advice, I ___ failed.','will have','might have','had','would','B','4025'),
('B2','Choose: Were it not for his advice, I ___ failed.','might have','would','will have','had','A','4025'),
('B2','Complete: Were it not for his advice, I ___ failed.','might have','would','will have','had','A','4025'),
('B2','Little ___ she know about the consequences.','did','does','has','was','A','4026'),
('B2','Choose: Little ___ she know about the consequences.','did','does','has','was','A','4026'),
('B2','Complete: Little ___ she know about the consequences.','did','does','has','was','A','4026'),
('B2','Supposing it ___ tomorrow, will we cancel?','rains','rain','rained','is raining','A','4027'),
('B2','Choose: Supposing it ___ tomorrow, will we cancel?','rains','rain','rained','is raining','A','4027'),
('B2','Complete: Supposing it ___ tomorrow, will we cancel?','rains','rain','rained','is raining','A','4027'),
('B2','Scarcely ___ had he started when it broke.','had','has','have','was','A','4028'),
('B2','Choose: Scarcely ___ had he started when it broke.','had','has','have','was','A','4028'),
('B2','Complete: Scarcely ___ had he started when it broke.','had','has','have','was','A','4028'),
('B2','No matter how much he tries, he ___ improve.','can’t','doesn’t','won’t','can','D','4029'),
('B2','Choose: No matter how much he tries, he ___ improve.','won’t','doesn’t','can’t','can','D','4029'),
('B2','Complete: No matter how much he tries, he ___ improve.','won’t','doesn’t','can’t','can','D','4029'),
('B2','She behaved as though she ___ everything.','knows','knew','had known','knowing','C','4030'),
('B2','Choose: She behaved as though she ___ everything.','had known','knew','knows','knowing','A','4030'),
('B2','Complete: She behaved as though she ___ everything.','had known','knew','knows','knowing','A','4030'),
('B2','The problem was solved ___ effort.','with','by','through','without','D','4031'),
('B2','Choose: The problem was solved ___ effort.','with','without','by','through','B','4031'),
('B2','Complete: The problem was solved ___ effort.','with','without','by','through','B','4031'),
('B2','Were you in my shoes, you ___ differently.','act','would act','acted','will act','B','4032'),
('B2','Choose: Were you in my shoes, you ___ differently.','would act','act','acted','will act','A','4032'),
('B2','Complete: Were you in my shoes, you ___ differently.','would act','act','acted','will act','A','4032'),
('B2','He had his car ___ yesterday.','repair','repaired','repairing','repairs','B','4033'),
('B2','Choose: He had his car ___ yesterday.','repaired','repair','repairing','repairs','A','4033'),
('B2','Complete: He had his car ___ yesterday.','repaired','repair','repairing','repairs','A','4033'),
('B2','___ he work harder, he would succeed.','Should','If','Were','Has','A','4034'),
('B2','Choose: ___ he work harder, he would succeed.','Should','If','Were','Has','A','4034'),
('B2','Complete: ___ he work harder, he would succeed.','Should','If','Were','Has','A','4034'),
('B2','I couldn’t help ___ when I heard the joke.','laugh','to laugh','laughing','laughed','C','4035'),
('B2','Choose: I couldn’t help ___ when I heard the joke.','laughing','laugh','to laugh','laughed','A','4035'),
('B2','Complete: I couldn’t help ___ when I heard the joke.','laughing','laugh','to laugh','laughed','A','4035');

INSERT INTO testnivel_questions (level, question, option_a, option_b, option_c, option_d, correct_option, variant_group_id) VALUES

('B2','If it hadn’t been for you, I ___ lost.','will be','would be','would have been','was','C','4036'),
('B2','Choose: If it hadn’t been for you, I ___ lost.','would have been','would be','will be','was','A','4036'),
('B2','Complete: If it hadn’t been for you, I ___ lost.','would have been','would be','will be','was','A','4036'),
('B2','Were I you, I ___ the job.','take','would take','took','takes','B','4037'),
('B2','Choose: Were I you, I ___ the job.','would take','take','took','takes','A','4037'),
('B2','Complete: Were I you, I ___ the job.','would take','take','took','takes','A','4037'),
('B2','I would rather you ___ more polite.','be','are','were','was','C','4038'),
('B2','Choose: I would rather you ___ more polite.','were','was','be','are','A','4038'),
('B2','Complete: I would rather you ___ more polite.','were','was','be','are','A','4038'),
('B2','He talks as if he ___ the boss.','is','were','was','being','B','4039'),
('B2','Choose: He talks as if he ___ the boss.','were','is','was','being','A','4039'),
('B2','Complete: He talks as if he ___ the boss.','were','is','was','being','A','4039'),
('B2','She acted as though nothing ___ happened.','had','have','has','had been','A','4040'),
('B2','Choose: She acted as though nothing ___ happened.','had','have','has','had been','A','4040'),
('B2','Complete: She acted as though nothing ___ happened.','had','have','has','had been','A','4040'),
('B2','You should have told me if you ___ help.','need','needed','had needed','have needed','C','4041'),
('B2','Choose: You should have told me if you ___ help.','had needed','needed','have needed','need','A','4041'),
('B2','Complete: You should have told me if you ___ help.','had needed','needed','have needed','need','A','4041'),
('B2','If she were here, she ___ us.','helps','would help','helped','will help','B','4042'),
('B2','Choose: If she were here, she ___ us.','would help','helps','helped','will help','A','4042'),
('B2','Complete: If she were here, she ___ us.','would help','helps','helped','will help','A','4042'),
('B2','Were they aware, they ___ done something.','have','will have','would have','would','C','4043'),
('B2','Choose: Were they aware, they ___ done something.','would have','would','have','will have','A','4043'),
('B2','Complete: Were they aware, they ___ done something.','would have','would','have','will have','A','4043'),
('B2','The report was finished ___ time.','at','on','in','by','D','4044'),
('B2','Choose: The report was finished ___ time.','by','in','on','at','A','4044'),
('B2','Complete: The report was finished ___ time.','by','in','on','at','A','4044'),
('B2','Were it not raining, we ___ out.','go','would go','gone','will go','B','4045'),
('B2','Choose: Were it not raining, we ___ out.','would go','go','gone','will go','A','4045'),
('B2','Complete: Were it not raining, we ___ out.','would go','go','gone','will go','A','4045'),
('B2','She looked as if she ___ seen a ghost.','has','had','have','having','B','4046'),
('B2','Choose: She looked as if she ___ seen a ghost.','had','has','have','having','A','4046'),
('B2','Complete: She looked as if she ___ seen a ghost.','had','has','have','having','A','4046'),
('B2','If he ___ earlier, he would have caught the train.','leaves','left','had left','leave','C','4047'),
('B2','Choose: If he ___ earlier, he would have caught the train.','had left','left','leaves','leave','A','4047'),
('B2','Complete: If he ___ earlier, he would have caught the train.','had left','left','leaves','leave','A','4047'),
('B2','___ I known, I would have come sooner.','Have','Had','Has','If','B','4048'),
('B2','Choose: ___ I known, I would have come sooner.','Had','Have','Has','If','A','4048'),
('B2','Complete: ___ I known, I would have come sooner.','Had','Have','Has','If','A','4048'),
('B2','You look as though you ___ something to say.','have','had','has','having','A','4049'),
('B2','Choose: You look as though you ___ something to say.','have','had','has','having','A','4049'),
('B2','Complete: You look as though you ___ something to say.','have','had','has','having','A','4049'),
('B2','If only she ___ the truth.','knows','knew','had known','has known','C','4050'),
('B2','Choose: If only she ___ the truth.','had known','knew','knows','has known','A','4050'),
('B2','Complete: If only she ___ the truth.','had known','knew','knows','has known','A','4050');

CREATE TABLE IF NOT EXISTS testnivel_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  level_result ENUM('A1', 'A2', 'B1', 'B2') NOT NULL,
  source VARCHAR(50) DEFAULT 'web',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
