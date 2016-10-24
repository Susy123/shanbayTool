// 字符串预处理，解析驼峰命名法和下划线命名法的单词、词组
function preprocessWord (originWord) {
    if (originWord.indexOf(" ") === -1) {
        originWord = originWord.replace(/_/g, " ");
        if (/[a-z]+/.test(originWord)) {
            originWord = trim(originWord.replace(/([A-Z])/g, " $1"));
        }
    }
    return originWord;
}


window.Notifications = window.Notifications || window.webkitNotifications;

function showNotification(note) {
    if (!Notifications) {
        //console.log("Browse don't support notification.");
        return;
    }
    var notification = null, havePermission = Notifications.checkPermission();
    if (havePermission === 0) {
        notification = Notifications.createNotification(
            note.icon || chrome.extension.getURL("icons/icon128.png"),
            note.title || "ShanbayTool",
            note.content
        );
        notification.onclick = function () {
            window.open("");
        };
        notification.show();
    } else {
        Notifications.requestPermission();
    }

    return notification;
}

chrome.runtime.onInstalled.addListener(
    function (details) {
        if (details.reason === "install") {
            //console.log("first install.");
            showNotification({
                title : "installTitle",
                content : "installContent"
            });
        } else if (details.reason === "update") {
            
            chrome.storage.sync.set({"showTips" : true}, function() {
                
            });
            showNotification({
                title : "updateTitle",
                content : "updateContent"                          
            });
        }
    }
);


chrome.storage.sync.get(null,function (items) {
    //console.log(JSON.stringify(items));
    if (items.showTips === undefined ) {
        //console.log("storage 是空的");
        chrome.storage.sync.set(settings);
    } else {
        //console.log("[Current Settings]");
        for (var key in items) {
            if (settings[key] === undefined) {
                chrome.storage.sync.remove(key);
                //console.log("Remove setting item '%s'", key);
            } else {
                settings[key] = items[key];
            }
        }
        chrome.storage.sync.set(settings);
    }
});

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        var a = new shanbay();
        a.Query(preprocessWord(message.queryWord), message.source, sendResponse);
        return true;
});
