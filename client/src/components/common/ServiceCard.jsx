import { useState } from 'react';
import { Card, Image, Text, Button, Box, Badge, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconScissors } from '@tabler/icons-react';

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
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                    height: '100%',
                    minHeight: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {image && !imageError ? (
                    <Card.Section>
                        <Image
                            src={image}
                            height={200}
                            alt={displayName}
                            onError={() => setImageError(true)}
                            style={{
                                transition: 'transform 0.4s ease',
                            }}
                        />
                    </Card.Section>
                ) : (
                    <Card.Section>
                        <Box
                            style={{
                                height: 200,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                color: 'white',
                            }}
                        >
                            <IconScissors size={64} opacity={0.7} />
                        </Box>
                    </Card.Section>
                )}

                <Box style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                    <Badge color="amber" size="lg" variant="filled">
                        ₹{displayPrice}
                    </Badge>
                </Box>

                <Box style={{ flexGrow: 1, paddingTop: '1rem' }}>
                    <Text size="xl" fw={700} style={{ minHeight: 64 }}>
                        {displayName}
                    </Text>
                    <Text
                        size="sm"
                        c="dimmed"
                        mt="xs"
                        lineClamp={2}
                        style={{ minHeight: 40 }}
                    >
                        {description || 'Premium grooming service tailored for you'}
                    </Text>
                </Box>

                <Button
                    fullWidth
                    color="amber"
                    onClick={() => onBook && onBook(service)}
                    mt="md"
                    styles={{
                        root: {
                            fontWeight: 600,
                        },
                    }}
                >
                    Book Now
                </Button>
            </Card>
        </motion.div>
    );
};

export default ServiceCard;
