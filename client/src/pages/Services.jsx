import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import './Services.css';

const Services = () => {
    const [stylers, setStylers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedStyler, setSelectedStyler] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
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

            // Reset form
            setSelectedStyler('');
            setSelectedService('');
            setSelectedDate('');
            setSelectedTime('');

            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to book appointment. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="services-page">
            <div className="services-header">
                <h1>Gentlemen's Grooming Services</h1>
                <p>Book your appointment with our expert stylers</p>
            </div>

            <div className="services-container">
                {/* Services List */}
                <section className="services-list">
                    <h2>Our Services</h2>
                    <div className="service-cards">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <div key={service._id} className="service-card">
                                    <h3>{service.name || service.serviceName}</h3>
                                    <p className="service-price">₹{service.price || service.amount}</p>
                                    <p className="service-description">{service.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No services available at the moment.</p>
                        )}
                    </div>
                </section>

                {/* Booking Form */}
                <section className="booking-section">
                    <h2>Book Your Appointment</h2>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleBooking} className="booking-form">
                        <div className="form-group">
                            <label htmlFor="styler">Select Styler</label>
                            <select
                                id="styler"
                                value={selectedStyler}
                                onChange={(e) => setSelectedStyler(e.target.value)}
                                required
                            >
                                <option value="">Choose a styler</option>
                                {stylers.map((styler) => (
                                    <option key={styler._id} value={styler._id}>
                                        {styler.name} - {styler.specialization || 'Expert Styler'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="service">Select Service</label>
                            <select
                                id="service"
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                required
                            >
                                <option value="">Choose a service</option>
                                {services.map((service) => (
                                    <option key={service._id} value={service._id}>
                                        {service.name || service.serviceName} - ₹{service.price || service.amount}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Select Date</label>
                            <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="time">Select Time</label>
                            <select
                                id="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                            >
                                <option value="">Choose a time slot</option>
                                <option value="09:00">09:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="14:00">02:00 PM</option>
                                <option value="15:00">03:00 PM</option>
                                <option value="16:00">04:00 PM</option>
                                <option value="17:00">05:00 PM</option>
                                <option value="18:00">06:00 PM</option>
                            </select>
                        </div>

                        <button type="submit" className="book-btn" disabled={loading}>
                            {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Services;
