'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const restaurant = useStore((state) => state.restaurant);

  useEffect(() => {
    if (restaurant) {
      router.push('/dashboard');
    } else {
      router.push('/setup');
    }
  }, [restaurant, router]);

  return null;
}

