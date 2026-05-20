import { useRef, useState } from 'react';
import {
  uploadPropertyImages,
  deletePropertyImage,
} from '../../services/propertyService.js';

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/avif';

export default function ImageUploader({ propertyId, images, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const updated = await uploadPropertyImages(propertyId, files);
      onChange(updated.images || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Falha no upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (publicId) => {
    setError(null);
    setRemovingId(publicId);
    try {
      const updated = await deletePropertyImage(propertyId, publicId);
      onChange(updated.images || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Falha ao remover imagem');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <label className="label-eyebrow">Imagens ({images.length})</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-colors px-4 py-2 border border-gold disabled:opacity-50"
        >
          {uploading ? 'Enviando...' : 'Adicionar fotos'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mb-4 text-xs text-gold/90">{error}</p>
      )}

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed border-subtle hover:border-gold/40 transition-colors py-16 text-center"
        >
          <p className="label-eyebrow text-ink-secondary mb-2">
            {uploading ? 'Enviando...' : 'Clique para escolher fotos'}
          </p>
          <p className="text-xs text-ink-secondary">JPG, PNG, WebP ou AVIF &middot; até 8MB cada</p>
        </button>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <li key={img.publicId} className="relative aspect-square bg-card overflow-hidden group">
              <img src={img.url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 label-eyebrow text-gold bg-black/70 px-2 py-1">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(img.publicId)}
                disabled={removingId === img.publicId}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/60 grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm uppercase tracking-wider text-gold disabled:opacity-100 disabled:bg-black/70"
              >
                {removingId === img.publicId ? '...' : 'Remover'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
