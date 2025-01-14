import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          🪚 Fuzzy Chainsaw
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/experiment">Experiment</Button>
        <Button color="inherit" component={Link} to="/randomizer">Randomizer</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
