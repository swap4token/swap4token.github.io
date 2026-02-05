var selectAddress;
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';

var TokenControlContractInstance;
var ToolControlContractInstance;
var RouterControlContractInstance;
var contractInstanceInit=function(){
    TokenControlContractInstance=new web3js.eth.Contract(TokenAbi,wbnbContract,{from:selectAddress,gasPrice:'0'});
    ToolControlContractInstance=new web3js.eth.Contract(SwapToolAbi,swapToolContract,{from:selectAddress,gasPrice:'0'});
	RouterControlContractInstance=new web3js.eth.Contract(SwapRouterAbi,pancakeRouterContract,{from:selectAddress,gasPrice:'0'});
	pageDataInit();
}

//主页获取数据
var allowanceAmount = 0;
var haveAmount = 0;

var allowanceLpAmount = 0;
var haveLpAmount = 0;

var userDepositAmount = 0;
var nodeBnbPrice = 0;
var shareShipRes = 0;
var userBnbRes = 0;

var depositDataInit = function(){
	swapTokenDataInit();
	findUserLpDetail();
	getPairsInfoBatch();
}


var swapTokenDataInit = function(){
    if(!selectAddress){console.log('区块链数据获取中…… ');return;}
    var addToken0ContractInput = $("#addToken0ContractInput").val();
    var addToken1ContractInput = $("#addToken1ContractInput").val();
    console.log('addToken0ContractInput '+addToken0ContractInput)
    console.log('addToken1ContractInput '+addToken1ContractInput)
    if(!addToken0ContractInput || !addToken1ContractInput) return;
    ToolControlContractInstance.methods.getTokenBalance(addToken0ContractInput, addToken1ContractInput, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('swapTokenDataInit getTokenBalance')
		console.log(res);
		var token0decimals = res[2]*1;
		var token1decimals = res[3]*1;
		var addToken0Balance = bigintToDecimal8SigFigs(res[0], token0decimals);
		var addToken1Balance = bigintToDecimal8SigFigs(res[1], token1decimals);
		$('#addToken0Balance').text(addToken0Balance);
		$('#addToken1Balance').text(addToken1Balance);
		AddLiquidityToken0HaveAmount = addToken0Balance;
		AddLiquidityToken1HaveAmount = addToken1Balance;
		AddLiquidityToken0Decimals = token0decimals;
        AddLiquidityToken1Decimals = token1decimals;
	})
}


var findUserLpDetail = function(){
    if(!selectAddress){console.log('区块链数据获取中…… ');return;}
    var importToken0ContractInput = $("#importToken0ContractInput").val();
    var importToken1ContractInput = $("#importToken1ContractInput").val();
    console.log('findUserLpDetail '+importToken0ContractInput)
    console.log('findUserLpDetail '+importToken1ContractInput)
    if(!importToken0ContractInput || !importToken1ContractInput) return;
    ToolControlContractInstance.methods.findUserLpDetailV2(importToken0ContractInput, importToken1ContractInput, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findUserLpDetail findUserLpDetail')
		console.log(res);
		var importPoolpairAddress = res[0];
		$('#importPairContractSuccess').val(importPoolpairAddress);
		var importPoolToken0Address = res[1];
        var importPoolToken1Address = res[2];
        $('#importToken0ContractSuccess').val(importPoolToken0Address);
        $('#importToken1ContractSuccess').val(importPoolToken1Address);
		var importPoolToken0decimals = res[9]*1;
        var importPoolToken1decimals = res[10]*1;
        $('#importToken0DecimalsSuccess').val(importPoolToken0decimals);
        $('#importToken1DecimalsSuccess').val(importPoolToken1decimals);
        
        var importPoolPairTotalAmount = bigintToDecimal8SigFigs(res[3], 18);
        var importPoolUserPairAmount = bigintToDecimal8SigFigs(res[4], 18);
        $('#importPoolPairTotalAmount').text(importPoolPairTotalAmount);
        $('#importPoolUserPairAmount').text(importPoolUserPairAmount);
        var importPoolUserPairRate = (importPoolUserPairAmount * 100.0)/(importPoolPairTotalAmount * 1.0);
        $('#importPoolUserPairRate').text(importPoolUserPairRate.toFixed(4)+" %");
        var importPoolToken0Amount = bigintToDecimal8SigFigs(res[5], importPoolToken0decimals);
        var importPoolToken1Amount = bigintToDecimal8SigFigs(res[6], importPoolToken1decimals);
        $('#importPoolToken0Amount').text(importPoolToken0Amount);
        $('#importPoolToken1Amount').text(importPoolToken1Amount);
        
        var importPoolToken0symbol = res[7];
        var importPoolToken1symbol = res[8];
        $('#importPoolToken0symbol').text(importPoolToken0symbol);
        $('#importPoolToken1symbol').text(importPoolToken1symbol);
        
        // document.getElementById('lpAddress').textContent = getContract68Address(importPoolpairAddress);
        // document.getElementById('previewToken0').textContent = getContract68Address(importPoolToken0Address);
        // document.getElementById('previewToken1').textContent = getContract68Address(importPoolToken1Address);
        // document.getElementById('lpBalance').textContent = importPoolUserPairAmount + ' LP';
        
        $('#lpAddress').text(getContract68Address(importPoolpairAddress));
        $('#previewToken0').text(getContract68Address(importPoolToken0Address));
        $('#previewToken1').text(getContract68Address(importPoolToken1Address));
        $('#lpBalance').text(importPoolUserPairAmount + ' LP');
        $("#lpPreview").addClass("show");
	})
	
	
}

