import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties.js';
import PropertyCard from '../../components/property/PropertyCard.jsx';

export default function Home() {
  const { data, loading } = useProperties({ highlight: true, limit: 6 });

  return (
    <>
      <Helmet>
        <title>Residências Extraordinárias</title>
        <meta name="description" content="Curadoria de residências de alto padrão no Brasil." />
      </Helmet>

      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-bg" aria-hidden />

        <div className="relative h-full container-luxe flex flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="label-eyebrow text-gold mb-6"
          >
            Curadoria premium
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display max-w-3xl text-ink-primary"
          >
            Descubra residências extraordinárias
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-6 max-w-xl text-ink-secondary"
          >
            Selecionamos imóveis singulares para quem busca discrição, sofisticação e arquitetura autoral.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12"
          >
            <Link to="/imoveis" className="btn-gold">
              Explorar residências
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container-luxe py-section-sm md:py-section">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="label-eyebrow mb-4">Seleção do mês</p>
            <h2 className="font-serif text-h2 max-w-2xl">
              Residências em destaque
            </h2>
          </div>
          <Link
            to="/imoveis"
            className="text-sm uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors self-start md:self-auto"
          >
            Ver todas &rarr;
          </Link>
        </div>

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-card animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data?.items?.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((property, i) => (
              <PropertyCard key={property._id} property={property} index={i} />
            ))}
          </div>
        )}

        {!loading && data?.items?.length === 0 && (
          <p className="text-ink-secondary text-center py-12">
            Nenhuma residência em destaque no momento.
          </p>
        )}
      </section>

      <section className="border-t border-subtle">
        <div className="container-luxe py-section-sm md:py-section">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p className="label-eyebrow mb-4">Atendimento</p>
            <h2 className="font-serif text-h2 leading-tight">
              Uma experiência sob medida do primeiro contato ao pós-venda.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                number: '01',
                title: 'Curadoria',
                description:
                  'Selecionamos cada residência manualmente, com critérios rigorosos de arquitetura, localização e história. Você não navega: você descobre.',
              },
              {
                number: '02',
                title: 'Atendimento reservado',
                description:
                  'Visitas exclusivamente com hora marcada e um curador dedicado a entender o seu repertório e suas preferências.',
              },
              {
                number: '03',
                title: 'Discrição absoluta',
                description:
                  'Sigilo total sobre o cliente e o imóvel, do primeiro contato à entrega das chaves. Sua privacidade é parte do serviço.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-serif text-6xl md:text-7xl font-light text-gold mb-6 leading-none">
                  {step.number}
                </p>
                <h3 className="font-serif text-2xl mb-4">{step.title}</h3>
                <p className="text-ink-secondary leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-subtle">
        <div className="container-luxe py-section grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="label-eyebrow mb-4">Sobre nós</p>
            <h2 className="font-serif text-h2 leading-tight">
              Imóveis singulares para histórias singulares.
            </h2>
          </div>
          <div className="space-y-6 text-ink-secondary leading-relaxed">
            <p>
              Trabalhamos com curadoria silenciosa. Cada residência em nosso portfólio passa por
              uma análise criteriosa de arquitetura, localização, acabamentos e história.
            </p>
            <p>
              Atendemos exclusivamente com hora marcada. A discrição do cliente e do imóvel
              é o nosso compromisso.
            </p>
            <div className="pt-4">
              <Link to="/imoveis" className="btn-gold">
                Conhecer o portfólio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
