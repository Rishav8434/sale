import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { propertyApi } from '../api/propertyApi';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  UploadCloud, 
  MapPin, 
  DollarSign, 
  FileText, 
  Image as ImageIcon, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';

const propertySchema = yup.object().shape({
  title: yup.string().min(3, 'Title must be at least 3 characters').max(200).required('Title is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters').required('Description is required'),
  price: yup.number().typeError('Price must be a valid number').positive('Price must be positive').required('Price is required'),
  type: yup.string().oneOf(['SALE', 'RENT']).required('Property type is required'),
  location: yup.string().required('Location is required'),
  imageUrl: yup.string().nullable(),
});

const AddEditPropertyPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [loadingProperty, setLoadingProperty] = useState(isEditMode);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      type: 'SALE',
      imageUrl: '',
    },
  });

  const currentImageUrl = watch('imageUrl');

  useEffect(() => {
    if (isEditMode) {
      const fetchPropertyToEdit = async () => {
        try {
          const res = await propertyApi.getPropertyById(id);
          if (res && res.data) {
            const p = res.data;
            // Check ownership or admin
            if (user && p.ownerId !== user.id && !isAdmin) {
              alert('You do not have permission to edit this property');
              navigate('/dashboard');
              return;
            }

            setValue('title', p.title);
            setValue('description', p.description);
            setValue('price', p.price);
            setValue('type', p.type);
            setValue('location', p.location);
            setValue('imageUrl', p.imageUrl || '');
            setImagePreview(p.imageUrl || '');
          }
        } catch (err) {
          console.error('Failed to load property', err);
          setServerError('Failed to load property details');
        } finally {
          setLoadingProperty(false);
        }
      };

      fetchPropertyToEdit();
    }
  }, [id, isEditMode, setValue, user, isAdmin, navigate]);

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    setUploadingImage(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await propertyApi.uploadImage(formData);

      if (res && res.data && res.data.imageUrl) {
        setValue('imageUrl', res.data.imageUrl);
        setImagePreview(res.data.imageUrl);
      }
    } catch (err) {
      console.error('Image upload failed', err);
      setServerError('Image upload failed. You can paste an image URL directly instead.');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);

    try {
      if (isEditMode) {
        await propertyApi.updateProperty(id, data);
        alert('Property listing updated successfully');
        navigate(`/properties/${id}`);
      } else {
        const res = await propertyApi.createProperty(data);
        alert('Property listing created successfully! It is now pending admin approval before appearing publicly.');
        navigate(isAdmin ? '/admin' : '/dashboard');
      }
    } catch (err) {
      console.error('Save failed', err);
      setServerError(err.response?.data?.message || 'Failed to save property listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200/80">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Client Portfolio
          </Link>
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700 mb-1">
            Registry Submission Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-950 tracking-tight">
            {isEditMode ? 'Modify Listing Provenance' : 'List New Residence'}
          </h1>
          <p className="text-stone-500 text-sm mt-1.5">
            Document architectural attributes, spatial metrics, and provenance records for global client review.
          </p>
        </div>
      </div>

      {/* Admin Review Notice for new listings */}
      {!isEditMode && (
        <div className="p-5 bg-stone-900 text-stone-200 rounded-3xl border border-stone-800 flex items-start gap-4 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xs leading-relaxed space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wider block text-[11px]">Curatorial Verification Protocol:</span>
            <p className="text-stone-300">All submissions are reviewed by RealNest senior curators to ensure architectural authenticity, accurate spatial metrics, and verified property ownership before public indexation.</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="luxury-card p-8 sm:p-12 space-y-8">
        
        {serverError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-800">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Core Identification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pb-2 border-b border-stone-100">
              01 / Residence Provenance & Title
            </h3>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                Property Title or Estate Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Promontory Glass Residence"
                {...register('title')}
                className={`w-full px-4 py-3 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.title.message}</p>
              )}
            </div>

            {/* Type and Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Type */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Transaction Type
                </label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-3 bg-stone-50/80 rounded-xl border border-stone-200 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                >
                  <option value="SALE">Acquisition (For Sale)</option>
                  <option value="RENT">Curated Lease (For Rent)</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.type.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Valuation / Price (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2500000"
                    {...register('price')}
                    className={`w-full pl-10 pr-4 py-3 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all ${
                      errors.price ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.price.message}</p>
                )}
              </div>

            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                City, Region & Micro-District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Trousdale Estates, Beverly Hills, CA"
                  {...register('location')}
                  className={`w-full pl-10 pr-4 py-3 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all ${
                    errors.location ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Section 2: Narrative & Architectural Specs */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pb-2 border-b border-stone-100">
              02 / Architectural Narrative & Spatial Specs
            </h3>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                Editorial Description & Materiality
              </label>
              <textarea
                rows="6"
                placeholder="Detail architectural architects, custom travertine finishes, ceiling heights, panoramic vistas, smart building automation, and site footprint..."
                {...register('description')}
                className={`w-full p-4 bg-stone-50/80 rounded-xl border text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 leading-relaxed transition-all ${
                  errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Section 3: Media & Showcase Imagery */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pb-2 border-b border-stone-100">
              03 / Curated Visual Showcase
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              
              {/* File Upload Box */}
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-stone-800 bg-stone-50/50 transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="sr-only"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-md">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-amber-800">
                    {uploadingImage ? 'Uploading via Cloudinary...' : 'Upload Architectural Photo'}
                  </span>
                  <span className="text-[11px] text-stone-400">High-resolution JPEG, PNG, or WEBP</span>
                </label>
              </div>

              {/* URL Direct Input */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Direct Image URI (CDN / Unsplash):
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    {...register('imageUrl')}
                    onChange={(e) => {
                      register('imageUrl').onChange(e);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                  />
                </div>
              </div>

            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative aspect-[16/9] max-w-sm rounded-2xl overflow-hidden border border-stone-300 bg-stone-100 shadow-md mt-4">
                <img
                  src={imagePreview}
                  alt="Property Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-stone-950/80 backdrop-blur-md rounded-full text-[10px] font-bold text-amber-300 flex items-center gap-1.5 border border-stone-700">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  Showcase Ready
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-8 border-t border-stone-200 flex items-center justify-end gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
            >
              Discard
            </Link>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-stone-900/20 flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Registering Listing...
                </>
              ) : (
                isEditMode ? 'Update Listing Provenance' : 'Submit for Curatorial Approval'
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddEditPropertyPage;
