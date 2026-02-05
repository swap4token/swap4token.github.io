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
var haveBnbAmount = 0;
var haveFrogAmount = 0;
var haveParentAddress = false;
var baseUrl = "https://swap4token.github.io/user.html?ref=";
var userPageDataInit = function(){
	$('#myshareLink').text(baseUrl+selectAddress);
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
		allowanceFrogAmount = web3js.utils.fromWei(dataList[3])*1;
		haveFrogAmount = web3js.utils.fromWei(dataList[4])*1;
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
		
	})
	
	controlContractInstance.methods.getUserShareData(selectAddress,"0xb7f2d67b37f5afb65225c5bc3c28b405be5bc964").call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserShareData getUserShareData')
		console.log(res);
		var sunList = res[0];
		var userDepositList = res[1];
		var userShareList = res[2];
		var userShareTotalList = res[3];
		
		var size = sunList.length;
		if(size > 0){
			$('#shareSunListContent').html("");
			var shareAmount;
			var teamAmount;
			var userAmount;
			for(var i=0;i<size;i++){
				var newEle = recordEle;
				newEle = newEle.replace('userAddress',getSimpleAddress(sunList[i]));
				userAmount = web3js.utils.fromWei(userDepositList[i])*1;
				shareAmount = web3js.utils.fromWei(userShareList[i])*1;
				teamAmount = web3js.utils.fromWei(userShareTotalList[i])*1;
				teamAmount = teamAmount - userAmount;
				if(teamAmount < 0){teamAmount = 0;}
				newEle = newEle.replace('shareAmount',userAmount.toFixed(2));
				newEle = newEle.replace('teamAmount',shareAmount.toFixed(2));
				$('#shareSunListContent').append(newEle);
			}
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
	shareContractInstance.methods.getParentIsJion(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log(res);
		if(res){
		}else{
			tishi("你没有绑定推荐人或没有参与，不能被他人绑定");
		}
	})
}


//绑定推荐关系
var haveParentAddress = false;
var shareShip = function(_parentAddress){
	tishi('链上下发成功，稍等执行');
	shareContractInstance.methods.shareShip(_parentAddress).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		userPageDataInit();
		setTimeout(function(){ userPageDataInit(); }, 2000 )
	});
}

var getParentIsJion = function(_parentAddress){
	shareContractInstance.methods.getParentIsJion(_parentAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
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

var pageDataInit = function(){
	userPageDataInit();
}



