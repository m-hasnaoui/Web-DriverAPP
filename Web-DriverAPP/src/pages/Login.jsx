import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Box, Button, TextField } from "@mui/material";
import { ReactSession } from "react-client-session";
import config from "./global/config";

const Login = ({ onLogin }) => {
  const url = config.apiUrl + "login.php";
  const urlVisibility = config.apiUrl + "selection.php";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const requestGetVisibility = async (id, role) => {
    if (role !== "admin") {
      try {
        const response = await axios.get(urlVisibility, {
          params: { idUser: id, visibility: "" },
        });

        ReactSession.set("visibility", response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const requestGetUsername = async (username, password, onLogin, setError) => {
    try {
      const response = await axios.get(url, {
        params: {
          username: username,
        },
      });

      const userData = response.data;
      const idUser = userData["idUser"];
      const user = userData["username"];
      const pass = userData["password"];
      const role = userData["role"];
      const deposit = userData["deposit"];
      const active = userData["active"];

      if (
        username !== "" &&
        password !== "" &&
        username === user &&
        password === pass
      ) {
        if (active === 1) {
          ReactSession.setStoreType("localStorage");
          ReactSession.set("idUser", idUser);
          ReactSession.set("username", username);
          ReactSession.set("role", role);
          ReactSession.set("deposit", deposit);
          await requestGetVisibility(
            ReactSession.get("idUser"),
            ReactSession.get("role")
          );
          onLogin();
          window.location.reload();
        } else {
          alert("Votre compte a été désactivé !");
        }
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect!");
      }
    } catch (error) {
      console.error(error);
      setError("Erreur de connexion.");
    }
  };

  const handleLogin = async () => {
    await requestGetUsername(username, password, onLogin, setError);
  };

  return (
    <Box m="150px" display="flex" flexDirection="column" alignItems="center">
      <Header
        title="Connexion"
        subtitle="Connecter avec votre nom d'utilisateur et votre mot de passe."
      />
      <Box m="20px" flexDirection="column" textAlign="center">
        <TextField
          style={{ marginTop: "20px", marginBottom: "20px" }}
          fullWidth
          variant="filled"
          type="text"
          label="Nom d'Utilisateur"
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <TextField
          style={{ marginTop: "20px", marginBottom: "20px" }}
          fullWidth
          variant="filled"
          type="password"
          label="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            style={{ width: "150px", marginTop: "20px", marginBottom: "20px" }}
            type="Button"
            color="secondary"
            variant="contained"
            onClick={handleLogin}
          >
            Connexion
          </Button>
        </Box>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Box>
    </Box>
  );
};

export default Login;
