-- Livres emprunté par un membre spécifique
--Intérêt : affiché à un client tous les livres qu'il a emprunté (historique) 


SELECT l.* FROM exemplaire ex 
JOIN emprunt e ON e.id_exemplaire = ex.id_exemplaire 
JOIN livre l ON ex.id_element = l.id_livre 
JOIN membre m ON e.id_membre = m.id_membre 
WHERE m.id_membre = 1;


-- Livres emprunté par un membre spécifique et non retourné 
SELECT l.* FROM exemplaire ex 
JOIN emprunt e ON e.id_exemplaire = ex.id_exemplaire 
JOIN livre l ON ex.id_element = l.id_livre 
JOIN membre m ON e.id_membre = m.id_membre 
WHERE m.id_membre = 1 AND e.date_retour is Null;

-- Exemplaire Non disponible 
--Si un exemplaire est déjà emprunter 
-- Intérêt: vérifier la disponibilité avant l’emprunt 

SELECT l.*, count(l.*) as book_count 
FROM exemplaire ex 
JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire 
JOIN livre l ON ex.id_exemplaire = l.id_livre 
GROUP BY l.id_livre

--Calculer le prix moyen des exemplaires de chaque élément
SELECT el.type_element, AVG(prix_achat)
FROM elements el
JOIN exemplaire ex ON ex.id_element = el.id_element
GROUP BY el.type_element

--Les livres les plus emprunter (count et group by)
--Intérêt: recommandé au membre dans la page web par exemple

SELECT l.*, count(l.*) as book_count 
FROM exemplaire ex 
JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire 
JOIN livre l ON ex.id_exemplaire = l.id_livre 
group by l.id_livre

--Si un livre ( ou au moins une copie du livre ) est disponible 
--Intérêt: une recherche dans la page web 

SELECT el.titre FROM exemplaire ex 
JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire 
JOIN livre l ON ex.id_exemplaire = l.id_livre 
JOIN elements el ON el.id_element = l.id_livre 
WHERE el.titre like 'Data Science Fundamentals' 
AND e.date_retour is not NULL;


--Nombre de livres écrits par chaque auteur
SELECT a.nom, COUNT(a.*) 
FROM Livre l
JOIN Ecrire e ON l.id_livre = e.id_livre 
JOIN Auteur a ON e.id_auteur = a.id_auteur 
GROUP BY a.id_auteur


--Lister les étudiants dans une formation et un niveau spécifiques
SELECT et.* , m.prenom, m.nom
FROM etudiant et
JOIN membre m ON m.id_membre = et.id_etudiant
WHERE et.formation like '%Info%'
AND et.niveau = 'L3'



-- Trouver tous les livres publiés dans une langue et un genre spécifiques.
SELECT el.*
FROM Elements el
JOIN livre l ON l.id_livre = el.id_element
WHERE langue = 'Anglais'
AND genre = 'Programmation'



--Liste des membres ayant emprunté un livre au moins
SELECT m.nom AS membre_nom,  m.prenom AS membre_prenom
FROM Membre m
WHERE 
    m.id_membre IN (
        SELECT em.id_membre
        FROM Emprunt em
        JOIN Exemplaire ex ON em.id_exemplaire = ex.id_exemplaire
        JOIN Elements e ON ex.id_element = e.id_element
        WHERE e.type_element = 'Livre'
    );

