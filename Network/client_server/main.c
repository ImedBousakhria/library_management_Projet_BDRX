#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h> // Windows-specific
#include <ws2tcpip.h> // For inet_pton and other functions

#pragma comment(lib, "ws2_32.lib") // Link with Winsock library

#define PORT 8005

int main() {
    WSADATA wsa;
    SOCKET sock = INVALID_SOCKET;
    struct sockaddr_in serv_addr;
    int memberID;  // Dynamically input member ID
    int objectID;  // Dynamically input object ID
    char buffer[1024] = {0};

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) {
        printf("Failed. Error Code : %d\n", WSAGetLastError());
        return 1;
    }

    // Socket creation
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET) {
        printf("Socket creation failed. Error: %d\n", WSAGetLastError());
        WSACleanup();
        return 1;
    }

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);

    // Use loopback IP address to connect to server on the same machine
    if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
        printf("Invalid IP address\n");
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    // Connect to server
    if (connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
        printf("Connection failed. Error: %d\n", WSAGetLastError());
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    // Prompt the user to input member ID
    printf("Enter your member ID: ");
    scanf("%d", &memberID);  // Get member ID from user input

    // Send introduction message
    char request[256];
    sprintf(request, "%d", memberID);
    send(sock, request, strlen(request), 0);
    printf("Client: %s\n", request);

    // Receive server's response
    int valread = recv(sock, buffer, 1024, 0);
    if (valread > 0) {
        printf("Server: %s\n", buffer);
    } else {
        printf("Failed to receive response. Error: %d\n", WSAGetLastError());
    }

    // Prompt the user to input object ID
    printf("Enter the object ID you want to borrow: ");
    scanf("%d", &objectID);  // Get object ID from user input

    // Send object ID for borrowing
    sprintf(request, "%d", objectID);
    send(sock, request, strlen(request), 0);
    printf("Client: %s\n", request);

    // Receive server's response
    valread = recv(sock, buffer, 1024, 0);
    if (valread > 0) {
        printf("Server: %s\n", buffer);
    } else {
        printf("Failed to receive response. Error: %d\n", WSAGetLastError());
    }

    // Cleanup
    closesocket(sock);
    WSACleanup();
    return 0;
}
