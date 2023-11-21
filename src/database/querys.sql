
-- creacion del usuario
CREATE USER 'admin_tenis'@'localhost' IDENTIFIED VIA mysql_native_password USING '***';GRANT ALL PRIVILEGES ON *.* TO 'admin_tenis'@'localhost' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;



-- creacion de la base de datos
CREATE DATABASE admin_tenis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- creacion de la tabla usuarios especificando el id autoincrementable y unico, un nombre y un rol que puede tomar dos valores, admin y user
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'user') NOT NULL,
    contrasena VARCHAR(255) NOT NULL -- Agregada para almacenar contraseñas
    --correo VARCHAR(255) NOT NULL
);


ALTER TABLE `usuarios` ADD `correo` VARCHAR(255) NOT NULL AFTER `contrasena`, ADD UNIQUE `correo` (`correo`(255));




CREATE TABLE torneos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    tipo_torneo ENUM('regular', 'escalera') NOT NULL,
    rama ENUM('masculina', 'femenina', 'mixta') NOT NULL,
    modalidad ENUM('singles', 'dobles') NOT NULL,
    cantidad_grupos INT NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    configuracion_sets JSON NOT NULL,
    fase_actual ENUM('grupos', 'octavos', 'cuartos', 'semifinales', 'final') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);


CREATE TABLE jugadores (
    --id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rama ENUM('masculina', 'femenina', 'mixta') NOT NULL,
    categoria ENUM('A', 'B+', 'B', 'C+', 'C', 'D') NOT NULL,
    ranking INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE parejas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jugador1_id INT NOT NULL,
    jugador2_id INT NOT NULL,
    torneo_id INT NOT NULL,
    FOREIGN KEY (jugador1_id) REFERENCES jugadores(id),
    FOREIGN KEY (jugador2_id) REFERENCES jugadores(id),
    FOREIGN KEY (torneo_id) REFERENCES torneos(id)
);




CREATE TABLE partidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    torneo_id INT NOT NULL,
    fase ENUM('grupos', 'octavos', 'cuartos', 'semifinales', 'final') NOT NULL,
    participante1_id INT,
    participante2_id INT,
    resultado VARCHAR(255),
    fecha DATE,
    FOREIGN KEY (torneo_id) REFERENCES torneos(id),
    FOREIGN KEY (participante1_id) REFERENCES jugadores(id),
    FOREIGN KEY (participante2_id) REFERENCES jugadores(id)
);


