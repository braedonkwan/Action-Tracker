import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, Box, Divider, Stack, Avatar } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SummaryCard = ({ filteredLogs }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeElapsedText, setTimeElapsedText] = useState('No logs available');

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const totalCount = useMemo(() => filteredLogs.length, [filteredLogs]);

    useEffect(() => {
        if (filteredLogs.length > 0) {
            const mostRecent = filteredLogs.reduce(
                (latest, log) => (log.timestamp > latest.timestamp ? log : latest),
                filteredLogs[0]
            );
            const last = new Date(mostRecent.timestamp);
            const diff = Math.max(0, currentTime - last);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            setTimeElapsedText(`${days}d ${hours}h ${minutes}m ago`);
        } else {
            setTimeElapsedText('No logs yet');
        }
    }, [filteredLogs, currentTime]);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Summary
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <ListAltIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary' }}>
                            Total Actions
                        </Typography>
                        <Typography variant="h4">{totalCount}</Typography>
                    </Box>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography color="text.secondary">Last logged:</Typography>
                    <Typography>{timeElapsedText}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
