chrome.runtime.onMessage.addListener((request, sender, sendResponse): boolean => {
    // console.log(request)
    if (request.name === "noteImageDL") {
        getImageInfo(request.srcUrl, sendResponse)
    }

    return true; // sync

})

const getImageInfo = (srcUrl: string, sendResponse) => {
    // 右クリックから取得したurlはsda1.netがsda1.net/になっているのでHTML内の画像URLと一致させる
    const imgUrl = srcUrl.replace("sda1.net/", "sda1.net")
    const images = $(`img[src*="${imgUrl}"]`)
    const targetImage = images[0]

    sendResponse(getInfoFromTimeline(targetImage))

}

const getInfoFromTimeline = (image) => {

    let article = $(image.closest(".article"))

    // 画像のインデックスを取得
    const allImages = article.find("div[data-count] img:visible, div[data-count] img:hidden, div[data-count] canvas")
    const imageIndex: number = allImages.index(image)

    // usernameを取得
    let username: string = article.find("a[href^='/']").attr("href").replace("/", "")
    // 頭についた@を削除(2つ目以降は削除しない)
    if (username.startsWith("@")) {
        username = username.slice(1)
    }

    // noteIdを取得
    const noteId: string = article.find("div.info > a").attr("href").split("/")[2]

    // console.log(`username = ${username}, noteId = ${noteId}, imageIndex = ${imageIndex}`)

    return {
        result: true,
        username: username,
        noteId: noteId,
        imageIndex: imageIndex
    };
}