var addLiquidityTokenAmountDataInit = function(token0Amount, token1Amount){
    console.log('addLiquidityTokenAmountDataInit token0Amount;'+token0Amount)
    console.log('addLiquidityTokenAmountDataInit token1Amount;'+token1Amount)
    var addToken0ContractInput = $("#addToken0ContractInput").val();
    var addToken1ContractInput = $("#addToken1ContractInput").val();
    var _inTokenAmountWei;
    if(token0Amount > 0){
        _inTokenAmountWei = decimalToBigInteger(token0Amount, 18);
        getAddLdxTokenInfo(addToken0ContractInput, addToken1ContractInput, _inTokenAmountWei, token0Amount,'addToken1BalanceInput', 'addToken1Balance', 'addToken0Balance', 'addLiquidityToken1ApproveBtn', 'addLiquidityToken0ApproveBtn');
    }
    if(token1Amount > 0){
        _inTokenAmountWei = decimalToBigInteger(token1Amount, 18);
        getAddLdxTokenInfo(addToken1ContractInput, addToken0ContractInput, _inTokenAmountWei, token1Amount,'addToken0BalanceInput', 'addToken0Balance', 'addToken1Balance', 'addLiquidityToken0ApproveBtn', 'addLiquidityToken1ApproveBtn');
    }
    
}

var getAddLdxTokenInfo = function(_inTokenContract, _outTokenContract, _inTokenAmountWei, _inTokenAmount, _outTokenInputId, _outTokenHaveAmountId, _inTokenHaveAmountId, _outTokenApproveId, _inTokenApproveId){
    ToolControlContractInstance.methods.getAddLdxTokenInfo(_inTokenContract, _outTokenContract, selectAddress, _inTokenAmountWei).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getAddLdxTokenInfo getAddLdxTokenInfo')
		console.log(res);
		
		var AddLdxInTokendecimals = res[6]*1;
        var AddLdxOutTokendecimals = res[7]*1;
		var AddLdxInTokenHaveAmount = bigintToDecimal8SigFigs(res[0], AddLdxInTokendecimals);
		var AddLdxOutTokenHaveAmount = bigintToDecimal8SigFigs(res[1], AddLdxOutTokendecimals);
		var AddLdxInTokenAllowance = bigintToDecimal8SigFigs(res[2], AddLdxInTokendecimals);
		var AddLdxOutTokenAllowance = bigintToDecimal8SigFigs(res[3], AddLdxOutTokendecimals);
		var pairRes = res[4]*1;
		var AddLdxOutTokenNeedAmount = bigintToDecimal8SigFigs(res[5], AddLdxOutTokendecimals);
		if(pairRes > 0){
		    $('#'+_outTokenInputId).val(AddLdxOutTokenNeedAmount);
		}
		
		$('#'+_inTokenHaveAmountId).text(AddLdxInTokenHaveAmount);
        $('#'+_outTokenHaveAmountId).text(AddLdxOutTokenHaveAmount);
		
		
		if(AddLdxInTokenAllowance*1.0 >= _inTokenAmount){
		    $('#'+_inTokenApproveId).hide();
		    AddLiquidityToken1NeedApprove = false;
		}else{
		    $('#'+_inTokenApproveId).show();
		    AddLiquidityToken1NeedApprove = true;
		}
		
		if(AddLdxOutTokenAllowance*1.0 >= AddLdxOutTokenNeedAmount){
		    $('#'+_outTokenApproveId).hide();
		    AddLiquidityToken0NeedApprove = false;
		}else{
		    $('#'+_outTokenApproveId).show();
		    AddLiquidityToken0NeedApprove = true;
		}
	})
}

