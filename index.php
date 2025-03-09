<video id="video" controls width="640" height="360"></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        var video = document.getElementById("video");
        var videoSrc = "https://tv-indonesia-8w6s.vercel.app/stream/trans_7/";

        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSrc;
            video.addEventListener("loadedmetadata", function () {
                video.play();
            });
        } else {
            console.error("Browser tidak mendukung HLS");
        }
    });
</script>
