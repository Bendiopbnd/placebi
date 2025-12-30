import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Placebi - Restaurant Revenue Management',
  description: 'Plateforme de gestion des revenus et dépenses pour restaurants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

