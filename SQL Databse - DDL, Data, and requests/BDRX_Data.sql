-- Insert into Fournisseur
INSERT INTO Fournisseur (nom, telephone, adresse, mail) VALUES
('Alpha Supplies', '0123456789', '123 Rue Alpha, Paris', 'alpha@mail.com'),
('Beta Distribution', '0987654321', '456 Rue Beta, Lyon', 'beta@mail.com'),
('Gamma Imports', '0771234567', '789 Rue Gamma, Marseille', 'gamma@mail.com');

-- Insert into Membre
INSERT INTO Membre (nom, prenom, date_naissance, mail, telephone, code_postal, date_souscription) VALUES
('Dupont', 'Marie', '1990-05-12', 'marie.dupont@mail.com', '0612345678', '75001', '2024-11-19'),
('Bernard', 'Paul', '1985-08-22', 'paul.bernard@mail.com', '0623456789', '69001', '2024-11-19'),
('Lemoine', 'Alice', '2003-03-15', 'alice.lemoine@mail.com', '0634567890', '13001', '2024-11-20'),
('Morel', 'Jacques', '2000-10-05', 'jacques.morel@mail.com', '0645678901', '59000', '2024-11-20');

-- Insert into Etudiant
INSERT INTO Etudiant (id_etudiant, formation, niveau) VALUES
(3, 'Informatique', 'L3'),
(4, 'Mathematiques', 'M2');

-- Insert into Enseignant
INSERT INTO Enseignant (id_enseignant, specialite, department) VALUES
(1, 'Intelligence Artificielle', 'Informatique'),
(2, 'Statistiques', 'Mathematiques');

-- Insert into Elements
INSERT INTO Elements (type_element, titre, langue, date_publication, genre) VALUES
('Livre', 'SQL Basics', 'Francais', '2020-05-10', 'Informatique'),
('Livre', 'Advanced Python', 'Anglais', '2021-03-18', 'Programmation'),
('DVD', 'Learning AI', 'Francais', '2022-01-12', 'Documentaire'),
('DVD', 'Big Data Overview', 'Anglais', '2023-06-22', 'Education');

-- Insert into Auteur
INSERT INTO Auteur (nom, prenom, nationalite) VALUES
('Martin', 'Jean', 'Francaise'),
('Smith', 'Robert', 'Americaine');

-- Insert into Livre
INSERT INTO Livre (id_livre, editeur, nombre_page, collection, edition) VALUES
(1, 1, 'Reilly', 300, 'Series A', '3rd Edition'),
(2, 2, 'Packt', 400, 'Series B', '2nd Edition');

-- Insert into Ecrire
INSERT INTO Ecrire (id_auteur, id_livre) VALUES
(1, 1),
(2, 2);

-- Insert into DVD
INSERT INTO DVD (id_DVD, realisateur, produceur, duree, sous_titre, format_audio, classification_age) VALUES
(3, 'Jacques Martin', 'Studio X', 120, TRUE, 'Dolby', 12),
(4, 'Emily Carter', 'Studio Y', 90, FALSE, 'Stereo', 16);

-- Insert into Exemplaire
INSERT INTO Exemplaire (id_fournisseur, id_element, date_achat, localisation, prix_achat) VALUES
(1, 1, '2024-01-10', 'Bibliotheque Centrale', 25.50),
(1, 2, '2024-02-15', 'Section Informatique', 35.75),
(2, 3, '2024-03-20', 'Section Multimedia', 15.99),
(3, 4, '2024-04-25', 'Section DVD', 19.99);

-- Insert into Emprunt
INSERT INTO Emprunt (id_membre, id_exemeplaire, date_emprunt, date_retour) VALUES
(3, 1, '2024-11-15', '2024-11-18'),
(4, 2, '2024-11-16', NULL),
(3, 3, '2024-11-18', NULL);


--------------------------------------- PART 2 --------------------------------------------

