"use client"

function SkeletonCard() {
  return (
    <article className="glass-panel animate-pulse overflow-hidden">
      <div className="aspect-video bg-muted" />

      <div className="p-5 md:p-6">
        <div className="mb-3 flex gap-2">
          <div className="h-5 w-16 rounded-md bg-muted" />
          <div className="h-5 w-20 rounded-md bg-muted" />
        </div>

        <div className="mb-3 h-7 w-3/4 rounded-md bg-muted" />

        <div className="mb-4 space-y-2">
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-5/6 rounded-md bg-muted" />
          <div className="h-4 w-4/6 rounded-md bg-muted" />
        </div>

        <div className="h-4 w-32 rounded-md bg-muted" />
      </div>
    </article>
  )
}

function SearchBarSkeleton() {
  return (
    <div className="glass-inset mb-8 flex items-center gap-3 px-4 py-3">
      <div className="h-4 w-4 rounded-md bg-muted" />
      <div className="h-4 w-full rounded-md bg-muted" />
    </div>
  )
}

export default function BlogLoading() {
  return (
    <>
      <SearchBarSkeleton />

      <section className="grid gap-5 md:gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </section>
    </>
  )
}
