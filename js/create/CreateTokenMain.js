var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();

var shareContractInstance;
var controlContractInstance;

var contractInstanceInit=function(){
	console.log('contractInstanceInit....')
	shareContractInstance=new web3js.eth.Contract(ShareAbi,shareContract,{from:selectAddress,gasPrice:'0'});
	controlContractInstance=new web3js.eth.Contract(CreateIdoAbi,createIdoTokenContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}
var allowanceUsdtAmount = 0;
var allowanceFrogAmount = 0;
var haveUsdtAmount = 0;
var minGasNeed = 0.001;

var haveBnbAmount = 0;
var NeedPayBnBAmount = 0;
var NeedPayBnBAmountWei = 0;

var haveFrogAmount = 0;
var NeedPayFrogAmount = 0;

var haveDouAmount = 0;
var NeedPayDouAmount = 0;

var haveYejiAmount = 0;
var NeedPayYejiAmount = 0;
var haveParentAddress = false;

var createPageDataInit = function(){
	controlContractInstance.methods.getUserData(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserData getUserData')
		console.log(res);
		
		var parentAddress = res[0];
		if(parentAddress != "0x0000000000000000000000000000000000000000"){
			haveParentAddress = true;
			$('#referrerAddress').text(getSimpleAddress(parentAddress));
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
			$("#referrerModal").addClass("active");
		}
		var dataList = res[1];
		haveBnbAmount = web3js.utils.fromWei(dataList[0])*1;
		allowanceUsdtAmount = web3js.utils.fromWei(dataList[1])*1;
		haveUsdtAmount = web3js.utils.fromWei(dataList[2])*1;
		if(allowanceUsdtAmount > haveUsdtAmount){
			$("#usdtApproveBtn").hide();
			$("#usdtDepositBtn").show();
		}else{
			$("#usdtApproveBtn").show();
			$("#usdtDepositBtn").hide();
		}
		allowanceFrogAmount = web3js.utils.fromWei(dataList[3])*1;
		haveFrogAmount = web3js.utils.fromWei(dataList[4])*1;
		if(allowanceFrogAmount > haveFrogAmount){
			$("#frogApproveBtn").hide();
			$("#frogDepositBtn").show();
		}else{
			$("#frogApproveBtn").show();
			$("#frogDepositBtn").hide();
		}
		$('#haveBnbAmount').text((haveBnbAmount).toFixed(4));
		$('#haveUsdtAmount').text((haveUsdtAmount).toFixed(4));
		$('#haveFrogAmount').text((haveFrogAmount).toFixed(4));
		
		var allDouAmount = web3js.utils.fromWei(dataList[10])*1;
		var subDouAmount = web3js.utils.fromWei(dataList[11])*1;
		haveDouAmount = allDouAmount - subDouAmount;
		$('#allDouAmount').text((allDouAmount).toFixed(2));
		$('#subDouAmount').text((subDouAmount).toFixed(2));
		$('#haveDouAmount').text((haveDouAmount).toFixed(2));
		
		var userShareDepositWithSelf = web3js.utils.fromWei(dataList[20])*1;
		var userShareSun1Deposit = web3js.utils.fromWei(dataList[21])*1;
		var userShareDepositMaxArea = web3js.utils.fromWei(dataList[22])*1;
		var userDepositAmount = web3js.utils.fromWei(dataList[23])*1;
		var userShareDepositTotal = userShareDepositWithSelf - userDepositAmount;
		var userShareDepositMinArea = userShareDepositWithSelf - userShareDepositMaxArea - userDepositAmount;
		var userShareDepositMinAreaOver = web3js.utils.fromWei(dataList[24])*1;
		haveYejiAmount = userShareDepositMinArea - userShareDepositMinAreaOver; 
		if(haveYejiAmount < 0){haveYejiAmount = 0;}
		$('#userShareDepositTotal').text((userShareDepositTotal).toFixed(4));
		$('#userShareSun1Deposit').text((userShareSun1Deposit).toFixed(4));
		$('#userShareDepositMaxArea').text((userShareDepositMaxArea).toFixed(4));
		$('#userShareDepositMinArea').text((userShareDepositMinArea).toFixed(4));
		$('#userShareDepositMinAreaOver').text((userShareDepositMinAreaOver).toFixed(4));
		$('#haveYejiAmount').text((haveYejiAmount).toFixed(4));
		
		NeedPayBnBAmountWei = dataList[25]+"";
		NeedPayBnBAmount = web3js.utils.fromWei(dataList[25])*1;
		NeedPayFrogAmount = web3js.utils.fromWei(dataList[26])*1;
		NeedPayDouAmount = web3js.utils.fromWei(dataList[27])*1;
		NeedPayYejiAmount = web3js.utils.fromWei(dataList[28])*1;
		$('#NeedPayBnBAmount').text((NeedPayBnBAmount).toFixed(4));
		$('#NeedPayFrogAmount').text((NeedPayFrogAmount).toFixed(4));
		$('#NeedPayDouAmount').text((NeedPayDouAmount).toFixed(4));
		$('#NeedPayYejiAmount').text((NeedPayYejiAmount).toFixed(4));
		
		if(haveYejiAmount > 0){
			var yejiCanCreateNumber = haveYejiAmount / NeedPayYejiAmount;
			yejiCanCreateNumber = parseInt(yejiCanCreateNumber);
			$('#yejiCanCreateNumber').text((yejiCanCreateNumber).toFixed(0));
		}
	})
	
}
var recordEle = "<div class='team-item'><div class='team-address-bar'>userAddress</div><div class='team-stats'><div class='team-stat'><div class='team-stat-label'>直推业绩</div><div class='team-stat-value'>shareAmount USDT</div></div><div class='team-stat'><div class='team-stat-label'>团队业绩</div><div class='team-stat-value'>teamAmount USDT</div></div></div></div>";
var copyAddress = function(){
	if(selectAddress){
		copycontext(selectAddress);
	}else{
		tishi('钱包地址正在加载！');
	}
}

