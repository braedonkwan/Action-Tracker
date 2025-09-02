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
import { parseISO, format } from 'date-fns';

const BarGraph = ({ data }) => (
    <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
            <defs>
                <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#42a5f5" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#1976d2" stopOpacity={0.9} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(v) => {
                try { return format(parseISO(v), 'MMM d'); } catch { return v; }
            }} />
            <YAxis allowDecimals={false} />
            <Tooltip labelFormatter={(v) => {
                try { return format(parseISO(v), 'EEEE, MMM d, yyyy'); } catch { return v; }
            }} />
            <Bar dataKey="count" name="Count" fill="url(#countGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

export default BarGraph;
