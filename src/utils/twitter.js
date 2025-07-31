
let currentHref = location.href;

const waitFor = (selector, text, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const interval = 200;
    let elapsed = 0;

    const timer = setInterval(() => {
      let curElement = undefined
      if (text) {
        const spans = document.querySelectorAll(selector);
        curElement = Array.from(spans).find((spanItem) => spanItem.innerText.trim() === text || spanItem.innerText.trim().indexOf(text) !== -1);
      } else {
        curElement = document.querySelector(selector);
      }
      if (curElement) {
        clearInterval(timer);
        resolve(curElement);
      } else if (elapsed >= timeout) {
        clearInterval(timer);
        reject(`Timeout waiting for ${selector}`);
      }
      elapsed += interval;
    }, interval);
  });
};

const getBuffer = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return buffer;
}
const hrefMap = {
  "home": 'https://x.com/home', // 首页
}

setInterval(() => {
  if (location.href !== currentHref) {
    console.log("URL changed:", location.href);
    currentHref = location.href;
    if (currentHref == hrefMap.home) {
      chrome.runtime.sendMessage(
        { action: "getLoginStatus", data: {value: 'twitter', login: true} }
      );
    }
  }
}, 1000);


async function mockInputVideo(url) {
  const buffer = await getBuffer(url);
  const file = new File([buffer], "video.mp4", { type: "video/mp4" });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  waitFor("input[type='file']").then(inputElement => {
    inputElement.files = dataTransfer.files;
    const event = new Event("change", { bubbles: true });
    inputElement.dispatchEvent(event);
    // 模拟点击上传按钮
    handlePublishVideo()
  })
}

async function handlePublishVideo() {
  // 点击发布按钮
  let hasUploadSuccess = await waitFor("div[aria-live='polite'][role='status'] span", ' Uploaded (100%)')

  let publishButtonElement = await waitFor("button[data-testid='tweetButtonInline']:not([disabled])")
  if (hasUploadSuccess && publishButtonElement) {
      publishButtonElement.click();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendTwitter") {
    console.log("收到popup消息:", request.data);
    mockInputVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
    // sendResponse("处理完成");
  }
});