var approveToken0Check = function(){
	approveToken02router();
}
var approveToken02router = function(){
	tishi('链上下发成功，稍等执行');
	var addToken0ContractInput = $("#addToken0ContractInput").val();
	var addToken0ContractInstance = new web3js.eth.Contract(TokenAbi,addToken0ContractInput,{from:selectAddress,gasPrice:'0'}); 
	addToken0ContractInstance.methods.approve(pancakeRouterContract,'9999999999999000000000000000000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 2000 )
	});
}
var approveToken1Check = function(){
	approveToken12router();
}
var approveToken12router = function(){
	tishi('链上下发成功，稍等执行');
	var addToken1ContractInput = $("#addToken1ContractInput").val();
	var addToken1ContractInstance = new web3js.eth.Contract(TokenAbi,addToken1ContractInput,{from:selectAddress,gasPrice:'0'}); 
	addToken1ContractInstance.methods.approve(pancakeRouterContract,'9999999999999000000000000000000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 2000 )
	});
}

var approvePairCheck = function(){
	approvePair();
}
var approvePair = function(){
	tishi('链上下发成功，稍等执行');
	var removeLiquidityPair = $("#removeLiquidityPairInput").val();
	var removeLiquidityPairContractInstance = new web3js.eth.Contract(TokenAbi,removeLiquidityPair,{from:selectAddress,gasPrice:'0'}); 
	removeLiquidityPairContractInstance.methods.approve(pancakeRouterContract,'9999999999999000000000000000000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 2000 )
	});
}

var AddLiquidityToken0NeedApprove = true;
var AddLiquidityToken1NeedApprove = true;
var AddLiquidityToken0HaveAmount = 0;
var AddLiquidityToken1HaveAmount = 0;
var AddLiquidityToken0Decimals = 0;
var AddLiquidityToken1Decimals = 0;

var AddLiquidityCheck = function(){
    if(AddLiquidityToken0NeedApprove || AddLiquidityToken1NeedApprove){
        tishi("请先点击授权");
        return;
    }
    var addToken0ContractInput = $("#addToken0ContractInput").val();
    var addToken1ContractInput = $("#addToken1ContractInput").val();
    console.log('AddLiquidityCheck addToken0ContractInput;'+addToken0ContractInput)
    console.log('AddLiquidityCheck addToken1ContractInput;'+addToken1ContractInput)
    if(addToken0ContractInput == addToken1ContractInput){
        tishi("代币选择错误");
        return;
    }
    var addToken0Amount = $("#addToken0BalanceInput").val();
    var addToken1Amount = $("#addToken1BalanceInput").val();
    if(AddLiquidityToken0HaveAmount*1.0 < addToken0Amount){
        tishi("第一个代币余额不足");
        return;
    }
    if(AddLiquidityToken1HaveAmount*1.0 < addToken1Amount){
        console.log('AddLiquidityToken1HaveAmount;'+AddLiquidityToken1HaveAmount);
        console.log('addToken1Amount;'+addToken1Amount);
        tishi("第二个代币余额不足");
        return;
    }
    var addToken0AmountWei = decimalToBigInteger(addToken0Amount, AddLiquidityToken0Decimals);
    var addToken1AmountWei = decimalToBigInteger(addToken1Amount, AddLiquidityToken1Decimals);
    var _ethAmountWei;
    if(addToken0ContractInput == bnbContract){
        addLiquidityETH(addToken1ContractInput,addToken1AmountWei,1,addToken0AmountWei, 1);
    }else if(addToken1ContractInput == bnbContract){
        _ethAmountWei = decimalToBigInteger(addToken1Amount, 18);
        addLiquidityETH(addToken0ContractInput, addToken0AmountWei, 1, addToken1AmountWei, 1);
    }else {
        addLiquidity(addToken0ContractInput,addToken1ContractInput,addToken0AmountWei,addToken1AmountWei,1,1,);
    }
}

