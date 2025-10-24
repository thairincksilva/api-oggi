const express = require("express");
const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor Express rodando com sucesso 🚀");
});

// Rota webhook para /serasaexperian/api/reports
app.post("/serasaexperian/api/reports", (req, res) => {
  const { clientWebhook, optionalFeatures } = req.query;

  const headers = {
    api: req.get("api"),
    cnpj: req.get("cnpj"),
    key: req.get("key"),
    hash: req.get("hash"),
    distribuidor: req.get("distribuidor"),
  };

  const body = req.body;

  // Validações básicas
  if (!clientWebhook) {
    return res.status(400).json({ error: "clientWebhook é obrigatório como query param" });
  }
  if (!headers.api || !headers.key || !headers.cnpj) {
    return res.status(400).json({ error: "headers obrigatórios ausentes (api, key, cnpj)" });
  }

  // Log para debug
  console.log("Webhook recebido:", {
    clientWebhook,
    optionalFeatures,
    headers,
    body,
  });

  // Resposta de confirmação (ACK)
  return res.json({
    status: "received",
    receivedAt: new Date().toISOString(),
    clientWebhook,
    optionalFeatures,
    headers,
    body,
    message: "Requisição recebida com sucesso",
  });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
