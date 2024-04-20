type NoteInfo = {
    result: boolean
    username: string
    noteId: string
    imageIndex: number
}

// ダウンロード
const downloadImage = (srcUrl: string, response: NoteInfo) => {
    // サムネイルの場合はオリジナル画像のURLに変更
    const downloadUrl = srcUrl.replace("&thumbnail=1", "")

    // 拡張子を取得してファイル名を生成
    const extension = srcUrl.split('.').pop()?.toLowerCase()
    const filename = `${response.username}-${response.noteId}-${response.imageIndex}.${extension}`
    // console.log(filename)

    // chrome.downloads.downloadを使ってダウンロード
    chrome.downloads.download({
        url: downloadUrl,
        filename: filename,
        saveAs: false,
    })

}


// getImageInfo.tsのgetImageInfo関数を呼び出して画像情報を取得したのち、ダウンロードする
const messageToGetNoteInfo = (info, tab) => {
    chrome.tabs.sendMessage(
        tab.id,
        {
            name: "noteImageDL",
            srcUrl: info.srcUrl,
        },
        (response: NoteInfo) => {
            downloadImage(info.srcUrl, response)
        }
    )
}

// 右クリックメニューの設定
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        type: "normal",
        id: "downloadMisskeyImage",
        title: "Download Misskey Image",
        contexts: ["image"],
        documentUrlPatterns: [
            "*://misskey.io/*",
            "*://social.sda1.net/*"
        ],

    })
})

// 右クリックメニューのクリックイベント
chrome.contextMenus.onClicked.addListener(messageToGetNoteInfo)