-- Additional Fournisseur
INSERT INTO Fournisseur (nom, telephone, adresse, mail) VALUES
('Delta Books', '0775432167', '101 Rue Delta, Toulouse', 'delta@mail.com'),
('Epsilon Media', '0678943210', '202 Rue Epsilon, Bordeaux', 'epsilon@mail.com');

-- Additional Membre
INSERT INTO Membre (nom, prenom, date_naissance, mail, telephone, code_postal, date_souscription) VALUES
('Tremblay', 'Chloe', '1999-12-24', 'chloe.tremblay@mail.com', '0678901234', '31000', '2024-11-19'),
('Dubois', 'Lucas', '2001-06-30', 'lucas.dubois@mail.com', '0789012345', '33000', '2024-11-19'),
('Lambert', 'Emma', '1997-11-15', 'emma.lambert@mail.com', '0690123456', '34000', '2024-11-20'),
('Petit', 'Hugo', '2000-04-20', 'hugo.petit@mail.com', '0712345678', '35000', '2024-11-20');

-- Additional Etudiant
INSERT INTO Etudiant (id_etudiant, formation, niveau) VALUES
(5, 'Physique', 'L2'),
(6, 'Chimie', 'M1');

-- Additional Enseignant
INSERT INTO Enseignant (id_enseignant, specialite, department) VALUES
(7, 'Physique Quantique', 'Physique'),
(8, 'Chimie Organique', 'Chimie');

-- Additional Elements
INSERT INTO Elements (type_element, titre, langue, date_publication, genre) VALUES
('Livre', 'Data Science Fundamentals', 'Anglais', '2019-07-01', 'Data Science'),
('Livre', 'Understanding Chemistry', 'Francais', '2022-02-15', 'Education'),
('DVD', 'Physics for Beginners', 'Anglais', '2023-04-10', 'Documentaire'),
('DVD', 'The Wonders of Chemistry', 'Francais', '2023-09-20', 'Science');

-- Additional Auteur
INSERT INTO Auteur (nom, prenom, nationalite) VALUES
('Taylor', 'James', 'British'),
('Moreau', 'Claire', 'Francaise');

-- Additional Livre
INSERT INTO Livre (id_livre, editeur, nombre_page, collection, edition) VALUES
(5, 'Springer', 350, 'Data Insights', '1st Edition'),
(6, 'Hachette', 420, 'Chemical Knowledge', '4th Edition');

-- Additional Ecrire
INSERT INTO Ecrire (id_auteur, id_livre) VALUES
(3, 5),
(4, 6);

-- Additional DVD
INSERT INTO DVD (id_DVD, realisateur, produceur, duree, sous_titre, format_audio, classification_age) VALUES
(7, 'John Doe', 'Nature Films', 150, TRUE, '5.1 Surround', 8),
(8, 'Jane Roe', 'Chemistry Studio', 110, FALSE, 'Dolby', 12);

-- Additional Exemplaire
INSERT INTO Exemplaire (id_fournisseur, id_element, date_achat, localisation, prix_achat) VALUES
(4, 5, '2024-05-10', 'Section Data Science', 30.00),
(5, 6, '2024-06-15', 'Section Science', 40.00),
(4, 7, '2024-07-20', 'Section DVD', 25.50),
(5, 8, '2024-08-25', 'Section Documentary', 28.75);

-- Expanded Emprunt
INSERT INTO Emprunt (id_membre, id_exemeplaire, date_emprunt, date_retour) VALUES
(3, 5, '2024-11-15', NULL),
(4, 6, '2024-11-16', '2024-11-18'),
(5, 7, '2024-11-17', NULL),
(6, 8, '2024-11-18', NULL),
(7, 1, '2024-11-14', '2024-11-19'),
(8, 2, '2024-11-13', NULL),
(5, 3, '2024-11-19', NULL),
(6, 4, '2024-11-20', NULL),
(7, 5, '2024-11-10', '2024-11-15'),
(8, 6, '2024-11-11', '2024-11-14');
