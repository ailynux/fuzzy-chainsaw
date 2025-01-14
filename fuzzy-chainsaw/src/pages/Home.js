import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const Home = () => {
  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h3">🪚 Fuzzy Chainsaw 🪚</Typography>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Welcome to the Fuzziest, Chainsaw-iest Repository on GitHub! 🎉
        </Typography>
        <Typography variant="body2" style={{ marginTop: "10px" }}>
          Are you tired of boring chainsaws? Do you want a chainsaw that purrs while it cuts? 🐱⚡  
          This project is a **React & MUI Playground** to test cool UI features, build fun components, and practice your React skills!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
