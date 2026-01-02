'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent,
  Rating,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useProductsStore, Product } from '@/store/productsStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const getProductById = useProductsStore((state) => state.getProductById);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      setLoading(true);
      setError(null);
      const productId = parseInt(params.id as string);
      const productData = await getProductById(productId);

      if (productData) {
        setProduct(productData);
      } else {
        setError('Product not found');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id, getProductById]);

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error || 'Product not found'}
        </Alert>
      </Box>
    );
  }

  const categoryStr = String(product.category || '');
  const formattedCategory = categoryStr
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Box>
      {/* Back Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/dashboard/products')}
        sx={{
          mb: 4,
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateX(-2px)',
          },
        }}
      >
        Back to Products
      </Button>

      <Paper sx={{ p: 5, borderRadius: 2 }}>
        {/* Main Product Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, mb: 5 }}>
          {/* Image Carousel */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
            <Box
              sx={{
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'grey.50',
                p: 2,
              }}
            >
              <Box
                component="img"
                src={product.images[selectedImageIndex] || product.thumbnail}
                alt={product.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 500,
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
            </Box>
            {product.images.length > 1 && (
              <ImageList cols={4} rowHeight={100} gap={8}>
                {product.images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? 2 : 1,
                      borderColor: selectedImageIndex === index ? 'primary.main' : 'divider',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        opacity: 0.9,
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {product.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 2.5,
                fontWeight: 500,
              }}
            >
              {product.brand}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
              <Rating value={product.rating} readOnly precision={0.1} size="medium" />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Chip
                label={formattedCategory}
                color="primary"
                sx={{ mr: 1, mb: 1, fontWeight: 500, height: 28 }}
              />
              {product.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1, fontWeight: 500 }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Pricing Section */}
            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1.5 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '2rem',
                  }}
                >
                  ${product.price}
                </Typography>
                {product.discountPercentage > 0 && (
                  <Chip
                    label={`${Math.round(product.discountPercentage)}% off`}
                    size="small"
                    color="secondary"
                    sx={{
                      height: 24,
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: product.stock > 0 ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.7,
              }}
            >
              {product.description}
            </Typography>
          </Box>
        </Box>

        {/* Specifications Section */}
        <Divider sx={{ my: 5 }} />
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 3,
          }}
        >
          Specifications
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Product Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    SKU
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.sku}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Weight
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.weight} kg
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Dimensions
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Minimum Order
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.minimumOrderQuantity}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Additional Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Warranty
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.warrantyInformation}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Shipping
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.shippingInformation}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Availability
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.availabilityStatus}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Return Policy
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {product.returnPolicy}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <>
            <Divider sx={{ my: 5 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
              }}
            >
              Reviews
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {product.reviews.map((review, index) => (
                <Card key={index} variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {review.reviewerName}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        mb: 1.5,
                        lineHeight: 1.6,
                      }}
                    >
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
