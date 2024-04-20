// ダウンロード
var downloadImage = function (srcUrl, response) {
    var _a;
    // サムネイルの場合はオリジナル画像のURLに変更
    var downloadUrl = srcUrl.replace("&thumbnail=1", "");
    // 拡張子を取得してファイル名を生成
    var extension = (_a = srcUrl.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    var filename = "".concat(response.username, "-").concat(response.noteId, "-").concat(response.imageIndex, ".").concat(extension);
    // console.log(filename)
    // chrome.downloads.downloadを使ってダウンロード
    chrome.downloads.download({
        url: downloadUrl,
        filename: filename,
        saveAs: false,
    });
};
// getImageInfo.tsのgetImageInfo関数を呼び出して画像情報を取得したのち、ダウンロードする
var messageToGetNoteInfo = function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {
        name: "noteImageDL",
        srcUrl: info.srcUrl,
    }, function (response) {
        downloadImage(info.srcUrl, response);
    });
};
// 右クリックメニューの設定
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        type: "normal",
        id: "downloadMisskeyImage",
        title: "Download Misskey Image",
        contexts: ["image"],
        documentUrlPatterns: [
            "*://misskey.io/*",
            "*://social.sda1.net/*"
        ],
    });
});
// 右クリックメニューのクリックイベント
chrome.contextMenus.onClicked.addListener(messageToGetNoteInfo);
