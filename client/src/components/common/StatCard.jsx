import React from 'react';
import { Paper, Box, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { LocationOn, Star, ContentCut, CalendarMonth, Favorite, EmojiEvents } from '@mui/icons-material';

const StatCard = ({ iconName, title, count, color, trend }) => {
    // Render icon based on name
    const renderIcon = () => {
        const iconProps = { sx: { fontSize: { xs: 32, sm: 36 } } };
        switch (iconName) {
            case 'location':
                return <LocationOn {...iconProps} />;
            case 'star':
                return <Star {...iconProps} />;
            case 'scissors':
                return <ContentCut {...iconProps} />;
            case 'calendar':
                return <CalendarMonth {...iconProps} />;
            case 'heart':
                return <Favorite {...iconProps} />;
            case 'trophy':
                return <EmojiEvents {...iconProps} />;
            default:
                return <LocationOn {...iconProps} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' }
            }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 4 },
                    height: '100%',
                    minHeight: { xs: 180, sm: 200 },
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.04)} 50%, ${alpha(color, 0.08)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${alpha(color, 0.2)}`,
                    borderRadius: 3,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(color, 0.18)} 0%, ${alpha(color, 0.08)} 50%, ${alpha(color, 0.12)} 100%)`,
                        border: `2px solid ${alpha(color, 0.4)}`,
                        boxShadow: `0 12px 40px ${alpha(color, 0.25)}`,
                        '& .icon-box': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: `0 8px 24px ${alpha(color, 0.4)}`,
                        },
                        '& .background-circle': {
                            transform: 'scale(1.3)',
                            opacity: 0.15,
                        },
                        '& .background-pattern': {
                            opacity: 0.6,
                        }
                    },
                }}
            >
                {/* Background Pattern */}
                <Box
                    className="background-pattern"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.3,
                        transition: 'opacity 0.4s ease',
                        background: `radial-gradient(circle at 80% 20%, ${alpha(color, 0.15)} 0%, transparent 50%)`,
                    }}
                />

                {/* Background Circle Decoration */}
                <Box
                    className="background-circle"
                    sx={{
                        position: 'absolute',
                        right: -30,
                        bottom: -30,
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.05)} 100%)`,
                        opacity: 0.1,
                        transition: 'all 0.4s ease',
                    }}
                />

                {/* Content */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Icon Box */}
                    <Box
                        className="icon-box"
                        sx={{
                            width: { xs: 60, sm: 68 },
                            height: { xs: 60, sm: 68 },
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                            color: 'white',
                            mb: 2.5,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: `0 4px 16px ${alpha(color, 0.3)}`,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                borderRadius: 2.5,
                                padding: '2px',
                                background: `linear-gradient(135deg, ${alpha('#fff', 0.4)} 0%, ${alpha('#fff', 0.1)} 100%)`,
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                            }
                        }}
                    >
                        {renderIcon()}
                    </Box>

                    {/* Count */}
                    <Typography
                        variant="h3"
                        fontWeight={800}
                        color="text.primary"
                        sx={{
                            mb: 0.5,
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {count}
                    </Typography>

                    {/* Title */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{
                            mb: trend ? 1.5 : 0,
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            letterSpacing: '0.02em',
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Trend */}
                    {trend && (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                bgcolor: trend > 0 ? alpha('#16a34a', 0.1) : alpha('#dc2626', 0.1),
                                border: `1px solid ${trend > 0 ? alpha('#16a34a', 0.3) : alpha('#dc2626', 0.3)}`,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: trend > 0 ? 'success.main' : 'error.main',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                }}
                            >
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.7rem',
                                }}
                            >
                                vs last month
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </motion.div>
    );
};

export default StatCard;
