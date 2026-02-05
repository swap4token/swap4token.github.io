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
	controlContractInstance=new web3js.eth.Contract(CreateUserAbi,createUserTokenContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

var minGasNeed = 0.001;
var haveBnbAmount = 0;
var FairBeginNeedPayBnBAmount = 0;
var SelfTokenNeedPayBnBAmount = 0;
var FairBeginNeedPayBnBAmountWei = 0;
var SelfTokenNeedPayBnBAmountWei = 0;
var poolHaveUsdtAmount = 0;
var createPageDataInit = function(){
     $("#TokenOwnerInput").val(selectAddress);
     
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
			// $('#parentAddressWindow').show();
		}
		var dataList = res[1];
		haveBnbAmount = web3js.utils.fromWei(dataList[0])*1;
		
		poolHaveUsdtAmount = web3js.utils.fromWei(dataList[5])*1;
		FairBeginNeedPayBnBAmountWei = dataList[10]+"";
		SelfTokenNeedPayBnBAmountWei = dataList[11]+"";
		FairBeginNeedPayBnBAmount = web3js.utils.fromWei(dataList[10])*1;
		SelfTokenNeedPayBnBAmount = web3js.utils.fromWei(dataList[11])*1;
		
		$('#haveBnbAmount').text((haveBnbAmount).toFixed(4));
		$('#poolHaveUsdtAmount').text((poolHaveUsdtAmount).toFixed(2));
		$('#FairBeginNeedPayBnBAmount').text((FairBeginNeedPayBnBAmount).toFixed(4));
		$('#SelfTokenNeedPayBnBAmount').text((SelfTokenNeedPayBnBAmount).toFixed(4));
	})
	
}

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

//发行标准自有代币
var findSelfTokenSalt = function(parameter, TokenOwner){
    tishi("开始铸造代币");
	controlContractInstance.methods.findSalt(SelfTokenCode, 300).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findSelfTokenSalt findSalt')
		console.log(res);
		var Salt = res[0]*1;
		if(Salt > 0){
			deployUserSelfToken(Salt, parameter, TokenOwner);
		}else{
			findSelfTokenSaltV2(parameter, TokenOwner);
		}
	})
}
var findSelfTokenSaltV2 = function(parameter, TokenOwner){
	controlContractInstance.methods.findSalt(SelfTokenCode, 600).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findSelfTokenSaltV2 findSaltV2')
		console.log(res);
		var Salt = res[0]*1;
		if(Salt > 0){
			deployUserSelfToken(Salt, parameter, TokenOwner);
		}else{
			tishi("没有合适的盐");
		}
	})
}


var deployUserSelfTokenCheck = function(){
	if(haveBnbAmount < SelfTokenNeedPayBnBAmount + minGasNeed){
		tishi("BNB余额不足");
		return ;
	}
	// 构造结构体数据
	var TokenName= $("#TokenNameInput").val().trim();
	var TokenSymbol= $("#TokenSymbolInput").val().trim();
	var TokenTotal= $("#TokenTotalInput").val().trim();
	var TokenContext= $("#TokenContextInput").val().trim();
	var TokenBuyFee= $("#TokenBuyFeeInput").val().trim();
	var TokenSellFee= $("#TokenSellFeeInput").val().trim();
	var TokenOwner= $("#TokenOwnerInput").val().trim();
	
	if(TokenName && TokenSymbol && TokenTotal && TokenContext && TokenBuyFee && TokenSellFee && TokenOwner){
		const parameter = {
			name: TokenName,
			symbol: TokenSymbol,
			context: TokenContext,
			total: web3js.utils.toWei(TokenTotal)+"",
			
			maxNumber: "0",
			minNumber: "0",
			oneAmount: '0',
			
			oneBuyAmount: '0',
			oneShareBuyAmount: '0'
		};
		console.log(parameter)
		findSelfTokenSalt(parameter, TokenOwner);
	}else{
		tishi("输入错误");
	}
}

var deployUserSelfToken = function(salt, parameter, TokenOwner){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.deployUserSelfToken(SelfTokenCode, salt, TokenOwner, parameter).send({from:selectAddress,gasPrice: gasPrice,value:SelfTokenNeedPayBnBAmountWei}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

//发行公平发射代币
var findFairBeginTokenSalt = function(parameter){
    tishi("开始铸造代币");
	controlContractInstance.methods.findSalt(FairBeginTokenCode, 300).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findSalt findSalt')
		console.log(res);
		var Salt = res[0]*1;
		if(Salt > 0){
			deployFairBeginToken(Salt, parameter);
		}else{
			findFairBeginTokenSaltV2(parameter);
		}
	})
}
var findFairBeginTokenSaltV2 = function(parameter){
	controlContractInstance.methods.findSalt(FairBeginTokenCode, 600).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findSalt findSaltV2')
		console.log(res);
		var Salt = res[0]*1;
		if(Salt > 0){
			deployFairBeginToken(Salt, parameter);
		}else{
			tishi("没有合适的盐");
		}
	})
}

var deployFairBeginTokenCheck = function(){
	if(haveBnbAmount < FairBeginNeedPayBnBAmount + minGasNeed){
		tishi("BNB余额不足");
		return ;
	}
	// 构造结构体数据
	var TokenName= $("#TokenNameInput").val().trim();
	var TokenSymbol= $("#TokenSymbolInput").val().trim();
	var TokenTotal= $("#TokenTotalInput").val().trim();
	var TokenContext= $("#TokenContextInput").val().trim();
	var TokenBuyFee= $("#TokenBuyFeeInput").val().trim();
	var TokenSellFee= $("#TokenSellFeeInput").val().trim();
	var TokenPairUsdt = $("#TokenPairUsdtInput").val().trim();
	if(poolHaveUsdtAmount < TokenPairUsdt*1){
	    tishi("USDT余额不足");
		return ;
	}
	
	if(TokenName && TokenSymbol && TokenTotal && TokenContext && TokenBuyFee && TokenSellFee && TokenPairUsdt){
		const parameter = {
			name: TokenName,
			symbol: TokenSymbol,
			context: TokenContext,
			total: web3js.utils.toWei(TokenTotal)+"",
			
			maxNumber: "0",
			minNumber: "0",
			oneAmount: web3js.utils.toWei(TokenPairUsdt)+"",
			
			oneBuyAmount: '0',
			oneShareBuyAmount: '0'
		};
		console.log(parameter)
		findFairBeginTokenSalt(parameter);
	}else{
		tishi("输入错误")
	}
}

var deployFairBeginToken = function(salt, parameter){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.deployFairBeginToken(FairBeginTokenCode, salt, parameter).send({from:selectAddress,gasPrice: gasPrice,value:FairBeginNeedPayBnBAmountWei}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

var pageDataInit = function(){
	createPageDataInit();
}
