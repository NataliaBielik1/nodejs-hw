import 'dotenv/config';
import cors from "cors";
import express from "express";
import pino from 'pino';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get("/notes", (request, response) => {
  response.json({ message: "Retrieved all notes" });
});

app.get("/notes/:noteId", (request, response) => {
  response.json({ message: "Retrieved note with ID: id_param" });
});

app.use((req, res, next) => {
  res.status(404).json({ "message": "Route not found" });
});

app.get('/test-error', (request, response) => {
  throw new Error('Simulated server error');
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ "message": "повідомлення про помилку" });
});


const PORT = Number.parseInt(process.env.PORT, 10) || 8080;

app.listen(PORT, error => {
  if (error) {
    throw error;
  }
  console.log("Server started on port ${PORT}");
});



