import socket
from db_connection import get_db
from datetime import date
import errno
import logging


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

TIMEOUT = 15
HOST = '0.0.0.0'  
PORT = 8080  # default port 

def recv_with_timeout(conn, buffer_size=1024):
    """Utility function to receive data with timeout handling."""
    try:
        data = ''
        while True:
            part = conn.recv(buffer_size).decode()  
            data += part  
            logging.debug(f"Received part: {part}")  
            
            # If we receive the full message (ending with newline or similar)
            if part.endswith('\n') or part.strip():
                break  

            # If no data received, exit to avoid infinite loop
            if not part:
                break

        logging.debug(f"Full data received: {data.strip()}") 
        return data.strip()
    except socket.timeout:
        conn.sendall(f"Timeout: No response received within {TIMEOUT} seconds. Goodbye.\n".encode())
        conn.close()
        logging.error("Client timed out.")
        exit()

def find_available_port(start_port):
    """Try to bind to the given port, if it is occupied, increment the port number."""
    port = start_port
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(TIMEOUT)
                s.bind((HOST, port))
                logging.info(f"Successfully bound to port {port}.")  
                return port
        except OSError as e:
            if e.errno == errno.EADDRINUSE:
                logging.warning(f"Port {port} is already in use. Trying next port...")  
                port += 1  # Try the next port
            else:
                raise  

# Initialize database connection
db = get_db()

chosen_port = find_available_port(PORT)
logging.info(f"Server running on port {chosen_port}.")  
try:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind((HOST, chosen_port)) 
        except OSError as e:
            if e.errno == errno.EADDRINUSE:
                logging.error(f"Port {chosen_port} is already in use. Please use a different port.") 
                exit()
            else:
                raise

        s.listen()
        logging.info("Server listening...")  

        conn, addr = s.accept()
        with conn:
            logging.info(f"Connected by {addr}") 
            conn.settimeout(TIMEOUT)
            cursor = db.cursor()

            try:
                # Receive and verify member ID
                data = recv_with_timeout(conn)
                if data.isdigit():
                    member_id = int(data)
                    logging.debug(f"Received member ID: {member_id}")  

                    # Check if the member exists
                    cursor.execute("SELECT COUNT(*) FROM membre WHERE id_membre = %s", (member_id,))
                    if cursor.fetchone()[0] > 0:
                        cursor.execute("SELECT nom, prenom FROM membre WHERE id_membre = %s", (member_id,))
                        prenom, nom = cursor.fetchone()
                        conn.sendall(f"Welcome {prenom} {nom}".encode())

                        # Check the type of the member
                        cursor.execute(""" 
                            SELECT COUNT(*) FROM membre m 
                            JOIN Etudiant e ON m.id_membre = e.id_etudiant 
                        """)
                        type_membre = "student" if cursor.fetchone()[0] > 0 else "teacher"
                        QUOTA = 2 if type_membre == 'student' else 4
                    else:
                        conn.sendall("Invalid member ID. Please try again.".encode())
                        conn.close()
                        exit()
                
                # Handle borrowing requests
                while True:
                    # Checking the quota
                    cursor.execute("SELECT COUNT(*) from emprunt WHERE id_membre = %s and date_retour is NULL", (member_id,))
                    borrow_count = cursor.fetchone()[0]
                    borrows_left = QUOTA - borrow_count
                    conn.sendall(f"You have {borrows_left} borrows left\n".encode())

                    if borrows_left == 0:
                        logging.info("Member has reached borrow limit.")  
                        break

                    # Receive object ID
                    data = recv_with_timeout(conn)
                    if data.isdigit():
                        print(data)
                        object_id = int(data)
                        print(object_id)
                        logging.debug(f"Received object ID: {object_id}")  

                        # Check if object exists
                        cursor.execute(""" 
                            SELECT COUNT(*) 
                            FROM exemplaire 
                            WHERE id_exemplaire = %s
                        """, (object_id,))

                        if cursor.fetchone()[0] > 0:
                            cursor.execute(""" 
                                SELECT COUNT(e.*) 
                                FROM emprunt e 
                                WHERE e.id_exemplaire = %s AND e.date_retour is NULL
                            """, (object_id,))

                            if cursor.fetchone()[0] > 0:
                                conn.sendall("Database: object is already borrowed\n".encode())
                            else:
                                date_emprunt = date.today().strftime('%Y-%m-%d')
                                try:
                                    cursor.execute(
                                        "INSERT INTO emprunt (id_membre, id_exemplaire, date_emprunt, date_retour)"
                                        "VALUES (%s, %s, %s, %s)",
                                        (member_id, object_id, date_emprunt, None)
                                    )
                                    db.commit()
                                    conn.sendall("Borrowing success!\n".encode())
                                except Exception as e:
                                    logging.error(f"Database error: {e}")  
                                    conn.sendall("Server error: Could not process your request.\n".encode())
                        else:
                            conn.sendall("Invalid object ID. Please try again.\n".encode())
                    else:
                        conn.sendall("Invalid input format.\n".encode())

                    # Ask if the client wants to continue borrowing
                    choice = recv_with_timeout(conn).lower()
                    if choice == "no":
                        logging.info("Client ended session.")  
                        conn.sendall("Goodbye!\n".encode())
                        break

            except socket.error as sock_err:
                if sock_err.errno == 10054:
                    logging.warning("Client disconnected unexpectedly.")  
            except Exception as e:
                logging.error(f"Error processing request: {e}")  
                conn.sendall("Error processing your request. Please try again.\n".encode())

except Exception as e:
    logging.error(f"Server error: {e}")  
