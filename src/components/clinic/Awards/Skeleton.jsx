import React from 'react';

export default function AwardSkeleton() {
  return (
    <div className="clinic-awards__skeleton-card">
      <div className="clinic-awards__skeleton-thumb animate-pulse" />
      <div className="clinic-awards__skeleton-text animate-pulse" />
    </div>
  );
}
