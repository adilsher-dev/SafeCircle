import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Trash2, ShieldQuestion, Bell, Radio } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Feedback';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/api';
import { extractErrorMessage } from '@/api/client';

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [prefs, setPrefs] = useState({ liveTracking: true, pushNotifications: true });

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await userApi.deleteAccount();
      toast.success('Account deleted');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
  <div className="space-y-8">

    {/* Header */}
    <div>
      <h1 className="text-4xl font-bold text-white">
        Settings
      </h1>

      <p className="text-muted mt-2">
        Manage your account and personalize your SafeCircle experience.
      </p>
    </div>

    {/* Preferences */}
    <Card className="w-full">
      <CardHeader
        title="Preferences"
        icon={
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 border border-primary/20">
            <Settings className="h-5 w-5 text-primary" />
          </div>
        }
      />

      <div className="space-y-4 mt-6">

        <PrefToggle
          icon={<Radio className="h-5 w-5" />}
          label="Live Tracking"
          description="Automatically enable live tracking whenever a journey starts."
          checked={prefs.liveTracking}
          onChange={(v) =>
            setPrefs((p) => ({
              ...p,
              liveTracking: v,
            }))
          }
        />

        <PrefToggle
          icon={<Bell className="h-5 w-5" />}
          label="Push Notifications"
          description="Receive instant alerts and safety notifications."
          checked={prefs.pushNotifications}
          onChange={(v) =>
            setPrefs((p) => ({
              ...p,
              pushNotifications: v,
            }))
          }
        />

      </div>
    </Card>

    {/* Session */}

    <Card className="w-full">
      <CardHeader
        title="Session"
        icon={
          <div className="p-3 rounded-2xl bg-gradient-to-br from-ai/20 to-primary/20 border border-ai/20">
            <ShieldQuestion className="h-5 w-5 text-ai" />
          </div>
        }
      />

      <p className="text-muted mt-2">
        Sign out from this device securely.
      </p>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </Card>

    {/* Danger Zone */}

    <Card className="border-red-500/30 bg-red-500/5">

      <CardHeader
        title="Danger Zone"
        icon={
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>
        }
      />

      <p className="text-muted mt-2">
        Permanently delete your SafeCircle account and all your journeys,
        contacts, alerts and history.
      </p>

      <div className="mt-6">
        <Button
          variant="danger"
          onClick={() => setConfirmOpen(true)}
        >
          Delete My Account
        </Button>
      </div>

    </Card>

    {/* Delete Modal */}

    <Modal
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      title="Delete Account?"
    >
      <p className="text-sm text-muted mb-6">
        This action is permanent and cannot be undone.
      </p>

      <div className="flex gap-4">

        <Button
          variant="outline"
          fullWidth
          onClick={() => setConfirmOpen(false)}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          fullWidth
          loading={deleting}
          onClick={handleDeleteAccount}
        >
          Delete
        </Button>

      </div>

    </Modal>

  </div>
);

function PrefToggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.05]">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 border border-primary/20 text-primary">
          {icon}
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg">
            {label}
          </h3>

          <p className="text-muted text-sm mt-1">
            {description}
          </p>
        </div>

      </div>

      <button
  onClick={() => onChange(!checked)}
  className={`
    relative h-8 w-16 rounded-full transition-all duration-300
    ${
      checked
        ? 'bg-gradient-to-r from-primary to-ai shadow-lg shadow-primary/30'
        : 'bg-slate-700'
    }
  `}
>
  <span
    className={`
      absolute top-1 left-1 h-6 w-6 rounded-full bg-white
      transition-transform duration-300
      ${checked ? 'translate-x-8' : 'translate-x-0'}
    `}
  />
</button>

    </div>
  );
}
}