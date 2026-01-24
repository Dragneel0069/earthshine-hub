import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function ProjectCardListSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t md:border-t-0 md:border-l flex flex-col items-end justify-center gap-2 min-w-[180px]">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Project Type Filter */}
      <div>
        <Skeleton className="h-4 w-24 mb-3" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* State Filter */}
      <div>
        <Skeleton className="h-4 w-12 mb-3" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Verification Filter */}
      <div>
        <Skeleton className="h-4 w-36 mb-3" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-2 w-full rounded-full mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceSkeleton() {
  return (
    <div className="flex">
      {/* Sidebar Skeleton */}
      <aside className="w-72 border-r border-primary/10 bg-card/50 p-6 min-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-20" />
        </div>
        <FiltersSkeleton />
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>

        {/* Results Count */}
        <Skeleton className="h-5 w-32 mb-6" />

        {/* Grid of Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
