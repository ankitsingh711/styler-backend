import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Block, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MotionPaper = motion(Paper);

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Container maxWidth="sm">
                <MotionPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    elevation={8}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        borderRadius: 3,
                    }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        <Block
                            sx={{
                                fontSize: 80,
                                color: 'error.main',
                                mb: 2,
                            }}
                        />
                    </motion.div>

                    <Typography
                        variant="h3"
                        fontWeight={800}
                        gutterBottom
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        403
                    </Typography>

                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Access Denied
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6b4298 100%)',
                            },
                        }}
                    >
                        Go Back
                    </Button>
                </MotionPaper>
            </Container>
        </Box>
    );
};

export default Unauthorized;
