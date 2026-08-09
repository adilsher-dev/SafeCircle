import { Link } from 'react-router-dom';
import { ShieldQuestion } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
        <ShieldQuestion className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">404</h1>
      <p className="text-muted mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
