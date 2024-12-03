import psycopg2



def get_db():
    conn_params={
    'dbname': 'postgres',
    'user': 'postgres',
    'password' : 'feryel04',
    'host' : 'localhost',
    'port' : '5432'
    }

    """conn_params={
    'dbname': 'newDB',
    'user': 'postgres',
    'password' : '123456',
    'host' : 'localhost',
    'port' : '5432'
    }"""


    try:
        conn=psycopg2.connect(**conn_params)
        print("Database connection is established !!!")
        return conn
    except psycopg2.Error as e:
        print(f"Error in the connection : {e}")
        return None 
    

