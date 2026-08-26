// src/components/common/Layout/Footer.tsx

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-amber-400">🍽️ Aurora</h3>
            <p className="text-gray-400 mt-2">
              Sabores autênticos em um ambiente acolhedor.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Horário</h4>
            <p className="text-gray-400">
              Seg-Sáb: 12h - 23h<br />
              Dom: 12h - 22h
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contato</h4>
            <p className="text-gray-400">
              📞 (244) 999 999 999<br />
              📧 contato@gourmet.ao<br />
              📍 Luanda, Angola
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
          © 2026 Aurora. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}