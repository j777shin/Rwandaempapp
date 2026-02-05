import { Link } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4 text-neutral-300">404</h1>
        <h2 className="text-3xl font-semibold mb-2 text-foreground">Page Not Found</h2>
        <p className="text-xl mb-8 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
