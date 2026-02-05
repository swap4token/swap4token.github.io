
var startPlusListener = true;
var plusListenerStart = function() {
	if (window.plus) {
		var backStartCount = 0;
		plus.key.addEventListener('backbutton', function() {
			var currentWebUrl = plus.webview.currentWebview().getURL() + "";
			var result = currentWebUrl.indexOf("index");
			if (result > 0) {
				//alert('是首页0——'+result)
				backStartCount++;
				if (backStartCount === 1) {
					setTimeout(function() {
						backStartCount = 0;
					}, 2000);
				} else if (backStartCount === 2) {
					plus.runtime.quit();
				}
			} else {
				plus.webview.goBack();
			}
		}, false);
		startPlusListener = false;
	}
}

var plusListener = function() {
	plusListenerStart();
	if (startPlusListener) {
		setTimeout(function() {
			plusListener();
		}, 20);
	}
}

plusListener();

document.addEventListener('plusready', function() {
	var backPlusreadyCount = 0;
	plus.key.addEventListener('backbutton', function() {
		var currentWebUrl = plus.webview.currentWebview().getURL() + "";
		var result = currentWebUrl.indexOf("index");
		if (result > 0) {
			//alert('是首页1——'+result)
			backPlusreadyCount++;
			if (backPlusreadyCount === 1) {
				setTimeout(function() {
					backPlusreadyCount = 0;
				}, 2000);
			} else if (backPlusreadyCount === 2) {
				plus.runtime.quit();
			}
		} else {
			window.history.back();
		}
	}, false);
}, false);

