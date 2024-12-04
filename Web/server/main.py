from fastapi import FastAPI, Query, HTTPException, Body
from databases import Database
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List
import httpx

DATABASE_URL = "postgresql+asyncpg://postgres:feryel04@localhost:5432/postgres"
database = Database(DATABASE_URL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

URL_COVER_NOT_FOUND="https://via.placeholder.com/150x220.png?text=No+Cover+Available"

@app.get("/home")
async def get_best_books(
    langue: str = Query(None), 
    genre: str = Query(None)
):
    # The suggested books (most borrowed) with filters if specified
    query = """SELECT el.*, l.*, au.nom, au.prenom, count(*) as book_count 
        FROM exemplaire ex 
        JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        JOIN livre l ON el.id_element = l.id_livre
        JOIN ecrire ec ON ec.id_livre = l.id_livre
        JOIN auteur au ON au.id_auteur = ec.id_auteur
    """

    if langue:
        query += " AND el.langue = :langue "
    if genre:
        query += " AND el.genre = :genre "

    query += """group by l.id_livre, el.id_element, au.id_auteur
        ORDER BY book_count DESC
        LIMIT 20"""

    params = {}
    if langue:
        params["langue"] = langue
    if genre:
        params["genre"] = genre

    results = await database.fetch_all(query, values=params)

    enriched_books = []
    for book in results:
        title = book["titre"]  
        author = f"{book['prenom']} {book['nom']}"  
       
        cover_url = await fetch_book_cover(title, author)

        book_with_cover = dict(book)
        book_with_cover["cover_url"] = cover_url == cover_url if cover_url else URL_COVER_NOT_FOUND

        enriched_books.append(book_with_cover)

    return {"Books": enriched_books}


@app.get("/home/DVD")
async def get_best_DVD(
    langue: str = Query(None), 
    genre: str = Query(None)
):
    # The suggested DVDs (most borrowed) with filters if specified
    query = """SELECT el.*, d.*, count(*) as DVD_count 
        FROM exemplaire ex 
        JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        JOIN DVD d ON el.id_element = d.id_DVD 
    """

    if langue:
        query += " AND el.langue = :langue "
    if genre:
        query += " AND el.genre = :genre "

    query += """group by d.id_DVD, el.id_element
        ORDER BY DVD_count DESC
        LIMIT 20""" 
    params = {}
    if langue:
        params["langue"] = langue
    if genre:
        params["genre"] = genre

    results = await database.fetch_all(query, values=params)
    return {"DVDs": results}


@app.get("/home/{user_id}")
async def get_user(user_id: int):
    #user details 
    query = """
    SELECT * 
    FROM membre 
    WHERE id_membre = :user_id
    """
    params = {"user_id": user_id}

    results = await database.fetch_all(query, values=params)
    
 
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
 
    return {"user": results}


@app.get("/home/{user_id}/livres")
async def get_borrwed(user_id : int):
    #user details 
    query = """
        SELECT l.*, el.*, e.date_retour, e.date_emprunt FROM emprunt e 
        JOIN exemplaire ex ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        JOIN Livre l ON l.id_livre= el.id_element
        where id_membre = :user_id
        ORDER BY date_emprunt DESC;
    """
    params = {"user_id": user_id}

    results = await database.fetch_all(query, values=params)
    
 
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
 
    return {"books borrowed": results}


@app.get("/home/{user_id}/DVD")
async def get_borrwed(user_id : int):
    #user details 
    query = """
    SELECT d.*, el.*, e.date_retour, e.date_emprunt FROM emprunt e 
    JOIN exemplaire ex ON ex.id_exemplaire = e.id_exemplaire
    JOIN elements el ON el.id_element = ex.id_element
    JOIN DVD d ON d.id_DVD= el.id_element
    where id_membre = :user_id
    ORDER BY date_emprunt DESC;
    """
    params = {"user_id": user_id}

    results = await database.fetch_all(query, values=params)
    
 
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
 
    return {"DVDs Borrowed": results}



class LoginRequest(BaseModel):
    email: str
    password: str 



@app.post("/login")
async def login_user(login_data: LoginRequest):
    
    query = """
    SELECT *
    FROM membre m
    WHERE m.mail = :email
    """
    params = {"email": login_data.email}


    result = await database.fetch_one(query, values=params)

    if not result:
        print(f"User with email '{login_data.email}' not found.")
        raise HTTPException(status_code=404, detail="User not found")

    nom_user= result["nom"]
    id_user=result["id_membre"]

    expected_password = f"{nom_user}{id_user}"
    if expected_password !=login_data.password :
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return {"user_id": result["id_membre"]}



async def fetch_book_cover(title: str, author: str):
    api_url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}+inauthor:{author}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)
    print(response)
    if response.status_code == 200:
        data = response.json()
        if "items" in data and len(data["items"]) > 0:
            cover_url = data["items"][0]["volumeInfo"].get("imageLinks", {}).get("thumbnail")
            return cover_url
    return None
