import React from "react";

const TaskTable = () => {
  // Sample data for the table
  const tasks = [
    {
      taskNo: 1,
      creatorUserId: "User123",
      taskToDo: "Complete Project Report",
      desireDateTime: "2024-12-18 14:00",
      treatedBy: "John Doe",
      confirmDateTimeA: "2024-12-17 10:00",
      confirmDateTimeB: "2024-12-17 15:00",
      attachment: "report.pdf",
      remark: "Need urgent review",
    },
    {
      taskNo: 2,
      creatorUserId: "User456",
      taskToDo: "Update System Config",
      desireDateTime: "2024-12-20 10:00",
      treatedBy: "Jane Smith",
      confirmDateTimeA: "2024-12-19 12:00",
      confirmDateTimeB: "2024-12-19 14:00",
      attachment: "config.txt",
      remark: "Critical update required",
    },
  ];

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Task Management Table</h2>
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Task No.</th>
              <th style={thStyle}>Creator User ID</th>
              <th style={thStyle}>Task To Do</th>
              <th style={thStyle}>Desire Date & Time</th>
              <th style={thStyle}>Treated By</th>
              <th style={thStyle}>Confirm Date & Time From A</th>
              <th style={thStyle}>Confirm Date & Time From B</th>
              <th style={thStyle}>Attachment</th>
              <th style={thStyle}>Remark If Any</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                style={{
                  ...rowStyle,
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                }}
              >
                <td style={tdStyle}>{task.taskNo}</td>
                <td style={tdStyle}>{task.creatorUserId}</td>
                <td style={tdStyle}>{task.taskToDo}</td>
                <td style={tdStyle}>{task.desireDateTime}</td>
                <td style={tdStyle}>{task.treatedBy}</td>
                <td style={tdStyle}>{task.confirmDateTimeA}</td>
                <td style={tdStyle}>{task.confirmDateTimeB}</td>
                <td style={tdStyle}>
                  <a href={`#${task.attachment}`} style={linkStyle}>
                    {task.attachment}
                  </a>
                </td>
                <td style={tdStyle}>{task.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#f0f2f5",
  minHeight: "100vh",
};

const headingStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "20px",
  textAlign: "center",
};

const cardStyle = {
  width: "90%",
  maxWidth: "1200px",
  backgroundColor: "#fff",
  borderRadius: "8px", // Rounded corners for the card
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  padding: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: "8px",  // Rounded corners for the table
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

const thStyle = {
  padding: "12px 15px",
  backgroundColor: "#6a1b9a",  // Purple shade
  color: "#fff",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
  textAlign: "center",
  textTransform: "uppercase",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
  fontSize: "14px",
  color: "#333",
};

const rowStyle = {
  transition: "background-color 0.3s ease",
  cursor: "pointer",
};

// Hover effect for rows
rowStyle["&:hover"] = {
  backgroundColor: "#f1e6f9",  // Light purple hover effect
};

const linkStyle = {
  color: "#6a1b9a",  // Purple shade for links
  textDecoration: "none",
  fontWeight: "bold",
};

// Table row hover effect
tableStyle["tr:hover"] = {
  backgroundColor: "#f1e6f9",  // Light purple hover effect for rows
};

export default TaskTable;
