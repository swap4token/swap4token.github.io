var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';
var controlContractInstance;
var controlAbi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"}],"name":"changeAdmain","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_usdtToken","type":"address"},{"internalType":"address","name":"_bpmToken","type":"address"}],"name":"changeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bool","name":"result","type":"bool"}],"name":"changeUserResulte","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"contract IERC20","name":"betToken","type":"address"}],"name":"Recycle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"setSwapFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"setWhiteUserStats","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"tokenA","type":"address"},{"internalType":"contract IERC20","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountA","type":"uint256"}],"name":"swapToken2Token","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferBnb","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"tokenA","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"newOwner","type":"address"}],"name":"transferToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"receive"},{"inputs":[],"name":"_bpm","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_usdt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"BPM","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"contract IERC20","name":"FROM","type":"address"},{"internalType":"contract IERC20","name":"TO","type":"address"}],"name":"getUserData","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserRecord","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint8[]","name":"","type":"uint8[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"USDT","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userActiveResult","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
var controlContract = '0x1c7f75d66F730b68Bbc72b3Ce7DBfE6C65c8f2a6';
console.log('contractInstanceInit....')
var contractInstanceInit=function(){
	controlContractInstance=new web3js.eth.Contract(controlAbi,controlContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

var FromtokenAllowanceAmount = 0;
var FromHaveAmount = 0;;
var swapPageDataInit = function(){
	var _tokenA = $('#fromTokenAddress').val();
	var _tokenB = $('#toTokenAddress').val();
	controlContractInstance.methods.getUserData(selectAddress,_tokenA,_tokenB).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserData getUserData')
		console.log(res);
		FromtokenAllowanceAmount = web3js.utils.fromWei(res[0])*1;
		FromHaveAmount = web3js.utils.fromWei(res[1])*1;
		fromTokenAmount = FromHaveAmount;
		$('#FromHaveAmount').text((FromHaveAmount).toFixed(2));
		if(FromtokenAllowanceAmount >= FromHaveAmount && FromHaveAmount > 0){
			$('#approveBtn').hide();
			$('#swapBtn').show();
		}else{
			$('#approveBtn').show();
			$('#swapBtn').hide();
		}
		var TotokenAllowanceAmount = web3js.utils.fromWei(res[2])*1;
		var TohaveAmount = web3js.utils.fromWei(res[3])*1;
		toTokenAmount = TohaveAmount;
		$('#TohaveAmount').text((TohaveAmount).toFixed(2));
	})
	
	controlContractInstance.methods.getUserRecord(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserRecord getUserRecord')
		console.log(res);
		var timeList = res[0];
		var AmountList = res[1];
		var buySellResList = res[2];
		
		var size = timeList.length;
		if(size > 0){
			$('#sharenodata').hide();
			$('#sharehavedata').show();
			$('#sharehavedata').html("");
			var Amount;
			var buySellRes;
			for(var i=0;i<size;i++){
				buySellRes = buySellResList[i];
				var newEle;
				if(buySellRes> 1){
					newEle = recordEleSell;
				}else{
					newEle = recordEleBuy;
				}
				newEle = newEle.replace('dateTime',changeSysTime2Date(timeList[i]));
				Amount = web3js.utils.fromWei(AmountList[i])*1;
				ToTokenAmount = Amount*99;
				newEle = newEle.replace('FromTokenAmount',Amount.toFixed(2));
				newEle = newEle.replace('ToTokenAmount',ToTokenAmount.toFixed(2));
				$('#sharehavedata').append(newEle);
			}
		}else{
			$('#sharenodata').show();
			$('#sharehavedata').hide();
		}
	})
}

var recordEleBuy = "<div class='mdui-p-y-1 flex justify-between align-center' style='border-bottom: 1px solid #eee;'><div class=''>dateTime</div><div class='mdui-text-color-black-secondary'><span id='' class='mdui-text-color-black'>FromTokenAmount</span> USDT-> <span id='' class='mdui-text-color-black'>ToTokenAmount</span> BPM</div></div>";
var recordEleSell = "<div class='mdui-p-y-1 flex justify-between align-center' style='border-bottom: 1px solid #eee;'><div class=''>dateTime</div><div class='mdui-text-color-black-secondary'><span id='' class='mdui-text-color-black'>FromTokenAmount</span> BPM-> <span id='' class='mdui-text-color-black'>ToTokenAmount</span> USDT</div></div>";

var approveCheck = function(){
	if(FromtokenAllowanceAmount < FromHaveAmount || FromHaveAmount == 0){
		approve()
	}else{
		if(FromHaveAmount > 0){
			tishi('完成授权');
		}else{
			tishi('余额为0');
		}
	}
}
var tokenContractInstance;
var approve = function(){
	tishi('链上下发成功，稍等执行');
	var _tokenFrom = $('#fromTokenAddress').val();
	tokenContractInstance = new web3js.eth.Contract(tokenAbi,_tokenFrom,{from:selectAddress,gasPrice:'0'});
	tokenContractInstance.methods.approve(controlContract,'999999999000000000000000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapPageDataInit();
		setTimeout(function(){ swapPageDataInit(); }, 2000 )
	});
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


//绑定推荐关系
var haveParentAddress = false;
var swapToken2Token = function(_tokenA,_tokenB,_tokenAmountWei){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.swapToken2Token(_tokenA,_tokenB,_tokenAmountWei).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapPageDataInit();
		setTimeout(function(){ swapPageDataInit(); }, 2000 )
	});
}

var fromTokenAmount = 0;
var swapToken2TokenCheck = function(){
	var _tokenA = $('#fromTokenAddress').val();
	var _tokenB = $('#toTokenAddress').val();
	var _tokenAmount = $('#swapFromTokenInput').val();
	console.log(_tokenAmount)
	console.log("fromTokenAmount:"+fromTokenAmount)
	if(_tokenAmount > 0 && fromTokenAmount >= _tokenAmount){
		var _tokenAmountWei = web3js.utils.toWei(_tokenAmount+"")+"";
		swapToken2Token(_tokenA, _tokenB, _tokenAmountWei);
	}else{
		tishi("余额不足");
	}
}

var pageDataInit = function(){
	swapPageDataInit();
}
