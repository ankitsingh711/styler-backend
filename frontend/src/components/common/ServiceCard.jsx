import { useState } from 'react';
import { Card, Typography, Button, Badge } from 'antd';
import { motion } from 'framer-motion';
import { ScissorOutlined } from '@ant-design/icons';
import './ServiceCard.css';

const { Text } = Typography;

const ServiceCard = ({ service, onBook }) => {
    const { name, serviceName, price, amount, description, image } = service;
    const [imageError, setImageError] = useState(false);

    const displayName = name || serviceName;
    const displayPrice = price || amount;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
        >
            <Card
                hoverable
                className="service-card-component"
                cover={
                    image && !imageError ? (
                        <img
                            src={image}
                            alt={displayName}
                            onError={() => setImageError(true)}
                            style={{ height: 200, objectFit: 'cover' }}
                        />
                    ) : (
                        <div className="service-card-placeholder">
                            <ScissorOutlined style={{ fontSize: 64, opacity: 0.7 }} />
                        </div>
                    )
                }
            >
                <Badge.Ribbon text={`₹${displayPrice}`} color="#f59e0b">
                    <div style={{ minHeight: 120 }}>
                        <Text strong style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>
                            {displayName}
                        </Text>
                        <Text type="secondary" ellipsis={{ rows: 2 }} style={{ display: 'block', marginBottom: 16, minHeight: 40 }}>
                            {description || 'Premium grooming service tailored for you'}
                        </Text>
                        <Button
                            type="primary"
                            block
                            onClick={() => onBook && onBook(service)}
                        >
                            Book Now
                        </Button>
                    </div>
                </Badge.Ribbon>
            </Card>
        </motion.div>
    );
};

export default ServiceCard;
