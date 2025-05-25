import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

export default function DateRangeSelector({
                                              onRangeSelected,
                                          }: {
    onRangeSelected: (start: string, end: string) => void;
}) {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const handleDayPress = (day: any) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day.dateString);
            setEndDate(null);
        } else if (moment(day.dateString).isAfter(startDate)) {
            setEndDate(day.dateString);
            setShowCalendar(false);
            onRangeSelected(startDate, day.dateString);
        } else {
            setStartDate(day.dateString);
        }
    };

    const getMarkedDates = () => {
        const marked: any = {};

        if (startDate) {
            marked[startDate] = { startingDay: true, color: '#2F80ED', textColor: '#fff' };
        }

        if (startDate && endDate) {
            const start = moment(startDate);
            const end = moment(endDate);
            const range = end.diff(start, 'days');

            for (let i = 1; i < range; i++) {
                const day = start.clone().add(i, 'days').format('YYYY-MM-DD');
                marked[day] = { color: '#D6E4FF', textColor: '#2F80ED' };
            }

            marked[endDate] = { endingDay: true, color: '#2F80ED', textColor: '#fff' };
        }

        return marked;
    };

    return (
        <View style={styles.container}>
            <Button
                title={startDate && endDate ? 'Cambiar fechas' : 'Seleccionar fechas'}
                onPress={() => setShowCalendar(!showCalendar)}
            ></Button>

            {showCalendar && (
                <Calendar
                    style={styles.calendar}
                    onDayPress={handleDayPress}
                    markingType="period"
                    markedDates={getMarkedDates()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    calendar: {
        borderRadius: '16px'
    },
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});