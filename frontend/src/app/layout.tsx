import { SessionProvider } from '@/components/SessionProvider'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import Script from 'next/script'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HackTaika - Инновационные цифровые решения',
  description: 'Разработка веб-приложений, дизайн и маркетинг для вашего бизнеса',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={spaceGrotesk.variable}>
      <head>
        <Script id="hydration-fix" strategy="beforeInteractive">
          {`
            (function() {
              // Удаляем атрибуты расширений сразу при загрузке
              function removeExtensionAttributes() {
                const elements = document.querySelectorAll('*');
                elements.forEach(el => {
                  const attributes = Array.from(el.attributes);
                  attributes.forEach(attr => {
                    if (attr.name.includes('bis_') || 
                        attr.name.includes('__processed') || 
                        attr.name.includes('data-bis') ||
                        attr.name.includes('data-lastpass') ||
                        attr.name.includes('data-1password')) {
                      el.removeAttribute(attr.name);
                    }
                  });
                });
              }
              
              // Удаляем атрибуты сразу
              removeExtensionAttributes();
              
              // Наблюдаем за новыми атрибутами
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'attributes') {
                    const attr = mutation.attributeName;
                    if (attr && (attr.includes('bis_') || 
                                attr.includes('__processed') ||
                                attr.includes('data-bis') ||
                                attr.includes('data-lastpass') ||
                                attr.includes('data-1password'))) {
                      mutation.target.removeAttribute(attr);
                    }
                  }
                });
              });
              
              // Начинаем наблюдение после загрузки DOM
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register', '__processed', 'data-bis', 'data-lastpass', 'data-1password']
                  });
                });
              } else {
                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked', 'bis_register', '__processed', 'data-bis', 'data-lastpass', 'data-1password']
                });
              }
            })();
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}

