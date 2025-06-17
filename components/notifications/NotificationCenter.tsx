'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      case 'error':
        return <div className="h-2 w-2 rounded-full bg-red-500" />;
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={toggleOpen} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-80 origin-top-right"
          >
            <Card className="overflow-hidden shadow-lg">
              <div className="flex items-center justify-between bg-muted/50 p-3 border-b">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <ul className="divide-y">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-3 hover:bg-muted/50 ${!notification.read ? 'bg-muted/20' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <span className="sr-only">Dismiss</span>
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(notification.createdAt, 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}