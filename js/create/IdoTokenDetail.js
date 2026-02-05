var selectAddress;
console.log('linkMyWallet....')
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();

var shareContractInstance;
var controlContractInstance;
var usdtTokenContractInstance;
var tokenLpContractInstance;
var contractInstanceInit=function(){
	console.log('contractInstanceInit....')
	shareContractInstance=new web3js.eth.Contract(ShareAbi,shareContract,{from:selectAddress,gasPrice:'0'});
	controlContractInstance=new web3js.eth.Contract(CreateIdoAbi,createIdoTokenContract,{from:selectAddress,gasPrice:'0'});
	usdtTokenContractInstance=new web3js.eth.Contract(tokenAbi,usdtContract,{from:selectAddress,gasPrice:'0'});
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
	controlContractInstance.methods.getIdoTokenDetail(tokenContract, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
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
		tokenMaxNumber = tokenObject.maxNumber;
        tokenMinNumber = tokenObject.minNumber;
        tokenOverNumber = tokenObject.overNumber;
        tokenOneAmount = web3js.utils.fromWei(tokenObject.oneAmount)*1;
		var oneTokenAmount = web3js.utils.fromWei(tokenObject.oneTokenAmount)*1;
		var userGetLpAmount = (tokenOneAmount * oneTokenAmount) ** 0.5;
		$('#userGetLpAmount').text(userGetLpAmount.toFixed(2));
		var tokenOpenPrice = tokenOneAmount / oneTokenAmount;
		var idoStartTime = tokenObject.idoStartTime;
        idoEndTime = tokenObject.idoEndTime;
        
        var nowTime = new Date().getTime() / 1000;
		if(idoStartTime > nowTime){
		    swapOrIdoTimeType = 1;//修改IDO启动时间
		    DateTimePickerModule.init({inputId: 'tokenIdoNewStartTime'});
		    $("#tokenIdoNewStartTime").css("background-color", "#fff");
		}else{
		    if(nowTime > idoEndTime || tokenOverNumber >= tokenMaxNumber){
		        swapOrIdoTimeType = 2;//修改开盘时间
		        DateTimePickerModule.init({inputId: 'tokenIdoSwapTime'});
		        $("#tokenIdoSwapTime").css("background-color", "#fff");
		    }
		    $("#tokenIdoNewStartTime").val(changeTime2DateSimply_all(idoStartTime));
		}
		var idoStartTimeDate = new Date(idoStartTime * 1000);
        var idoEndTimeDate = new Date(idoEndTime * 1000);
        $('#tokenIdoStartTime').val(formatDateToLocal(idoStartTimeDate));
        $('#tokenIdoEndTime').val(formatDateToLocal(idoEndTimeDate));
		
		$('#tokenName').text(tokenName);
		$('#tokenSymbol').text(tokenSymbol);
		$('.tokenSymbol').text(tokenSymbol);
		$('#tokenContext').text(tokenContext);
		$('#tokenName').val(tokenName);
		$('#tokenSymbol').val(tokenSymbol);
		$('#tokenContext').val(tokenContext);
		$('.tokenContext').text(tokenContext);
        
        $('#tokenOpenPrice').val(tokenOpenPrice.toFixed(5));
        $('#tokenOpenPrice').text(tokenOpenPrice.toFixed(5));
        $('.tokenOpenPrice').text(tokenOpenPrice.toFixed(5));
        
        var canBeforBuyMintOneAmount = web3js.utils.fromWei(tokenObject.oneBuyAmount)*1;
        var canBeforBuyShareOneAmount = web3js.utils.fromWei(tokenObject.oneShareBuyAmount)*1;
        $('.canBeforBuyMintOneAmount').text(canBeforBuyMintOneAmount.toFixed(2));
        $('.canBeforBuyShareOneAmount').text(canBeforBuyShareOneAmount.toFixed(2));
        var dataList = res[4];
        
        userIdoTokenIsEnd = dataList[8];
        var remianTokenTotal = web3js.utils.fromWei(dataList[9])*1
		$('#remianTokenTotal').text(remianTokenTotal.toFixed(2));
		$('.remianTokenTotal').text(remianTokenTotal.toFixed(2));
        var totalSupply = web3js.utils.fromWei(dataList[10])*1
		$('#tokenTotal').val(totalSupply.toFixed(2));
        
        launchTime = dataList[11]*1000;
        var idoTokenSwapTime = dataList[11];
        $('#tokenIdoSwapTime').val(changeTime2DateSimply_all(idoTokenSwapTime));
        $('.tokenIdoSwapTime').text(changeTime2DateSimply_all(idoTokenSwapTime));
        
		$('#tokenOneAmount').text(tokenOneAmount.toFixed(2));
		$('#tokenOneAmount_').text(tokenOneAmount.toFixed(0));
		$('#tokenOne2Amount_').text((tokenOneAmount*2).toFixed(0));
		$('#tokenOne3Amount_').text((tokenOneAmount*3).toFixed(0));
		
		
		
		$('.tokenOneAmount').text(tokenOneAmount.toFixed(2));
		
		$('#tokenMaxNumber').text(tokenMaxNumber);
		$('#tokenMinNumber').text(tokenMinNumber);
		$('#tokenOverNumber').text(tokenOverNumber);
		$('#tokenOverNumber_').text(tokenOverNumber);
		$('.tokenMinNumber').text(tokenMinNumber);
		$('.tokenOverNumber').text(tokenOverNumber);
		
		var tokenIdoMaxAmount = tokenOneAmount * tokenMaxNumber;
		$('.tokenIdoMaxAmount').text(tokenIdoMaxAmount.toFixed(2));
		
		var tokenIdoMinAmount = tokenOneAmount * tokenMinNumber;
		$('.tokenIdoMinAmount').text(tokenIdoMinAmount.toFixed(2));
		
		var tokenOverTotalAmount = tokenOverNumber * tokenOneAmount;
		$('.tokenOverTotalAmount').text(tokenOverTotalAmount.toFixed(2));
		
		var idoOverRate = tokenOverNumber * 100 / tokenMaxNumber;
		$('#idoOverRate').text(idoOverRate.toFixed(2));
		if(idoOverRate < 0.1){idoOverRate = 0.1;}
		$("#progressbarRate").css("width",idoOverRate+"%")
		
		$("#tokenIdoStartTime").text(changeTime2DateSimply_all(idoStartTime));
		
		
		var userPlayTokenTime = dataList[24];
		if(userPlayTokenTime*1 > 0){
		    $("#userPlayTokenTime").text(changeTime2DateSimply_all(userPlayTokenTime));
		}else{
		    $("#userPlayTokenTime").text("未参与");
		}
		
		var tokenBuyFee = dataList[12] * 0.1;
        var tokenSellFee = dataList[13] * 0.1;
        $('#tokenBuyFee').val(tokenBuyFee.toFixed(1));
        $('#tokenSellFee').val(tokenSellFee.toFixed(1));
		var lptotalSupply = web3js.utils.fromWei(dataList[16])*1
		$('#lptotalSupply').text(lptotalSupply.toFixed(2));
		
		var lptotalSupply = web3js.utils.fromWei(dataList[16])*1
		$('#lptotalSupply').val(lptotalSupply.toFixed(2));
		haveLpAmount = web3js.utils.fromWei(dataList[17])*1
        tokenMinLpAmount = web3js.utils.fromWei(dataList[18])*1
        $('.haveLpAmount').text(haveLpAmount.toFixed(4));
        $('.tokenMinLpAmount').text(tokenMinLpAmount.toFixed(4));
        var lpApproveRes = dataList[19] * 1;
        if(lpApproveRes > 0){
            $("#idoTokenOutApproveBtn").hide();
            $("#idoTokenOutBtn").show();
        }else{
            $("#idoTokenOutApproveBtn").show();
            $("#idoTokenOutBtn").hide();
        }
        haveUsdtAmount = web3js.utils.fromWei(dataList[21])*1;
        $('#haveUsdtAmount').text(haveUsdtAmount.toFixed(2));
        var userUsdtApproveRes = dataList[22]*1;
        if(userUsdtApproveRes > 0){
            $("#idoTokenInApproveBtn").hide();
            $("#idoTokenInMintBtn").show();
        }else{
            $("#idoTokenInApproveBtn").show();
            $("#idoTokenInMintBtn").hide();
        }
        
        var poolHaveUsdtAmount = web3js.utils.fromWei(dataList[23])*1;
        $('.poolHaveUsdtAmount').text(poolHaveUsdtAmount.toFixed(2));
        
        
        var userCanBeforBuyUsdtAmount = web3js.utils.fromWei(dataList[25])*1;
        $('.userCanBeforBuyUsdtAmount').text(userCanBeforBuyUsdtAmount.toFixed(2));
        var userCanBeforBuyShareUsdtAmount = web3js.utils.fromWei(dataList[26])*1;
        $('.userCanBeforBuyShareUsdtAmount').text(userCanBeforBuyShareUsdtAmount.toFixed(2));
        var userCanBeforBuyShareNumber = dataList[27]*1;
        $('.userCanBeforBuyShareNumber').text(userCanBeforBuyShareNumber.toFixed(0));
        $('.userCanBeforBuyShareNumber').val(userCanBeforBuyShareNumber.toFixed(0));
        
        userCanOutTime = dataList[14];
	})

    setTimeout(getUserShareList, 2000);
}

