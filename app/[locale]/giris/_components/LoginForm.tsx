'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { signInAction, type SignInState } from '../actions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginFormProps {
  locale: string;
  labels: {
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    signInError: string;
  };
}

const initialState: SignInState = { error: null };

export function LoginForm({ locale, labels }: LoginFormProps) {
  const boundAction = signInAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        label={labels.email}
        placeholder="ornek@mail.com"
      />

      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        label={labels.password}
        placeholder="••••••••"
      />

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" size="md" isLoading={isPending} className="mt-1 w-full">
        {isPending ? labels.signingIn : labels.signIn}
      </Button>
    </form>
  );
}
