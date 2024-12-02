CREATE TYPE niveau_enum AS ENUM ('L1', 'L2', 'L3', 'M1', 'M2', 'PhD');

CREATE TABLE IF NOT EXISTS Fournisseur (
    id_fournisseur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    adresse TEXT NOT NULL,
    mail VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Membre (
    id_membre SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL CHECK (date_naissance <= CURRENT_DATE - INTERVAL '5 years'),
    mail VARCHAR(100) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    date_souscription DATE NOT NULL CHECK (date_souscription BETWEEN '2024-11-19' AND CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS Etudiant (
    id_etudiant SERIAL PRIMARY KEY,
    formation VARCHAR(50) NOT NULL,
    niveau niveau_enum NOT NULL,
    Foreign KEY (id_etudiant) REFERENCES Membre(id_membre)
);

CREATE TABLE IF NOT EXISTS Enseignant (
    id_enseignant SERIAL PRIMARY KEY,
    specialite VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    Foreign KEY(id_enseignant) REFERENCES Membre(id_membre)
);

CREATE TABLE IF NOT EXISTS Elements (
    id_element SERIAL PRIMARY KEY,
    type_element VARCHAR(50) NOT NULL,
    titre VARCHAR(200) NOT NULL,
    langue VARCHAR(50) NOT NULL,
    date_publication DATE NOT NULL CHECK (date_publication <= CURRENT_DATE),
    genre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Auteur (
    id_auteur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    nationalite VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Livre (
    id_livre INT PRIMARY KEY,
    editeur VARCHAR(100) NOT NULL,
    nombre_page INT NOT NULL,
    collection VARCHAR(100),
    edition VARCHAR(50),
    Foreign KEY (id_livre) REFERENCES Elements(id_element)   
);

CREATE TABLE IF NOT EXISTS Ecrire (
    id_auteur INT NOT NULL,
    id_livre INT NOT NULL,
    Foreign Key (id_auteur) REFERENCES Auteur(id_auteur),
    Foreign Key (id_livre) REFERENCES Livre(id_livre),
    Primary key (id_auteur, id_livre)
);

CREATE TABLE IF NOT EXISTS DVD (
    id_DVD INT PRIMARY KEY,
    realisateur VARCHAR(100) NOT NULL,
    produceur VARCHAR(100) NOT NULL,
    duree INT NOT NULL,
    sous_titre BOOLEAN NOT NULL,
    format_audio VARCHAR(50) NOT NULL,
    classification_age INT NOT NULL,
    Foreign Key (id_DVD) REFERENCES Elements(id_element)
);

CREATE TABLE IF NOT EXISTS Exemplaire (
    id_exemplaire SERIAL PRIMARY KEY,
    id_fournisseur INT NOT NULL,
    id_element INT NOT NULL,
    date_achat DATE NOT NULL CHECK (date_achat <= CURRENT_DATE),
    localisation VARCHAR(100) NOT NULL,
    prix_achat NUMERIC(10, 2) NOT NULL,
    Foreign Key (id_fournisseur) REFERENCES Fournisseur(id_fournisseur),
    Foreign Key (id_element) REFERENCES Elements(id_element)
);

CREATE TABLE IF NOT EXISTS Emprunt (
    id_emprunt SERIAL,
    id_membre INT NOT NULL,
    id_exemplaire INT NOT NULL,
    date_emprunt DATE NOT NULL CHECK (date_emprunt <= CURRENT_DATE),
    date_retour DATE,
    Primary Key (id_membre, id_exemplaire, id_emprunt),
    Foreign Key (id_membre) references Membre(id_membre),
    Foreign Key (id_exemplaire) references Exemplaire(id_exemplaire)
);