var getUserShareList = function(){
    controlContractInstance.methods.getUserShareData(selectAddress, tokenContract).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserShareData getUserShareData')
		console.log(res);
		var sunList = res[0];
		var userPalyTimeList = res[3];
		
		var size = sunList.length;
		if(size > 0){
			$('#shareSunListContent').html("");
			var palyTime;
			for(var i=0;i<size;i++){
				var newEle = shareRecordEle;
				newEle = newEle.replace('userAddress',getSimpleAddress(sunList[i]));
				palyTime = userPalyTimeList[i];
				if(palyTime > 0){
				    newEle = newEle.replace('tokenOneAmount',tokenOneAmount.toFixed(1));
				    newEle = newEle.replace('palyTime',changeTime2DateSimply_mdhm(palyTime));
				}else{
				    newEle = newEle.replace('tokenOneAmount',"0.0");
				    newEle = newEle.replace('palyTime',"未参与");
				}
				
				$('#shareSunListContent').append(newEle);
			}
		}
	})
}

var recordEle = "<a href='management.html?token=tokenContract' class='project-item'><div class='project-logo'><img src='./img/tokenContract.png' onerror=\"this.src='./img/none.png';\" /></div><div class='project-info'><div class='project-name'>tokenName</div><div class='project-symbol'>代币符号：tokenSymbol</div></div>tokenStats</a>";
var shareRecordEle = "<tr><td><span class='referral-addr-value'>userAddress</span></td><td><span class='referral-amount'>tokenOneAmount</span></td><td><span class='referral-time'>palyTime</span></td></tr>";

