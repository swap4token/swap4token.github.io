var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();

var shareContractInstance;
var controlContractInstance;
var userTokenContractInstance;
var usercontrolContractInstance;
var contractInstanceInit=function(){
	console.log('contractInstanceInit....')
	shareContractInstance=new web3js.eth.Contract(ShareAbi,shareContract,{from:selectAddress,gasPrice:'0'});
	controlContractInstance=new web3js.eth.Contract(CreateIdoAbi,createIdoTokenContract,{from:selectAddress,gasPrice:'0'});
	
	usercontrolContractInstance=new web3js.eth.Contract(CreateUserAbi,createUserTokenContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

var haveParentAddress = false;
var tokenOwner;
var parentAddress;
var pairAddress;
var tokenContract;
var tokenOneAmount = 0;
var baseUrl = "http://bpmweb3.com/swap/inIdoProject.html?ref=";
var tokenDetailPageDataInit = function(){
    $('#myshareLink').val(baseUrl+selectAddress);
    tokenContract = getQueryVariable('token');
	if(tokenContract){
	    tokenContractAddress = tokenContract.toLowerCase();
		$('#tokenContract').val(tokenContract);
		$('#tokenContract').text(getSimpleLongAddress(tokenContract));
		$("#tokenImage").attr("src","./img/token/"+tokenContract.toLowerCase()+".png")
	}else{
	    return ;
	}
	console.log(tokenContract);
	userTokenContractInstance=new web3js.eth.Contract(tokenAbi,tokenContract,{from:selectAddress,gasPrice:'0'});
	usercontrolContractInstance.methods.getSelfTokenDetail(tokenContract, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getIdoTokenDetail getIdoTokenDetail')
		console.log(res);
		tokenOwner = res[0].trim().toLowerCase();
		$('#oldAdminAddress').text(tokenOwner);
		
		parentAddress = res[1].trim().toLowerCase();
		if(parentAddress != "0x0000000000000000000000000000000000000000"){
			haveParentAddress = true;
			$('#referrerAddress').text(getSimpleAddress(parentAddress));
			$('#parentAddressText').text(getSimpleAddress(parentAddress));
			
			$('#parentAddress').val(parentAddress);
			$('#parentAddress').attr("readonly","readonly");
			$('#parentAddress').attr("disabled","true");
			$('#parentAddress').css('color', '#F5F5F5');
			$('#refereeBindedContent').show();
			$('#shareShipContent').hide();
			mdui.mutation();
		}else{
			var linkParentAddress = getQueryVariable('ref');
			if(linkParentAddress){
				$('#parentAddress').val(linkParentAddress);
			}
			$('#refereeBindedContent').hide();
			$('#shareShipContent').show();
		}
		
		pairAddress = res.pairAddress;
		console.log('getIdoTokenDetail pairAddress:'+pairAddress);
		var tokenObject = res.tokenObject;
		var tokenName = tokenObject.name;
		var tokenSymbol = tokenObject.symbol;
		var tokenContext = tokenObject.context;
		
		$('#tokenName').text(tokenName);
		$('#tokenSymbol').text(tokenSymbol);
		$('.tokenSymbol').text(tokenSymbol);
		$('#tokenContext').text(tokenContext);
		$('#tokenName').val(tokenName);
		$('#tokenSymbol').val(tokenSymbol);
		$('#tokenContext').val(tokenContext);
		$('.tokenContext').text(tokenContext);
		
		
		var dataList = res[4];
		var nowTime = new Date().getTime() / 1000;
		var totalSupply = web3js.utils.fromWei(dataList[0])*1
		var startTime = dataList[1]*1;
		if(startTime > 253402271999){
		    startTime = 253402271999;
		}
		$("#tokenOldStartTime").val(changeTime2DateSimply_all(startTime));
		
		$('#tokenTotal').val(totalSupply.toFixed(2));
		
		var tokenBuyFee = dataList[2]*1;
        var tokenSellFee = dataList[3]*1;
        $('#tokenBuyFee').val(tokenBuyFee.toFixed(0));
        $('#tokenSellFee').val(tokenSellFee.toFixed(0));
        $('#tokenBuyFeeInfo').text(tokenBuyFee.toFixed(0));
        $('#tokenSellFeeInfo').text(tokenSellFee.toFixed(0));
        $('#tokenBuyFeePersent').text((tokenBuyFee*0.1).toFixed(1));
        $('#tokenSellFeePersent').text((tokenSellFee*0.1).toFixed(1));
	})

    // setTimeout(getUserShareList, 2000);
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
		copycontext(baseUrl + selectAddress + "&token="+tokenContract);
	}else{
		tishi("钱包加载中……")
	}
}

var copyContract = function(){
	if(tokenContract){
		copycontext(tokenContract);
	}else{
		tishi('钱包地址正在加载！');
	}
}


var setTokenStartTimeCheck = function(){
    var tokenSwapTime = $("#tokenSwapTime").val();
    if(tokenSwapTime){
        var tokenSwapTimeValue = new Date(tokenSwapTime).getTime() / 1000;
        tokenSwapTimeValue = parseInt(tokenSwapTimeValue);
        setTokenStartTime(tokenSwapTimeValue)
    }else{
        tishi("输入错误");
    }
}
var setTokenStartTime = function(newTime){
	userTokenContractInstance.methods.setStartTime(newTime).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}
var setSwapFeeCheck = function(){
    var tokenBuyFee = $("#tokenBuyFee").val();
    var tokenSellFee = $("#tokenSellFee").val();
    if(tokenBuyFee && tokenSellFee){
        setSwapFee(tokenBuyFee, tokenSellFee);
    }else{
        tishi("输入错误");
    }
}
var setSwapFee = function(tokenBuyFee, tokenSellFee){
	userTokenContractInstance.methods.setSwapFee(tokenBuyFee, tokenSellFee).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}

//白名单
var setExcludedFromFeesCheck = function(value){
    var newUser = $("#whitelistAddress").val();
    if (newUser && newUser.startsWith('0x') && newUser.length === 42){
        setExcludedFromFees(newUser, value);
    }else{
        tishi("输入错误");
    }
}
var setExcludedFromFees = function(newUser, value){
	userTokenContractInstance.methods.setExcludedFromFees(newUser, value).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}

//权限部分
var transferOwnershipCheck = function(){
    var newAdmin = $("#newAdminAddress").val();
    if (newAdmin && newAdmin.startsWith('0x') && newAdmin.length === 42){
        transferOwnership(newAdmin);
    }else{
        tishi("输入错误");
    }
}
var transferOwnership = function(newAdmin){
	userTokenContractInstance.methods.transferOwnership(newAdmin).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}

var renounceOwnership = function(){
	userTokenContractInstance.methods.renounceOwnership().send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}



var pageDataInit = function(){
	tokenDetailPageDataInit();
}

//绑定推荐关系
var haveParentAddress = false;
var shareShip = function(_parentAddress){
	tishi('链上下发成功，稍等执行');
	shareContractInstance.methods.shareShip(_parentAddress).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
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



