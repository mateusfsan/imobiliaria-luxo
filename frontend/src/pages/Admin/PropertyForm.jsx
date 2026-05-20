import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createProperty,
  getProperty,
  updateProperty,
} from '../../services/propertyService.js';
import ImageUploader from '../../components/admin/ImageUploader.jsx';

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(160),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  price: z.coerce.number().positive('Informe um valor positivo'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'UF com 2 letras'),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  parking: z.coerce.number().int().min(0),
  area: z.coerce.number().positive(),
  highlight: z.boolean().optional(),
  luxuryLevel: z.coerce.number().int().min(1).max(5),
});

const DEFAULTS = {
  title: '',
  description: '',
  price: '',
  city: '',
  state: '',
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  area: '',
  highlight: false,
  luxuryLevel: 3,
};

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [images, setImages] = useState([]);
  const [property, setProperty] = useState(null);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    setLoading(true);
    getProperty(id)
      .then((data) => {
        if (!active) return;
        setProperty(data);
        setImages(data.images || []);
        reset({
          title: data.title,
          description: data.description,
          price: data.price,
          city: data.city,
          state: data.state,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          parking: data.parking,
          area: data.area,
          highlight: data.highlight,
          luxuryLevel: data.luxuryLevel,
        });
      })
      .catch(() => active && setProperty(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, isEdit, reset]);

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      if (isEdit) {
        await updateProperty(id, values);
        navigate('/admin/imoveis');
      } else {
        const created = await createProperty(values);
        navigate(`/admin/imoveis/${created._id}/editar`);
      }
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Falha ao salvar');
    }
  };

  if (isEdit && loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-card animate-pulse" />
        <div className="h-96 bg-card animate-pulse" />
      </div>
    );
  }

  if (isEdit && !property) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-secondary mb-6">Imóvel não encontrado.</p>
        <Link to="/admin/imoveis" className="btn-gold">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Admin · Editar imóvel' : 'Admin · Novo imóvel'}</title>
      </Helmet>

      <header className="mb-12">
        <Link
          to="/admin/imoveis"
          className="text-xs uppercase tracking-wider text-ink-secondary hover:text-gold transition-colors"
        >
          &larr; Imóveis
        </Link>
        <p className="label-eyebrow text-ink-secondary mt-6 mb-4">
          {isEdit ? 'Editando' : 'Novo cadastro'}
        </p>
        <h1 className="font-serif text-h1">
          {isEdit ? property.title : 'Adicionar imóvel'}
        </h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-3xl">
        <section className="space-y-8">
          <div>
            <label className="label-eyebrow block mb-3">Título</label>
            <input className="input-line" {...register('title')} />
            {errors.title && <p className="mt-2 text-xs text-gold">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-eyebrow block mb-3">Descrição</label>
            <textarea rows="5" className="input-line resize-none" {...register('description')} />
            {errors.description && (
              <p className="mt-2 text-xs text-gold">{errors.description.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="label-eyebrow block mb-3">Cidade</label>
              <input className="input-line" {...register('city')} />
              {errors.city && <p className="mt-2 text-xs text-gold">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label-eyebrow block mb-3">UF</label>
              <input
                maxLength={2}
                className="input-line uppercase"
                {...register('state')}
              />
              {errors.state && <p className="mt-2 text-xs text-gold">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="label-eyebrow block mb-3">Preço (R$)</label>
              <input type="number" min="0" className="input-line" {...register('price')} />
              {errors.price && <p className="mt-2 text-xs text-gold">{errors.price.message}</p>}
            </div>
            <div>
              <label className="label-eyebrow block mb-3">Área (m²)</label>
              <input type="number" min="0" className="input-line" {...register('area')} />
              {errors.area && <p className="mt-2 text-xs text-gold">{errors.area.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="label-eyebrow block mb-3">Quartos</label>
              <input type="number" min="0" className="input-line" {...register('bedrooms')} />
            </div>
            <div>
              <label className="label-eyebrow block mb-3">Banheiros</label>
              <input type="number" min="0" className="input-line" {...register('bathrooms')} />
            </div>
            <div>
              <label className="label-eyebrow block mb-3">Vagas</label>
              <input type="number" min="0" className="input-line" {...register('parking')} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-end">
            <div>
              <label className="label-eyebrow block mb-3">Nível de luxo (1 a 5)</label>
              <input
                type="number"
                min="1"
                max="5"
                className="input-line"
                {...register('luxuryLevel')}
              />
              {errors.luxuryLevel && (
                <p className="mt-2 text-xs text-gold">{errors.luxuryLevel.message}</p>
              )}
            </div>
            <label className="flex items-center gap-3 pb-3">
              <input
                type="checkbox"
                className="w-4 h-4 accent-gold"
                {...register('highlight')}
              />
              <span className="label-eyebrow">Destacar na home</span>
            </label>
          </div>
        </section>

        {isEdit && (
          <section className="border-t border-subtle pt-12">
            <ImageUploader
              propertyId={id}
              images={images}
              onChange={setImages}
            />
          </section>
        )}

        {!isEdit && (
          <p className="text-xs text-ink-secondary">
            Após salvar, você poderá adicionar fotos na tela de edição.
          </p>
        )}

        {serverError && (
          <p className="text-sm text-gold/90">{serverError}</p>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-50">
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar imóvel'}
          </button>
          <Link
            to="/admin/imoveis"
            className="text-sm uppercase tracking-wider text-ink-secondary hover:text-ink-primary transition-colors px-7 py-3"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
