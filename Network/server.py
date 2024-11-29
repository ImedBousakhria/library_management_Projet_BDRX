import socket
from Network.db_connection import get_db
from datetime import date

db = get_db()

HOST = '0.0.0.0'
PORT = 8005

try:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print("server listening, hi imed")
        conn, add = s.accept()
        with conn:
            print(f"connected by {add}")
            data = conn.recv(1024)
            data = data.decode()

            if "Hey server, it's me" in data:
                member_id = int(data.split()[-1])  
                print(f"Received member ID: {member_id}")

                cursor = db.cursor()
                cursor.execute("SELECT COUNT(*) FROM membre WHERE id_membre = %s", (member_id,))
                member_exists = cursor.fetchone()[0] > 0

                if member_exists:
                    response = "Ok, you truly are a member. Go ahead and input the object you want to borrow."
                else:
                    response = "Invalid member ID. Please try again."
                conn.sendall(response.encode())

                data = conn.recv(1024)
                data = data.decode()

                if "It's" in data:
                    object_id = int(data.split()[-1]) 
                    print(f"Received object ID: {object_id}")

                    cursor.execute("SELECT COUNT(*) FROM exemplaire WHERE id_exemplaire = %s", (object_id,))
                    object_exists = cursor.fetchone()[0] > 0

                    if object_exists:
                        date_emprunt = date.today().strftime('%Y-%m-%d')
                        query = "INSERT INTO emprunt (id_membre, id_objet, date_emprunt, date_retour) VALUES (%s, %s, %s, %s)"
                        try:
                            cursor.execute(query, (member_id, object_id, date_emprunt, date_emprunt))
                            db.commit()
                            response = "Borrowing success!"
                        except Exception as e:
                            print(f"Database query error: {e}")
                            response = "Server error: could not process your request."
                    else:
                        response = "Invalid object ID. Please try again."
                else:
                    response = "Invalid request. Please provide the correct object ID."

            else:
                response = "Invalid request format."

            conn.sendall(response.encode())

except Exception as e:
    print(f"Server error: {e}")
