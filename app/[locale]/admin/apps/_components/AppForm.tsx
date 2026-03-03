'use client';

import { useActionState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createAppAction,
  updateAppAction,
  type AppFormState,
} from '../actions';
import type { App } from '@/services/apps';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AppFormProps {
  app?: App;
  labels: {
    name: string;
    url: string;
    icon: string;
    orderIndex: string;
    save: string;
    saving: string;
    cancel: string;
    saveSuccess: string;
  };
  onCancel: () => void;
}

const initialState: AppFormState = { error: null, success: false };

export default function AppForm({ app, labels, onCancel }: AppFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const action = app
    ? updateAppAction.bind(null, app.id, app.icon_url)
    : createAppAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(labels.saveSuccess);
      router.refresh();
      onCancel();
    } else if (state.error) {
      toast.error(state.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        id="name"
        name="name"
        type="text"
        required
        label={labels.name}
        defaultValue={app?.name ?? ''}
        placeholder="Figma"
      />
      <Input
        id="url"
        name="url"
        type="url"
        required
        label={labels.url}
        defaultValue={app?.url ?? ''}
        placeholder="https://figma.com"
      />
      <Input
        id="order_index"
        name="order_index"
        type="number"
        min={0}
        label={labels.orderIndex}
        defaultValue={app?.order_index ?? 0}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="icon" className="text-sm font-medium text-foreground">
          {labels.icon}
        </label>
        {app?.icon_url && (
          <div className="flex items-center gap-3 mb-1">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src={app.icon_url}
                alt={app.name}
                fill
                className="object-contain rounded-md"
                sizes="40px"
              />
            </div>
            <span className="text-xs text-muted-foreground">Mevcut ikon</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          id="icon"
          name="icon"
          type="file"
          accept="image/*"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-shadow"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" size="md" isLoading={isPending}>
          {isPending ? labels.saving : labels.save}
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          {labels.cancel}
        </Button>
      </div>
    </form>
  );
}
