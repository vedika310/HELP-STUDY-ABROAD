'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useUsersStore } from '@/store/usersStore';
import { User } from '@/store/usersStore';

// Loading skeleton for table rows
const TableRowSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <TableRow key={i}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="70%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="50%" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

// Memoized User Row Component for performance
const UserRow = React.memo(({ user }: { user: User }) => {
  const router = useRouter();
  
  const handleRowClick = useCallback(() => {
    router.push(`/dashboard/users/${user.id}`);
  }, [router, user.id]);

  return (
    <TableRow
      hover
      onClick={handleRowClick}
      sx={{
        cursor: 'pointer',
        height: 72,
        transition: 'background-color 0.15s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 44, height: 44 }}
          />
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ color: 'text.primary', mb: 0.25 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              @{user.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {user.email}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={user.gender}
          size="small"
          color={user.gender === 'male' ? 'primary' : 'secondary'}
          sx={{
            fontWeight: 500,
            height: 26,
            fontSize: '0.8125rem',
          }}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user.phone}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user.company?.name || 'N/A'}
        </Typography>
      </TableCell>
    </TableRow>
  );
});

UserRow.displayName = 'UserRow';

export default function UsersPage() {
  const { users, total, loading, error, fetchUsers, searchUsers } = useUsersStore();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 10;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users based on search or pagination
  useEffect(() => {
    if (searchQuery) {
      searchUsers(searchQuery);
    } else {
      fetchUsers(limit, (page - 1) * limit);
    }
  }, [page, searchQuery, fetchUsers, searchUsers]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          Users
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage and search through user accounts
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or username..."
          variant="outlined"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (!e.target.value) setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            },
          }}
        />
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {loading && users.length === 0 ? (
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRowSkeleton />
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : users.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
            No users found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {searchQuery
              ? `No users match your search for "${searchQuery}"`
              : 'There are no users to display'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper sx={{ overflow: 'hidden', mb: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 2, fontWeight: 600, fontSize: '0.875rem' }}>Name</TableCell>
                    <TableCell sx={{ py: 2, fontWeight: 600, fontSize: '0.875rem' }}>Email</TableCell>
                    <TableCell sx={{ py: 2, fontWeight: 600, fontSize: '0.875rem' }}>Gender</TableCell>
                    <TableCell sx={{ py: 2, fontWeight: 600, fontSize: '0.875rem' }}>Phone</TableCell>
                    <TableCell sx={{ py: 2, fontWeight: 600, fontSize: '0.875rem' }}>Company</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Pagination */}
          {!searchQuery && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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

          {/* Search Results Info */}
          {searchQuery && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mt: 2,
              }}
            >
              Found {total} result{total !== 1 ? 's' : ''} for "{searchQuery}"
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
