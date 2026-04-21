import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Kredit Motor Online
        </h1>
        <p className="text-muted-foreground">
          Ajukan kredit motor dengan mudah & cepat
        </p>
        <Button>Mulai Sekarang</Button>
      </div>
    </main>
  );
}