var addLiquidityETH = function(_token, _amountTokenDesired, _amountTokenMin, _ethAmountWei, _amountETHMin){
	tishi('链上下发成功，稍等执行'); 
	console.log('_amountTokenDesired;'+_amountTokenDesired);
	RouterControlContractInstance.methods.addLiquidityETH(
	    _token, 
	    _amountTokenDesired, 
	    _amountTokenMin, 
	    _amountETHMin, 
	    selectAddress, 
	    '1000000000000000').send({from:selectAddress,gasPrice: gasPrice,value:_ethAmountWei}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); closeAddLiquidity();}, 1500 )
	});
}

var addLiquidity = function(_tokenA, _tokenB, _amountADesired, _amountBDesired, _amountAMin, _amountBMin){
	tishi('链上下发成功，稍等执行'); 
	RouterControlContractInstance.methods.addLiquidity(
	    _tokenA, 
	    _tokenB, 
	    _amountADesired, 
	    _amountBDesired, 
	    _amountAMin, 
	    _amountBMin, 
	    selectAddress, 
	    '1000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); closeAddLiquidity();}, 1500 )
	});
}

var findDeleteLdxPair = function(deleteToken0ContractInput, deleteToken1ContractInput){
    if(!selectAddress){console.log('区块链数据获取中…… ');return;}
    console.log('findDeleteLdxPair deleteToken0ContractInput '+deleteToken0ContractInput)
    console.log('findDeleteLdxPair deleteToken1ContractInput '+deleteToken1ContractInput)
    if(!deleteToken0ContractInput || !deleteToken1ContractInput) return;
    ToolControlContractInstance.methods.findUserLpDetailV3(deleteToken0ContractInput, deleteToken1ContractInput, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findDeleteLdxPair findUserLpDetail')
		console.log(res);
		var removeLiquidityPairInput = res[0];
		$('#removeLiquidityPairInput').val(removeLiquidityPairInput);
		$("#removeLiquidityToken0Input").val(res[1]);
        $("#removeLiquidityToken1Input").val(res[2]);
        
		var removeLiquidityToken0decimals = res[8]*1;
        var removeLiquidityToken1decimals = res[9]*1;
        
        var removeLiquidityToken0Amount = bigintToDecimal8SigFigs(res[5], removeLiquidityToken0decimals);
        var removeLiquidityToken1Amount = bigintToDecimal8SigFigs(res[6], removeLiquidityToken1decimals);
        
        $('#removeLiquidityToken0MaxAmount').val(removeLiquidityToken0Amount * 1);
        $('#removeLiquidityToken1MaxAmount').val(removeLiquidityToken1Amount * 1);
        
        
        RemoveLiquidityPairHave = bigintToDecimal8SigFigs(res[4], 18);
        var RemoveLiquidityPairApprove = bigintToDecimal8SigFigs(res[7], 18);
        if(RemoveLiquidityPairApprove*1 >= RemoveLiquidityPairHave*1){
            $("#RemoveLiquidityPairApproveBtn").hide();
            RemoveLiquidityPairNeedApprove = false;
        }else{
            $("#RemoveLiquidityPairApproveBtn").show();
            RemoveLiquidityPairNeedApprove = true;
        }
        updateRemoveValues();
	})
}
var RemoveLiquidityPairHave = 0;
var RemoveLiquidityPairNeedApprove = true;
var RemoveLiquidityCheck = function(){
    const percentage = $("#removeSlider").val();
    console.log("percentage:"+percentage)
    if(RemoveLiquidityPairNeedApprove){
        tishi("请先点击允许");
        return;
    }
    var removeLiquidityToken0Contract = $("#removeLiquidityToken0Input").val();
    var removeLiquidityToken1Contract = $("#removeLiquidityToken1Input").val();
    console.log("removeLiquidityToken0Contract:"+removeLiquidityToken0Contract)
    console.log("removeLiquidityToken1Contract:"+removeLiquidityToken1Contract)
    var RemoveLiquidityPairAmountWei = '';
    var RemoveLiquidityPairAmount = 0;
    if(RemoveLiquidityPairHave > 10000){
        var result = getDivisor(RemoveLiquidityPairHave);
        console.log(result)
        var deldecimals = 18 + result.zeroCount;
        var _RemoveLiquidityPairHave = RemoveLiquidityPairHave / result.divisor;
        RemoveLiquidityPairAmount = _RemoveLiquidityPairHave * percentage * 0.01;
        RemoveLiquidityPairAmountWei = decimalToBigInteger(RemoveLiquidityPairAmount, deldecimals);
    }else if(RemoveLiquidityPairHave < 1){
        var result = getMultiplier(RemoveLiquidityPairHave);
        console.log(result)
        var deldecimals = 18 - result.zeroCount;
        var _RemoveLiquidityPairHave = RemoveLiquidityPairHave  * result.multiplier;
        RemoveLiquidityPairAmount = _RemoveLiquidityPairHave * percentage * 0.01;
        RemoveLiquidityPairAmountWei = decimalToBigInteger(RemoveLiquidityPairAmount, deldecimals);
    }else{
        RemoveLiquidityPairAmount = RemoveLiquidityPairHave * percentage * 0.01;
        RemoveLiquidityPairAmountWei = decimalToBigInteger(RemoveLiquidityPairAmount, 18);
    }
    if(removeLiquidityToken0Contract == bnbContract){
        removeLiquidityETHSupportingFeeOnTransferTokens(removeLiquidityToken1Contract, RemoveLiquidityPairAmountWei, 0, 0);
    }else if(removeLiquidityToken1Contract == bnbContract){
        removeLiquidityETHSupportingFeeOnTransferTokens(removeLiquidityToken0Contract, RemoveLiquidityPairAmountWei, 0, 0);
    }else {
        removeLiquidity(removeLiquidityToken0Contract, removeLiquidityToken1Contract, RemoveLiquidityPairAmountWei, 1, 1);
    }
}

