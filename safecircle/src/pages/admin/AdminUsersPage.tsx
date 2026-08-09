import { useMemo, useState } from 'react';
import { Users, Search, Ban, CheckCircle2, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader, EmptyState, Badge, Modal } from '@/components/ui/Feedback';
import { useFetchOnMount } from '@/hooks/useAsync';
import { adminApi } from '@/api';
import { extractErrorMessage } from '@/api/client';
import { formatDate, initials } from '@/utils/format';
import type { AdminUserResponse } from '@/types';

export default function AdminUsersPage() {
  const { data: res, loading, refetch } = useFetchOnMount(() => adminApi.getAllUsers(), []);
  const users = res?.data ?? [];
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<AdminUserResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  const handleToggleStatus = async (u: AdminUserResponse) => {
    try {
      await adminApi.updateUserStatus({ userId: u.id, active: !u.isActive });
      toast.success(`${u.fullName} ${u.isActive ? 'deactivated' : 'activated'}`);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminApi.deleteUser(toDelete.id);
      toast.success('User deleted');
      setToDelete(null);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader label="Loading users…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm text-muted mt-1">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <Input
          placeholder="Search users…"
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64"
        />
      </div>

      <Card noPadding>
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<Users className="h-6 w-6" />} title="No users found" description="Try a different search." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-border/60">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border/40 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-ai/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {initials(u.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{u.fullName}</p>
                          <p className="text-xs text-muted truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className="border-border text-muted">
                        <Shield className="h-3 w-3" /> {u.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={u.isActive ? 'bg-safe/15 text-safe border-safe/30' : 'bg-muted/15 text-muted border-muted/30'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-xs">{formatDate(u.createdAt, 'MMM d, yyyy')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(u)} title={u.isActive ? 'Deactivate' : 'Activate'}>
                          {u.isActive ? <Ban className="h-3.5 w-3.5 text-warning" /> : <CheckCircle2 className="h-3.5 w-3.5 text-safe" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setToDelete(u)}>
                          <Trash2 className="h-3.5 w-3.5 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete user?">
        <p className="text-sm text-muted mb-6">
          This will permanently delete <span className="text-text font-medium">{toDelete?.fullName}</span> and all associated data.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      </Modal>
    </div>
  );
}
