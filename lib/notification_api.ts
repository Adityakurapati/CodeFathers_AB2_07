import { database } from "./firebase";
import { ref, get, set, push, update, remove, query, orderByChild, equalTo, onValue, off } from "firebase/database";

// Types
export interface Notification {
  id?: string;
  userId: string;
  message: string;
  type: "request_accepted" | "request_completed" | "donor_found" | "other";
  relatedRequestId?: string;
  createdAt: string;
  isRead: boolean;
}

// Get notifications for the current user
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const notificationsRef = ref(database, "notifications");
    
    // Using Promise-based approach instead of query to avoid indexing issues
    const snapshot = await get(notificationsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const notifications: Notification[] = [];
    const data = snapshot.val();
    
    // Filter notifications for this user
    for (const key in data) {
      if (data[key].userId === userId) {
        notifications.push({
          id: key,
          ...data[key]
        });
      }
    }
    
    // Sort by creation date, newest first
    return notifications.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const notifications = await getUserNotifications(userId);
    return notifications.filter(notification => !notification.isRead).length;
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    return 0;
  }
}

// Create a new notification
export async function createNotification(notificationData: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
  try {
    const notificationsRef = ref(database, "notifications");
    const newNotificationRef = push(notificationsRef);
    
    const timestamp = new Date().toISOString();
    const newNotification: Omit<Notification, "id"> = {
      ...notificationData,
      createdAt: timestamp
    };
    
    await set(newNotificationRef, newNotification);
    
    console.log("Notification created successfully with ID:", newNotificationRef.key);
    
    return {
      id: newNotificationRef.key as string,
      ...newNotification
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notificationRef = ref(database, `notifications/${notificationId}`);
    await update(notificationRef, {
      isRead: true
    });
    console.log("Notification marked as read:", notificationId);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notifications = await getUserNotifications(userId);
    
    const updates: Record<string, any> = {};
    
    notifications.forEach(notification => {
      if (!notification.isRead && notification.id) {
        updates[`notifications/${notification.id}/isRead`] = true;
      }
    });
    
    if (Object.keys(updates).length > 0) {
      const dbRef = ref(database);
      await update(dbRef, updates);
      console.log(`Marked ${Object.keys(updates).length} notifications as read for user:`, userId);
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const notificationRef = ref(database, `notifications/${notificationId}`);
    await remove(notificationRef);
    console.log("Notification deleted:", notificationId);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

// Create a notification when a request status changes to accepted
export async function createAcceptedRequestNotification(requestId: string, requesterId: string, donorId: string): Promise<Notification | null> {
  try {
    console.log(`Creating accepted notification for request: ${requestId}, requester: ${requesterId}, donor: ${donorId}`);
    
    // Get donor information
    const userRef = ref(database, `users/${donorId}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      console.error("Donor not found:", donorId);
      return null;
    }
    
    const donor = userSnapshot.val();
    const donorName = donor.name || "A donor"; // Default if name is not available
    
    console.log(`Found donor name: ${donorName}`);
    
    // Create notification
    const notification = await createNotification({
      userId: requesterId,
      message: `${donorName} has accepted your blood request and will be contacting you soon.`,
      type: "request_accepted",
      relatedRequestId: requestId,
      isRead: false
    });
    
    console.log("Successfully created notification:", notification);
    return notification;
  } catch (error) {
    console.error("Error creating accepted request notification:", error);
    return null;
  }
}

// Helper function to get hardcoded user ID (same as in recipient_api.ts)
export function getHardcodedUserId(): string {
  return "KH3hXtdgk6exwpaiSfaC5hEUU8u1";
}