var copyShareLink = function(){
	if(selectAddress){
		getParentIsJionCheck();
		copycontext(baseUrl + selectAddress);
	}else{
		tishi("钱包加载中……")
	}
}

var getParentIsJionCheck = function(){
	controlContractInstance.methods.getParentIsJion(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log(res);
		if(res){
		}else{
			tishi("你没有绑定推荐人或没有参与，不能被他人绑定");
		}
	})
}

//发行IDO项目代币
var findIdoTokenSalt = function(callback){
    tishi("开始部署IDO项目！");
	controlContractInstance.methods.findSalt(IdoTokenCode, 300).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findSalt findSalt')
		console.log(res);
		var Salt = res[0]*1;
		if(Salt > 0){
			if (typeof callback === 'function') {
				// 将检查结果和额外选项传递给回调
				callback(Salt);
			}
		}else{
			findSelfTokenSaltV2(callback);
		}
	})
}
var findSelfTokenSaltV2 = function(callback){
	controlContractInstance.methods.findSalt(IdoTokenCode, 600).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findSelfTokenSaltV2 findSaltV2')
		console.log(res);
		var Salt = res[0]*1;
		if(Salt > 0){
			if (typeof callback === 'function') {
				// 将检查结果和额外选项传递给回调
				callback(Salt);
			}
		}else{
			tishi("没有合适的盐");
		}
	})
}

