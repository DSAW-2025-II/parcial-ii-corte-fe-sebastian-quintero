require('dotenv').config();
const API_URL = "https://parcial-ii-corte-be-sebastian-quint.vercel.app"; 
const EMAIL = "admin@admin.com"; 
const PASSWORD = "admin";

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("sessionToken", data.token);
      alert("✅ Login exitoso. Token guardado.");
    } else {
      alert("❌ Error: " + (data.error || "No se pudo autenticar"));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error conectando con el servidor");
  }
});

// Buscar Pokémon
document.getElementById("searchBtn").addEventListener("click", async () => {
  const pokemonName = document.getElementById("pokemonInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!pokemonName) {
    resultDiv.textContent = "⚠️ Ingresa un nombre de Pokémon.";
    return;
  }

  const token = localStorage.getItem("sessionToken");
  if (!token) {
    resultDiv.textContent = "⚠️ Debes hacer login primero.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/pokemonDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ pokemonName })
    });

    const data = await res.json();

    if (res.ok) {
      resultDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Especie:</strong> ${data.species}</p>
        <p><strong>Peso:</strong> ${data.weight}</p>
        <img src="${data.img_url}" alt="${data.name}">
      `;
    } else {
      resultDiv.innerHTML = `<p>Ups! Pokémon no encontrado</p>`;
    }
  } catch (err) {
    console.error(err);
    resultDiv.textContent = "⚠️ Error al buscar el Pokémon.";
  }
});
