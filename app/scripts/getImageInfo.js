chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(request)
    if (request.name === "noteImageDL") {
        getImageInfo(request.srcUrl, sendResponse);
    }
    return true; // sync
});
var getImageInfo = function (srcUrl, sendResponse) {
    // 右クリックから取得したurlはsda1.netがsda1.net/になっているのでHTML内の画像URLと一致させる
    var imgUrl = srcUrl.replace("sda1.net/", "sda1.net");
    var images = $("img[src*=\"".concat(imgUrl, "\"]"));
    var targetImage = images[0];
    sendResponse(getInfoFromTimeline(targetImage));
};
var getInfoFromTimeline = function (image) {
    var article = $(image.closest(".article"));
    // 画像のインデックスを取得
    var allImages = article.find("div[data-count] img:visible, div[data-count] img:hidden, div[data-count] canvas");
    var imageIndex = allImages.index(image);
    // usernameを取得
    var username = article.find("a[href^='/']").attr("href").replace("/", "");
    // 頭についた@を削除(2つ目以降は削除しない)
    if (username.startsWith("@")) {
        username = username.slice(1);
    }
    // noteIdを取得
    var noteId = article.find("div.info > a").attr("href").split("/")[2];
    // console.log(`username = ${username}, noteId = ${noteId}, imageIndex = ${imageIndex}`)
    return {
        result: true,
        username: username,
        noteId: noteId,
        imageIndex: imageIndex
    };
};
