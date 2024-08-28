import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeRegistry from './ThemeRegistry'
import { NextAuthProvider } from '../providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Réservation de salles - Chartreux',
    description: `App pour réserver des salles d'étude aux Chartreux`,
}

export default function RootLayout(props: any) {
    const { children } = props;
    return (
        <html >
            {/* <body > */}
            <body className={inter.className} suppressHydrationWarning={true}>
                <ThemeRegistry>
                    <NextAuthProvider>
                        {children}
                    </NextAuthProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}