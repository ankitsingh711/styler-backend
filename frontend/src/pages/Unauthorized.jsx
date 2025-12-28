import React from 'react';
import { Box, Container, Title, Text, Button, Paper, Center, rem } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconShieldX, IconArrowLeft } from '@tabler/icons-react';
import { motion } from

    'framer-motion';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Center style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fdba74 100%)' }}>
            <Container size="sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        shadow="xl"
                        p="xl"
                        radius="lg"
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        >
                            <Box
                                style={{
                                    width: rem(120),
                                    height: rem(120),
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    marginBottom: rem(24),
                                    boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                                }}
                            >
                                <IconShieldX size={64} color="white" stroke={2} />
                            </Box>
                        </motion.div>

                        <Title order={1} fw={900} mb="md" style={{ fontSize: rem(48) }}>
                            403
                        </Title>

                        <Title order={2} fw={700} mb="sm">
                            Access Denied
                        </Title>

                        <Text size="lg" c="dimmed" mb="xl">
                            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                        </Text>

                        <Button
                            size="lg"
                            color="amber"
                            leftSection={<IconArrowLeft size={20} />}
                            onClick={handleGoBack}
                            styles={{
                                root: {
                                    fontWeight: 700,
                                },
                            }}
                        >
                            Go Back
                        </Button>
                    </Paper>
                </motion.div>
            </Container>
        </Center>
    );
};

export default Unauthorized;
