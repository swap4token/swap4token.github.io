var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();

var controlContractInstance;

var contractInstanceInit=function(){
	console.log('contractInstanceInit....')
	controlContractInstance=new web3js.eth.Contract(controlAbi,controlContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}
var baseUrl = "http://bpmweb3.com/swap/test.html?ref=";
var haveParentAddress = false;
var haveBnbAmount = 0;
var oneAmount = 0;
var lastSalt = 0;
var mintPageDataInit = function(){
	$('#myshareLink').text(baseUrl+selectAddress);
	controlContractInstance.methods.getUserData(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserData getUserData')
		console.log(res);
		
		var parentAddress = res[0];
		if(parentAddress != "0x0000000000000000000000000000000000000000"){
			haveParentAddress = true;
			$('#parentAddress').val(parentAddress);
			$('#parentAddress').attr("readonly","readonly");
			$('#parentAddress').attr("disabled","true");
			$('#parentAddress').css('color', '#F5F5F5');
			mdui.mutation();
		}else{
			var linkParentAddress = getQueryVariable('ref');
			if(linkParentAddress){
				$('#parentAddress').val(linkParentAddress);
			}
		}
		
		var dataList = res[1];
		var userLastTime = dataList[8];
		$("#userLastTime").text(changeTime2DateSimply_all(userLastTime));
		haveBnbAmount = web3js.utils.fromWei(dataList[0])*1;
		$('#haveOkbAmount').text((haveBnbAmount).toFixed(4));
		
		var userMintAmount = web3js.utils.fromWei(dataList[1])*1;
		var userMintWithdrawAmount = web3js.utils.fromWei(dataList[2])*1;
		userCanWithdrawAmount = userMintAmount - userMintWithdrawAmount;
		if(userCanWithdrawAmount < 0){userCanWithdrawAmount = 0;}
		$('#userMintAmount').text((userMintAmount).toFixed(4));
		$('#userMintWithdrawAmount').text((userMintWithdrawAmount).toFixed(4));
		$('#userCanWithdrawAmount').text((userCanWithdrawAmount).toFixed(4));
		
		var userNftNumber = dataList[15]*1;
		var nftWithdrawAmount = 0;
		nftCanWithdrawAmount = 0;
		if(userNftNumber > 0){
			var nftIsAcitve = dataList[10]*1;
			if(nftIsAcitve > 0){
				nftWithdrawAmount = web3js.utils.fromWei(dataList[13])*1;
				nftCanWithdrawAmount = web3js.utils.fromWei(dataList[14])*1;
			}
		}
		
		$('#userNftNumber').text((userNftNumber).toFixed(0));
		
		
		var userShareRewardAmount = web3js.utils.fromWei(dataList[25])*1;
		var userShareWithdrawAmount = web3js.utils.fromWei(dataList[26])*1;
		shareCanWithdrawAmount = userShareRewardAmount - userShareWithdrawAmount;
		
		nftCanWithdrawAmount = nftCanWithdrawAmount + shareCanWithdrawAmount;
		nftWithdrawAmount = nftWithdrawAmount + userShareWithdrawAmount;
		$('#nftWithdrawAmount').text((nftWithdrawAmount).toFixed(4));
		$('#nftCanWithdrawAmount').text((nftCanWithdrawAmount).toFixed(4));
		
		
		var userShareDepositWithSelf = dataList[20]*1;
		var userShareSun1Deposit = dataList[21]*1;
		var userShareDepositMaxArea = dataList[22]*1;
		var userDepositAmount = dataList[23]*1;
		var userShareNumber = dataList[24]*1;
		var getUserLevel = dataList[27]*1;
		var userShareDepositTotal = userShareDepositWithSelf - userDepositAmount;
		var userShareDepositMinArea = userShareDepositWithSelf - userShareDepositMaxArea - userDepositAmount;
		$('#userShareDepositTotal').text((userShareDepositTotal).toFixed(0));
		$('#userShareDepositMinArea').text((userShareDepositMinArea).toFixed(0));
		$('#getUserLevel').text((getUserLevel).toFixed(0));
		$('#userShareNumber').text((userShareNumber).toFixed(0));
		
		oneAmount = web3js.utils.fromWei(dataList[28])*1;
		
		
		lastSalt = dataList[29]*1;
		if(lastSalt > 0){
			$("#mintTokenBtn").show();
		}
		var adminAddressRes = dataList[9]*1;
		if(adminAddressRes > 0){
			$("#adminOprationDiv").show();
		}
	})
	
	controlContractInstance.methods.getUserLiquidityInfo(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserLiquidityInfo getUserLiquidityInfo')
		console.log(res);
		var dataList = res;
		userHaveLpAmount = web3js.utils.fromWei(dataList[0])*1;
		var userHaveLpXSparkAmount = web3js.utils.fromWei(dataList[1])*1;
		var userHaveLpFistAmount = web3js.utils.fromWei(dataList[2])*1;
		var userGetLpXSparkAmount = web3js.utils.fromWei(dataList[3])*1;
		var userGetLpFistAmount = web3js.utils.fromWei(dataList[4])*1;
		$('#userHaveLpAmount').text((userHaveLpAmount).toFixed(2));
		$('#userHaveLpXSparkAmount').text((userHaveLpXSparkAmount).toFixed(2));
		$('#userHaveLpFistAmount').text((userHaveLpFistAmount).toFixed(2));
		$('#userGetLpXSparkAmount').text((userGetLpXSparkAmount).toFixed(2));
		$('#userGetLpFistAmount').text((userGetLpFistAmount).toFixed(2));
	})
	
	controlContractInstance.methods.getUserShareData(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserShareData getUserShareData')
		console.log(res);
		var sunList = res[0];
		var depositList = res[1];
		var size = sunList.length;
		if(size > 0){
			$('#shareListContent').html("");
			for(var i=0;i<size;i++){
				var newEle = shareRecordEle;
				newEle = newEle.replace('sunAddress',getSimpleLongAddress(sunList[i]));
				newEle = newEle.replace('okbNumber',depositList[i]);
				$('#shareListContent').append(newEle);
			}
		}
	})
}

