import socket

HOST = '0.0.0.0'
PORT = 8001


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print("server listening, hi imed")
    conn, add= s.accept()
    with conn:
        print(f"connected by {add}")
        data= conn.recv(1024)
        
        data= data.decode()
        if "ID" in data and "OBJECT" in data:
            response= "borowing success" 
            print(data)
            
        else:
            response= "invalid request " 
               
        conn.sendall(response.encode())
        
    
