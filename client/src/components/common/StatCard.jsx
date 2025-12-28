import { Paper, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatCard = ({ icon: IconComponent, title, count, color, trend }) => {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    height: '100%',
                    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                    border: `1px solid ${color}30`,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: color,
                            color: 'white',
                            mb: 2,
                        }}
                    >
                        <IconComponent sx={{ fontSize: 32 }} />
                    </Box>

                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                        <CountUp end={parseInt(count)} duration={2.5} separator="," />
                        {count.includes('+') && '+'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {title}
                    </Typography>

                    {trend && (
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 1,
                                color: trend > 0 ? 'success.main' : 'error.main',
                                fontWeight: 600,
                                display: 'block',
                            }}
                        >
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                        </Typography>
                    )}
                </Box>

                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: -20,
                        bottom: -20,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: color,
                        opacity: 0.1,
                    }}
                />
            </Paper>
        </motion.div>
    );
};

export default StatCard;