var shareRecordEle = "<div class='mdui-p-y-1 flex justify-between align-center' style='color: #e1e1e1;'><span>sunAddress</span><span>okbNumber OKB</span></div>";

var copyAddress = function(){
	if(selectAddress){
		copycontext(selectAddress);
	}else{
		tishi('钱包地址正在加载！');
	}
}

var copyShareLink = function(){
	if(selectAddress){
	    copycontext(baseUrl + selectAddress);
		getParentIsJionCheck4copyShareLink();
	}else{
		tishi("钱包加载中……")
	}
}

var getParentIsJionCheck4copyShareLink = function(){
	controlContractInstance.methods.getParentIsJion(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log(res);
		if(res){
			
		}else{
			tishi("你没有绑定推荐人或没有参与，不能被他人绑定");
		}
	})
}

var getParentIsJionCheck2Buy = function(parent, inputBuyNumber, inputBuyAmountWei){
	tishi("先审核推荐人")
	controlContractInstance.methods.getParentIsJion(parent).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log(res);
		if(res){
			userBuy(parent, inputBuyNumber, inputBuyAmountWei);
		}else{
			tishi("推荐人无效");
		}
	})
}


var userBuyCheck = function(){
	var parent = $('#parentAddress').val();
	var inputBuyNumber = $("#inputBuyNumber").val();
	inputBuyNumber = parseInt(inputBuyNumber);
	if(inputBuyNumber > 20 || inputBuyNumber < 1){
		tishi("输入错误");
		return ;
	}
	var inputBuyAmount = inputBuyNumber * oneAmount;
	if(haveBnbAmount*1 < inputBuyAmount){
		tishi("OKB余额不足");
		console.log("haveBnbAmount:"+haveBnbAmount);
		console.log("inputBuyAmount:"+inputBuyAmount);
		return ;
	}
	var inputBuyAmountWei = web3js.utils.toWei(inputBuyAmount+"")+"";
	if(haveParentAddress){
		userBuy(parent, inputBuyNumber, inputBuyAmountWei);
	}else{
		getParentIsJionCheck2Buy(parent, inputBuyNumber, inputBuyAmountWei);
	}
}

var userBuy = function(parent, inputBuyNumber, inputBuyAmountWei){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.userBuy(parent, inputBuyNumber).send({from:selectAddress,gasPrice: gasPrice, value:inputBuyAmountWei}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}


var shareCanWithdrawAmount = 0;
var withdrawShareRewardCheck = function(){
	if(shareCanWithdrawAmount > 0){
		tishi("没有可提取");
		return ;
	}
	withdrawShareReward();
}

var withdrawShareReward = function(){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.withdrawShareReward().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}


var nftCanWithdrawAmount = 0;
var withdrawNftRewardCheck = function(){
	if(nftCanWithdrawAmount <= 0){
		tishi("没有可提取");
		return ;
	}
	withdrawNftReward();
}

var withdrawNftReward = function(){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.withdrawNftReward().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}

var userCanWithdrawAmount = 0;
var withdrawMintTokenCheck = function(){
	if(userCanWithdrawAmount == 0 || userCanWithdrawAmount < 0.0001){
		tishi("没有可提取");
		return ;
	}
	withdrawMintToken();
}

var withdrawMintToken = function(){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.withdrawMintToken().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}

var userHaveLpAmount;
var userDeleteLiuquidityCheck = function(){
	if(userHaveLpAmount < 0.0001){
		tishi("没有可撤除的LP");
		return ;
	}
	userDeleteLiuquidity();
}
var userDeleteLiuquidity = function(){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.userDeleteLiuquidity().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}

var pageDataInit = function(){
	mintPageDataInit();
}

var lastSalt = 0;
var initializeCheck = function(){
	if(lastSalt > 0){
		tishi("不需要重复初始化");
		return ;
	}
	initialize();
}

var initialize = function(){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.initialize(MintToken).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}

var activeUserNftCheck = function(){
	var inputNftId = $("#inputNftIdNumber").val();
	inputNftId = parseInt(inputNftId);
	if(inputNftId < 1){
		tishi("nftId 错误，应该大于0");
		return ;
	}
	activeUserNft(inputNftId);
}
var activeUserNft = function(nftId){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.activeUserNft(nftId).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		mintPageDataInit();
		setTimeout(function(){ mintPageDataInit(); }, 1500 )
	});
}