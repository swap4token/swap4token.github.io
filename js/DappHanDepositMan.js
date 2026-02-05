var selectAddress;
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';

var tokenContract = "0x55d398326f99059fF775485246999027B3197955";
var controlContractInstance;
var tokenContractInstance;

var contractInstanceInit=function(){
	controlContractInstance=new web3js.eth.Contract(controlAbi,controlContract,{from:selectAddress,gasPrice:'0'});
	tokenContractInstance=new web3js.eth.Contract(tokenAbi,tokenContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

//主页获取数据
var allowanceAmount = 0;
var haveAmount = 0;

var allowanceLpAmount = 0;
var haveLpAmount = 0;

var userDepositAmount = 0;
var oneUsdtAmount = 0;


var baseUrl = "https://heanniu.bpmweb3.com/index.html?ref=";
var depositDataInit = function(){
	$('#myshareLink').text(baseUrl+selectAddress);
	controlContractInstance.methods.getUserParent(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserParent getUserDataShare')
		console.log(res);
		
		var parentAddress = res;
		if(parentAddress != "0x0000000000000000000000000000000000000000"){
			haveParentAddress = true;
			$('#parentAddress').val(parentAddress);
			$('#parentAddress').attr("readonly","readonly");
			$('#parentAddress').attr("disabled","true");
			$('#parentAddress').css('color', '#F5F5F5');
			$('#parentAddress').css('font-size', '12px');
			mdui.mutation();
			$("#bindBtn").hide();
			
		}else{
			var linkParentAddress = getQueryVariable('ref');
			if(linkParentAddress){
				$('#parentAddress').val(linkParentAddress);
			}
		}
	})
	
	controlContractInstance.methods.getUserData(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserData getUserData')
		console.log(res);
		
		var dataList = res;
		oneUsdtAmount = web3js.utils.fromWei(res[3])*1;
		todayOneUsdtAmount = web3js.utils.fromWei(res[4])*1;
		
		allowanceAmount = web3js.utils.fromWei(res[0])*1;
		haveAmount = web3js.utils.fromWei(res[1])*1;
		
		if(allowanceAmount >= haveAmount || allowanceAmount >= 5 * todayOneUsdtAmount){
			$("#approveUsdtBtn").hide();
			$("#privateBuyBtn").show();
		}else{
			$("#approveUsdtBtn").show();
			$("#privateBuyBtn").hide();
		}
		
		var privateBuyUsdtAmount = web3js.utils.fromWei(res[6])*1;
		$('#haveAmount').text((haveAmount).toFixed(2));
		
		var PrivateBuyNumber = res[10]*1;
		$('#privateOverNumber').text((PrivateBuyNumber).toFixed(0));
		var privateBuyOverWidth = PrivateBuyNumber * 100 / 1000;
		$('#PrivateBuyNumberRate').text((privateBuyOverWidth).toFixed(2));
		$('#privateBuyOverWidth').css("width", privateBuyOverWidth+"%");
		
		
		var totalNumber = res[10]*1;
		$('#totalNumber').text((totalNumber).toFixed(0));
		userDepositOverNumber = res[11]*1;
		$('#userDepositOverNumber').text((userDepositOverNumber).toFixed(0));
		var userDepositAmount = web3js.utils.fromWei(res[12])*1;
		$('#userDepositAmount').text((userDepositAmount).toFixed(2));
		
		var getUserReward = web3js.utils.fromWei(res[13])*1;
		var userRewardWithdrawAmount = web3js.utils.fromWei(res[14])*1;
		userRewardCanWithdraw = getUserReward - userRewardWithdrawAmount;
		userRewardCanWithdraw = userRewardCanWithdraw * 0.0001;
		console.log('getUserReward:'+getUserReward)
		console.log('userRewardWithdrawAmount:'+userRewardWithdrawAmount)
		
		var getUserShareReward = web3js.utils.fromWei(res[15])*1;
		var userShareRewardWithdrawAmount = web3js.utils.fromWei(res[16])*1;
		userShareRewardCanWithdraw = getUserShareReward - userShareRewardWithdrawAmount;
		userShareRewardCanWithdraw = userShareRewardCanWithdraw * 0.0001;
		console.log('getUserShareReward:'+getUserShareReward)
		console.log('userShareRewardWithdrawAmount:'+userShareRewardWithdrawAmount)
		
		
		if(userRewardCanWithdraw < 0 || userRewardWithdrawAmount > 0){userRewardCanWithdraw = 0;}
		if(userShareRewardCanWithdraw < 0 || userShareRewardWithdrawAmount > 0){userShareRewardCanWithdraw = 0;}
		console.log('userRewardCanWithdraw:'+userRewardCanWithdraw)
		console.log('userShareRewardCanWithdraw:'+userShareRewardCanWithdraw)
		$('#userRewardCanWithdraw').text((userRewardCanWithdraw).toFixed(2));
		$('#userShareRewardCanWithdraw').text((userShareRewardCanWithdraw).toFixed(2));
		
		
		var userShareDepositAmount = res[20]*1;
		var userShareDepositAmount0 = res[21]*1;
		var userShareDepositAmount1 = res[22]*1;
		var userShareDepositAmount2 = res[23]*1;
		$('#userShareDepositAmount0').text((userShareDepositAmount0).toFixed(0));
		$('#userShareDepositAmount1').text((userShareDepositAmount1).toFixed(0));
		$('#userShareDepositAmount2').text((userShareDepositAmount2).toFixed(0));
		$('#userShareDepositAmount').text((userShareDepositAmount).toFixed(0));
		
		
		rewardWithdrawRes = res[26]*1;
		privateBuyStats = res[25]*1;
		
		
		var userNeedPayUsdtAmount1 = web3js.utils.fromWei(res[30])*1;
		var userNeedPayUsdtAmount2 = web3js.utils.fromWei(res[31])*1;
		var userNeedPayUsdtAmount3 = web3js.utils.fromWei(res[32])*1;
		var userNeedPayUsdtAmount4 = web3js.utils.fromWei(res[33])*1;
		var userNeedPayUsdtAmount5 = web3js.utils.fromWei(res[34])*1;
		
		$('#userNeedPayUsdtAmount1').text((userNeedPayUsdtAmount1).toFixed(0) + "U");
		$('#userNeedPayUsdtAmount2').text((userNeedPayUsdtAmount2).toFixed(0) + "U");
		$('#userNeedPayUsdtAmount3').text((userNeedPayUsdtAmount3).toFixed(0) + "U");
		$('#userNeedPayUsdtAmount4').text((userNeedPayUsdtAmount4).toFixed(0) + "U");
		$('#userNeedPayUsdtAmount5').text((userNeedPayUsdtAmount5).toFixed(0) + "U");
		
		var userShareUsdtDepositAmount3 = web3js.utils.fromWei(res[35])*1;
		var userShareUsdtDepositAmountall = web3js.utils.fromWei(res[36])*1;
		$('#userShareUsdtDepositAmount3').text((userShareUsdtDepositAmount3).toFixed(2));
		$('#userShareUsdtDepositAmountall').text((userShareUsdtDepositAmountall).toFixed(2));
	})
	
	controlContractInstance.methods.getUserShareData(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserShareData getUserShareData')
		console.log(res);
		var sunList = res[0];
		var buyList = res[1];
		var ShareList = res[2];
		var size = sunList.length;		
		if(size > 0){
			$('#havedata').html("");
			var sunBuyAmount;
			var sunShareAmount;
			for(var i=0;i<size;i++){
				var newEle = recordEle;
				sunBuyAmount = web3js.utils.fromWei(buyList[i])*1;
				sunShareAmount = ShareList[i]*1;
				newEle = newEle.replace('sunAddress',getSimpleAddress(sunList[i]));
				newEle = newEle.replace('userDeposit',(sunBuyAmount).toFixed(2));
				newEle = newEle.replace('shareDeposit',(sunShareAmount).toFixed(0)+"份");
				$('#havedata').append(newEle);
			}
		}
	})
}

