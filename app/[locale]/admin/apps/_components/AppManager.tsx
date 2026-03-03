'use client';

import { useState, useActionState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { App } from '@/services/apps';
import { deleteAppAction, type AppFormState } from '../actions';
import AppForm from './AppForm';
import Button from '@/components/ui/Button';

interface AppManagerLabels {
  addNew: string;
  edit: string;
  delete: string;
  name: string;
  url: string;
  icon: string;
  orderIndex: string;
  save: string;
  saving: string;
  cancel: string;
  confirmDelete: string;
  saveSuccess: string;
  deleteSuccess: string;
}

interface AppManagerProps {
  apps: App[];
  labels: AppManagerLabels;
}

const deleteInitialState: AppFormState = { error: null, success: false };

function DeleteButton({ app, labels }: { app: App; labels: AppManagerLabels }) {
  const router = useRouter();
  const boundAction = deleteAppAction.bind(null, app.id, app.icon_url);
  const [state, formAction, isPending] = useActionState(boundAction, deleteInitialState);

  useEffect(() => {
    if (state.success) {
      toast.success(labels.deleteSuccess);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, labels.deleteSuccess, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm(labels.confirmDelete)) {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive" size="sm" isLoading={isPending}>
        {labels.delete}
      </Button>
    </form>
  );
}

export default function AppManager({ apps, labels }: AppManagerProps) {
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleCloseForm() {
    setEditingApp(null);
    setShowAddForm(false);
  }

  const isFormOpen = showAddForm || editingApp !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Add Form */}
      {!isFormOpen && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setShowAddForm(true)}
          >
            {labels.addNew}
          </Button>
        </div>
      )}

      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {labels.addNew}
          </h2>
          <AppForm labels={labels} onCancel={handleCloseForm} />
        </div>
      )}

      {editingApp && (
        <div className="rounded-lg border border-accent bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {labels.edit}: {editingApp.name}
          </h2>
          <AppForm app={editingApp} labels={labels} onCancel={handleCloseForm} />
        </div>
      )}

      {/* Apps List */}
      {apps.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz uygulama eklenmedi.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {apps.map((app) => (
            <li
              key={app.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
            >
              {app.icon_url ? (
                <div className="relative h-8 w-8 shrink-0">
                  <Image
                    src={app.icon_url}
                    alt={app.name}
                    fill
                    className="object-contain rounded-md"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-base shrink-0">
                  📦
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{app.name}</p>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors truncate block"
                >
                  {app.url}
                </a>
              </div>

              <span className="text-xs text-muted-foreground shrink-0">#{app.order_index}</span>

              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingApp(app);
                  }}
                >
                  {labels.edit}
                </Button>
                <DeleteButton app={app} labels={labels} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
