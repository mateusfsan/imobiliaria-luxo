import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import TechLogo from '../../components/about/TechLogo.jsx';

const FRONTEND = [
  { slug: 'react', name: 'React' },
  { slug: 'vite', name: 'Vite' },
  { slug: 'tailwindcss', name: 'Tailwind CSS' },
  { slug: 'framer', name: 'Framer Motion' },
  { slug: 'reactrouter', name: 'React Router' },
  { slug: 'reacthookform', name: 'React Hook Form' },
  { slug: 'zod', name: 'Zod' },
  { slug: 'axios', name: 'Axios' },
  { slug: 'zustand', name: 'Zustand' },
];

const BACKEND = [
  { slug: 'nodedotjs', name: 'Node.js' },
  { slug: 'express', name: 'Express' },
  { slug: 'mongodb', name: 'MongoDB' },
  { slug: 'mongoose', name: 'Mongoose' },
  { slug: 'jsonwebtokens', name: 'JWT' },
  { slug: 'multer', name: 'Multer' },
  { slug: 'cloudinary', name: 'Cloudinary' },
];

const FEATURES = [
  {
    title: 'Autenticação JWT',
    description: 'Registro e login com hash bcrypt, sessão persistida e rotas protegidas por papel (usuário / admin).',
  },
  {
    title: 'CRUD de imóveis',
    description: 'Cadastro completo com upload de múltiplas imagens para o Cloudinary e conversão automática para WebP.',
  },
  {
    title: 'Busca e filtros',
    description: 'Listagem paginada com filtros por cidade, estado, quartos e faixa de preço, com estado sincronizado na URL.',
  },
  {
    title: 'Favoritos',
    description: 'Coração com atualização otimista e rollback, sincronizado entre sessões via API.',
  },
  {
    title: 'Agendamento de visitas',
    description: 'Seleção por horários disponíveis com prevenção de conflito no backend e disponibilidade reativa no front.',
  },
  {
    title: 'Painel administrativo',
    description: 'Dashboard com métricas, gestão visual de imóveis e fluxo de confirmação de visitas.',
  },
];

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <>
      <Helmet>
        <title>Sobre · Mateus Fernandes</title>
        <meta
          name="description"
          content="Plataforma imobiliária de alto padrão desenvolvida por Mateus Fernandes como projeto de portfólio full-stack."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=2400&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-bg" aria-hidden />

        <div className="relative h-full container-luxe flex flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="label-eyebrow text-gold mb-6"
          >
            Sobre
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display max-w-3xl"
          >
            Olá, sou o Mateus.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-6 label-eyebrow text-ink-secondary"
          >
            Desenvolvedor full-stack
          </motion.p>
        </div>
      </section>

      {/* Bio */}
      <section className="py-section-sm md:py-section">
        <div className="container-luxe max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 text-lg text-ink-secondary leading-relaxed"
          >
            <p>
              Esta plataforma faz parte do meu portfólio. Criei do zero uma experiência
              imobiliária de alto padrão, cuidando desde o modelo de dados até a
              última microinteração, para demonstrar domínio de
              produto, design e engenharia em um único projeto.
            </p>
            <p>
              A proposta foi tratar cada detalhe como um produto real: arquitetura limpa no
              backend, um design system coerente no frontend e decisões de UX pensadas
              para um público exigente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sobre o projeto */}
      <section className="border-t border-subtle">
        <div className="container-luxe py-section-sm md:py-section grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="label-eyebrow mb-4">O projeto</p>
            <h2 className="font-serif text-h2 leading-tight">
              Uma plataforma completa, não uma demo.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6 text-ink-secondary leading-relaxed md:text-lg">
            <p>
              Plataforma de curadoria de imóveis de luxo com dois lados: a vitrine
              pública (home editorial, portfólio com filtros, página de detalhe
              com galeria e agendamento de visitas) e um painel administrativo para o corretor
              gerenciar imóveis, imagens e a agenda de visitas.
            </p>
            <p>
              Todo o conteúdo vem de uma API REST própria, com banco de dados na nuvem
              e armazenamento de imagens otimizado. O código é open-source e o
              histórico de commits conta a construção fase a fase.
            </p>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-subtle">
        <div className="container-luxe py-section-sm md:py-section">
          <div className="mb-16 max-w-2xl">
            <p className="label-eyebrow mb-4">Stack técnica</p>
            <h2 className="font-serif text-h2 leading-tight">
              Tecnologias por trás da experiência.
            </h2>
            <p className="mt-4 text-ink-secondary text-sm">
              Passe o cursor sobre cada tecnologia.
            </p>
          </div>

          <div className="mb-14">
            <p className="text-xs uppercase tracking-wider text-ink-secondary/70 mb-6">Frontend</p>
            <motion.div
              variants={gridContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            >
              {FRONTEND.map((t) => (
                <TechLogo key={t.slug} slug={t.slug} name={t.name} />
              ))}
            </motion.div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-ink-secondary/70 mb-6">Backend</p>
            <motion.div
              variants={gridContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            >
              {BACKEND.map((t) => (
                <TechLogo key={t.slug} slug={t.slug} name={t.name} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="border-t border-subtle">
        <div className="container-luxe py-section-sm md:py-section">
          <div className="mb-16 max-w-2xl">
            <p className="label-eyebrow mb-4">O que foi construído</p>
            <h2 className="font-serif text-h2 leading-tight">Funcionalidades</h2>
          </div>

          <motion.div
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-subtle"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="bg-bg p-8"
              >
                <h3 className="font-serif text-xl mb-3">{f.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contato */}
      <section className="border-t border-subtle">
        <div className="container-luxe py-section text-center">
          <p className="label-eyebrow text-gold mb-6">Vamos conversar</p>
          <h2 className="font-serif text-h2 leading-tight max-w-2xl mx-auto mb-10">
            Gostou do que viu? O código está aberto.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://github.com/mateusfsan/imobiliaria-luxo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Ver no GitHub
            </a>
            <a
              href="https://github.com/mateusfsan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors px-7 py-3"
            >
              Perfil no GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
