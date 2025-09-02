import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';

const BarGraph = ({ data }) => {
    const theme = useTheme();
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(d) => format(parseISO(d), 'MM/dd')}
                />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(d) => format(parseISO(d), 'PP')} />
                <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarGraph;
