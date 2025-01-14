import React, { useState, useEffect } from "react";
import { Container, Button, Typography, Switch, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const Experiment = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Create a theme that updates based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  // Button click handler (e.g., alert message)
  const handleButtonClick = () => {
    alert("Chainsaw Engaged! 🪚");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h4">🛠️ Experiment with MUI</Typography>

        {/* Toggle Dark Mode */}
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <Typography variant="body1" style={{ marginBottom: "20px" }}>
          {darkMode ? "Dark Mode Enabled 🌙" : "Light Mode Enabled ☀️"}
        </Typography>

        {/* Button Action */}
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Click Me!
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default Experiment;