var recordEle = "<div class='grid grid-cols-2 p-3 items-center'><div class='text-sm'>sunAddress</div><div class='text-right text-orange-400'>userDeposit</div></div>";

var approveCheck = function(){
	if(allowanceAmount < haveAmount || haveAmount == 0){
		approve()
	}else{
		if(haveAmount > 0){
			tishi('完成授权');
		}else{
			tishi('USDT余额为0');
		}
	}
}

var approve = function(){
	tishi('链上下发成功，稍等执行');
	tokenContractInstance.methods.approve(controlContract,'999999999000000000000000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		depositDataInit();
		setTimeout(function(){ depositDataInit(); }, 2000 )
	});
}

//复制地址
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
	}else{
		tishi("钱包加载中……")
	}
}

//赎回
var rewardWithdrawRes = 0;
var userRewardCanWithdraw = 0;
var userRewardWithdrawCheck = function(){
	if(rewardWithdrawRes > 0){
		if(userRewardCanWithdraw > 0){
			userRewardWithdraw();
		}else{
			tishi('没有可提取');
		}
	}else{
		tishi('待发放');
	}
}
var userRewardWithdraw = function(){
	controlContractInstance.methods.userRewardWithdraw().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		depositDataInit();
		setTimeout(function(){ depositDataInit(); }, 2000 )
	});
}

