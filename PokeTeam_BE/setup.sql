CREATE TABLE pokeUsers (
	id INTEGER AUTO_INCREMENT,
	username VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(40) NOT NULL UNIQUE,
	password VARCHAR(20) NOT NULL,
	pokemon1_id INTEGER,
	pokemon2_id INTEGER,
	pokemon3_id INTEGER,
	pokemon4_id INTEGER,
	pokemon5_id INTEGER,
	pokemon6_id INTEGER,
	profilePic VARCHAR(500),
	team_grade INTEGER,
	nbT_Rated INTEGER,
	PRIMARY KEY (id)
);