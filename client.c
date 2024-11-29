#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h>
#include <ws2tcpip.h>

#define PORT 8001

int main() {
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printf("WSAStartup failed: %d\n", WSAGetLastError());
        return -1;
    }

    int sock = 0, valread;
    struct sockaddr_in serv_addr;
    int memberID = 123;
    int objectID = 456;
    char buffer[1024] = {0};

    // Socket creation
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        printf("\nError in socket creation\n");
        return -1;
    }

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);

    if (inet_pton(AF_INET, "10.40.59.151", &serv_addr.sin_addr) <= 0) {
        printf("\nInvalid IP address\n");
        return -1;
    }

    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        printf("\nConnection failed\n");
        return -1;
    }

    char request[256];
    sprintf(request, "ID: %d; OBJECT: %d", memberID, objectID);
    send(sock, request, strlen(request), 0);
    printf("Borrow request sent: %s\n", request);

    valread = recv(sock, buffer, 1024, 0);
    printf("Server response: %s\n", buffer);

    closesocket(sock);
    WSACleanup();

    return 0;
}
