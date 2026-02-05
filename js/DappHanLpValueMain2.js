var selectAddress;
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';

var LpValueAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"MARS","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAIR","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"USDT","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_PAIR","type":"address"}],"name":"changePair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getIsOwnerRes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lpAmount","type":"uint256"}],"name":"getLpUsdtTokenValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getParentList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getParentLpAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getParentLpTokenAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"sunList","type":"address[]"}],"name":"getSunLevel","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getSunLevelData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"sunList","type":"address[]"}],"name":"getSunLevelToken","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getSunLevelTokenData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"sunList","type":"address[]"}],"name":"getSunListLevelTokenData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"sunList","type":"address[]"}],"name":"getSunLpLevel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUsdtLpUsdtTokenValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserLpTokenValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserLpUsdtValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWhiteUser","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"outUser2WhiteUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"putUser2WhiteUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferBnb","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"newOwner","type":"address"}],"name":"transferToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"newOwner","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferTokenAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
var controlContract = '0xd776cBdFA8A608B7b32F840e13AD6d94c6B40639';
var controlLpValueContract = '0xbb284a1a364B0f6032AB5e49B21D645a2453248B';
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
    getUserSunListData(userAddress);
    
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

var getUserSunListData = function(userAddress){
	
	ajaxfunction("nbuser/get",{address:userAddress},function(res){
	    var json = eval("(" + res + ")");
		console.log(json)
		if(json.sucess){
			tishi("成功");
			getSunListData0(json.object);
			getSunListData1(json.other);
			getSunListData2(json.ext);
		}else{
			tishi(json.msg);
		}
	})
}

var sunListUsdtAmount0 = 0;
var sunListTokenAmount0 = 0;
var sunListUsdtAmount1 = 0;
var sunListTokenAmount1 = 0;
var sunListUsdtAmount2 = 0;
var sunListTokenAmount2 = 0;
var getSunListData0 = function(_sunList0){
    console.log(_sunList0);
	controlContractInstance.methods.getSunListLevelTokenData(_sunList0).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getSunLevelTokenData0 getSunLevelTokenData0')
		console.log(res);
		var sunListLpAmount0 = web3js.utils.fromWei(res[0])*1;
		sunListUsdtAmount0 = web3js.utils.fromWei(res[1])*1;
		sunListTokenAmount0 = web3js.utils.fromWei(res[2])*1;
		$('#sunListLpAmount0').text((sunListLpAmount0).toFixed(2));
		$('#sunListUsdtAmount0').text((sunListUsdtAmount0).toFixed(2));
		$('#sunListTokenAmount0').text((sunListTokenAmount0).toFixed(2));
		
		$('#sunListUsdtAmountTotal').text((sunListUsdtAmount0+sunListUsdtAmount1+sunListUsdtAmount2).toFixed(2));
		$('#sunListTokenAmountTotal').text((sunListTokenAmount0+sunListTokenAmount1+sunListTokenAmount2).toFixed(2));
	})
}

var getSunListData1 = function(_sunList1){
    console.log(_sunList1);
	controlContractInstance.methods.getSunListLevelTokenData(_sunList1).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getSunLevelTokenData1 getSunLevelTokenData1')
		console.log(res);
		var sunListLpAmount1 = web3js.utils.fromWei(res[0])*1;
		sunListUsdtAmount1 = web3js.utils.fromWei(res[1])*1;
		sunListTokenAmount1 = web3js.utils.fromWei(res[2])*1;
		$('#sunListLpAmount1').text((sunListLpAmount1).toFixed(2));
		$('#sunListUsdtAmount1').text((sunListUsdtAmount1).toFixed(2));
		$('#sunListTokenAmount1').text((sunListTokenAmount1).toFixed(2));
		
		$('#sunListUsdtAmountTotal').text((sunListUsdtAmount0+sunListUsdtAmount1+sunListUsdtAmount2).toFixed(2));
		$('#sunListTokenAmountTotal').text((sunListTokenAmount0+sunListTokenAmount1+sunListTokenAmount2).toFixed(2));
	})
}

var getSunListData2 = function(_sunList2){
    console.log(_sunList2);
	controlContractInstance.methods.getSunListLevelTokenData(_sunList2).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getSunLevelTokenData2 getSunLevelTokenData2')
		console.log(res);
		var sunListLpAmount2 = web3js.utils.fromWei(res[0])*1;
		sunListUsdtAmount2 = web3js.utils.fromWei(res[1])*1;
		sunListTokenAmount2 = web3js.utils.fromWei(res[2])*1;
		$('#sunListLpAmount2').text((sunListLpAmount2).toFixed(2));
		$('#sunListUsdtAmount2').text((sunListUsdtAmount2).toFixed(2));
		$('#sunListTokenAmount2').text((sunListTokenAmount2).toFixed(2));
		
		$('#sunListUsdtAmountTotal').text((sunListUsdtAmount0+sunListUsdtAmount1+sunListUsdtAmount2).toFixed(2));
		$('#sunListTokenAmountTotal').text((sunListTokenAmount0+sunListTokenAmount1+sunListTokenAmount2).toFixed(2));
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