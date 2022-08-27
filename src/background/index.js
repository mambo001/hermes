/*global chrome,browser*/
// If your extension doesn't need a background script, just leave this file empty
// const URL_NE = `https://script.google.com/macros/s/AKfycbz7zuBnhv_a65GmdySAZ5G5w6I61hWOJ84SZJFyY5Q/dev`;
const URL_NE = `https://script.google.com/macros/s/AKfycbymbnDy20JJDpcqfTE3C_78I0bmhNmTxQJXD-offVI8SnsBIU78WnvxJpCA0X7gR8q0/exec`;
let notificationID;

chrome.storage.local.set({ storage: {} })

chrome.storage.local.get(["storage"], (result) => {
  if (result.storage) {
    taskInBackground();
  } else {
    chrome.action.setBadgeText({ text: `...` })
  }
});

setInterval(function () {
  chrome.storage.local.get(["storage"], (result) => {
    if (result.storage) {
      taskInBackground();
    } else {
      chrome.action.setBadgeText({ text: `...` })
    }
  });
}, 60 * 1000);

export async function taskInBackground() {
  try {
    const fetchTasks = await fetch(URL_NE);
    const parsedTasks = await fetchTasks.json();
    const tasksCount = parsedTasks.notify.length;
    if (tasksCount > 0) {
      notificationID = doRenderNotification({
        type: "basic",
        title: "New tasks!",
        message: `You have ${tasksCount} pending tasks.`,
        contextMessage: "",
        isUpdate: false,
      });
      console.log({ notificationID });
    }
  } catch (error) {
    if (error.status === 401) {
      chrome.storage.local.get(["storage"], (result) => {
        let isGmailLogedIn = false;
        chrome.storage.local.set({ isGmailLogedIn }, function () {});
      });

      chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
      chrome.browserAction.setBadgeText({
        text: "!",
      });
    }
  }
}

function doRenderNotification({
  type,
  title,
  message,
  contextMessage,
  isUpdate,
}) {
  const baseNotificationOptions = {
    iconUrl: "../img/icon-48.png",
    requireInteraction: true,
    buttons: [
      {
        title: "Okay",
      },
    ],
  };

  if (isUpdate) {
    return chrome.notifications.update({
      notificationId: notificationID,
      options: {
        type,
        title,
        message,
        contextMessage,
        ...baseNotificationOptions,
      },
    });
  } else {
    return chrome.notifications.create({
      type,
      title,
      message,
      contextMessage,
      ...baseNotificationOptions,
    });
  }
}
