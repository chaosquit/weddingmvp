'use client';

import React, { Suspense } from 'react';
import type { InvitationData } from '../data/invitationData';
import Standard01 from '../themes/standard/Standard01';
import Standard02 from '../themes/standard/Standard02';
import Standard03 from '../themes/standard/Standard03';
import Standard04 from '../themes/standard/Standard04';
import Standard05 from '../themes/standard/Standard05';
import Magazine01 from '../themes/magazine/Magazine01';
import Magazine02 from '../themes/magazine/Magazine02';
import Magazine03 from '../themes/magazine/Magazine03';
import Magazine04 from '../themes/magazine/Magazine04';
import Magazine05 from '../themes/magazine/Magazine05';

const themeMap: Record<string, React.FC<{ data: InvitationData }>> = {
  'standard-01': Standard01,
  'standard-02': Standard02,
  'standard-03': Standard03,
  'standard-04': Standard04,
  'standard-05': Standard05,
  'magazine-01': Magazine01,
  'magazine-02': Magazine02,
  'magazine-03': Magazine03,
  'magazine-04': Magazine04,
  'magazine-05': Magazine05,
};

interface ThemeRendererProps {
  themeId: string;
  data: InvitationData;
}

export default function ThemeRenderer({ themeId, data }: ThemeRendererProps) {
  const ThemeComponent = themeMap[themeId];

  if (!ThemeComponent) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 text-gray-500">
        Theme "{themeId}" not found.
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ThemeComponent data={data} />
    </Suspense>
  );
}
