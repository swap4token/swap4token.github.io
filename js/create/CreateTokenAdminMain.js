var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();

var shareContractInstance;
var controlContractInstance;

var contractInstanceInit=function(){
	console.log('contractInstanceInit....')
	shareContractInstance=new web3js.eth.Contract(tokenAbi,usdtContract,{from:selectAddress,gasPrice:'0'});
	controlContractInstance=new web3js.eth.Contract(CreateUserAbi,createIdoTokenContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

var createPageDataInit = function(){
     
	shareContractInstance.methods.balanceOf(createIdoTokenContract).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserData getUserData')
		console.log(res);
		poolHaveUsdtAmount = web3js.utils.fromWei(res)*1;
		$('#poolHaveUsdtAmount').text((poolHaveUsdtAmount).toFixed(2));
	})
	
}

var copyAddress = function(){
	if(selectAddress){
		copycontext(selectAddress);
	}else{
		tishi('钱包地址正在加载！');
	}
}

var poolHaveUsdtAmount = 0;
var transferTokenAmountCheck = function(){
	var TokenPairUsdt = $("#TokenPairUsdtInput").val().trim();
	if(!TokenPairUsdt){
	    tishi("输入错误");
		return ;
	}
	
	TokenPairUsdt = (TokenPairUsdt*1).toFixed(0);
	if(poolHaveUsdtAmount*1 < TokenPairUsdt*1){
	    tishi("USDT余额不足");
		return ;
	}
	var amountWei = web3js.utils.toWei(TokenPairUsdt)+"";
	transferTokenAmount(amountWei);
}

var transferTokenAmount = function(amountWei){
	tishi('链上下发成功，稍等执行');
	controlContractInstance.methods.transferTokenAmount(usdtContract, amountWei).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		createPageDataInit();
		setTimeout(function(){ createPageDataInit(); }, 1500 )
	});
}

var pageDataInit = function(){
	createPageDataInit();
}
