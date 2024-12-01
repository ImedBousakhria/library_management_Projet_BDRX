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
    char buffer[1024] = {0};
    char request[256];
    int memberID, objectID;
    char choice[10]; // To decide if the client wants to continue borrowing

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("Failed. Error Code: %d\n", WSAGetLastError());
        return 1;
    }

    // Create socket
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET) {
        printf("Socket creation failed. Error: %d\n", WSAGetLastError());
        WSACleanup();
        return 1;
    }

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);

    // Use loopback IP address (127.0.0.1) for local testing
    if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
        printf("Invalid IP address.\n");
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

    // Input and send member ID
    printf("Enter your member ID: ");
    scanf("%d", &memberID);
    sprintf(request, "%d", memberID);
    send(sock, request, strlen(request), 0);

    // Receive server response
    if (recv(sock, buffer, sizeof(buffer), 0) > 0) {
        // Clear out any potential leftover characters
        buffer[strcspn(buffer, "\r\n")] = '\0'; // Remove any extra newline or carriage return

        printf("Server: %s\n", buffer);
        if (strcmp(buffer, "Invalid member ID. Please try again.") == 0) {
            closesocket(sock);
            WSACleanup();
            return 0;
        }
    }

    // Borrowing objects loop
    do {
        // Receive and display the borrow count status
        if (recv(sock, buffer, sizeof(buffer), 0) > 0) {
            // Clear out any potential leftover characters
            buffer[strcspn(buffer, "\r\n")] = '\0'; // Remove any extra newline or carriage return

            printf("Server: %s\n", buffer);
            if (strcmp(buffer, "you have 0 borrows left") == 0) {
                printf("No borrows left, exiting...\n");
                break;  // Exit if no borrows left
            }
        }

        // Ask for object ID if the user can still borrow
        printf("Enter the object ID you want to borrow: ");
        scanf("%d", &objectID);
        sprintf(request, "%d", objectID);
        send(sock, request, strlen(request), 0);

        // Receive server response for the object borrowing status
        if (recv(sock, buffer, sizeof(buffer), 0) > 0) {
            // Clear out any potential leftover characters
            buffer[strcspn(buffer, "\r\n")] = '\0'; // Remove any extra newline or carriage return

            printf("Server borrow response: %s\n", buffer);
        }

        // Ask if the client wants to continue borrowing
        printf("Do you want to borrow another object? (yes/no): ");
        scanf("%s", choice);
        send(sock, choice, strlen(choice), 0);

    } while (strcmp(choice, "yes") == 0);

    printf("Ending session. Goodbye!\n");

    // Cleanup
    closesocket(sock);
    WSACleanup();
    return 0;
}