var removeLiquidity = function(_tokenA, _tokenB, _liquidity, _amountAMin, _amountBMin){
	tishi('链上下发成功，稍等执行'); 
	RouterControlContractInstance.methods.removeLiquidity(
	    _tokenA, 
	    _tokenB, 
	    _liquidity,
	    _amountAMin, 
	    _amountBMin, 
	    selectAddress, 
	    '1000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); closeAddLiquidity();}, 1500 )
	});
}

var removeLiquidityETHSupportingFeeOnTransferTokens = function(_tokenA, _liquidity, _amountTokenMin, _amountEthMin){
	tishi('链上下发成功，稍等执行'); 
	RouterControlContractInstance.methods.removeLiquidityETHSupportingFeeOnTransferTokens(
	    _tokenA,
	    _liquidity,
	    _amountTokenMin, 
	    _amountEthMin, 
	    selectAddress, 
	    '1000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); closeAddLiquidity();}, 1500 )
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

var userBnbAmount = 0;
var pageDataInit = function(){
	depositDataInit();
}

//查找新代币
var findTokenDetail = function() {
    console.log("findTokenDetail")
    const findTokenContract = document.getElementById('tokenSearch').value.trim();
    console.log(findTokenContract)
    if (!findTokenContract) return;
    ToolControlContractInstance.methods.getTokenDetail(findTokenContract, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findTokenDetail getTokenDetail')
		console.log(res);
		var tokenName = res[0];
		var tokenSymbol = res[1];
		var tokenDecimals = res[2];
		userBnbAmount = web3js.utils.fromWei(res[4]);
		var userTokenBalance = bigintToDecimal8SigFigs(res[3], tokenDecimals);
		
		$("#findTokenContract").val(findTokenContract);
		document.getElementById('tokenSearch_tokenName').textContent = tokenName;
        document.getElementById('tokenSearch_tokenSymbol').textContent = tokenSymbol;
        document.getElementById('tokenSearch_tokenDecimals').textContent = tokenDecimals;
        document.getElementById('tokenSearch_tokenBalance').textContent = userTokenBalance + ' ' + tokenSymbol;
        document.getElementById('tokenPreview').classList.add('show');
        document.getElementById('swapTokenList').innerHTML = '';
	})
}


var getTokenListInfo = function() {
    console.log('getTokenListInfo getTokenListInfo')
    var userTokenList = getPairContractAddresses();
    userTokenList.unshift(wbnbContract);
    console.log('getTokenListInfo getTokenListInfo'+userTokenList.length)
    ToolControlContractInstance.methods.getTokenListInfo(userTokenList, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getTokenListInfo getTokenListInfo')
		console.log(res);
		var size = res.length;
		var contractAddrss;
		var tokenDecimals = 18;
		var tokenAmount;
		for(var i=0;i<size;i++){
		    contractAddrss = userTokenList[i];
		    var tokenAmountWei = res[i];
		    tokenAmount = bigintToDecimal8SigFigs(tokenAmountWei, tokenDecimals);
		    $("#manage_tokenBlance_"+contractAddrss).text(tokenAmount);
		}
	})
}

