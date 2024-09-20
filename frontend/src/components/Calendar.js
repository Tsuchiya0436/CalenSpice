import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";
import axios from "axios"

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/holidays/2024/")
          .then(response => {
            console.log(response.data);
            setHolidays(response.data.holidays);
          })
          .catch(error => {
            console.error("Error fetching holidays:", error);
          });
      }, []);

    // 振替休日の判定関数
    const isSubstituteHoliday = (day) => {
        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const previousDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day - 1);
    
        previousDay.setHours(0, 0, 0, 0);
        const formattedPreviousDay = formatDate(previousDay);
        const isPreviousSunday = previousDay.getDay() === 0;
        const isPreviousHoliday = holidays.some(holiday => holiday.date === formattedPreviousDay);
        return isPreviousSunday && isPreviousHoliday;
    };

    // 祝日や振替休日かどうかを判定する関数
    const isHoliday = (day) => {
        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dateObj.setHours(0, 0, 0, 0);
        const formattedDate = formatDate(dateObj);
        const isHolidayToday = holidays.some(holiday => holiday.date === formattedDate);
        const isSubstitute = isSubstituteHoliday(day);
        return isHolidayToday || isSubstitute;
    };

    const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const hadleDateClick = (day) => {
        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const formattedDate = dateObj.toISOString().split('T')[0];
        setSelectedDate(dateObj.toISOString().split('T')[0]);
        navigate(`/diary/${formattedDate}`);
    };
    
    // 前月に移動
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };
    
    // 次月に移動
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderHeader = () => {
        const months = [
            '1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'
        ];

        return (
            <div className="calendar-header">
                <button className="prev-button" onClick={prevMonth}>&larr;</button>
                <div className="month-title">
                    {currentDate.getFullYear()}年{months[currentDate.getMonth()]}月
                </div>
                <button className="next-button" onClick={nextMonth}>&rarr;</button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['日', '月', '火', '水', '木', '金', '土'];

        return (
            <div className="calendar-days">
                {days.map((day, index) => (
                    <div
                     key={index}
                     className={`calendar-day ${day === '土' ? 'saturday' : ''} ${day === '日' ? 'sunday' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderDates = () => {
        const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const dates = [];

        for (let i = 0; i < startDay; i++) {
            dates.push(<div key={`empty-${i}`} className="calendar-date empty"></div>)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isHolidayOrSubstitute = isHoliday(day);

            const isSelected = selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            dates.push(
                <div
                    key={day}
                    className={`calendar-date ${isHolidayOrSubstitute ? "holiday" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => hadleDateClick(day)}
                >
                    {day}
                </div>
            );
        }

        return <div className="calendar-grid">{dates}</div>
    };
    
    return (
        <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderDates()}
        </div>
    );
};

export default Calendar;