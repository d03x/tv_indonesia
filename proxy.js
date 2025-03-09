import express from "express";
import fetch from "node-fetch";

let getTvChannel = async (name) => {
  let channels = (await import("./stream_list.json")).default;

  if (channels) {
    return channels.filter((e) => {
      return e.chanel === name;
    })[0];
  }
  return null;
};

const app = express();

app.use("/stream", async (req, res) => {
  let chanel_name = req.url
    .replace("/stream/", "")
    .trim()
    .replace("/", "")
    .trim();
  let channel = await getTvChannel(chanel_name);

  let server_url;
  if (!req.url.endsWith(".ts") && !req.url.endsWith(".m3u8")) {
    server_url = `${channel?.provider_url}/${channel?.stream}`;
  } else {
    server_url = `${channel?.provider_url}/${req.url.replace("/stream", "")}`;
  }

  if (server_url) {
    const response = await fetch(server_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://video.detik.com/",
        Origin: "https://video.detik.com/",
      },
    });
    res.set("Content-Type", response.headers.get("Content-Type"));
    res.set("Access-Control-Allow-Origin", "*");
    res.status(response.status);
    response.body.pipe(res);
  }
});

app.listen(8015, () => {
  console.log("Proxy server berjalan di http://localhost:8015");
});
