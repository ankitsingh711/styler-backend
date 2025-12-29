import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card } from 'antd';
import {
    TrophyOutlined,
    HeartOutlined,
    ThunderboltOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    StarOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    ArrowRightOutlined,
    ScissorOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import './About.css';

const { Title, Text, Paragraph } = Typography;
const MotionDiv = motion.div;

const About = () => {
    const navigate = useNavigate();

    const stats = [
        { value: 150, suffix: '+', label: 'Expert Stylists', icon: <TeamOutlined />, color: '#f59e0b' },
        { value: 20, suffix: '+', label: 'Locations', icon: <EnvironmentOutlined />, color: '#14b8a6' },
        { value: 15, suffix: '+', label: 'Years Experience', icon: <CalendarOutlined />, color: '#8b5cf6' },
        { value: 5000, suffix: '+', label: 'Happy Clients', icon: <HeartOutlined />, color: '#ec4899' },
    ];

    const values = [
        {
            icon: <TrophyOutlined />,
            title: 'Excellence',
            description: 'We strive for perfection in every service, using only the finest products and latest techniques.',
            color: '#f59e0b',
        },
        {
            icon: <HeartOutlined />,
            title: 'Trust',
            description: 'Building lasting relationships with our clients through honesty, integrity, and reliability.',
            color: '#ec4899',
        },
        {
            icon: <ThunderboltOutlined />,
            title: 'Innovation',
            description: 'Staying ahead with cutting-edge trends and technologies in beauty and wellness.',
            color: '#8b5cf6',
        },
        {
            icon: <TeamOutlined />,
            title: 'Care',
            description: 'Treating every client with personalized attention, respect, and genuine care.',
            color: '#14b8a6',
        },
    ];

    const features = [
        {
            icon: <SafetyCertificateOutlined />,
            title: 'Certified Professionals',
            description: 'Our stylists are trained and certified in the latest techniques and trends.',
        },
        {
            icon: <StarOutlined />,
            title: 'Premium Products',
            description: 'We use only top-tier, professional-grade products for exceptional results.',
        },
        {
            icon: <CheckCircleOutlined />,
            title: 'Satisfaction Guaranteed',
            description: "Your happiness is our priority. We ensure you leave loving your look.",
        },
        {
            icon: <ScissorOutlined />,
            title: 'Personalized Service',
            description: 'Every client receives customized care tailored to their unique style.',
        },
    ];

    return (
        <div className="about-page-modern">
            {/* Hero Section */}
            <section className="about-hero-modern">
                <div className="about-hero-pattern" />
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="about-hero-content-modern"
                    >
                        <div className="about-badge">
                            <ScissorOutlined /> About Styler
                        </div>
                        <Title level={1} className="about-hero-title-modern">
                            Where Beauty Meets
                            <br />
                            <span className="gradient-text-about">Excellence</span>
                        </Title>
                        <Paragraph className="about-hero-description">
                            Transforming lives through exceptional beauty and grooming services since 2009.
                            We combine artistry, expertise, and passion to create stunning results that make you feel confident and beautiful.
                        </Paragraph>
                    </MotionDiv>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats-modern">
                <div className="container">
                    <Row gutter={[24, 24]}>
                        {stats.map((stat, index) => (
                            <Col key={index} xs={24} sm={12} lg={6}>
                                <MotionDiv
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="about-stat-card" bordered={false}>
                                        <div className="about-stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <div className="about-stat-number" style={{ color: stat.color }}>
                                            <CountUp end={stat.value} duration={2.5} separator="," />
                                            {stat.suffix}
                                        </div>
                                        <div className="about-stat-label">{stat.label}</div>
                                    </Card>
                                </MotionDiv>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story-modern">
                <div className="container">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <MotionDiv
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="story-content">
                                    <Title level={2} className="story-title">
                                        Our Story
                                    </Title>
                                    <Paragraph className="story-text">
                                        Founded in 2009, Styler began with a simple vision: to create a space where everyone could experience premium grooming services in a welcoming, professional environment.
                                    </Paragraph>
                                    <Paragraph className="story-text">
                                        Over the years, we've grown from a single salon to 20+ locations nationwide, but our commitment to excellence has remained unchanged. We believe that great style starts with great care, and every client deserves personalized attention from certified professionals who are passionate about their craft.
                                    </Paragraph>
                                    <Paragraph className="story-text">
                                        Today, we're proud to serve thousands of happy clients, offering cutting-edge styles, premium products, and an experience that goes beyond just a haircut—it's about confidence, community, and celebrating your unique beauty.
                                    </Paragraph>
                                </div>
                            </MotionDiv>
                        </Col>
                        <Col xs={24} lg={12}>
                            <MotionDiv
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="story-image-placeholder">
                                    <ScissorOutlined className="story-icon" />
                                    <div className="story-image-text">Premium Grooming Experience</div>
                                </div>
                            </MotionDiv>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values-modern">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="section-header-center">
                            <Title level={2} className="section-title-modern">
                                Our Core Values
                            </Title>
                            <Text className="section-subtitle-modern">
                                The principles that guide everything we do
                            </Text>
                        </div>

                        <Row gutter={[24, 24]}>
                            {values.map((value, index) => (
                                <Col key={index} xs={24} sm={12} lg={6}>
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                    >
                                        <Card className="value-card-modern" bordered={false}>
                                            <div className="value-icon-box" style={{ backgroundColor: `${value.color}15`, color: value.color }}>
                                                {value.icon}
                                            </div>
                                            <Title level={4} className="value-title">{value.title}</Title>
                                            <Text className="value-description">{value.description}</Text>
                                        </Card>
                                    </MotionDiv>
                                </Col>
                            ))}
                        </Row>
                    </MotionDiv>
                </div>
            </section>

            {/* Features Section */}
            <section className="about-features-modern">
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="section-header-center">
                            <Title level={2} className="section-title-modern">
                                Why Choose Styler
                            </Title>
                            <Text className="section-subtitle-modern">
                                Experience the difference that sets us apart
                            </Text>
                        </div>

                        <Row gutter={[32, 32]}>
                            {features.map((feature, index) => (
                                <Col key={index} xs={24} sm={12} lg={6}>
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="feature-item-modern">
                                            <div className="feature-icon-modern">
                                                {feature.icon}
                                            </div>
                                            <Title level={5} className="feature-title-modern">
                                                {feature.title}
                                            </Title>
                                            <Text className="feature-description-modern">
                                                {feature.description}
                                            </Text>
                                        </div>
                                    </MotionDiv>
                                </Col>
                            ))}
                        </Row>
                    </MotionDiv>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta-modern">
                <div className="about-cta-pattern" />
                <div className="container">
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="about-cta-content"
                    >
                        <Title level={2} className="about-cta-title">
                            Ready to Experience Excellence?
                        </Title>
                        <Text className="about-cta-description">
                            Book your appointment today and discover why thousands trust Styler for their grooming needs
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRightOutlined />}
                            onClick={() => navigate('/services')}
                            className="about-cta-button"
                        >
                            Book Now
                        </Button>
                    </MotionDiv>
                </div>
            </section>
        </div>
    );
};

export default About;
