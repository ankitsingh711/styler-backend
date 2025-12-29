import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Title,
    Text,
    Button,
    Grid,
    Paper,
    Group,
    Stack,
    Badge,
    rem,
    SimpleGrid,
} from '@mantine/core';
import {
    IconTarget,
    IconSparkles,
    IconHeart,
    IconUsers,
    IconTrophy,
    IconCertificate,
    IconLeaf,
    IconStar,
    IconYoga,
    IconCheck,
    IconMapPin,
    IconCalendar,
    IconArrowRight,
} from '@tabler/icons-react';
import CountUp from 'react-countup';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const About = () => {
    const stats = [
        { value: 6000, suffix: '+', label: 'Expert Stylists', icon: <IconUsers size={32} /> },
        { value: 162, suffix: '+', label: 'Locations Worldwide', icon: <IconMapPin size={32} /> },
        { value: 15, suffix: '+', label: 'Years of Excellence', icon: <IconCalendar size={32} /> },
        { value: 50, suffix: 'K+', label: 'Happy Clients', icon: <IconHeart size={32} /> },
    ];

    const values = [
        {
            icon: <IconTrophy size={40} />,
            title: 'Excellence',
            description: 'We strive for perfection in every service, using only the finest products and latest techniques.',
            color: '#f59e0b',
        },
        {
            icon: <IconHeart size={40} />,
            title: 'Trust',
            description: 'Building lasting relationships with our clients through honesty, integrity, and reliability.',
            color: '#ec4899',
        },
        {
            icon: <IconSparkles size={40} />,
            title: 'Innovation',
            description: 'Staying ahead with cutting-edge trends and technologies in beauty and wellness.',
            color: '#8b5cf6',
        },
        {
            icon: <IconUsers size={40} />,
            title: 'Care',
            description: 'Treating every client with personalized attention, respect, and genuine care.',
            color: '#14b8a6',
        },
    ];

    const features = [
        { icon: <IconTrophy size={32} />, title: 'Award-Winning Service', description: 'Recognized excellence in beauty and grooming services with multiple industry awards.' },
        { icon: <IconCertificate size={32} />, title: 'Certified Professionals', description: 'Our stylists are trained and certified in the latest techniques and trends.' },
        { icon: <IconLeaf size={32} />, title: 'Premium Products', description: 'We use only internationally recognized brands and high-quality products.' },
        { icon: <IconStar size={32} />, title: 'Personalized Experience', description: 'Customized services tailored to your unique style and preferences.' },
        { icon: <IconYoga size={32} />, title: 'Relaxing Ambiance', description: 'Modern, comfortable spaces designed for your relaxation and comfort.' },
        { icon: <IconCheck size={32} />, title: 'Satisfaction Guaranteed', description: 'Your happiness is our priority. We ensure complete satisfaction with every visit.' },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                style={{
                    minHeight: '60vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    overflow: 'hidden',
                }}
            >
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
                        <Badge size="lg" variant="dot" color="amber" mb="xl">
                            About Styler Salon
                        </Badge>

                        <Title
                            order={1}
                            style={{
                                fontSize: rem(56),
                                fontWeight: 900,
                                color: 'white',
                                marginBottom: rem(24),
                                lineHeight: 1.1,
                            }}
                        >
                            Where Beauty Meets
                            <br />
                            <Text
                                component="span"
                                inherit
                                variant="gradient"
                                gradient={{ from: '#f59e0b', to: '#d97706', deg: 45 }}
                            >
                                Excellence
                            </Text>
                        </Title>

                        <Text size="xl" c="dimmed" maw={700} mx="auto" mb="xl">
                            Transforming lives through exceptional beauty and grooming services since 2009
                        </Text>
                    </MotionBox>
                </Container>
            </Box>

            {/* Our Story Section */}
            <Box style={{ padding: '5rem 0', backgroundColor: '#f8f9fa' }}>
                <Container size="lg">
                    <Grid align="center" gutter="xl">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MotionBox
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge color="amber" size="lg" mb="md">Our Journey</Badge>
                                <Title order={2} fw={800} mb="md">Our Story</Title>
                                <Text size="md" c="dimmed" mb="md">
                                    Founded with a passion for beauty and excellence, Styler Salon has grown from a
                                    single location to over 162 branches nationally and internationally. Our journey
                                    began with a simple vision: to provide world-class beauty and grooming services
                                    that make everyone feel confident and beautiful.
                                </Text>
                                <Text size="md" c="dimmed">
                                    Today, we stand as a premium unisex salon trusted by thousands of clients who
                                    seek not just a service, but an experience. Every visit to Styler Salon is a
                                    journey of transformation, where our expert stylists bring your vision to life.
                                </Text>
                            </MotionBox>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MotionBox
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Paper
                                    radius="lg"
                                    style={{
                                        height: 400,
                                        backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                                    }}
                                />
                            </MotionBox>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            {/* Mission & Vision Section */}
            <Box style={{ padding: '5rem 0' }}>
                <Container size="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        mb="xl"
                    >
                        <Title order={2} ta="center" fw={800} mb={rem(8)}>
                            Our Mission & Vision
                        </Title>
                        <Text size="lg" ta="center" c="dimmed" maw={600} mx="auto">
                            Guiding principles that drive everything we do
                        </Text>
                    </MotionBox>

                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MotionPaper
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                shadow="sm"
                                p="xl"
                                radius="lg"
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                                    borderLeft: '4px solid #f59e0b',
                                }}
                            >
                                <Group mb="md">
                                    <Box
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconTarget size={32} color="#f59e0b" />
                                    </Box>
                                </Group>
                                <Title order={3} fw={700} mb="md">Our Mission</Title>
                                <Text c="dimmed">
                                    To provide exceptional beauty and grooming services that enhance confidence
                                    and bring out the best in every individual through expert care, premium
                                    products, and personalized attention.
                                </Text>
                            </MotionPaper>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MotionPaper
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                shadow="sm"
                                p="xl"
                                radius="lg"
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                    borderLeft: '4px solid #8b5cf6',
                                }}
                            >
                                <Group mb="md">
                                    <Box
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconSparkles size={32} color="#8b5cf6" />
                                    </Box>
                                </Group>
                                <Title order={3} fw={700} mb="md">Our Vision</Title>
                                <Text c="dimmed">
                                    To be the most trusted and sought-after salon chain globally, setting new
                                    standards in beauty and wellness while empowering individuals to express
                                    their unique style with confidence.
                                </Text>
                            </MotionPaper>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box style={{ padding: '5rem 0', backgroundColor: '#1e293b', color: 'white' }}>
                <Container size="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        mb="xl"
                    >
                        <Title order={2} ta="center" c="white" fw={800} mb={rem(8)}>
                            Our Achievements
                        </Title>
                        <Text size="lg" ta="center" c="dimmed" maw={600} mx="auto">
                            Numbers that speak for our excellence
                        </Text>
                    </MotionBox>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                        {stats.map((stat, index) => (
                            <MotionPaper
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                p="xl"
                                radius="lg"
                                ta="center"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                <Box
                                    style={{
                                        color: '#f59e0b',
                                        marginBottom: rem(16),
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Title order={2} c="white" fw={900} mb="xs">
                                    <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} enableScrollSpy />
                                </Title>
                                <Text c="dimmed" size="sm" fw={600}>
                                    {stat.label}
                                </Text>
                            </MotionPaper>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Values Section */}
            <Box style={{ padding: '5rem 0', backgroundColor: '#f8f9fa' }}>
                <Container size="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        mb="xl"
                    >
                        <Title order={2} ta="center" fw={800} mb={rem(8)}>
                            Our Core Values
                        </Title>
                        <Text size="lg" ta="center" c="dimmed" maw={600} mx="auto">
                            The principles that define who we are
                        </Text>
                    </MotionBox>

                    <Grid gutter="xl">
                        {values.map((value, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                                <MotionPaper
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    shadow="sm"
                                    p="xl"
                                    radius="lg"
                                    style={{ height: '100%', cursor: 'pointer' }}
                                >
                                    <Box
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: rem(12),
                                            backgroundColor: `${value.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: rem(20),
                                            color: value.color,
                                        }}
                                    >
                                        {value.icon}
                                    </Box>
                                    <Title order={3} fw={700} mb="md">
                                        {value.title}
                                    </Title>
                                    <Text c="dimmed">
                                        {value.description}
                                    </Text>
                                </MotionPaper>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Why Choose Us Section */}
            <Box style={{ padding: '5rem 0' }}>
                <Container size="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        mb="xl"
                    >
                        <Title order={2} ta="center" fw={800} mb={rem(8)}>
                            Why Choose Styler Salon?
                        </Title>
                        <Text size="lg" ta="center" c="dimmed" maw={600} mx="auto">
                            Experience the difference that sets us apart
                        </Text>
                    </MotionBox>

                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                        {features.map((feature, index) => (
                            <MotionPaper
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                                shadow="sm"
                                p="xl"
                                radius="lg"
                                style={{ cursor: 'pointer' }}
                            >
                                <Box
                                    style={{
                                        color: '#f59e0b',
                                        marginBottom: rem(16),
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Title order={4} fw={700} mb="sm">
                                    {feature.title}
                                </Title>
                                <Text c="dimmed" size="sm">
                                    {feature.description}
                                </Text>
                            </MotionPaper>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box style={{ backgroundColor: '#f59e0b', padding: '4rem 0', color: 'white' }}>
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center' }}
                    >
                        <Title order={2} c="white" fw={800} mb="md">
                            Ready to Transform Your Look?
                        </Title>
                        <Text size="lg" c="white" mb="xl" maw={600} mx="auto">
                            Book your appointment today and experience the Styler difference
                        </Text>
                        <Group justify="center">
                            <Button
                                component={Link}
                                to="/services"
                                size="lg"
                                variant="white"
                                color="dark"
                                rightSection={<IconArrowRight size={20} />}
                                styles={{
                                    root: {
                                        fontWeight: 700,
                                    },
                                }}
                            >
                                Book Now
                            </Button>
                            <Button
                                component={Link}
                                to="/services"
                                size="lg"
                                variant="outline"
                                style={{
                                    borderColor: 'white',
                                    color: 'white',
                                }}
                            >
                                View Services
                            </Button>
                        </Group>
                    </MotionBox>
                </Container>
            </Box>
        </Box>
    );
};

export default About;
