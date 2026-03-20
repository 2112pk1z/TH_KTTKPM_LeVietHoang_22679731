package org.example;

public class NotificationService {

    private static NotificationService instance;

    private NotificationService() {}

    public static NotificationService getInstance() {
        if (instance == null) {
            instance = new NotificationService();
        }
        return instance;
    }

    public void sendNotification(String type, String message) {
        Notification notification = NotificationFactory.createNotification(type);
        notification.send(message);
    }
}