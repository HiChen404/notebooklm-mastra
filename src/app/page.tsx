import { NotebooksSkeleton } from "@/components/custom/home-page/notebook-skeleton";
import { NotebooksGrid } from "@/components/custom/home-page/notebooks-grid";
import { UploadSources } from "@/components/custom/uploads/upload-sources";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const sessionId = (await searchParams).sessionId;
  if (!sessionId) return null;

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="-top-[20%] -left-[20%] absolute w-[70%] h-[70%] rounded-full bg-blue-100 opacity-50 blur-3xl" />
        <div className="top-[20%] -right-[20%] absolute w-[70%] h-[70%] rounded-full bg-teal-100 opacity-50 blur-3xl" />
        <div className="-bottom-[20%] left-[20%] absolute w-[70%] h-[70%] rounded-full bg-purple-100 opacity-50 blur-3xl" />
        <div className="top-[0%] -right-[0%] absolute w-[50%] h-[70%] rounded-full bg-red-100 opacity-50 blur-3xl" />
        <div className="bottom-[0%] -left-[0%] absolute w-[50%] h-[70%] rounded-full bg-orange-100 opacity-50 blur-3xl" />
      </div>

      <div className="relative flex items-center min-h-screen mx-auto px-4 py-8 container">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="mb-8 bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 font-bold text-transparent text-6xl">
            Welcome to NotebookLM2
          </h1>

          <Card className="w-full py-8 rounded-3xl">
            <CardHeader>
              <h2 className="font-semibold text-3xl">
                Create a podcast from your documents
              </h2>
              <p className="text-muted-foreground">
                NotebookLM is an AI-powered assistant that creates podcasts from
                the sources you upload
              </p>
            </CardHeader>

            <CardContent>
              <Suspense fallback={<NotebooksSkeleton />}>
                <NotebooksGrid sessionId={sessionId} />
              </Suspense>
            </CardContent>

            <CardFooter className="justify-center">
              <div className="flex flex-col items-center gap-4">
                <UploadSources variant="welcome" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
