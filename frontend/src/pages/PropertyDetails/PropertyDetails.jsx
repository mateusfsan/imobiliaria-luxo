import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useProperty } from '../../hooks/useProperties.js';
import { formatPrice, formatArea } from '../../utils/format.js';
import Gallery from './Gallery.jsx';
import FavoriteButton from '../../components/property/FavoriteButton.jsx';

function InfoCell({ label, value }) {
  return (
    <div className="border-t border-subtle pt-6">
      <p className="label-eyebrow text-ink-secondary mb-2">{label}</p>
      <p className="font-serif text-2xl">{value}</p>
    </div>
  );
}

export default function PropertyDetails() {
  const { id } = useParams();
  const { data, loading, error } = useProperty(id);

  if (loading) {
    return (
      <div className="pt-32 container-luxe">
        <div className="aspect-[16/10] bg-card animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-40 container-luxe text-center min-h-[60vh]">
        <p className="text-ink-secondary mb-6">Imovel nao encontrado.</p>
        <Link to="/imoveis" className="btn-gold">
          Voltar para o portfolio
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.title} &middot; Residencias</title>
        <meta name="description" content={data.description.slice(0, 160)} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description.slice(0, 200)} />
        {data.images?.[0] && <meta property="og:image" content={data.images[0].url} />}
      </Helmet>

      <article className="pt-28">
        <header className="container-luxe pb-12 flex items-end justify-between gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="label-eyebrow text-gold mb-4"
            >
              {data.city} &middot; {data.state}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-h1 max-w-4xl leading-tight"
            >
              {data.title}
            </motion.h1>
          </div>
          <FavoriteButton propertyId={data._id} size="lg" label className="shrink-0" />
        </header>

        <div className="container-luxe">
          <Gallery images={data.images || []} title={data.title} />
        </div>

        <section className="container-luxe py-section-sm md:py-section grid md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-7">
            <h2 className="font-serif text-h3 mb-6">Sobre a residencia</h2>
            <p className="text-ink-secondary leading-loose whitespace-pre-line">
              {data.description}
            </p>
          </div>

          <aside className="md:col-span-5 md:sticky md:top-32 self-start">
            <div className="border border-subtle p-8 md:p-10">
              <p className="label-eyebrow text-ink-secondary mb-3">Valor</p>
              <p className="font-serif text-4xl text-gold tracking-wide">
                {formatPrice(data.price)}
              </p>

              <div className="mt-10 space-y-6">
                <InfoCell label="Area" value={formatArea(data.area)} />
                <InfoCell label="Quartos" value={data.bedrooms} />
                <InfoCell label="Banheiros" value={data.bathrooms} />
                <InfoCell label="Vagas" value={data.parking} />
              </div>

              <div className="mt-10">
                <Link to="/agendar" state={{ propertyId: data._id }} className="btn-gold w-full">
                  Agendar visita
                </Link>
                <p className="mt-4 text-xs text-ink-secondary text-center">
                  Atendimento exclusivamente com hora marcada.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </article>
    </>
  );
}
