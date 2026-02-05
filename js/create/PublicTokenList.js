var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();

var shareContractInstance;
var controlContractInstance;
var usercontrolContractInstance;
var contractInstanceInit=function(){
	console.log('contractInstanceInit....')
	shareContractInstance=new web3js.eth.Contract(ShareAbi,shareContract,{from:selectAddress,gasPrice:'0'});
	controlContractInstance=new web3js.eth.Contract(CreateIdoAbi,createIdoTokenContract,{from:selectAddress,gasPrice:'0'});
	usercontrolContractInstance=new web3js.eth.Contract(CreateUserAbi,createUserTokenContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}


var createPageDataInit = function(){
    var nowTime = new Date().getTime() / 1000;
    //用户创建的IDO项目列表
	controlContractInstance.methods.getUserIdoTokenList(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserIdoTokenList getUserIdoTokenList')
		console.log(res);
		
		var tokenList = res[0];
		var timeList = res[1];
		var oneToken;
		var size = tokenList.length;
		if(size > 0){$("#IdoTokenContent").html("");}
		var swapTime;
		var nowTime = parseInt(new Date().getTime()/ 1000);
		var tokenStats
		for(var i=0;i<size;i++){
			oneToken = tokenList[i];
			swapTime = timeList[i];
			console.log('nowTime:'+nowTime)
			console.log('swapTime:'+swapTime)
			if(nowTime*1 > swapTime*1){
				tokenStats = getTokenStats(3);
			}else{
				if(oneToken.idoEndTime < nowTime){
					tokenStats = getTokenStats(2);
				}else{
					if(oneToken.idoStartTime < nowTime){
						tokenStats = getTokenStats(1);
					}else{
						tokenStats = getTokenStats(0);
					}
				}
			}
			var newRecordEle = recordEle;
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenName", oneToken.name);
			newRecordEle = newRecordEle.replace("tokenSymbol", oneToken.symbol);
			newRecordEle = newRecordEle.replace("tokenStats", tokenStats);
			$("#IdoTokenContent").prepend(newRecordEle)
		}
	})
	
	//用户创建的自有项目列表
	usercontrolContractInstance.methods.getUserSelfTokenList(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserIdoTokenList getUserSelfTokenList')
		console.log(res);
		
		var tokenList = res[0];
		var timeList = res[1];
		var oneToken;
		var size = tokenList.length;
		if(size > 0){$("#SelfTokenContent").html("");}
		var swapTime;
		var nowTime = parseInt(new Date().getTime()/ 1000);
		var tokenStats
		for(var i=0;i<size;i++){
			oneToken = tokenList[i];
			swapTime = timeList[i];
			
			if(nowTime > swapTime){
				tokenStats = getTokenStats(3);
			}else{
				tokenStats = getTokenStats(2);
			}
			var newRecordEle = SelfRecordEle;
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenName", oneToken.name);
			newRecordEle = newRecordEle.replace("tokenSymbol", oneToken.symbol);
			newRecordEle = newRecordEle.replace("tokenStats", tokenStats);
			$("#SelfTokenContent").prepend(newRecordEle)
		}
	})
	
	//用户创建的公平发射项目列表
	usercontrolContractInstance.methods.getUserFairBeginTokenList(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getPublicFairBeginTokenList getPublicFairBeginTokenList')
		console.log(res);
		
		var tokenList = res[0];
		var timeList = res[1];
		var oneToken;
		var size = tokenList.length;
		if(size > 0){$("#FairBeginTokenContent").html("");}
		var swapTime;
		var nowTime = parseInt(new Date().getTime()/ 1000);
		var tokenStats
		for(var i=0;i<size;i++){
			oneToken = tokenList[i];
			swapTime = timeList[i];
			
			if(nowTime > swapTime){
				tokenStats = getTokenStats(3);
			}else{
				tokenStats = getTokenStats(2);
			}
			var newRecordEle = FairBeginrecordEle;
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenName", oneToken.name);
			newRecordEle = newRecordEle.replace("tokenSymbol", oneToken.symbol);
			newRecordEle = newRecordEle.replace("tokenStats", tokenStats);
			$("#FairBeginTokenContent").prepend(newRecordEle)
		}
	})
	
	//用户参与的IDO项目列表
	controlContractInstance.methods.getUserPlayIdoTokenList(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserPlayIdoTokenList getUserPlayIdoTokenList')
		console.log(res);
		
		var tokenList = res[0];
		var timeList = res[1];
		var oneToken;
		var size = tokenList.length;
		if(size > 0){$("#userPlayIdoTokenContent").html("");}
		var swapTime;
		var nowTime = parseInt(new Date().getTime()/ 1000);
		var tokenStats
		for(var i=0;i<size;i++){
			oneToken = tokenList[i];
			swapTime = timeList[i];
			console.log('nowTime:'+nowTime)
			console.log('swapTime:'+swapTime)
			if(nowTime*1 > swapTime*1){
				tokenStats = getTokenStats(3);
			}else{
				if(oneToken.idoEndTime < nowTime){
					tokenStats = getTokenStats(2);
				}else{
					if(oneToken.idoStartTime < nowTime){
						tokenStats = getTokenStats(1);
					}else{
						tokenStats = getTokenStats(0);
					}
				}
			}
			var newRecordEle = playRecordEle;
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenName", oneToken.name);
			newRecordEle = newRecordEle.replace("tokenSymbol", oneToken.symbol);
			newRecordEle = newRecordEle.replace("tokenStats", tokenStats);
			$("#userPlayIdoTokenContent").prepend(newRecordEle)
		}
	})
	
	//全网的IDO项目列表
	controlContractInstance.methods.getPublicIdoTokenList().call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getPublicIdoTokenList getPublicIdoTokenList')
		console.log(res);
		
		var tokenList = res[0];
		var timeList = res[1];
		var oneToken;
		var size = tokenList.length;
