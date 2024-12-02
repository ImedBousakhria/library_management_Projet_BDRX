#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h>
#include <ws2tcpip.h>

#pragma comment(lib, "ws2_32.lib")

#define DEFAULT_PORT 8080 // Default port


void trim(char *str) {
    char *end;
    while (isspace((unsigned char)*str) || *str == '\n' || *str == '\r') str++;

    end = str + strlen(str) - 1;
    while (end > str && (isspace((unsigned char)*end) || *end == '\n' || *end == '\r')) end--;


    *(end + 1) = '\0';
}

// Function to send data in chunks if it exceeds buffer size
int send_data(SOCKET sock, const char *data) {
    int data_len = strlen(data);
    int sent = 0;

    while (sent < data_len) {
        int bytes_to_send = data_len - sent;
        if (bytes_to_send > 1024) {
            bytes_to_send = 1024;
        }

        int sent_bytes = send(sock, data + sent, bytes_to_send, 0);
        if (sent_bytes == SOCKET_ERROR) {
            printf("Failed to send data. Error: %d\n", WSAGetLastError());
            return -1;
        }

        sent += sent_bytes;
    }

    return 0;
}

int main() {
    WSADATA wsa;
    SOCKET sock = INVALID_SOCKET;
    struct sockaddr_in serv_addr;
    char buffer[1024] = {0};
    char request[256];
    long long memberID;
    int objectID;
    char choice[10];
    int recv_result;
    int PORT = DEFAULT_PORT;
    char ip_address[100];

    printf("Enter the server IP address: ");
    scanf("%s", ip_address);

    printf("Enter the server port number (press Enter to use the default: %d): ", DEFAULT_PORT);

    while (getchar() != '\n');

    fgets(choice, sizeof(choice), stdin);
    trim(choice);

    if (strlen(choice) == 0) {
        printf("No port entered. Using default port: %d\n", DEFAULT_PORT);
        PORT = DEFAULT_PORT;
    } else {
        PORT = atoi(choice);
        if (PORT <= 0 || PORT > 65535) {
            printf("Using default port: %d\n", DEFAULT_PORT);
            PORT = DEFAULT_PORT;
        }
    }

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

    // Set timeout for socket operations (5 seconds for sending/receiving)
    int timeout_ms = 25000;
    setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, (const char*)&timeout_ms, sizeof(timeout_ms));
    setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, (const char*)&timeout_ms, sizeof(timeout_ms));

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);

    // Convert user input IP address to binary form
    if (inet_pton(AF_INET, ip_address, &serv_addr.sin_addr) <= 0) {
        printf("Invalid IP address: %s\n", ip_address);
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    // Connect to server
    if (connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
        int error_code = WSAGetLastError();

        if (error_code == 10061) {
            printf("Connection failed. Error: No server is running on this port: %d\n", PORT);
        } else {
            printf("Connection failed. Network unreachable \n");
        }

        closesocket(sock);
        WSACleanup();
        return 1;
    }

    // Input and send member ID
    while (1) {
        printf("Enter your member ID: ");
        if (scanf("%lld", &memberID) != 1) {
            printf("Invalid member ID. Please enter a numeric value.\n");
            while (getchar() != '\n');
        } else {
            break;
        }
    }

    sprintf(request, "%lld", memberID);
    if (send_data(sock, request) == -1) {
        closesocket(sock);
        WSACleanup();
        return 1;
    }
    // Receive server response
    recv_result = recv(sock, buffer, sizeof(buffer), 0);
    if (recv_result > 0) {
        buffer[recv_result] = '\0';
        trim(buffer);
        printf("Received: %s\n", buffer);

        if (strcmp(buffer, "Invalid member ID. Please try again.") == 0) {
            closesocket(sock);
            WSACleanup();
            return 0;
        }
    } else {
        printf("Server closed the connection unexpectedly.\n");
        closesocket(sock);
        WSACleanup();
        return 0;
    }

    // Borrowing objects loop
    do {
        // Receive and display the borrow count status
        recv_result = recv(sock, buffer, sizeof(buffer), 0);
        if (recv_result > 0) {
            buffer[recv_result] = '\0';
            trim(buffer);
            printf("Received: %s\n", buffer);

            if (strcmp(buffer, "You have 0 borrows left") == 0) {
                printf("No borrows left, exiting...\n");
                closesocket(sock);
                WSACleanup();
                return 0;
          }
        } else {
            printf("Server closed the connection unexpectedly.\n");
            break;
        }

        while (1) {
            printf("Enter the object ID you want to borrow: ");
            if (scanf("%d", &objectID) != 1) {
                printf("Invalid object ID. Please enter a numeric value.\n");
                while (getchar() != '\n');
            } else {
                break;
            }
        }
        sprintf(request, "%d", objectID);
        if (send_data(sock, request) == -1) {
            closesocket(sock);
            WSACleanup();
            return 1;
        }

        // Receive server response for the object borrowing status
        recv_result = recv(sock, buffer, sizeof(buffer), 0);
        if (recv_result > 0) {
            buffer[recv_result] = '\0';
            trim(buffer);
            printf("Server borrow response: '%s'\n", buffer);

        } else {
            printf("Server closed the connection unexpectedly.\n");
            break;
        }

        printf("\n\n");
        // Ask if the client wants to continue borrowing
        while (1) {
            printf("Do you want to borrow another object? (yes/no): ");
            scanf("%s", choice);
            if (strcmp(choice, "yes") == 0 || strcmp(choice, "no") == 0) {
                send(sock, choice, strlen(choice), 0);
                break;
            } else {
                printf("Invalid choice. Please enter 'yes' or 'no'.\n");
            }
        }

    } while (strcmp(choice, "yes") == 0);

    printf("Ending session. Goodbye!\n");

    closesocket(sock);
    WSACleanup();
    return 0;
}