var getTokenStats = function(_type){
	if(_type > 3){
		return "<span class='project-status status-swaping'>已开盘</span>";
	}
	if(_type > 2){
		return "<span class='project-status status-pending'>待开盘</span>";
	}
	if(_type > 1){
		return "<span class='project-status status-running'>IDO中</span>";
	}
	return "<span class='project-status status-ended'>待IDO</span>";
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

var swapOrIdoTimeType = 0;
var changeTokenTime = function(){
    if(swapOrIdoTimeType > 1){
        tishi("修改开盘时间");
        setTokenStartTimeCheck();
    }else if(swapOrIdoTimeType > 0){
        tishi("修改IDO开始时间");
        changeIdoStartTimeCheck();
    }else{
        tishi("等待IDO结束后才可修改");
    }
}

     
var setTokenStartTimeCheck = function(){
    var tokenIdoSwapTime = $("#tokenIdoSwapTime").val();
    if(tokenIdoSwapTime){
        var nowTime = new Date().getTime() / 1000;
        if(idoEndTime < nowTime){
            tokenIdoSwapTimeValue = new Date(tokenIdoSwapTime).getTime() / 1000;
            tokenIdoSwapTimeValue = parseInt(tokenIdoSwapTimeValue);
            setTokenStartTime(tokenIdoSwapTimeValue)
        }else{
            tishi("私募未结束");
        }
    }else{
        tishi("输入错误");
    }
}
var setTokenStartTime = function(newTime){
	controlContractInstance.methods.setTokenStartTime(tokenContract, newTime).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}
var changeIdoStartTimeCheck = function(){
    var tokenIdoNewStartTime = $("#tokenIdoNewStartTime").val();
    if(tokenIdoNewStartTime){
        var nowTime = new Date().getTime() / 1000;
        tokenIdoNewStartTimeValue = new Date(tokenIdoNewStartTime).getTime() / 1000;
        tokenIdoNewStartTimeValue = parseInt(tokenIdoNewStartTimeValue);
        if(tokenIdoNewStartTimeValue > nowTime){
            changeIdoStartTime(tokenIdoNewStartTimeValue)
        }else{
            tishi("请设置大于当前时间");
        }
        
    }else{
        tishi("输入错误");
    }
}
var changeIdoStartTime = function(newTime){
	controlContractInstance.methods.changeIdoStartTime(tokenContract, newTime).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
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
	controlContractInstance.methods.setExcludedFromFees(tokenContract, newUser, value).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
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
        tishi("转移权限会导致归属错乱");
        // transferOwnership(newAdmin);
    }else{
        tishi("输入错误");
    }
}
var transferOwnership = function(newAdmin){
	controlContractInstance.methods.transferOwnership(tokenContract, newAdmin).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}

