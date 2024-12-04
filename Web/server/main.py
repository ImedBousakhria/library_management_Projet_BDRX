from fastapi import FastAPI, Query, HTTPException
from databases import Database
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "postgresql+asyncpg://postgres:123456@localhost:5432/newDB"
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


@app.get("/home")
async def get_best_books(
    langue: str = Query(None), 
    genre: str = Query(None)
):
    # The suggested books (most borrowed) with filters if specified
    query = """SELECT el.*, l.*, count(*) as book_count 
        FROM exemplaire ex 
        JOIN emprunt e ON ex.id_exemplaire = e.id_exemplaire
        JOIN elements el ON el.id_element = ex.id_element
        JOIN livre l ON el.id_element = l.id_livre 
    """

    if langue:
        query += " AND el.langue = :langue "
    if genre:
        query += " AND el.genre = :genre "

    query += """group by l.id_livre, el.id_element
        ORDER BY book_count DESC
        LIMIT 20"""

    params = {}
    if langue:
        params["langue"] = langue
    if genre:
        params["genre"] = genre


    results = await database.fetch_all(query, values=params)
    return {"Books": results}


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
async def get_borrowed_books(user_id : int):
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
async def get_borrowed_DVDs(user_id : int):
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