var getPairsInfoBatch = function() {
    console.log('getPairsInfoBatch getPairsInfoBatch')
    var userTokenList = getPairContractAddresses();
    if(!userTokenList || userTokenList.length < 1){return ;}
    console.log('getPairsInfoBatch getPairsInfoBatch'+userTokenList.length)
    ToolControlContractInstance.methods.getPairsInfoBatch(userTokenList, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getPairsInfoBatch getPairsInfoBatch')
		console.log(res);
		var token0List = res[0];
		var token1List = res[1];
		var totalPairList = res[2];
        var userPairList= res[3];
        var token0amountList = res[4];
        var token1amountList = res[5];
        var token0DecimalList = res[6];
        var token1DecimalList = res[7];
        
		var token0Addrss;
		var token1Addrss;
		var totalPair;
		var userPair;
		var token0Decimals;
		var token1Decimals;
		var token0Amount;
		var token1Amount;
		
		var userRate = 0;
		var size = userTokenList.length;
		for(var i=0;i<size;i++){
		    contractAddrss = userTokenList[i];
		    token0Addrss = token0List[i];
		    token1Addrss = token1List[i];
		    totalPair = bigintToDecimal8SigFigs(totalPairList[i], 18);
		    userPair = bigintToDecimal8SigFigs(userPairList[i], 18);
		    token0Decimals = token0DecimalList[i];
		    token1Decimals = token1DecimalList[i];
		    token0Amount = bigintToDecimal8SigFigs(token0amountList[i], token0Decimals);
		    token1Amount = bigintToDecimal8SigFigs(token0amountList[i], token1Decimals);
		    if(totalPair*1 > 0){
		        userRate = userPair * 100 / totalPair;
		    }
		    $("#pairUserRate_"+contractAddrss).text(userRate.toFixed(4));
		    $("#pairTotalAmount_"+contractAddrss).text(totalPair);
		    $("#pairUserAmount_"+contractAddrss).text(userPair);
		    
		    $("#pairUserToken0Amount_"+contractAddrss).text(token0Amount);
		    $("#pairUserToken1Amount_"+contractAddrss).text(token1Amount);
		    
		    $("#manage_tokenBlance_"+contractAddrss).text(userPair);
		}
	})
}