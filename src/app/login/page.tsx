'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Refrigerator } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon } from '@/components/icons/google-icon';

export default function LoginPage() {
  const { toast } = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Éxito',
        description: 'Has iniciado sesión correctamente.',
      });
      // The AuthProvider will handle redirection automatically
    } catch (error) {
      console.error('Error signing in with Google', error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-muted/60 px-4 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Refrigerator className="h-5 w-5 text-primary" />
            </div>
            <span className="text-2xl font-headline font-semibold">
              MisCongelados
            </span>
          </div>
          <h2 className="mt-4 px-4 text-sm font-medium text-muted-foreground sm:text-base">
            Inicia sesión para guardar y encontrar tus congelados sin esfuerzo.
          </h2>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-headline">
              Accede a tu cuenta
            </CardTitle>
            <CardDescription>
              Usa Google para empezar en segundos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleSignIn}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continuar con Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
