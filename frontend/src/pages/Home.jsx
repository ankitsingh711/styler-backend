import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Title,
    Text,
    Button,
    Grid,
    Card,
    Image,
    Paper,
    Stack,
    Badge,
    Loader,
    Group,
    rem,
} from '@mantine/core';
import {
    IconArrowRight,
    IconScissors,
    IconStar,
    IconMapPin,
    IconPhone,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../services/statsService';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

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
    const { user } = useAuth();

    // State for dynamic stats
    const [stats, setStats] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch stats on component mount
    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                // Ensure stats is an array - API might return { stats: [...] } or just [...]
                const statsArray = Array.isArray(data) ? data : (data?.stats || []);

                // If no stats returned, use default fallback
                if (statsArray.length === 0) {
                    setStats([
                        { iconName: 'location', title: 'Branches', count: '20+', color: colorMap.location },
                        { iconName: 'star', title: 'Happy Clients', count: '5000+', color: colorMap.star },
                        { iconName: 'scissors', title: 'Expert Stylists', count: '150+', color: colorMap.scissors },
                        { iconName: 'calendar', title: 'Total Appointments', count: '10K+', color: colorMap.calendar },
                        { iconName: 'heart', title: 'Customer Satisfaction', count: '98%', color: colorMap.heart },
                        { iconName: 'trophy', title: 'Years in Business', count: '15+', color: colorMap.trophy },
                    ]);
                } else {
                    setStats(statsArray);
                }
                setStatsLoading(false);
            } catch (error) {
                console.error('Error loading stats:', error);
                // Fallback to default stats
                setStats([
                    { iconName: 'location', title: 'Branches', count: '20+', color: colorMap.location },
                    { iconName: 'star', title: 'Happy Clients', count: '5000+', color: colorMap.star },
                    { iconName: 'scissors', title: 'Expert Stylists', count: '150+', color: colorMap.scissors },
                    { iconName: 'calendar', title: 'Total Appointments', count: '10K+', color: colorMap.calendar },
                    { iconName: 'heart', title: 'Customer Satisfaction', count: '98%', color: colorMap.heart },
                    { iconName: 'trophy', title: 'Years in Business', count: '15+', color: colorMap.trophy },
                ]);
                setStatsLoading(false);
            }
        };

        loadStats();
    }, []);

    const services = [
        {
            title: 'Hair Styling',
            description: 'Professional cuts and styles for every occasion',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/services/hair-styling.jpg',
        },
        {
            title: 'Makeup & Beauty',
            description: 'Expert makeup for weddings and special events',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/services/makeup.jpg',
        },
        {
            title: 'Spa & Wellness',
            description: 'Relax and rejuvenate with our spa treatments',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/services/spa.jpg',
        },
        {
            title: 'Nail Care',
            description: 'Manicures, pedicures, and nail art',
            image: 'https://d3r0z4awu7ba6n.cloudfront.net/images/services/nails.jpg',
        },
    ];

    const trendingStyles = [
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/1.jpg',
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/2.jpg',
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/6.jpg',
        'https://d3r0z4awu7ba6n.cloudfront.net/images/looks/homeBanner/4.jpg',
    ];

    const partners = [
        { name: 'L\'Oreal', logo: '/partners/loreal.png' },
        { name: 'Schwarzkopf', logo: '/partners/schwarzkopf.png' },
        { name: 'Wella', logo: '/partners/wella.png' },
        { name: 'Redken', logo: '/partners/redken.png' },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                style={{
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    overflow: 'hidden',
                }}
            >
                {/* Background Pattern */}
                <Box
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                    }}
                />

                <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'center' }}
                    >
                        <Badge
                            size="lg"
                            variant="dot"
                            color="amber"
                            mb="xl"
                        >
                            Premium Styling Services
                        </Badge>

                        <Title
                            order={1}
                            style={{
                                fontSize: rem(72),
                                fontWeight: 900,
                                color: 'white',
                                marginBottom: rem(24),
                                lineHeight: 1.1,
                            }}
                        >
                            Transform Your Look
                            <br />
                            <Text
                                component="span"
                                inherit
                                variant="gradient"
                                gradient={{ from: '#f59e0b', to: '#d97706', deg: 45 }}
                            >
                                With Style
                            </Text>
                        </Title>

                        <Text
                            size="xl"
                            c="dimmed"
                            maw={600}
                            mx="auto"
                            mb="xl"
                        >
                            Experience world-class grooming and styling services from our expert team
                        </Text>

                        <Group justify="center" mt="xl">
                            <Button
                                component={Link}
                                to="/services"
                                size="lg"
                                color="amber"
                                rightSection={<IconArrowRight size={20} />}
                                styles={{
                                    root: {
                                        fontWeight: 700,
                                    },
                                }}
                            >
                                Explore Services
                            </Button>
                            {!user && (
                                <Button
                                    component={Link}
                                    to="/login"
                                    size="lg"
                                    variant="outline"
                                    color="gray"
                                    styles={{
                                        root: {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Sign Up Now
                                </Button>
                            )}
                        </Group>
                    </MotionBox>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
                <Container size="xl">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title order={2} ta="center" mb={rem(8)} fw={800}>
                            Our Achievements
                        </Title>
                        <Text size="lg" ta="center" c="dimmed" mb="xl" maw={600} mx="auto">
                            Numbers that speak for our excellence
                        </Text>
                    </MotionBox>

                    {statsLoading ? (
                        <Grid>
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                                    <Paper
                                        shadow="sm"
                                        p="xl"
                                        radius="lg"
                                        style={{ minHeight: 200 }}
                                    >
                                        <Loader size="md" />
                                    </Paper>
                                </Grid.Col>
                            ))}
                        </Grid>
                    ) : (
                        <Grid>
                            {stats.map((stat, index) => (
                                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                                    <StatCard
                                        iconName={stat.iconName}
                                        title={stat.title}
                                        count={stat.count}
                                        trend={stat.trend}
                                        color={stat.color}
                                    />
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            {/* Trending Styles Section */}
            <Box style={{ padding: '4rem 0', backgroundColor: 'rgba(30, 41, 59, 0.03)' }}>
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title order={2} ta="center" mb={rem(8)} fw={800}>
                            Trending Styles
                        </Title>
                        <Text size="lg" ta="center" c="dimmed" mb="xl" maw={600} mx="auto">
                            Discover the latest trends in grooming and styling
                        </Text>
                    </MotionBox>

                    <Grid>
                        {trendingStyles.map((image, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                                <MotionPaper
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -12 }}
                                    shadow="sm"
                                    radius="md"
                                    style={{
                                        height: 380,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        style={{
                                            height: '100%',
                                            backgroundImage: `url(${image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />

                                    <Box
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                                        }}
                                    />

                                    <Badge
                                        color="amber"
                                        variant="filled"
                                        style={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                        }}
                                    >
                                        {index % 2 === 0 ? 'TRENDING' : 'POPULAR'}
                                    </Badge>

                                    <Box
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            padding: rem(24),
                                            zIndex: 1,
                                        }}
                                    >
                                        <Title order={6} c="white" fw={700} mb={rem(4)}>
                                            Style {index + 1}
                                        </Title>
                                        <Text size="sm" c="white" opacity={0.9}>
                                            Latest grooming trends
                                        </Text>
                                    </Box>
                                </MotionPaper>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Services Section */}
            <Container size="lg" style={{ padding: '4rem 0' }}>
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Title order={2} ta="center" mb={rem(8)} fw={800}>
                        Our Services
                    </Title>
                    <Text size="lg" ta="center" c="dimmed" mb="xl" maw={600} mx="auto">
                        Premium grooming services tailored to your needs
                    </Text>
                </MotionBox>

                <Grid gutter="xl">
                    {services.map((service, index) => (
                        <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                            <MotionBox
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{
                                    y: -12,
                                    transition: { duration: 0.3 }
                                }}
                                style={{ height: '100%' }}
                            >
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    style={{
                                        height: 420,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                    onClick={() => navigate('/services')}
                                >
                                    <Card.Section>
                                        <Image
                                            src={service.image}
                                            height={200}
                                            alt={service.title}
                                        />
                                    </Card.Section>

                                    <Badge color="amber" variant="filled" mt="md">
                                        PREMIUM
                                    </Badge>

                                    <Title order={3} mt="md" fw={800}>
                                        {service.title}
                                    </Title>

                                    <Text size="sm" c="dimmed" mt="sm">
                                        {service.description}
                                    </Text>

                                    <Button
                                        color="amber"
                                        fullWidth
                                        mt="md"
                                        radius="md"
                                        rightSection={<IconArrowRight size={16} />}
                                    >
                                        Learn More
                                    </Button>
                                </Card>
                            </MotionBox>
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box style={{ backgroundColor: '#f59e0b', padding: '4rem 0', color: 'white' }}>
                <Container>
                    <Grid align="center">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MotionBox
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Title order={2} c="white" fw={800} mb="md">
                                    Ready to Transform Your Look?
                                </Title>
                                <Text size="lg" c="white" mb="xl">
                                    Book your appointment now and experience the difference
                                </Text>
                                <Group>
                                    <Button
                                        component={Link}
                                        to="/services"
                                        size="lg"
                                        variant="white"
                                        color="dark"
                                        rightSection={<IconArrowRight size={20} />}
                                    >
                                        Book Now
                                    </Button>
                                    <Button
                                        component="a"
                                        href="tel:+919999999999"
                                        size="lg"
                                        variant="outline"
                                        style={{
                                            borderColor: 'white',
                                            color: 'white',
                                        }}
                                        leftSection={<IconPhone size={20} />}
                                    >
                                        Call Us
                                    </Button>
                                </Group>
                            </MotionBox>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MotionBox
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image
                                    src="https://d3r0z4awu7ba6n.cloudfront.net/images/cta/booking.jpg"
                                    radius="md"
                                    alt="Book appointment"
                                />
                            </MotionBox>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            {/* Partners Section */}
            <Box style={{ padding: '4rem 0' }}>
                <Container>
                    <Title order={3} ta="center" mb="xl" c="dimmed" fw={700}>
                        Trusted by leading brands
                    </Title>

                    <Grid justify="center">
                        {partners.map((partner, index) => (
                            <Grid.Col key={index} span={{ base: 6, sm: 4, md: 3 }}>
                                <MotionPaper
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    shadow="xs"
                                    p="xl"
                                    radius="md"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: 100,
                                    }}
                                >
                                    <Text size="lg" fw={700} c="dimmed">
                                        {partner.name}
                                    </Text>
                                </MotionPaper>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
