'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import UnauthenticatedHome from '@/components/UnauthenticatedHome';
import AuthenticatedDashboard from '@/components/AuthenticatedDashboard';

export default function HomePage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => {
        if (res.ok) setIsAuth(true);
        else setIsAuth(false);
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    return <LoadingSpinner />;
  }

  if (!isAuth) {
    return <UnauthenticatedHome />;
  } else {
    return <AuthenticatedDashboard />;
  }
}