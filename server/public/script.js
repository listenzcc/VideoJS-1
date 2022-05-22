$(function () {
    var $refreshButton = $("#refresh");
    var $results = $("#css_result");

    function refresh() {
        var css = $("style.cp-pen-styles").text();
        $results.html(css);
    }

    refresh();
    $refreshButton.click(refresh);

    // Select all the contents when clicked
    $results.click(function () {
        $(this).select();
    });
});

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#00aaaa";
ctx.fillRect(0, 0, 150, 75);

function savePic() {
    const currentTime = `${getCurrentPlayer().currentTime()}`.replace(".", "-");
    const fileName = `snap-${currentTime}`;

    var fileType = "png"; // 如果文件名中没有带后缀，默认使用png
    switch (
        fileName // 判断保存的图片格式
    ) {
        case fileName.indexOf("png") > -1:
            fileType = "png";
            break;
        case fileName.indexOf("jpg") > -1:
            fileType = "jpg";
            break;
        case fileName.indexOf("jpeg") > -1:
            fileType = "jpeg";
            break;
        case fileName.indexOf("bmp") > -1:
            fileType = "bmp";
            break;
        case fileName.indexOf("gif") > -1:
            fileType = "gif";
            break;
        default:
            fileType = "png";
            break;
    }

    const { thumbWidth, fullWidth } = OPTIONS;

    // Thumb
    var video = getCurrentVideo();
    var div = d3
        .select("#thumb-div")
        .append("div")
        .attr("id", `thumb-${currentTime}`)
        .attr("class", `thumb-div-child`);

    var canvas = div
        .append("canvas")
        .attr("class", "thumb-canvas")
        .on("click", (e) => {
            if (e.target._display) {
                e.target._display = false;
            } else {
                e.target._display = true;
            }

            d3.select(`#thumb-detail-collapse-${currentTime}`).attr(
                "style",
                () => (e.target._display ? "display: block; " : "display: none")
            );
        })._groups[0][0];
    canvas.width = thumbWidth; //video.videoWidth;
    canvas.height = (thumbWidth / video.videoWidth) * video.videoHeight; //video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); // 图片大小和视频分辨率一致

    var div1 = div
        .append("div")
        .attr("style", `display: none`)
        .attr("class", "thumb-detail-collapse")
        .attr("id", `thumb-detail-collapse-${currentTime}`);

    var canvas1 = div1
        .append("canvas")
        .attr("id", `thumb-detail1-${currentTime}`)._groups[0][0];
    canvas1.width = fullWidth; //video.videoWidth;
    canvas1.height = (fullWidth / video.videoWidth) * video.videoHeight; //video.videoHeight;
    canvas1
        .getContext("2d")
        .drawImage(video, 0, 0, canvas1.width, canvas1.height); // 图片大小和视频分辨率一致

    div1.append("p").text(`Snip on ${currentTime.split("-")[0]} seconds`);

    const textarea = div1
        .append("textarea")
        .attr("id", `thumb-detail-${currentTime}`)
        .attr("class", "thumb-detail-textarea")
        .attr("placeholder", "Details of the collection")
        .text("")
        .on("input", (e) => {
            const newContent = e.target.value;
            const md = marked.parse(newContent);
            console.log(newContent);
            console.log(md);
            // d3.select(`#full-detail-${currentTime}`).text(newContent);
            document.getElementById(`full-detail-${currentTime}`).innerHTML =
                md;
            // d3.select(`#full-detail-${currentTime}`).attr("innerHTML", md);
        });

    const button = div1
        .append("button")
        .text("remove")
        .on("click", (e) => {
            const full = document.getElementById(`full-${currentTime}`);
            full.parentNode.removeChild(full);

            const thumb = document.getElementById(`thumb-${currentTime}`);
            thumb.parentNode.removeChild(thumb);
        });

    // Gallery
    var video = getCurrentVideo();

    var div = d3
        .select("#full-div")
        .append("div")
        .attr("class", "full-div")
        .attr("id", `full-${currentTime}`);

    div.append("h2").text(`Snip on ${currentTime.split("-")[0]} seconds`);

    var canvas = div.append("canvas")._groups[0][0];
    canvas.width = fullWidth; //video.videoWidth;
    canvas.height = (fullWidth / video.videoWidth) * video.videoHeight; //video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); // 图片大小和视频分辨率一致
    div.append("p")
        .attr("id", `full-detail-${currentTime}`)
        .text("What is the point of the collection?");

    // How to save the picture
    // var strDataURL = canvas.toDataURL("image/" + fileType); // canvas中video中取一帧图片并转成dataURL
    // var arr = strDataURL.split(","),
    //     mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]),
    //     n = bstr.length,
    //     u8arr = new Uint8Array(n);
    // while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    // }
    // var blob = new Blob([u8arr], {
    //     type: mime,
    // });
    // var url = window.URL.createObjectURL(blob);
    // var a = document.createElement("a");
    // a.style.display = "none";
    // a.href = url;
    // a.download = fileName;
    // document.body.appendChild(a);
    // a.click();
    // setTimeout(function () {
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    // }, 1000);
}

function PrintDiv() {
    var divContents = document.getElementById("instructions").innerHTML;
    var printWindow = window.open(); //"", "", "height=200,width=400");
    printWindow.document.write("<html><head><title>Print DIV Content</title>");
    printWindow.document.write("</head><body >");
    printWindow.document.write(divContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
}
