import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Paper,
    Stack,
    Chip,
    alpha,
    CircularProgress,
} from '@mui/material';
import {
    ArrowForward,
    ContentCut,
    Star,
    LocationOn,
    Phone,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../services/statsService';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

// Icon mapping for backend data - defined outside component for stability
const iconMap = {
    location: LocationOn,
    star: Star,
    scissors: ContentCut,
};

// Color mapping for backend data
const colorMap = {
    location: '#f59e0b',
    star: '#14b8a6',
    scissors: '#1e293b',
    calendar: '#8b5cf6',
    heart: '#ec4899',
    trophy: '#f97316',
};

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // State for dynamic statistics
    const [stats, setStats] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    // Fetch statistics on component mount
    useEffect(() => {
        const loadStats = async () => {
            try {
                setStatsLoading(true);
                const response = await fetchStats();
                if (response.success && response.data.stats) {
                    // Map backend data to component format
                    const formattedStats = response.data.stats.map(stat => ({
                        iconName: stat.icon, // Store icon name instead of component
                        title: stat.title,
                        count: `${stat.count}${stat.count >= 100 ? '+' : ''}`,
                        color: colorMap[stat.icon] || '#f59e0b',
                        trend: stat.trend,
                    }));
                    setStats(formattedStats);
                    setStatsError(null);
                }
            } catch (error) {
                console.error('Error loading stats:', error);
                setStatsError('Failed to load statistics');
                // Fallback to default stats on error
                setStats([
                    { iconName: 'location', title: 'Branches', count: '162+', color: '#f59e0b', trend: 12 },
                    { iconName: 'star', title: 'Happy Clients', count: '50000+', color: '#14b8a6', trend: 8 },
                    { iconName: 'scissors', title: 'Expert Stylists', count: '6000+', color: '#1e293b', trend: 5 },
                    { iconName: 'calendar', title: 'Total Appointments', count: '125000+', color: '#8b5cf6', trend: 15 },
                    { iconName: 'heart', title: 'Customer Satisfaction', count: '98%', color: '#ec4899', trend: 2 },
                    { iconName: 'trophy', title: 'Years in Business', count: '15+', color: '#f97316', trend: 0 },
                ]);
            } finally {
                setStatsLoading(false);
            }
        };

        loadStats();
    }, []);

    const services = [
        {
            title: 'HAIR STYLING',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/1.jpg',
            description: 'Expert cuts and styling for all occasions',
        },
        {
            title: 'MAKEUP & BEAUTY',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/2.jpg',
            description: 'Professional makeup and beauty services',
        },
        {
            title: 'SPA & WELLNESS',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/6.jpg',
            description: 'Relaxing spa treatments and wellness care',
        },
        {
            title: 'NAIL CARE',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/4.jpg',
            description: 'Manicures, pedicures, and nail art',
        },
    ];

    const trendingStyles = [
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/1.jpg',
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/2.jpg',
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/6.jpg',
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/4.jpg',
    ];

    const partners = [
        'https://www.lookssalon.in/public/images//brands/Loreal_edited.webp',
        'https://www.lookssalon.in/public/images//brands/Kerastase-Logo.webp',
        'https://www.lookssalon.in/public/images//brands/olaplex-vector-logo_edited.webp',
        'https://www.lookssalon.in/public/images//brands/Moroccanoil-Logo.webp',
        'https://www.lookssalon.in/public/images//brands/biotop.webp',
        'https://www.lookssalon.in/public/images//brands/wahl-logo.webp',
        'https://www.lookssalon.in/public/images//brands/dyson.webp',
        'https://www.lookssalon.in/public/images//brands/american-crew.webp',
    ];

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '65vh', sm: '70vh', md: '80vh' },
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url(https://www.lookssalon.in/public/images/innerBanner/service-men-1.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.7)',
                        zIndex: 0,
                    },
                }}
            >
                <Container sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        sx={{ maxWidth: 800 }}
                    >
                        <Chip
                            label="PREMIUM GROOMING EXPERIENCE"
                            sx={{
                                mb: 3,
                                bgcolor: alpha('#f59e0b', 0.9),
                                color: 'white',
                                fontWeight: 700,
                                px: 2,
                            }}
                        />
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'white',
                                fontWeight: 800,
                                mb: 3,
                                textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                            }}
                        >
                            Transform Your Look with Styler
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'white',
                                mb: 4,
                                fontWeight: 400,
                                opacity: 0.95,
                                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                            }}
                        >
                            Experience world-class grooming services with our expert stylists
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                component={Link}
                                to="/services"
                                variant="contained"
                                color="secondary"
                                size="large"
                                endIcon={<ArrowForward />}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                }}
                            >
                                Book Appointment
                            </Button>
                            <Button
                                component={Link}
                                to="/about"
                                variant="outlined"
                                size="large"
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: alpha('#fff', 0.1),
                                    },
                                }}
                            >
                                Learn More
                            </Button>
                        </Stack>
                    </MotionBox>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container sx={{ py: { xs: 6, md: 8 }, mt: { xs: -6, sm: -8, md: -6 }, position: 'relative', zIndex: 2 }}>
                {statsLoading ? (
                    // Loading state - 6 skeleton cards
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: alpha('#1e293b', 0.03),
                                        borderRadius: 3,
                                    }}
                                >
                                    <CircularProgress size={40} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    // Stats cards - 6 cards in responsive grid
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                                <StatCard
                                    iconName={stat.iconName}
                                    title={stat.title}
                                    count={stat.count}
                                    color={stat.color}
                                    trend={stat.trend}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Trending Styles Section */}
            <Box sx={{ bgcolor: alpha('#1e293b', 0.03), py: { xs: 6, md: 10 } }}>
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h2" align="center" gutterBottom fontWeight={800}>
                            Trending Styles
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                        >
                            Discover the latest trends in grooming and styling
                        </Typography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {trendingStyles.map((image, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <MotionPaper
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -12 }}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        height: { xs: 320, sm: 380 },
                                        cursor: 'pointer',
                                        position: 'relative',
                                        border: `2px solid ${alpha('#1e293b', 0.08)}`,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            border: `2px solid ${alpha('#f59e0b', 0.4)}`,
                                            boxShadow: `0 16px 48px ${alpha('#f59e0b', 0.2)}`,
                                            '& .style-image': {
                                                transform: 'scale(1.15)',
                                            },
                                            '& .style-overlay': {
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                                            },
                                            '& .style-badge': {
                                                transform: 'scale(1.05)',
                                                bgcolor: alpha('#f59e0b', 0.95),
                                            }
                                        },
                                    }}
                                >
                                    {/* Image */}
                                    <Box
                                        className="style-image"
                                        sx={{
                                            height: '100%',
                                            backgroundImage: `url(${image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    />

                                    {/* Gradient Overlay */}
                                    <Box
                                        className="style-overlay"
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                                            transition: 'background 0.4s ease',
                                        }}
                                    />

                                    {/* Category Badge */}
                                    <Chip
                                        className="style-badge"
                                        label={index % 2 === 0 ? 'TRENDING' : 'POPULAR'}
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            bgcolor: alpha('#f59e0b', 0.9),
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.7rem',
                                            px: 1.5,
                                            height: 28,
                                            backdropFilter: 'blur(10px)',
                                            border: `1px solid ${alpha('#fff', 0.2)}`,
                                            transition: 'all 0.3s ease',
                                        }}
                                    />

                                    {/* Content */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            p: 3,
                                            zIndex: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 700,
                                                mb: 0.5,
                                                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            Style {index + 1}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: alpha('#fff', 0.9),
                                                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            Latest grooming trends
                                        </Typography>
                                    </Box>
                                </MotionPaper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Services Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h2" align="center" gutterBottom fontWeight={800}>
                        Our Services
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                    >
                        Premium grooming services tailored to your needs
                    </Typography>
                </MotionBox>

                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index}>
                            <MotionBox
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{
                                    y: -12,
                                    transition: { duration: 0.3 }
                                }}
                                sx={{ display: 'flex', width: '100%', height: '100%' }}
                            >
                                <Card
                                    sx={{
                                        height: { xs: 380, sm: 420 },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        borderRadius: 3,
                                        border: `2px solid ${alpha('#1e293b', 0.08)}`,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            border: `2px solid ${alpha('#f59e0b', 0.5)}`,
                                            boxShadow: `0 20px 60px ${alpha('#1e293b', 0.25)}`,
                                            '& .service-image': {
                                                transform: 'scale(1.12)',
                                            },
                                            '& .service-overlay': {
                                                background: 'linear-gradient(to top, rgba(30,41,59,0.95) 0%, rgba(30,41,59,0.7) 60%, rgba(30,41,59,0.2) 100%)',
                                            },
                                            '& .service-button': {
                                                transform: 'translateY(0)',
                                                opacity: 1,
                                            }
                                        },
                                    }}
                                    onClick={() => navigate('/services')}
                                >
                                    <CardMedia
                                        component="img"
                                        className="service-image"
                                        height="100%"
                                        image={service.image}
                                        alt={service.title}
                                        sx={{
                                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    />

                                    {/* Gradient Overlay */}
                                    <Box
                                        className="service-overlay"
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(30,41,59,0.9) 0%, rgba(30,41,59,0.5) 50%, rgba(30,41,59,0.1) 100%)',
                                            transition: 'background 0.4s ease',
                                        }}
                                    />

                                    {/* Content */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            p: { xs: 3, sm: 4 },
                                            zIndex: 1,
                                        }}
                                    >
                                        <Chip
                                            label="PREMIUM"
                                            sx={{
                                                mb: 2,
                                                bgcolor: alpha('#f59e0b', 0.95),
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                height: 28,
                                                backdropFilter: 'blur(10px)',
                                                border: `1px solid ${alpha('#fff', 0.2)}`,
                                            }}
                                        />
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 800,
                                                mb: 1.5,
                                                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                                fontSize: { xs: '1.75rem', sm: '2rem' }
                                            }}
                                        >
                                            {service.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'white',
                                                opacity: 0.95,
                                                mb: 2.5,
                                                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                                fontSize: { xs: '0.95rem', sm: '1rem' }
                                            }}
                                        >
                                            {service.description}
                                        </Typography>
                                        <Button
                                            className="service-button"
                                            variant="contained"
                                            color="secondary"
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                transform: 'translateY(8px)',
                                                opacity: 0,
                                                transition: 'all 0.3s ease',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Explore Services
                                        </Button>
                                    </Box>
                                </Card>
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* About Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 } }}>
                <Container>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <MotionBox
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Typography variant="h2" gutterBottom fontWeight={800} sx={{ color: 'white' }}>
                                    Explore the Realm of Beauty
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, color: 'white', opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    With over 162 branches nationally and internationally, Styler salon is a premium beauty salon
                                    for men and women who desire to look the best every day. Getting a makeover not only changes
                                    the appearance of a person but also brings back the lost confidence.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: 'white', opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    With over 6000 employees engaged in transforming your look, we make sure that all the services
                                    provided at our salons meet the international standards.
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/about"
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    sx={{ py: 1.5, px: 4, fontWeight: 700 }}
                                >
                                    Learn More About Us
                                </Button>
                            </MotionBox>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MotionBox
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Box
                                    component="img"
                                    src="https://www.lookssalon.in/public/images/innerBanner/service-men-1.jpg"
                                    alt="Styler Salon"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 4,
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    }}
                                />
                            </MotionBox>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Partner Brands Section */}
            <Container sx={{ py: { xs: 6, md: 10 } }}>
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h2" align="center" gutterBottom fontWeight={800}>
                        Our Partner Brands
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                    >
                        We use only premium international brands
                    </Typography>
                </MotionBox>

                <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                    {partners.map((partner, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <MotionPaper
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                whileHover={{
                                    y: -6,
                                    scale: 1.03,
                                    transition: { duration: 0.3 }
                                }}
                                elevation={0}
                                sx={{
                                    p: { xs: 2.5, sm: 3 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: { xs: 100, sm: 130 },
                                    borderRadius: 3,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `2px solid ${alpha('#1e293b', 0.06)}`,
                                    background: `linear-gradient(135deg, ${alpha('#1e293b', 0.02)} 0%, ${alpha('#1e293b', 0.06)} 100%)`,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        border: `2px solid ${alpha('#f59e0b', 0.3)}`,
                                        background: `linear-gradient(135deg, ${alpha('#f59e0b', 0.05)} 0%, ${alpha('#f59e0b', 0.02)} 100%)`,
                                        boxShadow: `0 8px 32px ${alpha('#f59e0b', 0.15)}`,
                                        '& .brand-logo': {
                                            filter: 'grayscale(0%) brightness(1.05)',
                                            transform: 'scale(1.05)',
                                        },
                                        '& .brand-bg': {
                                            opacity: 0.12,
                                        }
                                    },
                                }}
                            >
                                {/* Background Pattern */}
                                <Box
                                    className="brand-bg"
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: 0.06,
                                        background: `radial-gradient(circle at 50% 50%, ${alpha('#f59e0b', 0.3)} 0%, transparent 70%)`,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                />
                                <Box
                                    component="img"
                                    className="brand-logo"
                                    src={partner}
                                    alt="Partner Brand"
                                    sx={{
                                        maxWidth: '85%',
                                        maxHeight: '70%',
                                        objectFit: 'contain',
                                        filter: 'grayscale(100%) brightness(0.9)',
                                        transition: 'all 0.3s ease',
                                        zIndex: 1,
                                    }}
                                />
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            {
                !isAuthenticated() && (
                    <Box
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            py: { xs: 8, md: 10 },
                            textAlign: 'center',
                            background: `linear-gradient(135deg, ${alpha('#f59e0b', 0.15)} 0%, ${alpha('#14b8a6', 0.1)} 50%, ${alpha('#1e293b', 0.08)} 100%)`,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `radial-gradient(circle at 30% 50%, ${alpha('#f59e0b', 0.15)} 0%, transparent 50%), radial-gradient(circle at 70% 50%, ${alpha('#14b8a6', 0.15)} 0%, transparent 50%)`,
                                opacity: 0.6,
                            }
                        }}
                    >
                        <Container sx={{ position: 'relative', zIndex: 1 }}>
                            <MotionBox
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Typography
                                    variant="h3"
                                    gutterBottom
                                    fontWeight={800}
                                    sx={{
                                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }
                                    }}
                                >
                                    Ready to Transform Your Look?
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{
                                        mb: 5,
                                        maxWidth: 600,
                                        mx: 'auto',
                                        fontSize: { xs: '1rem', sm: '1.15rem' }
                                    }}
                                >
                                    Join thousands of satisfied customers and book your appointment today
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                    <Button
                                        component={Link}
                                        to="/services"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            py: 1.8,
                                            px: 5,
                                            fontWeight: 700,
                                            fontSize: '1.05rem',
                                            boxShadow: `0 8px 24px ${alpha('#1e293b', 0.25)}`,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 12px 32px ${alpha('#1e293b', 0.35)}`,
                                            }
                                        }}
                                    >
                                        Book Now
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/admin/login"
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                        sx={{
                                            py: 1.8,
                                            px: 5,
                                            fontWeight: 700,
                                            fontSize: '1.05rem',
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    >
                                        Admin Login
                                    </Button>
                                </Stack>
                            </MotionBox>
                        </Container>
                    </Box>
                )
            }
        </Box >
    );
};

export default Home;
