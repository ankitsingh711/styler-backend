import { Card, CardContent, CardMedia, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { ContentCut } from '@mui/icons-material';

const ServiceCard = ({ service, onBook }) => {
    const { name, serviceName, price, amount, description, image } = service;

    const displayName = name || serviceName;
    const displayPrice = price || amount;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        '& .service-image': {
                            transform: 'scale(1.1)',
                        },
                    },
                }}
            >
                {image ? (
                    <CardMedia
                        component="img"
                        height="200"
                        image={image}
                        alt={displayName}
                        className="service-image"
                        sx={{
                            transition: 'transform 0.4s ease',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            color: 'white',
                        }}
                    >
                        <ContentCut sx={{ fontSize: 64, opacity: 0.7 }} />
                    </Box>
                )}

                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Chip
                        label={`₹${displayPrice}`}
                        color="secondary"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            px: 1,
                        }}
                    />
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Typography gutterBottom variant="h5" component="h3" fontWeight={700}>
                        {displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {description || 'Premium grooming service tailored for you'}
                    </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => onBook && onBook(service)}
                        sx={{
                            py: 1.2,
                            fontWeight: 600,
                        }}
                    >
                        Book Now
                    </Button>
                </CardActions>
            </Card>
        </motion.div>
    );
};

export default ServiceCard;
