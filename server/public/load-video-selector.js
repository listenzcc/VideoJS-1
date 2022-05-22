console.log("------------");

d3.json("./video-list").then((raw) => {
    console.log("====");
    console.log(raw);

    const selectors = d3.select("#video-selector");
    selectors
        .selectAll("option")
        .data(raw)
        .enter()
        .append("option")
        .text((e) => {
            return e.name;
        })
        .attr("value", (e) => {
            return e.name;
        });

    videoSelectorOnchange();
});

const getCurrentVideoName = () => {
    const select = document.getElementById("video-selector");
    return select.value;
};

const getCurrentPlayer = () => {
    return videojs(`#my_video_1`);
};

const getCurrentVideo = () => {
    return document.querySelector("#my_video_1_html5_api");
};

const videoSelectorOnchange = () => {
    const videoName = getCurrentVideoName();
    const title = document.getElementById("video-title");

    title.innerHTML = videoName;

    getCurrentPlayer().src({
        src: `./video/${videoName}`,
        type: "video/mp4",
    });
};
