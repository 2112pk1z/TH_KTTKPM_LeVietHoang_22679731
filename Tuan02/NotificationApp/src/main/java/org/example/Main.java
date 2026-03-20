package org.example;

public class Main {
    public static void main(String[] args) {

        NotificationService service = NotificationService.getInstance();

        service.sendNotification("EMAIL", "Hello via Email!");
        service.sendNotification("SMS", "Hello via SMS!");
    }
}