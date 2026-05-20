import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Property } from '../src/models/Property.js';

// Imagens de Unsplash (uso livre). Usamos a URL como publicId tambem,
// com prefixo "seed:" para nunca tentar apagar no Cloudinary.
const img = (url) => ({ url, publicId: `seed:${url}` });

const properties = [
  {
    title: 'Cobertura duplex com vista para o Jardim Botânico',
    description:
      'Cobertura duplex de arquitetura autoral, com pé-direito triplo na sala, piscina privativa com borda infinita e vista panorâmica para a Mata Atlântica. Acabamentos em mármore Calacatta e madeira freijó. Suíte master com closet e hidromassagem.',
    price: 28500000,
    city: 'Rio de Janeiro',
    state: 'RJ',
    bedrooms: 4,
    bathrooms: 5,
    parking: 4,
    area: 620,
    highlight: true,
    luxuryLevel: 5,
    images: [
      img('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Casa contemporânea em condomínio fechado, Alphaville',
    description:
      'Projeto assinado, integração total com área externa, jardim paisagístico e spa privativo. Sistema de automação residencial completo, adega climatizada e home theater.',
    price: 16800000,
    city: 'Barueri',
    state: 'SP',
    bedrooms: 5,
    bathrooms: 6,
    parking: 6,
    area: 850,
    highlight: true,
    luxuryLevel: 5,
    images: [
      img('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Apartamento garden no Itaim Bibi',
    description:
      'Apartamento garden em edifício boutique, com 320m2 e 200m2 de jardim privativo. Living amplo, cozinha gourmet integrada e três suítes com varandas individuais.',
    price: 12400000,
    city: 'Sao Paulo',
    state: 'SP',
    bedrooms: 3,
    bathrooms: 4,
    parking: 3,
    area: 320,
    highlight: false,
    luxuryLevel: 4,
    images: [
      img('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Mansão à beira-mar na Praia de Geribá',
    description:
      'Residência de praia com acesso direto à areia, arquitetura mediterrânea, piscina aquecida com vista para o oceano e ancoradouro privativo. Ideal para verão em família.',
    price: 42000000,
    city: 'Armacao dos Buzios',
    state: 'RJ',
    bedrooms: 6,
    bathrooms: 7,
    parking: 8,
    area: 1100,
    highlight: true,
    luxuryLevel: 5,
    images: [
      img('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Loft industrial em Pinheiros',
    description:
      'Loft de 180m2 em edifício convertido, pé-direito de 5 metros, mezanino com escritório e janelas pivotantes do piso ao teto. Acabamento bruto sofisticado.',
    price: 4800000,
    city: 'Sao Paulo',
    state: 'SP',
    bedrooms: 1,
    bathrooms: 2,
    parking: 2,
    area: 180,
    highlight: false,
    luxuryLevel: 4,
    images: [
      img('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Casa de campo em Itaipava com haras',
    description:
      'Propriedade rural de 12 hectares com casa principal, casa de hóspedes, lago artificial e haras com seis baias. Vegetação nativa preservada e nascentes próprias.',
    price: 9600000,
    city: 'Petropolis',
    state: 'RJ',
    bedrooms: 5,
    bathrooms: 5,
    parking: 6,
    area: 780,
    highlight: false,
    luxuryLevel: 4,
    images: [
      img('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Penthouse em Brooklin com terraço panorâmico',
    description:
      'Penthouse triplex com 480m2, terraço de 220m2 com piscina e ofurô japonês. Vista 360 da cidade. Três vagas privativas e elevador exclusivo.',
    price: 19500000,
    city: 'Sao Paulo',
    state: 'SP',
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    area: 480,
    highlight: true,
    luxuryLevel: 5,
    images: [
      img('https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
  {
    title: 'Casa minimalista em Trancoso',
    description:
      'Casa de 5 suítes projetada em torno de um quintal central com piscina. Materiais locais, telhado de palha e integração total com a vegetação nativa baiana.',
    price: 11200000,
    city: 'Porto Seguro',
    state: 'BA',
    bedrooms: 5,
    bathrooms: 5,
    parking: 4,
    area: 540,
    highlight: false,
    luxuryLevel: 5,
    images: [
      img('https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=80'),
      img('https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2400&q=80'),
    ],
  },
];

await mongoose.connect(env.mongoUri);
console.log('[seed] conectado em', mongoose.connection.name);

const wipe = process.argv.includes('--wipe');
if (wipe) {
  const { deletedCount } = await Property.deleteMany({});
  console.log(`[seed] ${deletedCount} imóveis removidos`);
}

const inserted = await Property.insertMany(properties);
console.log(`[seed] ${inserted.length} imóveis inseridos`);

await mongoose.disconnect();
