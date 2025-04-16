import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-8 py-4 border-t border-gray-200">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Sinergia Creativa. Todos los derechos
            reservados.
          </p>
          <Link
            href="https://samaragtech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors mt-2 md:mt-0"
          >
            <span>Desarrollado por</span>
            <span className="font-medium">SamaragTech</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
