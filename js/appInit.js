
mui.plusReady(function() {
	var backCount = 0;
	plus.key.addEventListener('backbutton', function() {
		var currentWebUrl = plus.webview.currentWebview().getURL() + "";
		var result = currentWebUrl.indexOf("index");
		if (result > 0) {
			//alert('是首页2——'+result)
			backCount++;
			if (backCount === 1) {
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					backCount = 0;
				}, 2000);
			} else if (backCount === 2) {
				plus.runtime.quit();
			}
		} else {
			mui.back();
		}
	});
	
});