// 		if(size > 0){$("#IdoTokenContent").html("");}
		var swapTime;
		var nowTime = parseInt(new Date().getTime()/ 1000);
		var tokenStats
		var newRecordEle;
		var newRecordBelong2Ele;
		
		var endedProjectNumber=0;
		var ongoingProjecteNumber=0;
		$("#upcomingTokenContent").html("");
		$("#ongoingTokenContent").html("");
		$("#endedProjectContent").html("");
		for(var i=0;i<size;i++){
			oneToken = tokenList[i];
			swapTime = timeList[i];
			var tokenDay = 0;
			var tokenHour = 0;
    		var tokenMinter = 0;
    		var tokenSecond = 0;
			var diffSecond = 0;
			var tokenOpenPrice = oneToken.oneAmount / oneToken.oneTokenAmount;
			if(oneToken.idoEndTime > nowTime && oneToken.maxNumber - oneToken.overNumber > 0){
			    console.log('tokenSymbol oneToken.symbol 2：'+oneToken.symbol)
				if(oneToken.idoStartTime > nowTime){
					newRecordEle = publicIdoWaitEle;
					newRecordBelong2Ele="upcomingTokenContent";
					diffSecond = oneToken.idoStartTime - nowTime;
				}else{
					newRecordEle = publicIdoStartEle;
					newRecordBelong2Ele="ongoingTokenContent";
					diffSecond = oneToken.idoEndTime - nowTime;
				}
				ongoingProjecteNumber = 1;
				
			}else{
				newRecordEle = publicIdoOverEle;
				newRecordBelong2Ele="endedProjectContent";
				endedProjectNumber = 1;
			}
			if(diffSecond >= 0){
			    tokenDay = parseInt(diffSecond / 86400);
    			diffSecond = diffSecond - (tokenDay * 86400);
    			tokenHour = parseInt(diffSecond / 3600);
    			diffSecond = diffSecond - (tokenHour * 3600);
    			tokenMinter = parseInt(diffSecond / 60);
    			tokenSecond = diffSecond - (tokenMinter * 60);
			}
			console.log('getPublicIdoTokenList size'+size)
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenContract", oneToken.token.toLowerCase());
			newRecordEle = newRecordEle.replace("tokenName", oneToken.name);
			if(diffSecond > 0){
			    newRecordEle = newRecordEle.replace("tokenDay", tokenDay);
    			newRecordEle = newRecordEle.replace("tokenHour", tokenHour);
    			newRecordEle = newRecordEle.replace("tokenMinter", tokenMinter);
    			newRecordEle = newRecordEle.replace("tokenSecond", tokenSecond);
			}
			
			newRecordEle = newRecordEle.replace("tokenSymbol", oneToken.symbol);
			newRecordEle = newRecordEle.replace("tokenSymbol", oneToken.symbol);
			newRecordEle = newRecordEle.replace("tokenOneAmount", (web3js.utils.fromWei(oneToken.oneAmount)*1).toFixed(2));
			newRecordEle = newRecordEle.replace("tokenOpenPrice", ((tokenOpenPrice)*1).toFixed(8));
			newRecordEle = newRecordEle.replace("tokenIdoOverNumber", oneToken.overNumber);
			newRecordEle = newRecordEle.replace("tokenSwapStartTime", changeTime2DateSimply_all(swapTime));
			newRecordEle = newRecordEle.replace("tokenIdoMaxAmount", (web3js.utils.fromWei(oneToken.oneAmount)*1*oneToken.maxNumber).toFixed(2));
			newRecordEle = newRecordEle.replace("tokenStats", tokenStats);
			$("#"+newRecordBelong2Ele).prepend(newRecordEle)
		}
		if(endedProjectNumber*1 > 0){
		    $("#endedProjectemptytip").hide()
		}
		console.log(ongoingProjecteNumber);
		if(ongoingProjecteNumber*1 > 0){
		    $("#ongoingProjectemptytip").hide()
		}
		
	})
}

