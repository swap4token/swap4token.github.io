var selectAddress;
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';


var controlContractInstance;
var controlIdoContractInstance;

var contractInstanceInit=function(){
	controlContractInstance=new web3js.eth.Contract(LpValueAbi,controlLpValueContract,{from:selectAddress,gasPrice:'0'});
	controlIdoContractInstance=new web3js.eth.Contract(controlAbi,controlContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

//主页获取数据

var searchData = function(userAddress){
    console.log('--------------------------')
    console.log(userAddress);
    parentShareAddress0 = userAddress;
    $('#parentShareAddress0').text(getContractAddress(userAddress));
	$('#parentShareAddress0').css('color', '#D2D2D2');
	$('#parentShareAddress0').css('font-size', '12px');
		
    controlIdoContractInstance.methods.getUserParent(userAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserParent getUserDataShare')
		console.log(res);
		var parentAddress = res;
		parentShareAddress1 = res;
		$('#parentShareAddress1').text(getContractAddress(parentAddress));
		$('#parentShareAddress1').css('color', '#D2D2D2');
		$('#parentShareAddress1').css('font-size', '12px');
		getParentAddress2(parentAddress);
	})
	
	controlContractInstance.methods.getParentLpAmount(userAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getParentLpAmount getParentLpAmount')
		console.log(res);
		
		var userDepositAmount = web3js.utils.fromWei(res[0])*1;
		var userDepositAmount1 = web3js.utils.fromWei(res[1])*1;
		var userDepositAmount2 = web3js.utils.fromWei(res[2])*1;
		var userDepositAmount3 = web3js.utils.fromWei(res[3])*1;
		
		$('#userDepositAmount').text((userDepositAmount).toFixed(2));
		$('#userDepositAmount1').text((userDepositAmount1).toFixed(2));
		$('#userDepositAmount2').text((userDepositAmount2).toFixed(2));
		$('#userDepositAmount3').text((userDepositAmount3).toFixed(2));
		
	})
	
	controlContractInstance.methods.getSunLevelData(userAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getSunLevelData getSunLevelData')
		console.log(res);
		
		var userShareDepositAmount0 = web3js.utils.fromWei(res[0])*1;
		var userShareDepositAmount1 = web3js.utils.fromWei(res[1])*1;
		var userShareDepositAmount2 = web3js.utils.fromWei(res[2])*1;
		var userShareUsdtDepositAmount = userShareDepositAmount0 + userShareDepositAmount1 + userShareDepositAmount2;
		$('#userShareDepositAmount0').text((userShareDepositAmount0).toFixed(2));
		$('#userShareDepositAmount1').text((userShareDepositAmount1).toFixed(2));
		$('#userShareDepositAmount2').text((userShareDepositAmount2).toFixed(2));
		$('#userShareUsdtDepositAmount').text((userShareUsdtDepositAmount).toFixed(2));
	})
	
	
	controlContractInstance.methods.getParentLpTokenAmount(userAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getParentLpTokenAmount getParentLpTokenAmount')
		console.log(res);
		
		var userDepositTokenAmount = web3js.utils.fromWei(res[0])*1;
		var userDepositTokenAmount1 = web3js.utils.fromWei(res[1])*1;
		var userDepositTokenAmount2 = web3js.utils.fromWei(res[2])*1;
		var userDepositTokenAmount3 = web3js.utils.fromWei(res[3])*1;
		
		$('#userDepositTokenAmount').text((userDepositTokenAmount).toFixed(2));
		$('#userDepositTokenAmount1').text((userDepositTokenAmount1).toFixed(2));
		$('#userDepositTokenAmount2').text((userDepositTokenAmount2).toFixed(2));
		$('#userDepositTokenAmount3').text((userDepositTokenAmount3).toFixed(2));
		
	})
	
	controlContractInstance.methods.getSunLevelTokenData(userAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getSunLevelTokenData getSunLevelTokenData')
		console.log(res);
		
		var userShareDepositTokenAmount0 = web3js.utils.fromWei(res[0])*1;
		var userShareDepositTokenAmount1 = web3js.utils.fromWei(res[1])*1;
		var userShareDepositTokenAmount2 = web3js.utils.fromWei(res[2])*1;
		var userShareUsdtDepositTokenAmount = userShareDepositTokenAmount0 + userShareDepositTokenAmount1 + userShareDepositTokenAmount2;
		$('#userShareDepositTokenAmount0').text((userShareDepositTokenAmount0).toFixed(2));
		$('#userShareDepositTokenAmount1').text((userShareDepositTokenAmount1).toFixed(2));
		$('#userShareDepositTokenAmount2').text((userShareDepositTokenAmount2).toFixed(2));
		$('#userShareUsdtDepositTokenAmount').text((userShareUsdtDepositTokenAmount).toFixed(2));
	})
}

var getParentAddress2 = function(_parentAddress){
	controlIdoContractInstance.methods.getUserParent(_parentAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserParent getUserDataShare')
		console.log(res);
		var parentAddress = res;
		parentShareAddress2 = res;
		$('#parentShareAddress2').text(getContractAddress(parentAddress));
		$('#parentShareAddress2').css('color', '#D2D2D2');
		$('#parentShareAddress2').css('font-size', '12px');
		getParentAddress3(parentAddress);
	})
}

var getParentAddress3 = function(_parentAddress){
	controlIdoContractInstance.methods.getUserParent(_parentAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserParent getUserDataShare')
		console.log(res);
		var parentAddress = res;
		parentShareAddress3 = res;
		$('#parentShareAddress3').text(getContractAddress(parentAddress));
		$('#parentShareAddress3').css('color', '#D2D2D2');
		$('#parentShareAddress3').css('font-size', '12px');
	})
}

//复制地址
var copyAddress = function(){
	if(selectAddress){
		copycontext(selectAddress);
	}else{
		tishi('钱包地址正在加载！');
	}
}
var parentShareAddress0 = "";
var parentShareAddress1 = "";
var parentShareAddress2 = "";
var parentShareAddress3 = "";
var copyUserAddress0 = function(){
	if(selectAddress){
		copycontext(parentShareAddress0);
	}else{
		tishi('钱包地址正在加载！');
	}
}
var copyUserAddress1 = function(){
	if(selectAddress){
		copycontext(parentShareAddress1);
	}else{
		tishi('钱包地址正在加载！');
	}
}
var copyUserAddress2 = function(){
	if(selectAddress){
		copycontext(parentShareAddress2);
	}else{
		tishi('钱包地址正在加载！');
	}
}
var copyUserAddress3 = function(){
	if(selectAddress){
		copycontext(parentShareAddress3);
	}else{
		tishi('钱包地址正在加载！');
	}
}




var pageDataInit = function(){
	searchData(selectAddress);
}

//绑定推荐关系
var searchDataCheck = function(){
	var parentAddress = $('#parentAddress').val();
	if(parentAddress){
		searchData(parentAddress);
	}else{
		tishi("地址不合法");
	}
}