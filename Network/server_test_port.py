import socket
from db_connection import get_db
from datetime import date

# Initialize database connection
db = get_db()

# Server configuration
HOST = '0.0.0.0'
PORT = 1

try:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print("Server listening...")

        # Wait for a client to connect
        conn, addr = s.accept()
        with conn:
            print(f"Connected by {addr}")
            cursor = db.cursor()

            # Step 1: Receive and verify member ID
            data = conn.recv(1024).decode()
            if data:
                member_id = int(data.strip())
                print(f"Received member ID: {member_id}")
                # Check if the member exists
                cursor.execute("SELECT COUNT(*) FROM membre WHERE id_membre = %s", (member_id,))
                if cursor.fetchone()[0] > 0:

                    conn.sendall("Ok, you truly are a member".encode())
                    # Check the type of the member 
                    cursor.execute("SELECT COUNT(*) FROM membre m JOIN Etudiant e ON m.id_membre = e.id_etudiant")
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
                conn.sendall(f"you have {borrows_left} borrows left\n".encode())

                if borrows_left == 0:
                    print("Member has reached borrow limit.")
                    break

                # Receive object ID
                data = conn.recv(1024).decode().strip()
                if data.isdigit():
                    object_id = int(data)
                    print(f"Received object ID: {object_id}")
                    # Check if object exists
                    cursor.execute("SELECT COUNT(*) FROM exemplaire WHERE id_exemplaire = %s", (object_id,))
                    if cursor.fetchone()[0] > 0:
                        date_emprunt = date.today().strftime('%Y-%m-%d')
                        try:
                            cursor.execute(
                                "INSERT INTO emprunt (id_membre, id_objet, date_emprunt, date_retour) "
                                "VALUES (%s, %s, %s, %s)",
                                (member_id, object_id, date_emprunt, None)
                            )
                            db.commit()
                            conn.sendall("Borrowing success!\n".encode())
                        except Exception as e:
                            print(f"Database error: {e}")
                            conn.sendall("Server error: Could not process your request.\n".encode())
                    else:
                        conn.sendall("Invalid object ID. Please try again.\n".encode())
                else:
                    conn.sendall("Invalid input format.\n".encode())

                # Ask if the client wants to continue borrowing
                choice = conn.recv(1024).decode().strip().lower()
                if choice == "no":
                    print("Client ended session.")
                    conn.sendall("Goodbye!\n".encode())
                    break

except Exception as e:
    print(f"Server error: {e}")
