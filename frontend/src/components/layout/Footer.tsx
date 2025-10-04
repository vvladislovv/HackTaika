'use client'

export function Footer() {
  return (
    <footer className="bg-dark-brown text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-orange geometric-shape" />
                <div className="absolute inset-2 bg-rust geometric-shape rotate-45" />
              </div>
              <span className="text-xl font-bold">HackTaika</span>
            </div>
            <p className="text-cream">
              Создаём инновационные цифровые решения
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {['#description', '#products', '#portfolio', '#devblog', '#socials'].map(
                (href) => (
                  <li key={href}>
                    <button
                      onClick={() => {
                        const element = document.querySelector(href)
                        if (element) element.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-cream hover:text-orange transition-smooth"
                    >
                      {href.replace('#', '').charAt(0).toUpperCase() +
                        href.replace('#', '').slice(1)}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <p className="text-cream">
              Email: info@hacktaika.com
              <br />
              Телефон: +7 (999) 123-45-67
            </p>
          </div>
        </div>

        <div className="border-t border-cream/20 pt-8 text-center text-cream">
          <p>&copy; {new Date().getFullYear()} HackTaika. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

