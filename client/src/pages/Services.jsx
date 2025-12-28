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
} from '@mantine/core';
import {
    IconScissors,
    IconUser,
    IconCalendar,
    IconClock,
    IconCircleCheck,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/common/ServiceCard';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { DateInput, TimeInput } from '@mantine/dates';

const MotionBox = motion(Box);

const Services = () => {
    const [stylers, setStylers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedStyler, setSelectedStyler] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

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
            await bookingService.createAppointment({
                stylerId: selectedStyler,
                serviceId: selectedService,
                date: selectedDate?.toISOString().split('T')[0],
                time: selectedTime,
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
        if (!selectedDate || !selectedTime) return 2;
        return 3;
    };

    return (
        <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: rem(32), paddingBottom: rem(32) }}>
            {/* Hero Section */}
            <Box
                style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    paddingTop: rem(48),
                    paddingBottom: rem(48),
                    marginBottom: rem(48),
                }}
            >
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title order={1} ta="center" fw={800} c="white" mb="xs">
                            Our Premium Services
                        </Title>
                        <Text size="xl" ta="center" c="white" opacity={0.9} maw={600} mx="auto">
                            Choose from our range of professional grooming services
                        </Text>
                    </MotionBox>
                </Container>
            </Box>

            <Container>
                <Grid gutter="xl">
                    {/* Services Grid */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Title order={3} fw={700} mb="lg">
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
                                    {services.map((service) => (
                                        <Grid.Col key={service._id} span={{ base: 12, sm: 6 }}>
                                            <ServiceCard
                                                service={service}
                                                onBook={() => setSelectedService(service._id)}
                                            />
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper p="xl" radius="md" style={{ textAlign: 'center' }}>
                                    <IconScissors size={64} opacity={0.5} style={{ margin: '0 auto', marginBottom: rem(16) }} />
                                    <Text c="dimmed">
                                        No services available at the moment.
                                    </Text>
                                </Paper>
                            )}
                        </MotionBox>
                    </Grid.Col>

                    {/* Booking Form */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Paper
                                shadow="md"
                                p="xl"
                                radius="lg"
                                style={{
                                    position: 'sticky',
                                    top: 100,
                                }}
                            >
                                <Title order={3} fw={700} mb="md">
                                    Book Appointment
                                </Title>

                                {/* Stepper */}
                                <Stepper active={getActiveStep()} mb="xl" mt="md">
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
                                                icon={message.type === 'success' ? <IconCircleCheck size={16} /> : undefined}
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
                                    />

                                    <DateInput
                                        label="Select Date"
                                        placeholder="Pick a date"
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        leftSection={<IconCalendar size={16} />}
                                        minDate={new Date()}
                                        disabled={!selectedStyler}
                                        mb="md"
                                        required
                                    />

                                    <Select
                                        label="Select Time"
                                        placeholder="Choose a time slot"
                                        data={timeSlots}
                                        value={selectedTime}
                                        onChange={setSelectedTime}
                                        leftSection={<IconClock size={16} />}
                                        disabled={!selectedDate}
                                        mb="md"
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        color="amber"
                                        loading={loading}
                                        disabled={!selectedService || !selectedStyler || !selectedDate || !selectedTime}
                                        styles={{
                                            root: {
                                                fontWeight: 700,
                                            },
                                        }}
                                    >
                                        Confirm Booking
                                    </Button>

                                    {!isAuthenticated() && (
                                        <Alert color="blue" mt="md">
                                            Please login to book an appointment
                                        </Alert>
                                    )}
                                </Box>
                            </Paper>
                        </MotionBox>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
};

export default Services;
