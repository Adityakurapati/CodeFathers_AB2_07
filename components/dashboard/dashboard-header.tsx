"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Calendar, Droplet, Home, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

import { 
  getUserNotifications, 
  getUnreadNotificationCount, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  getHardcodedUserId,
  Notification
} from "@/lib/notification_api"

export function DashboardHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notifications when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true)
        const userId = getHardcodedUserId()
        const userNotifications = await getUserNotifications(userId)
        setNotifications(userNotifications)
        
        const count = await getUnreadNotificationCount(userId)
        setUnreadCount(count)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
    
    // Set up a refresh interval (e.g., every 30 seconds)
    const intervalId = setInterval(fetchNotifications, 30000)
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    // Prevent event propagation to stop focus shifting
    e.stopPropagation()
    e.preventDefault()
    
    try {
      await markNotificationAsRead(notificationId)
      
      // Update local notification state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      )
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    // Prevent event propagation to stop focus shifting
    e.stopPropagation()
    
    try {
      const userId = getHardcodedUserId()
      await markAllNotificationsAsRead(userId)
      
      // Update local notification state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      
      // Reset unread count
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Format notification timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Droplet className="h-6 w-6 fill-primary" />
          <span>BloodConnect</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/recipient" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/appointments" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </Link>
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative" onClick={(e) => e.stopPropagation()}>
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No notifications to display
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-10rem)]">
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 rounded-lg ${notification.isRead ? 'bg-background' : 'bg-primary/5'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <p className="text-sm">{notification.message}</p>
                              <time className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.createdAt)}
                              </time>
                            </div>
                            {!notification.isRead && notification.id && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={(e) => handleMarkAsRead(notification.id!, e)}
                              >
                                <span className="sr-only">Mark as read</span>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}