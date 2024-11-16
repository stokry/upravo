import { Button } from '@/components/ui/button';

export function TopNav() {
  return (
    <nav className="flex items-center justify-between h-10 text-sm">
      <div className="flex items-center space-x-6">
        <Button variant="link" className="text-white hover:text-white/90 p-0 h-auto">
          Vijesti
        </Button>
        <Button variant="link" className="text-white hover:text-white/90 p-0 h-auto">
          Sport
        </Button>
        <Button variant="link" className="text-white hover:text-white/90 p-0 h-auto">
          Kultura
        </Button>
        <Button variant="link" className="text-white hover:text-white/90 p-0 h-auto">
          Vrijeme
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="link" className="text-white hover:text-white/90 p-0 h-auto">
          Prijava
        </Button>
      </div>
    </nav>
  );
}