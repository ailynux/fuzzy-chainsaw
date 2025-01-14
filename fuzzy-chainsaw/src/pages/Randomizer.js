import React, { useState } from "react";
import { Container, Button, Typography } from "@mui/material";

const Randomizer = () => {
  const [level, setLevel] = useState("Unknown");

  const levels = ["Fuzzy", "Chainsaw-y", "Dangerously Cuddly", "Purrfectly Deadly"];

  return (
    <Container style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4">🎲 Chainsaw Randomizer</Typography>
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Fuzzy Level: {level}
      </Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => setLevel(levels[Math.floor(Math.random() * levels.length)])}
        style={{ marginTop: "20px" }}
      >
        Randomize!
      </Button>
    </Container>
  );
};

export default Randomizer;
