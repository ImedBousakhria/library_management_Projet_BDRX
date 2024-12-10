from fastapi import FastAPI, Query, HTTPException, Body
from databases import Database
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import httpx
from typing import Optional

DATABASE_URL = "postgresql+asyncpg://feryel:FeryelBoubeker04%23@postgresql-feryel.alwaysdata.net:5432/feryel_projetbd_rx"
database = Database(DATABASE_URL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

# Allow CORS for all origins or specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify the frontend origin here
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


DVD_API_KEY="5e31138282e013cbcde5ae8adb5205b1"
URL_COVER_NOT_FOUND="https://via.placeholder.com/150x220.png?text=No+Cover+Available"

@app.get("/home")
async def get_best_books(
    langue: str = Query(None), 
    genre: str = Query(None),
    recherche: str = Query(None)
):
    # The suggested books (most borrowed from the table emprunt) 

    query = """SELECT el.*, l.*, au.nom, au.prenom, count(*) as book_count 
        FROM exemplaire ex 
        JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        JOIN livre l ON el.id_element = l.id_livre
        JOIN ecrire ec ON ec.id_livre = l.id_livre
        JOIN auteur au ON au.id_auteur = ec.id_auteur
        group by l.id_livre, el.id_element, au.id_auteur
        ORDER BY book_count DESC
        LIMIT 20
    """
    # the alternative query is search in all the books with filters if specified 
    alt_query="""
       SELECT el.*, l.*, au.nom, au.prenom
		FROM elements el 
        JOIN livre l ON el.id_element = l.id_livre
        JOIN ecrire ec ON ec.id_livre = l.id_livre
        JOIN auteur au ON au.id_auteur = ec.id_auteur
    """
    if langue:
        alt_query += " AND el.langue = :langue "
    if genre:
        alt_query += " AND el.genre = :genre "
    if recherche:
        alt_query += " AND el.titre ILIKE :recherche "
    

    params = {}
    if langue:
        params["langue"] = langue
    if genre:
        params["genre"] = genre
    if recherche:
        params["recherche"] = f"%{recherche}%"


    query = alt_query if langue or genre or recherche else query

    results = await database.fetch_all(query, values=params)

    # adding the url for the book cover from a API 
    enriched_books = []
    for book in results:
        title = book["titre"]  
        author = f"{book['prenom']} {book['nom']}"  
       
        cover_url = await fetch_book_cover(title, author)

        book_with_cover = dict(book)
        book_with_cover["cover_url"] = cover_url  if cover_url else URL_COVER_NOT_FOUND

        enriched_books.append(book_with_cover)

    return {"Books": enriched_books}


@app.get("/home/DVD")
async def get_best_DVD(
    langue: str = Query(None), 
    genre: str = Query(None),
    recherche: str = Query(None)
):
    # The suggested DVDs (most borrowed from the table emprunt) 
    query = """SELECT el.*, d.*, count(*) as DVD_count 
        FROM exemplaire ex 
        JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        JOIN DVD d ON el.id_element = d.id_DVD 
        group by d.id_DVD, el.id_element
        ORDER BY DVD_count DESC
        LIMIT 20
    """
    # the alternative query is for searching in all the DVDs with filters if specified
    alt_query="""
       SELECT el.*, d.*
		FROM elements el 
        JOIN DVD d ON el.id_element = d.id_DVD
    """
    if langue:
        alt_query += " AND el.langue = :langue "
    if genre:
        alt_query += " AND el.genre = :genre "
    if recherche:
        alt_query += " AND el.titre ILIKE :recherche "


    params = {}
    if langue:
        params["langue"] = langue
    if genre:
        params["genre"] = genre
    if recherche:
        params["recherche"] = f"%{recherche}%"
    
    query = alt_query if langue or genre or recherche else query
    results = await database.fetch_all(query, values=params)

    #adding the DVD posters from an API 
    enriched_DVDs= []
    for DVD in results:
        title = DVD["titre"] 

        cover_url = await fetch_DVD_cover(title)

        DVD_with_cover = dict(DVD)
        DVD_with_cover["cover_url"] = cover_url

        enriched_DVDs.append(DVD_with_cover)

    return {"DVDs": enriched_DVDs}


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


@app.get("/home/{user_id}/borrows")
async def get_borrowed_books(user_id : int):
    #user details 
    query = """
        SELECT el.*, e.date_retour, e.date_emprunt FROM emprunt e 
        JOIN exemplaire ex ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        where id_membre = :user_id
        ORDER BY date_emprunt DESC;
    """
    params = {"user_id": user_id}

    results = await database.fetch_all(query, values=params)
    
 
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
 
    return {"borrows": results}



class LoginRequest(BaseModel):
    email: str
    password: str 


#the login endpoint 
@app.post("/login")
async def login_user(login_data: LoginRequest):
    #cheking the email exists in the database
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
    #the password is the name+id 
    expected_password = f"{nom_user}{id_user}"
    if expected_password !=login_data.password :
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return {"user_id": result["id_membre"]}

 
#fetching the books covers
async def fetch_book_cover(title: str, author: str):
    api_url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}+inauthor:{author}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)
    if response.status_code == 200:
        data = response.json()
        if "items" in data and len(data["items"]) > 0:
            cover_url = data["items"][0]["volumeInfo"].get("imageLinks", {}).get("thumbnail")
            return cover_url
    return None    

#fetching DVD posters 
async def fetch_DVD_cover(title):
    api_url=f"https://api.themoviedb.org/3/search/movie?api_key={DVD_API_KEY}&query={title}"

    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)
    if response.status_code == 200:
        data = response.json()
        if data["results"]:
            poster_path = data["results"][0]["poster_path"]
            if poster_path:
                full_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                return full_url   
    return None

@app.get("/api/BookCategories")
async def get_book_categories():
    query="""select DISTINCT genre from elements"""
        
    result = await database.fetch_all(query)
    return result



# Existing imports and setup...

class UpdateUserRequest(BaseModel):
    email: Optional[str] = Field(None, description="User's email address")
    tel: Optional[str] = Field(None, description="User's telephone number")
    code_postale: Optional[str] = Field(None, description="User's postal code")

@app.put("/home/{user_id}")
async def update_user_info(user_id: int, user_data: UpdateUserRequest):
    """
    update user's email, telephone, and code postale.
    """
    # Check if the user exists
    check_query = """
    SELECT *
    FROM membre
    WHERE id_membre = :user_id
    """
    params = {"user_id": user_id}
    existing_user = await database.fetch_one(check_query, values=params)

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # adding the fields if provided
    update_fields = []
    update_values = {"user_id": user_id}

    if user_data.email is not None:
        update_fields.append("mail = :email")
        update_values["email"] = user_data.email
    if user_data.tel is not None:
        update_fields.append("telephone = :tel")
        update_values["tel"] = user_data.tel
    if user_data.code_postale is not None:
        update_fields.append("code_postal = :code_postale")
        update_values["code_postale"] = user_data.code_postale

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    update_query = f"""
    UPDATE membre
    SET {', '.join(update_fields)}
    WHERE id_membre = :user_id
    """

    await database.execute(update_query, values=update_values)

    return {"message": "User information updated successfully"}

