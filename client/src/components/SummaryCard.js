import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SummaryCard = ({ filteredLogs }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeElapsedText, setTimeElapsedText] = useState('No logs available');

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (filteredLogs.length > 0) {
            const mostRecent = filteredLogs.reduce(
                (latest, log) => (log.timestamp > latest.timestamp ? log : latest),
                filteredLogs[0]
            );
            const last = new Date(mostRecent.timestamp);
            const diff = currentTime - last;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            setTimeElapsedText(`Last logged action was ${hours}h ${minutes}m ago`);
        } else {
            setTimeElapsedText('No logs available');
        }
    }, [filteredLogs, currentTime]);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">Summary</Typography>
                <Typography>{timeElapsedText}</Typography>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
