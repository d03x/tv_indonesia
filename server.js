import bodyParser from "body-parser";
import { info, log } from "console";
import express, { response } from "express";
import fetch from "node-fetch";
async function getChanel(name) {
  try {
    let chanels = await import("./stream_list.json");
    if (chanels.default) {
      return chanels.default.filter((e) => {
        return e.chanel == name;
      })[0];
    }
  } catch (error) {
    console.log(error.message);
  }
}

const app = express();

app.get("/channels", async (req, res) => {
  const data = await import("./stream_list.json");
  if (data.default) {
    let chan = data.default.map((dat) => {
      return {
        name: dat.name,
        channel: dat.chanel,
      };
    });
    res.json(chan);
  }
});

app.get("/stream/:chanel/:stream_data?", async (req, res) => {
  let params = req.params;
  let server_url;
  let stream_data = params.stream_data ?? null;
  let channel = params.chanel ?? null;

  if (!channel) {
    res.status(501);
    res.json({
      status: 5092,
      message: "Stream data tidak ada",
    });
  }

  let channelData = await getChanel(channel);
  if (!channelData) {
    res.status(501);
    res.json({
      status: 5092,
      message: "Stream data tidak ada",
    });
  }
  server_url = channelData.provider_url + channelData.stream;

  if (stream_data) {
    server_url = channelData.provider_url + stream_data;
  }

  let response = await fetch(server_url, {
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
});

app.listen(5000, () => {
  info("Listen localhost:50000");
});

export default app;