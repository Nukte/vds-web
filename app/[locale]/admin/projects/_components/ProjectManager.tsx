'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Project } from '@/services/projects';
import { deleteProjectAction, type ProjectFormState } from '../actions';
import ProjectForm from './ProjectForm';
import Button from '@/components/ui/Button';

interface ProjectManagerLabels {
  addNew: string;
  edit: string;
  delete: string;
  title: string;
  description: string;
  tags: string;
  githubUrl: string;
  liveUrl: string;
  orderIndex: string;
  save: string;
  saving: string;
  cancel: string;
  confirmDelete: string;
  saveSuccess: string;
  deleteSuccess: string;
}

interface ProjectManagerProps {
  projects: Project[];
  labels: ProjectManagerLabels;
}

const deleteInitialState: ProjectFormState = { error: null, success: false };

function DeleteButton({
  project,
  labels,
}: {
  project: Project;
  labels: ProjectManagerLabels;
}) {
  const router = useRouter();
  const boundAction = deleteProjectAction.bind(null, project.id);
  const [state, formAction, isPending] = useActionState(boundAction, deleteInitialState);

  useEffect(() => {
    if (state.success) {
      toast.success(labels.deleteSuccess);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

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

export default function ProjectManager({ projects, labels }: ProjectManagerProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleCloseForm() {
    setEditingProject(null);
    setShowAddForm(false);
  }

  const isFormOpen = showAddForm || editingProject !== null;

  return (
    <div className="flex flex-col gap-6">
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
          <ProjectForm labels={labels} onCancel={handleCloseForm} />
        </div>
      )}

      {editingProject && (
        <div className="rounded-lg border border-accent bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {labels.edit}: {editingProject.title}
          </h2>
          <ProjectForm project={editingProject} labels={labels} onCancel={handleCloseForm} />
        </div>
      )}

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz proje eklenmedi.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-start gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {project.title}
                </p>
                {project.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-xs text-muted-foreground hover:text-accent transition-colors truncate block"
                  >
                    {project.live_url}
                  </a>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                #{project.order_index}
              </span>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProject(project);
                  }}
                >
                  {labels.edit}
                </Button>
                <DeleteButton project={project} labels={labels} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
