import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import style from './DashboardPage.module.css'; // Corrected import

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const DashboardPage = () => {
    // Sample data for the charts
    const taskStatsData = {
        labels: ['Total', 'Assigned', 'In-Progress', 'Completed'],
        datasets: [
            {
                label: 'Task Statistics',
                data: [100, 60, 30, 50],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderWidth: 1,
            },
        ],
    };

    const employeePerformanceData = {
        labels: ['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4', 'Employee 5'],
        datasets: [
            {
                label: 'Performance (in %)',
                data: [90, 80, 70, 85, 95],
                fill: false,
                borderColor: '#36A2EB',
                tension: 0.1,
            },
        ],
    };

    const milestoneAchievementsData = {
        labels: ['Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4'],
        datasets: [
            {
                label: 'Achieved Milestones',
                data: [3, 5, 2, 4],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderWidth: 1,
            },
        ],
    };

    // Chart options to control size
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow custom dimensions
    };

    return (
        <div className={style.dashboardContainer}>
            <h1 className={style.dashboardTitle}>Dashboard Insights</h1>

            {/* Task Statistics Cards */}
            <div className={style.taskCards}>
                <div className={style.taskCard}>
                    <h4>Total Tasks</h4>
                    <p className={style.taskCount}>100</p>
                </div>
                <div className={style.taskCard}>
                    <h4>Assigned Tasks</h4>
                    <p className={style.taskCount}>60</p>
                </div>
                <div className={style.taskCard}>
                    <h4>In-Progress Tasks</h4>
                    <p className={style.taskCount}>30</p>
                </div>
                <div className={style.taskCard}>
                    <h4>Completed Tasks</h4>
                    <p className={style.taskCount}>50</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className={style.chartsContainer}>
                <div className={style.chartCard}>
                    <h3>Task Statistics</h3>
                    <div className={style.chartContainer}>
                        <Doughnut data={taskStatsData} options={chartOptions} />
                    </div>
                </div>

                <div className={style.chartCard}>
                    <h3>Employee Performance</h3>
                    <div className={style.chartContainer}>
                        <Line data={employeePerformanceData} options={chartOptions} />
                    </div>
                </div>

                <div className={style.chartCard}>
                    <h3>Milestone Achievements</h3>
                    <div className={style.chartContainer}>
                        <Bar data={milestoneAchievementsData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default DashboardPage;