var recordEle = "<a href='management.html?token=tokenContract' class='project-item'><div class='project-logo'><img src='./img/token/tokenContract.png' onerror=\"this.src='./img/none.png'; this.onerror = null\" /></div><div class='project-info'><div class='project-name'>tokenName</div><div class='project-symbol'>代币符号：tokenSymbol</div></div>tokenStats</a>";
var SelfRecordEle = "<a href='manageSelfToken.html?token=tokenContract' class='project-item'><div class='project-logo'><img src='./img/token/tokenContract.png' onerror=\"this.src='./img/none.png'; this.onerror = null\" /></div><div class='project-info'><div class='project-name'>tokenName</div><div class='project-symbol'>代币符号：tokenSymbol</div></div>tokenStats</a>";
var FairBeginrecordEle = "<a href='manageFairBeginToken.html?token=tokenContract' class='project-item'><div class='project-logo'><img src='./img/token/tokenContract.png' onerror=\"this.src='./img/none.png'; this.onerror = null\" /></div><div class='project-info'><div class='project-name'>tokenName</div><div class='project-symbol'>代币符号：tokenSymbol</div></div>tokenStats</a>";

var playRecordEle = "<a href='endIdoProject.html?token=tokenContract' class='project-item'><div class='project-logo'><img src='./img/token/tokenContract.png' onerror=\"this.src='./img/none.png';\" /></div><div class='project-info'><div class='project-name'>tokenName</div><div class='project-symbol'>代币符号：tokenSymbol</div></div>tokenStats</a>";

var publicIdoStartEle = "<div class='card ongoing'><div class='project-header'><div class='project-logo-name'><div class='project-logo'><img src='./img/token/tokenContract.png' onerror=\"this.src='./img/none.png';\" /></div><div class='project-name'>tokenName</div></div><div class='project-tag'>进行中</div></div><div class='project-info'><div class='info-label'>代币符号</div><div class='info-value'>tokenSymbol</div></div><div class='project-info'><div class='info-label'>IDO价格</div><div class='info-value value-highlight'>tokenOneAmount</div></div><div class='project-info'><div class='info-label'>硬顶额度</div><div class='info-value'>tokenIdoMaxAmount USDT</div></div><div class='project-info'><div class='info-label'>剩余时间</div><div class='info-value countdown'>tokenDay天 tokenHour时 tokenMinter分 tokenSecond秒</div></div><button onclick=\"window.location.href = 'inIdoProject.html?token=tokenContract'\" class='btn'>立即参与</button></div>";
var publicIdoWaitEle = "<div class='card upcoming'><div class='project-header'><div class='project-logo-name'><div class='project-logo'><img src='./img/token/tokenContract.png' onerror=\"this.src='./img/none.png';\" /></div><div class='project-name'>tokenName</div></div><div class='project-tag upcoming'>即将开始</div></div><div class='project-info'><div class='info-label'>代币符号</div><div class='info-value'>tokenSymbol</div></div><div class='project-info'><div class='info-label'>IDO价格</div><div class='info-value value-highlight'>tokenOneAmount USDT</div></div><div class='project-info'><div class='info-label'>硬顶额度</div><div class='info-value'>tokenIdoMaxAmount USDT</div></div><div class='project-info'><div class='info-label'>启动时间</div><div class='info-value countdown'>tokenDay天 tokenHour时 tokenMinter分 tokenSecond秒</div></div><button class='btn disabled-btn' onclick=\"tishi('敬请期待')\">敬请期待</button></div>";
var publicIdoOverEle = "<div class='card ended'><div class='project-header'><div class='project-logo-name'><div class='project-logo'><img src='img/token/tokenContract.png' onerror=\"this.src='./img/none.png';\" /></div><div class='project-name'>tokenName</div></div><div class='project-tag ended'>已结束</div></div><div class='project-info'><div class='info-label'>代币符号</div><div class='info-value'>tokenSymbol</div></div><div class='project-info'><div class='info-label'>IDO价格</div><div class='info-value value-highlight'>tokenOneAmount USDT</div></div><div class='project-info'><div class='info-label'>开盘价格</div><div class='info-value value-highlight'>tokenOpenPrice USDT</div></div><div class='project-info'><div class='info-label'>参与人数</div><div class='info-value'>tokenIdoOverNumber</div></div><div class='project-info'><div class='info-label'>开盘时间</div><div class='info-value'>tokenSwapStartTime</div></div><button onclick=\"window.location.href = 'endIdoProject.html?token=tokenContract'\" class='btn'>查看详情</button></div>";

var getTokenStats = function(_type){
	if(_type > 2){
		return "<span class='project-status status-swaping'>已开盘</span>";
	}
	if(_type > 1){
		return "<span class='project-status status-pending'>待开盘</span>";
	}
	if(_type > 0){
		return "<span class='project-status status-running'>IDO中</span>";
	}
	return "<span class='project-status status-ended'>待IDO</span>";
}

var copyAddress = function(){
	if(selectAddress){
		copycontext(selectAddress);
	}else{
		tishi('钱包地址正在加载！');
	}
}

var pageDataInit = function(){
	createPageDataInit();
}
