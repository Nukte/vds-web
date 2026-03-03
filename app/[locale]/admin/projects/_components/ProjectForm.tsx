'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProjectAction, updateProjectAction, type ProjectFormState } from '../actions';
import type { Project } from '@/services/projects';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ProjectFormProps {
  project?: Project;
  labels: {
    title: string;
    description: string;
    tags: string;
    githubUrl: string;
    liveUrl: string;
    orderIndex: string;
    save: string;
    saving: string;
    cancel: string;
    saveSuccess: string;
  };
  onCancel: () => void;
}

const initialState: ProjectFormState = { error: null, success: false };

export default function ProjectForm({ project, labels, onCancel }: ProjectFormProps) {
  const router = useRouter();
  const action = project
    ? updateProjectAction.bind(null, project.id)
    : createProjectAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(labels.saveSuccess);
      router.refresh();
      onCancel();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        id="title"
        name="title"
        type="text"
        required
        label={labels.title}
        defaultValue={project?.title ?? ''}
        placeholder="Portfolio Website"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          {labels.description}
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ''}
          placeholder="A personal portfolio built with Next.js..."
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-shadow resize-none"
        />
      </div>

      <Input
        id="tags"
        name="tags"
        type="text"
        label={labels.tags}
        defaultValue={project?.tags.join(', ') ?? ''}
        placeholder="react, typescript, nextjs"
      />

      <Input
        id="github_url"
        name="github_url"
        type="url"
        label={labels.githubUrl}
        defaultValue={project?.github_url ?? ''}
        placeholder="https://github.com/username/repo"
      />

      <Input
        id="live_url"
        name="live_url"
        type="url"
        label={labels.liveUrl}
        defaultValue={project?.live_url ?? ''}
        placeholder="https://myproject.com"
      />

      <Input
        id="order_index"
        name="order_index"
        type="number"
        min={0}
        label={labels.orderIndex}
        defaultValue={project?.order_index ?? 0}
      />

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
