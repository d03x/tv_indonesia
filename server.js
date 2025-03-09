import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 5000;

// Ambil path file JSON
const streamListPath = path.resolve("stream_list.json");

// Fungsi untuk membaca JSON
function getStreamList() {
  try {
    const jsonData = fs.readFileSync(streamListPath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error membaca stream_list.json:", error.message);
    return [];
  }
}

app.get("/channels", (req, res) => {
  const data = getStreamList();
  const channels = data.map((dat) => ({
    name: dat.name,
    channel: dat.chanel,
  }));
  res.json(channels);
});

app.get("/stream/:chanel/:stream_data?", async (req, res) => {
  const { chanel, stream_data } = req.params;
  const data = getStreamList();
  const channelData = data.find((e) => e.chanel === chanel);

  if (!channelData) {
    return res.status(404).json({ status: 404, message: "Channel tidak ditemukan" });
  }

  let server_url = channelData.provider_url + (stream_data || channelData.stream);

  try {
    const response = await fetch(server_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: channelData.referer,
        Origin: channelData.origin,
      },
    });

    res.contentType(response.headers.get("Content-Type"));
    res.set("Access-Control-Allow-Origin", "*");
    res.status(response.status);
    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Gagal mengambil stream", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

export default app;