var getDeployIdoTokenParameter = function(){
	
	var TokenName= $("#TokenNameInput").val().trim();
	var TokenSymbol= $("#TokenSymbolInput").val().trim();
	var TokenTotal= $("#TokenTotalInput").val().trim();
	var TokenContext= $("#TokenContextInput").val().trim();
	
	var TokenoneAmount= $("#TokenoneAmountInput").val().trim();
	var TokenmaxNumber= $("#TokenmaxNumberInput").val().trim();
	var TokenminNumber= $("#TokenminNumberInput").val().trim();
	var TokenoneBuyAmount= $("#TokenoneBuyAmountInput").val().trim();
	var TokenoneShareBuyAmount= $("#TokenoneShareBuyAmountInput").val().trim();
	if(TokenminNumber > TokenmaxNumber){
	    tishi("硬顶软顶输错误");
		return null;
	}
	// 构造结构体数据
	if(TokenName && TokenSymbol && TokenTotal && TokenContext && TokenoneAmount && TokenmaxNumber && TokenminNumber){
		const parameter = {
			name: TokenName,
			symbol: TokenSymbol,
			context: TokenContext,
			total: web3js.utils.toWei(TokenTotal)+"",
			
			maxNumber: TokenmaxNumber,
			minNumber: TokenminNumber,
			oneAmount: web3js.utils.toWei(TokenoneAmount)+"",
			
			oneBuyAmount: web3js.utils.toWei(TokenoneBuyAmount)+"",
			oneShareBuyAmount: web3js.utils.toWei(TokenoneShareBuyAmount)+""
		};
		console.log(parameter)
		return parameter;
	}else{
		tishi("输入错误");
		return null;
	}
}

var deployIdoTokenByBnb = function(salt,parameter){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.deployIdoTokenByBnb(IdoTokenCode, salt, parameter).send({from:selectAddress,gasPrice: gasPrice, value:NeedPayBnBAmountWei}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

var deployIdoTokenByFrog = function(salt,parameter){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.deployIdoTokenByFrog(IdoTokenCode, salt, parameter).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

var deployIdoTokenByDou = function(salt,parameter){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.deployIdoTokenByDou(IdoTokenCode, salt, parameter).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

var deployIdoTokenByYeji = function(salt,parameter){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.deployIdoTokenByYeji(IdoTokenCode, salt, parameter).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

var deployIdoTokenByBnbCheck = function(){
	if(haveBnbAmount < NeedPayBnBAmount + minGasNeed){
		tishi("BNB余额不足");
		return ;
	}
	const parameter = getDeployIdoTokenParameter();
	if(parameter){
		findIdoTokenSalt(function(Salt){
			console.log("Salt:"+Salt)
			deployIdoTokenByBnb(Salt, parameter);
		})
	}
}
var deployIdoTokenByFrogCheck = function(){
	if(NeedPayFrogAmount > haveFrogAmount){
		tishi("Frog余额不足");
		return ;
	}
	const parameter = getDeployIdoTokenParameter();
	if(parameter){
		findIdoTokenSalt(function(Salt){
			console.log("Salt:"+Salt);
			deployIdoTokenByFrog(Salt, parameter);
		})
	}
}

var deployIdoTokenByDouCheck = function(){
	if(NeedPayDouAmount < haveDouAmount || haveDouAmount < 1){
		tishi("积分余额不足");
		return ;
	}
	const parameter = getDeployIdoTokenParameter();
	if(parameter){
		findIdoTokenSalt(function(Salt){
			console.log("Salt:"+Salt);
			deployIdoTokenByDou(Salt, parameter);
		})
	}
}
var deployIdoTokenByYejiCheck = function(){
	if(NeedPayYejiAmount < haveYejiAmount || haveYejiAmount < 1){
		tishi("小区业绩不足");
		return ;
	}
	const parameter = getDeployIdoTokenParameter();
	if(parameter){
		findIdoTokenSalt(function(Salt){
			console.log("Salt:"+Salt);
			deployIdoTokenByYeji(Salt, parameter);
		})
	}
}
var pageDataInit = function(){
	createPageDataInit();
}


var approveFrogCheck = function(){
    approveFrog();
}

var approveFrog = function(){
    var tokenFrogContractInstance=new web3js.eth.Contract(tokenAbi,"0xD0Dfc951Cd7787859F0eD61966BC243038888888",{from:selectAddress,gasPrice:'0'});
    tokenFrogContractInstance.methods.approve(createIdoTokenContract, '99999999999999999999000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}
