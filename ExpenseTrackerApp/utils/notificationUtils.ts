import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

export const initializeNotifications = async (): Promise<void> => {
  try {
    console.log("Initializing notifications...")

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!")
      return
    }

    console.log("Notifications initialized successfully")
  } catch (error) {
    console.error("Notification initialization error:", error)
    // Don't throw error, just log it
  }
}

// Simplified bill reminder function
export const scheduleBillReminder = async (bill: any): Promise<void> => {
  try {
    const reminderDate = new Date(bill.dueDate)
    reminderDate.setDate(reminderDate.getDate() - 1)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bill Reminder",
        body: `${bill.name} is due tomorrow - $${bill.amount}`,
        data: { billId: bill.id },
      },
      trigger: {
        date: reminderDate,
      },
    })
  } catch (error) {
    console.error("Error scheduling bill reminder:", error)
  }
}

export const cancelBillReminder = async (billId: string): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
    const notification = scheduledNotifications.find((notif) => notif.content.data?.billId === billId)

    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier)
    }
  } catch (error) {
    console.error("Error canceling bill reminder:", error)
  }
}

export const scheduleMonthlyReport = async (): Promise<void> => {
  try {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Monthly Expense Report",
        body: "Your monthly expense report is ready!",
        data: { type: "monthly-report" },
      },
      trigger: {
        date: nextMonth,
        repeats: true,
      },
    })
  } catch (error) {
    console.error("Error scheduling monthly report:", error)
  }
}
