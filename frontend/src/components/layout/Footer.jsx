export default function Footer() {
  return (
    <footer className="border-t border-subtle mt-section">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-3">
        <div>
          <div className="font-serif text-xl">
            Residências<span className="text-gold">.</span>
          </div>
          <p className="mt-4 text-sm text-ink-secondary leading-relaxed">
            Curadoria de residências extraordinárias. Discrição, sofisticação e exclusividade.
          </p>
        </div>

        <div>
          <h4 className="label-eyebrow mb-4">Contato</h4>
          <ul className="space-y-2 text-sm text-ink-secondary">
            <li>contato@residencias.com</li>
            <li>+55 11 0000 0000</li>
          </ul>
        </div>

        <div>
          <h4 className="label-eyebrow mb-4">Atendimento</h4>
          <p className="text-sm text-ink-secondary">
            Visitas exclusivamente com hora marcada.
          </p>
        </div>
      </div>
      <div className="border-t border-subtle">
        <div className="container-luxe py-6 text-xs text-ink-secondary/70 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} Residências. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
