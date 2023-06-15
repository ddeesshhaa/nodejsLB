const express = require("express");
const httpProxy = require("http-proxy");
const cors = require("cors");

// List of backend servers to load balance

const servers = [
  { target: "http://localhost:8080" },
  { target: "http://localhost:8080" },

  //   { target: "http://4d89-34-165-3-140.ngrok-free.app" },
  //   { target: "http://localhost:8082" },
];

const loadBalancer = httpProxy.createProxyServer();

loadBalancer.on("error", (err, req, res) => {
  console.error("Load balancer error:", err);
  res.status(500).send(err);
});

const app = express();
app.use(cors());

app.use((req, res) => {
  const server = servers.shift();
  console.log(`Forwarded to ${server.target}`);
  servers.push(server);
  loadBalancer.web(req, res, { target: server.target });
});
app.listen(1010, () => {
  console.log("Load balancer is running on port 3000");
});
