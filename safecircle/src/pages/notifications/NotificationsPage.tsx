import { Bell, Trash2, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageLoader, EmptyState, Badge } from '@/components/ui/Feedback';
import { useFetchOnMount } from '@/hooks/useAsync';
import { notificationApi } from '@/api';
import { extractErrorMessage } from '@/api/client';
import { formatRelative } from '@/utils/format';

export default function NotificationsPage() {
  const { data: res, loading, refetch } = useFetchOnMount(() => notificationApi.getMyNotifications(), []);
  const notifications = res?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      toast.success('All notifications marked as read');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationApi.deleteNotification(id);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Loading notifications…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
          </Button>
        )}
      </div>

      <Card>
        {notifications.length === 0 ? (
          <EmptyState icon={<Bell className="h-6 w-6" />} title="No notifications" description="You're all caught up." />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                  n.isRead ? 'border-border/60 bg-white/[0.02]' : 'border-primary/20 bg-primary/[0.04]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-muted' : 'bg-primary'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <Badge className="border-border text-muted text-[10px]">{n.type}</Badge>
                    </div>
                    <p className="text-sm text-muted mt-1">{n.message}</p>
                    <p className="text-xs text-muted/70 mt-1">{formatRelative(n.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkRead(n.id)}>
                      <CheckCheck className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(n.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