var renounceOwnership = function(){
	controlContractInstance.methods.renounceOwnership(tokenContract).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}


//权限部分
var userIdoTokenIsEnd = 0;
var tokenMinNumber = 0;
var tokenOverNumber = 0
var overIdoPerparSwapCheckV1 = function(){
    console.log("overIdoPerparSwapCheckV1")
    if(userIdoTokenIsEnd > 0){
        tishi("仅可操作一次");
        return ;
    }
    
    if (tokenOverNumber*1 >= tokenMinNumber*1){
        overIdoPerparSwap();
    }else{
        tishi("到达软顶之后才可以提前结束");
    }
}
var idoEndTime = 0;
var overIdoPerparSwapCheckV2 = function(){
    console.log("overIdoPerparSwapCheckV2")
    if(userIdoTokenIsEnd > 0){
        tishi("仅可操作一次");
        return ;
    }
    var nowTime = new Date().getTime() / 1000;
    if (nowTime > idoEndTime){
        overIdoPerparSwap();
    }else{
        tishi("IDO未到结束时间");
    }
}
var overIdoPerparSwap = function(){
	controlContractInstance.methods.overIdoPerparSwap(tokenContract).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
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

//参与IDO 和 保本退出
var haveUsdtAmount = 0;
var tokenMaxNumber = 0;
var mintCheck = function(){
    if (haveUsdtAmount >= tokenOneAmount){
        var nowTime = new Date().getTime() / 1000;
        
        if(tokenOverNumber - tokenMaxNumber >= 0 || nowTime - idoEndTime >= 0){
            tishi("IDO已结束");
            return ;
        }
        if(tokenMinLpAmount > 0){
            tishi("每个地址只能私募一份");
        }else{
            mint();
        }
    }else{
        tishi("余额不足");
    }
}
var mint = function(){
	controlContractInstance.methods.mint(tokenContract).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}

var haveLpAmount = 0;
var tokenMinLpAmount = 0;
var outCheck = function(){
    if (haveLpAmount >= tokenMinLpAmount && haveLpAmount > 0){
        var nowTime = new Date().getTime() / 1000;
        if(nowTime > userCanOutTime){
            out();
        }else{
            tishi("开盘后一小时可保本退出");
        }
    }else{
        tishi("LP余额不足");
    }
}
var out = function(){
	controlContractInstance.methods.out(tokenContract).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}


//授权部分
var approveUsdtCheck = function(){
    approveUsdt();
}

var approveUsdt = function(){
    usdtTokenContractInstance.methods.approve(createIdoTokenContract, '99999999999999999999000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}

var approveLpCheck = function(){
    approveLp();
}

var approveLp = function(){
    tokenLpContractInstance=new web3js.eth.Contract(tokenAbi,pairAddress,{from:selectAddress,gasPrice:'0'});
    tokenLpContractInstance.methods.approve(createIdoTokenContract, '99999999999999999999000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		tokenDetailPageDataInit();
		setTimeout(function(){ tokenDetailPageDataInit(); }, 2000 )
	});
}



