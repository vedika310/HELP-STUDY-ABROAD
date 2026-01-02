'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Pagination,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Rating,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useProductsStore, Product } from '@/store/productsStore';
import Link from 'next/link';

// Loading skeleton for product cards
const ProductCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" height={24} width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1.5 }} />
      <Skeleton variant="rectangular" height={20} width={80} sx={{ mb: 1.5, borderRadius: 1 }} />
      <Skeleton variant="text" height={28} width="40%" />
    </CardContent>
  </Card>
);

// Memoized Product Card Component for performance
const ProductCard = React.memo(({ product }: { product: Product }) => {
  const categoryStr = String(product.category || '');
  const formattedCategory = categoryStr
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Card
      component={Link}
      href={`/dashboard/products/${product.id}`}
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <CardActionArea sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.thumbnail}
          alt={product.title}
          sx={{
            objectFit: 'contain',
            p: 2.5,
            backgroundColor: 'grey.50',
            transition: 'transform 0.25s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 48,
              lineHeight: 1.4,
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
              fontWeight: 500,
            }}
          >
            {product.brand}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} readOnly size="small" precision={0.1} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {product.rating.toFixed(1)}
            </Typography>
          </Box>
          <Chip
            label={formattedCategory}
            size="small"
            sx={{
              mb: 2.5,
              fontWeight: 500,
              height: 24,
              alignSelf: 'flex-start',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1.5,
              mt: 'auto',
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.25rem',
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
                  height: 22,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  const {
    products,
    total,
    loading,
    error,
    categories,
    fetchProducts,
    searchProducts,
    filterByCategory,
    fetchCategories,
  } = useProductsStore();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const limit = 10;

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products based on search, category filter, or pagination
  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery);
      setSelectedCategory('');
    } else if (selectedCategory) {
      filterByCategory(selectedCategory, limit, (page - 1) * limit);
    } else {
      fetchProducts(limit, (page - 1) * limit);
    }
  }, [page, searchQuery, selectedCategory, fetchProducts, searchProducts, filterByCategory]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryChange = useCallback((event: any) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  }, []);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
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
          Products
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Browse and manage product catalog
        </Typography>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <TextField
          placeholder="Search products..."
          variant="outlined"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (!e.target.value) {
              setPage(1);
              setSelectedCategory('');
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 280,
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            },
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
            sx={{
              backgroundColor: 'background.paper',
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => {
              const categoryStr = String(category || '');
              const formattedName = categoryStr
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return (
                <MenuItem key={categoryStr} value={categoryStr}>
                  {formattedName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {loading && products.length === 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </Box>
      ) : products.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
            No products found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {searchQuery
              ? `No products match your search for "${searchQuery}"`
              : selectedCategory
              ? `No products found in category "${selectedCategory}"`
              : 'There are no products to display'}
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>

          {/* Pagination */}
          {!searchQuery && !selectedCategory && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Results Info */}
          {(searchQuery || selectedCategory) && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mt: 3,
              }}
            >
              Found {total} result{total !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory &&
                ` in category "${selectedCategory
                  .split('-')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}"`}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
