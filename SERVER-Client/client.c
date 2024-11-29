#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 8001

int main(){
    int sock = 0, valread;
    struct sockaddr_in serv_addr;
    int memberID = 123;
    int objectID = 456;
    char buffer[1024] = {0};
    
    // socket creation
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
    printf("\n error in socket creation");
    return -1;
    }
    
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
    
    
    if (inet_pton(AF_INET, "10.40.59.151", &serv_addr.sin_addr) <= 0) {
        printf("\n invalid IPaddress");
        return -1;    
        }
        
    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
    printf("\n connection failed");
    return -1;
    }
    
    char request[256];
    sprintf(request, "ID: %d; OBJECT:%d", memberID, objectID);
    send(sock, request, strlen(request), 0);
    printf("Borrow request sent: %s\n", buffer);
    
    valread = read(sock, buffer, 1024);
    printf("Server respoonse: %s\n", buffer);
    close(sock);
    return 0;
}


