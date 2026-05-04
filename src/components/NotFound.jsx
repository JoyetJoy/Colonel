import { useNavigate } from "react-router";
import { Shield, ArrowLeft } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mb-6">
        <Shield className="w-9 h-9 text-black" />
      </div>
      <h1 className="text-6xl text-white mb-2">404</h1>
      <p className="text-lg text-muted-foreground mb-1">Page Not Found</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
    </div>
  );
}