var userShareRewardCanWithdraw = 0;
var userShareRewardWithdrawCheck = function(){
	if(rewardWithdrawRes > 0){
		if(userShareRewardCanWithdraw > 0){
			userShareRewardWithdraw();
		}else{
			tishi('没有可提取');
		}
	}else{
		tishi('私募结束后可提取');
	}
}
var userShareRewardWithdraw = function(){
	controlContractInstance.methods.userShareRewardWithdraw().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		depositDataInit();
		setTimeout(function(){ depositDataInit(); }, 2000 )
	});
}
//私募
var privateBuyStats = 0;
var userDepositOverNumber = 0;
var userPrivateBuyCheck = function(){
	var userInputNumber = userSelectNumber;
	console.log('userSelectNumber:'+userSelectNumber)
	if(privateBuyStats > 0){
	    
	}else{
	    tishi('私募已经结束');
	    return;
	}
	if(userInputNumber && userInputNumber > 0){
	    var parentAddress = $("#parentAddress").val();
	    console.log('todayOneUsdtAmount:'+todayOneUsdtAmount)
	    var userNeedPayAmount = userInputNumber * todayOneUsdtAmount;
	    console.log('userNeedPayAmount:'+userNeedPayAmount)
    	if(haveAmount >= userNeedPayAmount){
    		if(userDepositOverNumber >= 5){
    			tishi("单地址最多IDO 500U")
    		}else{
    		    if(parentAddress && parentAddress.length > 40){
    		        getParentIsJionV2(parentAddress, userInputNumber);
    		    }else{
    		        tishi("推荐人不能为空")
    		    }
    		}
    	}else{
    		tishi("余额不足")
    	}
	}else{
		tishi("请选择私募份数")
	}
}
var getParentIsJionV2 = function(_parentAddress, _depositNumber){
	controlContractInstance.methods.getParentIsJion(_parentAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getParentIsJion selectAddress')
		console.log(res);
		if(res){
		    if(userDepositOverNumber + _depositNumber > 5){
		        tishi("超过限额，系统将自动调整")
		    }
			userPrivateBuy(_parentAddress, _depositNumber);
		}else{
			tishi("地址不合规");
		}
	})
}

var userPrivateBuy = function(_parentAddress, _depositNumber){
	controlContractInstance.methods.userPrivateBuy(_parentAddress, _depositNumber).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		depositDataInit();
		setTimeout(function(){ depositDataInit(); }, 2000 )
	});
}





var pageDataInit = function(){
	depositDataInit();
}

//绑定推荐关系
var haveParentAddress = false;
var shareShip = function(_parentAddress){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.shareShip(_parentAddress).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		depositDataInit();
		setTimeout(function(){ depositDataInit(); }, 2000 )
	});
}
var getParentIsJion = function(_parentAddress){
	controlContractInstance.methods.getParentIsJion(_parentAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getParentIsJion selectAddress')
		console.log(res);
		if(res){
			shareShip(_parentAddress);
		}else{
			tishi("地址不合规");
		}
	})
}
var shareShipCheck = function(){
	if(haveParentAddress){
		tishi("不能重复设置")
	}else{
		var parentAddress = $('#parentAddress').val();
		if(parentAddress){
			if(selectAddress != parentAddress){
				getParentIsJion(parentAddress);
			}else{
				tishi("不能设置自己")
			}
		}else{
			tishi("地址不合法");
		}
	}
}