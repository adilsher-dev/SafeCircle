import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Plus, Star, Trash2, Pencil, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal, PageLoader, EmptyState, Badge } from '@/components/ui/Feedback';
import { useFetchOnMount } from '@/hooks/useAsync';
import { contactApi } from '@/api';
import { contactSchema, type ContactFormValues } from '@/utils/schemas';
import { extractErrorMessage } from '@/api/client';
import { RELATIONSHIP_TYPES } from '@/types';
import type { ContactResponse } from '@/types';

export default function ContactsPage() {
  const { data: res, loading, refetch } = useFetchOnMount(() => contactApi.getMyContacts(), []);
  const contacts = res?.data ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContactResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ fullName: '', phoneNumber: '', email: '', relationship: 'FRIEND', primaryContact: false });
    setModalOpen(true);
  };

  const openEdit = (c: ContactResponse) => {
    setEditing(c);
    reset({
      fullName: c.fullName,
      phoneNumber: c.phoneNumber,
      email: c.email ?? '',
      relationship: c.relationship,
      primaryContact: c.primaryContact ?? false,
    });
    setModalOpen(true);
  };

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const payload = { ...values, email: values.email || undefined };
      if (editing) {
        await contactApi.updateContact(editing.id, payload);
        toast.success('Contact updated');
      } else {
        await contactApi.addContact(payload);
        toast.success('Contact added');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await contactApi.deleteContact(id);
      toast.success('Contact removed');
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Loading trusted contacts…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Trusted Contacts</h2>
          <p className="text-sm text-muted mt-1">People notified during an SOS or high-risk event.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No trusted contacts yet"
            description="Add people you trust so they can be alerted instantly during an emergency."
            action={
              <Button size="sm" onClick={openCreate}>
                Add your first contact
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <Card key={c.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 border border-primary/20 flex items-center justify-center font-bold text-primary">
                    {c.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-1.5">
                      {c.fullName}
                      {c.primaryContact && <Star className="h-3.5 w-3.5 text-warning fill-warning" />}
                    </p>
                    <Badge className="border-border text-muted mt-1">{c.relationship}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-muted">
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {c.phoneNumber}
                </p>
                {c.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" fullWidth onClick={() => openEdit(c)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-danger" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Contact' : 'Add Trusted Contact'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Phone number" placeholder="9876543210" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
          <Input label="Email (optional)" type="email" error={errors.email?.message} {...register('email')} />
          <Select label="Relationship" error={errors.relationship?.message} {...register('relationship')}>
            {RELATIONSHIP_TYPES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="rounded accent-primary" {...register('primaryContact')} />
            Set as primary contact
          </label>
          <Button type="submit" fullWidth loading={isSubmitting}>
            {editing ? 'Save Changes' : 'Add Contact'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
