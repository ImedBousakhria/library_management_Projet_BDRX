-- objets empruntés par membre
-- ex: books empruntés par Paul

SELECT l.* FROM exemplaire ex
JOIN emprunt e ON e.id_objet = ex.id_exemplaire
JOIN livre l ON ex.id_element = l.id_livre
JOIN membre m ON e.id_membre = m.id_membre
WHERE m.prenom = '?';


-- available books (general case: objects available)
SELECT  distinct l.* FROM  exemplaire ex
JOIN emprunt e ON ex.id_exemplaire = e.id_objet
JOIN  livre l ON ex.id_exemplaire = l.id_livre
WHERE e.date_retour is NOT NULL;


SELECT l.*, count(l.*) as book_count
FROM  exemplaire ex
JOIN emprunt e ON ex.id_exemplaire = e.id_objet
JOIN  livre l ON ex.id_exemplaire = l.id_livre
WHERE e.date_retour is NOT NULL
GROUP BY l.id_livre 


-- checks if a specific book is available (search)
SELECT el.titre 
FROM  exemplaire ex
JOIN emprunt e ON ex.id_exemplaire = e.id_objet
JOIN  livre l ON ex.id_exemplaire = l.id_livre
JOIN elements el ON el.id_element = l.id_livre
WHERE el.titre like '?' 
AND e.date_retour is not NULL;
-- 9: Insert after emprunt done
-- 10: Retour update date_retour
-- 4 Count the number of books written by each author
-- 5 Retrieve the latest purchased items
-- 6 List students in a specific formation and level
-- 7 Calculate the average price of items purchased
-- 8 Find all elements published in a specific language and genre