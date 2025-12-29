import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Badge, Spin, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../services/statsService';
import './Home.css';

const { Title, Text } = Typography;

const MotionDiv = motion.div;

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
    const [stats, setStats] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                const statsArray = Array.isArray(data) ? data : (data?.stats || []);

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

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-pattern" />

                <div className="hero-container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-content"
                    >
                        <Badge.Ribbon text="Premium Styling Services" color="#f59e0b">
                            <div style={{ paddingTop: 20 }} />
                        </Badge.Ribbon>

                        <Title level={1} className="hero-title">
                            Transform Your Look
                            <br />
                            <span className="hero-title-gradient">With Style</span>
                        </Title>

                        <Text className="hero-subtitle">
                            Experience world-class grooming and styling services from our expert team
                        </Text>

                        <Space size="large" className="hero-buttons">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ArrowRightOutlined />}
                                onClick={() => navigate('/services')}
                                className="hero-btn-primary"
                            >
                                Explore Services
                            </Button>
                            {!user && (
                                <Button
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    className="hero-btn-secondary"
                                >
                                    Sign Up Now
                                </Button>
                            )}
                        </Space>
                    </MotionDiv>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title level={2} className="section-title">
                            Our Achievements
                        </Title>
                        <Text className="section-subtitle">
                            Numbers that speak for our excellence
                        </Text>

                        {statsLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Row gutter={[24, 24]} style={{ marginTop: '3rem' }}>
                                {stats.map((stat, index) => (
                                    <Col key={index} xs={24} sm={12} md={8} lg={4}>
                                        <StatCard {...stat} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </MotionDiv>
                </div>
            </div>

            {/* Services Section */}
            <div className="services-section">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Title level={2} className="section-title">
                            Our Services
                        </Title>
                        <Text className="section-subtitle">
                            Discover our range of professional services
                        </Text>

                        <Row gutter={[32, 32]} style={{ marginTop: '3rem' }}>
                            {services.map((service, index) => (
                                <Col key={index} xs={24} sm={12} md={6}>
                                    <Card
                                        hoverable
                                        cover={
                                            <img
                                                alt={service.title}
                                                src={service.image}
                                                style={{ height: 250, objectFit: 'cover' }}
                                            />
                                        }
                                        className="service-card"
                                    >
                                        <Card.Meta
                                            title={service.title}
                                            description={service.description}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/services')}
                            >
                                View All Services
                            </Button>
                        </div>
                    </MotionDiv>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="cta-content"
                    >
                        <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
                            Ready to Transform Your Look?
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 18, display: 'block', marginBottom: 32 }}>
                            Book your appointment today and experience the difference
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/services')}
                            className="cta-button"
                        >
                            Book Now
                        </Button>
                    </MotionDiv>
                </div>
            </div>
        </div>
    );
};

export default Home;
