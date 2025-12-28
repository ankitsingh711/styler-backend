import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
    Card,
    CardContent,
    Chip,
    Button,
    Stack,
    Skeleton,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    alpha,
} from '@mui/material';
import {
    Person,
    Email,
    CalendarMonth,
    AccessTime,
    ContentCut,
    Logout,
    EventAvailable,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Profile = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const response = await bookingService.getUserAppointments();
            setAppointments(response.data || response || []);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const statusMap = {
            'Pending': 'warning',
            'Complete': 'success',
            'Approved': 'info',
            'Cancel': 'error',
        };
        return statusMap[status] || 'default';
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    py: { xs: 6, md: 8 },
                    mb: 4,
                }}
            >
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Avatar
                                sx={{
                                    width: { xs: 80, md: 120 },
                                    height: { xs: 80, md: 120 },
                                    bgcolor: 'secondary.main',
                                    fontSize: { xs: '2rem', md: '3rem' },
                                    fontWeight: 800,
                                }}
                            >
                                {user?.userName?.[0]?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight={800} gutterBottom>
                                    {user?.userName || 'User'}
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    {user?.email}
                                </Typography>
                            </Box>
                        </Stack>
                    </MotionBox>
                </Container>
            </Box>

            <Container>
                <Grid container spacing={4}>
                    {/* User Info Card */}
                    <Grid item xs={12} md={4}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Personal Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <List>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemIcon>
                                            <Person color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Full Name"
                                            secondary={user?.userName || 'User'}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 600 }}
                                        />
                                    </ListItem>

                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemIcon>
                                            <Email color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Email Address"
                                            secondary={user?.email}
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                            secondaryTypographyProps={{ variant: 'body1', fontWeight: 600 }}
                                        />
                                    </ListItem>
                                </List>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    sx={{ mt: 3, py: 1.2, fontWeight: 600 }}
                                >
                                    Logout
                                </Button>
                            </Paper>
                        </MotionBox>
                    </Grid>

                    {/* Appointments Section */}
                    <Grid item xs={12} md={8}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4" fontWeight={700}>
                                    My Appointments
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EventAvailable />}
                                    onClick={() => navigate('/services')}
                                    sx={{ fontWeight: 600 }}
                                >
                                    Book New
                                </Button>
                            </Box>

                            {loading ? (
                                <Stack spacing={2}>
                                    {[1, 2, 3].map((item) => (
                                        <Skeleton key={item} variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
                                    ))}
                                </Stack>
                            ) : appointments.length > 0 ? (
                                <AnimatePresence>
                                    <Stack spacing={3}>
                                        {appointments.map((appointment, index) => (
                                            <MotionCard
                                                key={appointment._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                elevation={2}
                                                sx={{
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        background: `linear-gradient(135deg, ${alpha('#1e293b', 0.05)} 0%, ${alpha('#f59e0b', 0.05)} 100%)`,
                                                        p: 2,
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="h6" fontWeight={700}>
                                                            Appointment #{appointment._id?.slice(-6)}
                                                        </Typography>
                                                        <Chip
                                                            label={appointment.status || 'Pending'}
                                                            color={getStatusColor(appointment.status)}
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </Stack>
                                                </Box>

                                                <CardContent sx={{ p: 3 }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Stack spacing={2}>
                                                                <Box>
                                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                                        <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                            STYLER
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Typography variant="body1" fontWeight={600}>
                                                                        {appointment.styler?.name || appointment.stylerName || 'N/A'}
                                                                    </Typography>
                                                                </Box>

                                                                <Box>
                                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                                        <ContentCut sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                            SERVICE
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Typography variant="body1" fontWeight={600}>
                                                                        {appointment.service?.name || appointment.serviceName || 'N/A'}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Grid>

                                                        <Grid item xs={12} sm={6}>
                                                            <Stack spacing={2}>
                                                                <Box>
                                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                                        <CalendarMonth sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                            DATE
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Typography variant="body1" fontWeight={600}>
                                                                        {formatDate(appointment.date)}
                                                                    </Typography>
                                                                </Box>

                                                                <Box>
                                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                                                        <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                            TIME
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Typography variant="body1" fontWeight={600}>
                                                                        {appointment.time || 'N/A'}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </MotionCard>
                                        ))}
                                    </Stack>
                                </AnimatePresence>
                            ) : (
                                <Paper
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        borderRadius: 4,
                                        background: `linear-gradient(135deg, ${alpha('#1e293b', 0.03)} 0%, ${alpha('#f59e0b', 0.03)} 100%)`,
                                    }}
                                >
                                    <EventAvailable sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        No Appointments Yet
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        You haven't booked any appointments. Start your grooming journey today!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={() => navigate('/services')}
                                        startIcon={<EventAvailable />}
                                        sx={{ py: 1.5, px: 4, fontWeight: 700 }}
                                    >
                                        Book an Appointment
                                    </Button>
                                </Paper>
                            )}
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
