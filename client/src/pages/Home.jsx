import { useEffect } from 'react';
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

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const services = [
        {
            title: 'GENTS',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/services/gents.jpg',
            description: 'Premium grooming services for men',
        },
        {
            title: 'LADIES',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/services/ladies.jpg',
            description: 'Luxury beauty treatments for women',
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

    const stats = [
        { icon: LocationOn, title: 'Branches', count: '162+', color: '#f59e0b', trend: 12 },
        { icon: Star, title: 'Happy Clients', count: '50000+', color: '#14b8a6', trend: 8 },
        { icon: ContentCut, title: 'Expert Stylists', count: '6000+', color: '#1e293b', trend: 5 },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '60vh', md: '80vh' },
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
                <Container sx={{ position: 'relative', zIndex: 1 }}>
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
            <Container sx={{ py: { xs: 6, md: 8 }, mt: { xs: -4, md: -6 }, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <StatCard {...stat} />
                        </Grid>
                    ))}
                </Grid>
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
                                    whileHover={{ y: -8 }}
                                    elevation={3}
                                    sx={{
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        height: 350,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            backgroundImage: `url(${image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'transform 0.4s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    />
                                </MotionPaper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Services Section */}
            <Container sx={{ py: { xs: 6, md: 10 } }}>
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
                        <Grid item xs={12} md={6} key={index}>
                            <MotionBox
                                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card
                                    sx={{
                                        height: 450,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigate('/services')}
                                >
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={service.image}
                                        alt={service.title}
                                        sx={{
                                            transition: 'transform 0.4s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                                            p: 4,
                                        }}
                                    >
                                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
                                            {service.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                                            {service.description}
                                        </Typography>
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
                                <Typography variant="h2" gutterBottom fontWeight={800}>
                                    Explore the Realm of Beauty
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    With over 162 branches nationally and internationally, Styler salon is a premium beauty salon
                                    for men and women who desire to look the best every day. Getting a makeover not only changes
                                    the appearance of a person but also brings back the lost confidence.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.8 }}>
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

                <Grid container spacing={3} justifyContent="center">
                    {partners.map((partner, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <MotionPaper
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                                elevation={1}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 120,
                                    borderRadius: 3,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={partner}
                                    alt="Partner Brand"
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '80%',
                                        objectFit: 'contain',
                                        filter: 'grayscale(100%)',
                                        transition: 'filter 0.3s',
                                        '&:hover': {
                                            filter: 'grayscale(0%)',
                                        },
                                    }}
                                />
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            {!isAuthenticated() && (
                <Box
                    sx={{
                        bgcolor: alpha('#f59e0b', 0.1),
                        py: { xs: 6, md: 8 },
                        textAlign: 'center',
                    }}
                >
                    <Container>
                        <Typography variant="h3" gutterBottom fontWeight={800}>
                            Ready to Transform Your Look?
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                            Join thousands of satisfied customers and book your appointment today
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                            <Button
                                component={Link}
                                to="/services"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ py: 1.5, px: 4, fontWeight: 700 }}
                            >
                                Book Now
                            </Button>
                            <Button
                                component={Link}
                                to="/admin/login"
                                variant="outlined"
                                color="primary"
                                size="large"
                                sx={{ py: 1.5, px: 4, fontWeight: 700 }}
                            >
                                Admin Login
                            </Button>
                        </Stack>
                    </Container>
                </Box>
            )}
        </Box>
    );
};

export default Home;
