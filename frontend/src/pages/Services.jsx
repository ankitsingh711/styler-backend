import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Title,
    Text,
    Grid,
    Paper,
    Select,
    Button,
    Alert,
    Skeleton,
    Stepper,
    rem,
    Badge,
} from '@mantine/core';
import {
    IconScissors,
    IconUser,
    IconCalendar,
    IconClock,
    IconCircleCheck,
    IconAlertCircle,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/common/ServiceCard';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Services = () => {
    const [stylers, setStylers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedStyler, setSelectedStyler] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();



    const steps = ['Select Service', 'Choose Styler', 'Pick Date & Time'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setDataLoading(true);
        try {
            const [stylersData, servicesData] = await Promise.all([
                bookingService.getStylers(),
                bookingService.getServices(),
            ]);

            const stylersList = stylersData.data || stylersData || [];
            const servicesList = servicesData.data || servicesData || [];

            setStylers(stylersList);
            setServices(servicesList);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const date = selectedDateTime?.toISOString().split('T')[0];
            const time = selectedDateTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

            await bookingService.createAppointment({
                stylerId: selectedStyler,
                serviceId: selectedService,
                date: date,
                time: time,
            });

            setMessage({ type: 'success', text: 'Appointment booked successfully!' });

            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to book appointment. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const getActiveStep = () => {
        if (!selectedService) return 0;
        if (!selectedStyler) return 1;
        if (!selectedDateTime) return 2;
        return 3;
    };

    return (
        <Box>
            {/* Hero Section */}
            <Box
                style={{
                    minHeight: '50vh',
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

                <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'center' }}
                    >
                        <Badge size="lg" variant="dot" color="amber" mb="xl">
                            Premium Services
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
                            Our Professional
                            <br />
                            <Text
                                component="span"
                                inherit
                                variant="gradient"
                                gradient={{ from: '#f59e0b', to: '#d97706', deg: 45 }}
                            >
                                Grooming Services
                            </Text>
                        </Title>

                        <Text size="xl" c="dimmed" maw={700} mx="auto">
                            Choose from our range of expert services and book your appointment today
                        </Text>
                    </MotionBox>
                </Container>
            </Box>

            {/* Main Content */}
            <Box style={{ backgroundColor: '#f8f9fa', paddingTop: rem(64), paddingBottom: rem(64) }}>
                <Container size="xl">
                    <Grid gutter="xl">
                        {/* Services Grid */}
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <MotionBox
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Title order={2} fw={800} mb="lg">
                                    Available Services
                                </Title>

                                {dataLoading ? (
                                    <Grid>
                                        {[1, 2, 3, 4].map((item) => (
                                            <Grid.Col key={item} span={{ base: 12, sm: 6 }}>
                                                <Skeleton height={300} radius="md" />
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                ) : services.length > 0 ? (
                                    <Grid>
                                        {services.map((service, index) => (
                                            <Grid.Col key={service._id} span={{ base: 12, sm: 6 }}>
                                                <MotionBox
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                >
                                                    <ServiceCard
                                                        service={service}
                                                        onBook={() => setSelectedService(service._id)}
                                                        isSelected={selectedService === service._id}
                                                    />
                                                </MotionBox>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Paper p="xl" radius="md" shadow="sm" style={{ textAlign: 'center' }}>
                                        <IconScissors size={64} color="#cbd5e1" style={{ margin: '0 auto', marginBottom: rem(16) }} />
                                        <Title order={4} c="dimmed" mb="xs">
                                            No Services Available
                                        </Title>
                                        <Text c="dimmed" size="sm">
                                            Please check back later for our available services.
                                        </Text>
                                    </Paper>
                                )}
                            </MotionBox>
                        </Grid.Col>

                        {/* Booking Form */}
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <MotionPaper
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                shadow="lg"
                                p="xl"
                                radius="lg"
                                style={{
                                    position: 'sticky',
                                    top: 100,
                                    background: 'white',
                                    border: '1px solid rgba(245, 158, 11, 0.1)',
                                }}
                            >
                                <Title order={3} fw={800} mb="md">
                                    Book Appointment
                                </Title>

                                {/* Stepper */}
                                <Stepper active={getActiveStep()} mb="xl" mt="md" color="amber">
                                    {steps.map((label) => (
                                        <Stepper.Step key={label} label={label} />
                                    ))}
                                </Stepper>

                                <AnimatePresence mode="wait">
                                    {message.text && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <Alert
                                                color={message.type === 'success' ? 'green' : 'red'}
                                                mb="md"
                                                icon={message.type === 'success' ? <IconCircleCheck size={16} /> : <IconAlertCircle size={16} />}
                                            >
                                                {message.text}
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Box component="form" onSubmit={handleBooking}>
                                    <Select
                                        label="Select Service"
                                        placeholder="Choose a service"
                                        data={services.map(s => ({
                                            value: s._id,
                                            label: `${s.name || s.serviceName} - ₹${s.price || s.amount}`
                                        }))}
                                        value={selectedService}
                                        onChange={setSelectedService}
                                        leftSection={<IconScissors size={16} />}
                                        mb="md"
                                        required
                                        styles={{
                                            input: {
                                                '&:focus': {
                                                    borderColor: '#f59e0b',
                                                },
                                            },
                                        }}
                                    />

                                    <Select
                                        label="Select Styler"
                                        placeholder="Choose a styler"
                                        data={stylers.map(s => ({
                                            value: s._id,
                                            label: `${s.name} - ${s.specialization || 'Expert Styler'}`
                                        }))}
                                        value={selectedStyler}
                                        onChange={setSelectedStyler}
                                        leftSection={<IconUser size={16} />}
                                        disabled={!selectedService}
                                        mb="md"
                                        required
                                        styles={{
                                            input: {
                                                '&:focus': {
                                                    borderColor: '#f59e0b',
                                                },
                                            },
                                        }}
                                    />

                                    <Box mb="md">
                                        <Text size="sm" fw={500} mb={4}>
                                            Select Date & Time <Text component="span" c="red">*</Text>
                                        </Text>
                                        <DatePicker
                                            selected={selectedDateTime}
                                            onChange={setSelectedDateTime}
                                            minDate={new Date()}
                                            disabled={!selectedStyler}
                                            required
                                            placeholderText="Pick date and time"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            showTimeSelect
                                            timeIntervals={30}
                                            timeCaption="Time"
                                            minTime={new Date().setHours(9, 0)}
                                            maxTime={new Date().setHours(18, 0)}
                                            className="custom-datepicker"
                                            calendarClassName="custom-calendar"
                                            wrapperClassName="datepicker-wrapper"
                                        />
                                    </Box>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        color="amber"
                                        loading={loading}
                                        disabled={!selectedService || !selectedStyler || !selectedDateTime}
                                        styles={{
                                            root: {
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                                },
                                                '&:disabled': {
                                                    background: '#e5e7eb',
                                                },
                                            },
                                        }}
                                    >
                                        Confirm Booking
                                    </Button>

                                    {!isAuthenticated() && (
                                        <Alert color="blue" mt="md" icon={<IconAlertCircle size={16} />}>
                                            Please login to book an appointment
                                        </Alert>
                                    )}
                                </Box>
                            </MotionPaper>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Services;
