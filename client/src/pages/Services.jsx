import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    MenuItem,
    Alert,
    Skeleton,
    alpha,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    ContentCut,
    Person,
    CalendarMonth,
    AccessTime,
    CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/common/ServiceCard';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);

const Services = () => {
    const [stylers, setStylers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedStyler, setSelectedStyler] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
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
                date: selectedDate,
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
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    py: { xs: 6, md: 8 },
                    mb: 6,
                }}
            >
                <Container>
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h2" align="center" fontWeight={800} gutterBottom>
                            Our Premium Services
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                            Choose from our range of professional grooming services
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>

            <Container>
                <Grid container spacing={4}>
                    {/* Services Grid */}
                    <Grid item xs={12} md={7}>
                        <MotionBox
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                Available Services
                            </Typography>

                            {dataLoading ? (
                                <Grid container spacing={3}>
                                    {[1, 2, 3, 4].map((item) => (
                                        <Grid item xs={12} sm={6} key={item}>
                                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : services.length > 0 ? (
                                <Grid container spacing={3}>
                                    {services.map((service) => (
                                        <Grid item xs={12} sm={6} key={service._id}>
                                            <ServiceCard
                                                service={service}
                                                onBook={() => setSelectedService(service._id)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper sx={{ p: 4, textAlign: 'center' }}>
                                    <ContentCut sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        No services available at the moment.
                                    </Typography>
                                </Paper>
                            )}
                        </MotionBox>
                    </Grid>

                    {/* Booking Form */}
                    <Grid item xs={12} md={5}>
                        <MotionBox
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    position: { md: 'sticky' },
                                    top: 100,
                                    borderRadius: 4,
                                }}
                            >
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    Book Appointment
                                </Typography>

                                {/* Stepper */}
                                <Stepper activeStep={getActiveStep()} sx={{ mb: 4, mt: 3 }}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
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
                                                severity={message.type}
                                                sx={{ mb: 3 }}
                                                icon={message.type === 'success' ? <CheckCircle /> : undefined}
                                            >
                                                {message.text}
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Box component="form" onSubmit={handleBooking}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Service"
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                        required
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            startAdornment: <ContentCut sx={{ mr: 1, color: 'text.secondary' }} />,
                                        }}
                                    >
                                        <MenuItem value="">Choose a service</MenuItem>
                                        {services.map((service) => (
                                            <MenuItem key={service._id} value={service._id}>
                                                {service.name || service.serviceName} - ₹{service.price || service.amount}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Styler"
                                        value={selectedStyler}
                                        onChange={(e) => setSelectedStyler(e.target.value)}
                                        required
                                        disabled={!selectedService}
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                                        }}
                                    >
                                        <MenuItem value="">Choose a styler</MenuItem>
                                        {stylers.map((styler) => (
                                            <MenuItem key={styler._id} value={styler._id}>
                                                {styler.name} - {styler.specialization || 'Expert Styler'}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        type="date"
                                        fullWidth
                                        label="Select Date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                        required
                                        disabled={!selectedStyler}
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            startAdornment: <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />,
                                        }}
                                    />

                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        required
                                        disabled={!selectedDate}
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />,
                                        }}
                                    >
                                        <MenuItem value="">Choose a time slot</MenuItem>
                                        {timeSlots.map((time) => (
                                            <MenuItem key={time} value={time}>
                                                {time}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={loading || !selectedService || !selectedStyler || !selectedDate || !selectedTime}
                                        sx={{
                                            py: 1.5,
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                        }}
                                    >
                                        {loading ? 'Booking...' : 'Confirm Booking'}
                                    </Button>

                                    {!isAuthenticated() && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            Please login to book an appointment
                                        </Alert>
                                    )}
                                </Box>
                            </Paper>
                        </MotionBox>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Services;
