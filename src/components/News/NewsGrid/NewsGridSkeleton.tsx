import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function NewsGridSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-3 space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          {[...Array(3)].map((_, i) => (
            <Card key={`left-${i}`}>
              <CardHeader className="p-3 space-y-3">
                <div className="w-full aspect-video bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Article */}
          <Card>
            <div className="w-full aspect-video bg-muted" />
            <CardContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </CardContent>
          </Card>

          {/* Featured Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={`featured-${i}`}>
                <div className="aspect-[4/3] bg-muted rounded" />
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-3 space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          {[...Array(3)].map((_, i) => (
            <Card key={`right-${i}`}>
              <CardHeader className="p-3 space-y-3">
                <div className="w-full aspect-video bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={`bottom-${i}`}>
            <CardHeader>
              <div className="space-y-4">
                <div className="w-full aspect-video bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}