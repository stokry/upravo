import React from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
}

export function LoadMoreButton({ onClick, loading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors px-6 py-2 rounded-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
            <span>Učitavanje...</span>
          </>
        ) : (
          <span>Učitaj više</span>
        )}
      </button>
    </div>
  );
}