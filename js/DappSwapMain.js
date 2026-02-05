var selectAddress;
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';

var WETHControlContractInstance;
var ToolControlContractInstance;
var RouterControlContractInstance;
var contractInstanceInit=function(){
    WETHControlContractInstance=new web3js.eth.Contract(WETHAbi,wbnbContract,{from:selectAddress,gasPrice:'0'});
    ToolControlContractInstance=new web3js.eth.Contract(SwapToolAbi,swapToolContract,{from:selectAddress,gasPrice:'0'});
	RouterControlContractInstance=new web3js.eth.Contract(SwapRouterAbi,swapRouterContract,{from:selectAddress,gasPrice:'0'});
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
	getTokenListInfo();
}

var swapTokenDataInit = function(){
    if(!selectAddress){console.log('区块链数据获取中…… ');return;}
    var fromTokenContract = $("#fromTokenContract").val();
    var toTokenContract = $("#toTokenContract").val();
    console.log('fromTokenContract '+fromTokenContract)
    console.log('toTokenContract '+toTokenContract)
    if(!fromTokenContract || !toTokenContract) return;
    initSwapRouterPath(fromTokenContract, toTokenContract);
    
    ToolControlContractInstance.methods.getTokenBalance(fromTokenContract, toTokenContract, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('swapTokenDataInit getTokenBalance')
		console.log(res);
		fromdecimals = res[2]*1;
		todecimals = res[3]*1;
		var oneFromAmountWei = decimalToBigInteger(0.1, fromdecimals);
		var _testFromString = res[0]+"";
		var _testFromWei = '';
		if(_testFromString.length > 2){
		    _testFromWei = _testFromString.slice(1);
		}
		getBestSwapRouter(oneFromAmountWei, todecimals, _testFromWei);
		fromTokenBalance = bigintToDecimal8SigFigs(res[0], fromdecimals);
		var toTokenBalance = bigintToDecimal8SigFigs(res[1], todecimals);
		$('#fromTokenBalance').text(fromTokenBalance);
		$('#toTokenBalance').text(toTokenBalance);
		fromdAllowanceAmount = bigintToDecimal8SigFigs(res[4], fromdecimals);
		console.log('fromdAllowanceAmount fromdAllowanceAmount:'+fromdAllowanceAmount)
		if(fromdAllowanceAmount*1.0 >= fromTokenBalance*1.0){
		    $('#swapToken2Token').show();
		    $('#swapapproveBtn').hide();
		}else{
		    $('#swapapproveBtn').show();
		    $('#swapToken2Token').hide();
		}
	})
	
// 	ToolControlContractInstance.methods.getTokenSwapRate(fromTokenContract, toTokenContract).call({from:selectAddress,gasPrice: '0'}).then(function(res){
// 		console.log('swapTokenDataInit getTokenSwapRate')
// 		console.log(res);
// 		var oneFromTokenToTokenAmount = web3js.utils.fromWei(res);
// 		$('#oneFromTokenToTokenAmount').text((oneFromTokenToTokenAmount*1.0).toFixed(4));
// 	})
	
	
}

var userBnbAmount = 0;
var fromTokenBalance = 0;
var fromdAllowanceAmount = 0;
var fromdecimals;
var todecimals;
var bestPath;
var swapMinToAmountWei;

var getBestSwapRouter = function(_fromOne,_outDecimals, _testFromWei){
    var _customSlippageValue = parseInt(customSlippageValue*10);
    console.log('getBestSwapRouter swapTokenAmountDataInit customSlippageValue;'+_customSlippageValue)
    var fromTokenContract = $("#fromTokenContract").val();
    ToolControlContractInstance.methods.findOptimalPathFixedWithLossRate(_fromOne, _customSlippageValue, path2, path3, path4, path5, path6).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('findOptimalPathFixedWithLossRate findOptimalPathFixedWithLossRate')
		console.log(res);
		bestPath = res[0];
		var getToTokenAmount = bigintToDecimal8SigFigs(res[1], _outDecimals);
		$("#oneFromTokenToTokenAmount").text((getToTokenAmount*10).toFixed(4));
		console.log('findOptimalPathFixed getToTokenAmount'+getToTokenAmount);
		if(_testFromWei && _testFromWei.length > 0){
		    if(fromTokenContract == bnbContract){
    		    simulateSwapBnb(_testFromWei, bestPath);
    		}else{
    		    simulateSwap(_testFromWei, bestPath);
    		}
		}else{
		    tishi("无法检测滑点");
		}
	})
}

var swapTokenAmountDataInit = function(fromAmount, toAmount){
    var _customSlippageValue = parseInt(customSlippageValue*10+3);
    console.log('swapTokenAmountDataInit customSlippageValue;'+_customSlippageValue)
    if(fromAmount > 0){
        console.log(fromAmount > fromdAllowanceAmount*1.0)
        if(fromAmount > fromdAllowanceAmount*1.0){
            $('#swapapproveBtn').show();
		    $('#swapToken2Token').hide();
        }else{
            $('#swapapproveBtn').hide();
		    $('#swapToken2Token').show();
        }
        var _fromAmountWei = decimalToBigInteger(multiplyDecimals(fromAmount, 0.998), fromdecimals);
        ToolControlContractInstance.methods.findOptimalPathFixedWithLossRate(_fromAmountWei, _customSlippageValue, path2, path3, path4, path5, path6).call({from:selectAddress,gasPrice: '0'}).then(function(res){
    		console.log('findOptimalPathFixedWithLossRate findOptimalPathFixedWithLossRate')
    		console.log(res);
    		bestPath = res[0];
    		var toTokenBalance = bigintToDecimal8SigFigs(res[1], todecimals);
    		swapMinToAmountWei = res[2]+"";
    		$("#toTokenInput").val(toTokenBalance);
    	})
    }else{
        $("#toTokenInput").val('');
    }
}

var approveTokenCheck = function(){
	approveFromToken2router();
}
var approveFromToken2router = function(){
	tishi('链上下发成功，稍等执行');
	var fromTokenContract = $("#fromTokenContract").val();
	var fromTokenContractInstance = new web3js.eth.Contract(TokenAbi,fromTokenContract,{from:selectAddress,gasPrice:'0'}); 
	fromTokenContractInstance.methods.approve(swapRouterContract,'9999999999999000000000000000000000000000000000').send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 2000 )
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

var swapToken2Token = function(){
    var _customSlippageValue = parseInt(customSlippageValue*10 + 3);
    console.log('swapTokenAmountDataInit customSlippageValue;'+_customSlippageValue)
    console.log('swapTokenAmountDataInit minSlippage;'+minSlippage)
    if(minSlippage*10 > _customSlippageValue*1){
        tishi("滑点最少调至"+(minSlippage*1.0).toFixed(1));
        return;
    }
    var fromTokenContract = $("#fromTokenContract").val();
    var toTokenContract = $("#toTokenContract").val();
    if(fromTokenContract == toTokenContract){tishi("交易对不存在");return;}
    
    var fromAmount = $("#fromTokenInput").val();
    console.log('fromAmount fromAmount-----'+fromAmount+"-----")
    if(!fromAmount || fromAmount*1.0 == 0 || fromAmount.length < 1){
        tishi("输入错误");
        return;
    }
    if(fromTokenBalance*1.0 >= fromAmount){
        var _fromAmountWei = decimalToBigInteger(fromAmount, fromdecimals);
        if(fromTokenContract == bnbContract){
            if(toTokenContract == WBNBCONTRACT){
                deposit(_fromAmountWei);
            }else{
                swapExactETHForTokensSupportingFeeOnTransferTokens(_fromAmountWei);
            }
        }else if(toTokenContract == bnbContract){
            if(fromTokenContract == WBNBCONTRACT){
                withdraw(_fromAmountWei);
            }else{
                swapExactTokensForETHSupportingFeeOnTransferTokens(_fromAmountWei);
            }
        }else{
            swapExactTokensForTokensSupportingFeeOnTransferTokens(_fromAmountWei);
        }
    }else{
        tishi("余额不足");
    }
}

var swapExactTokensForTokensSupportingFeeOnTransferTokens = function(_fromAmountWei){
    RouterControlContractInstance.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        _fromAmountWei,
        swapMinToAmountWei,
        bestPath,
        selectAddress,
        '100000000000000000000'
        ).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 1000 )
	});
}

var swapExactTokensForETHSupportingFeeOnTransferTokens = function(_fromAmountWei){
    RouterControlContractInstance.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
        _fromAmountWei,
        swapMinToAmountWei,
        bestPath,
        selectAddress,
        '100000000000000000000'
        ).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 1000 )
	});
}

var swapExactETHForTokensSupportingFeeOnTransferTokens = function(_fromAmountWei){
    RouterControlContractInstance.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
        swapMinToAmountWei,
        bestPath,
        selectAddress,
        '100000000000000000000'
        ).send({from:selectAddress,gasPrice: gasPrice, value:_fromAmountWei}).then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 1000 )
	});
}

var deposit = function(_fromAmountWei){
    WETHControlContractInstance.methods.deposit()
        .send({from:selectAddress,gasPrice: gasPrice, value:_fromAmountWei})
        .then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 1000 )
	});
}

var withdraw = function(_fromAmountWei){
    WETHControlContractInstance.methods.withdraw(_fromAmountWei)
        .send({from:selectAddress,gasPrice: gasPrice})
        .then(function(res){
		console.log(res)
		tishi('完成');
		swapTokenDataInit();
		setTimeout(function(){ swapTokenDataInit(); }, 1000 )
	});
}




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
        $("#swapTokenList").html('');
	})
}

var getTokenListInfo = function() {
    console.log('getTokenListInfo getTokenListInfo')
    var userTokenList = getContractAddresses();
    console.log('getTokenListInfo getTokenListInfo'+userTokenList.length)
    ToolControlContractInstance.methods.getTokenListInfo(userTokenList, selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getTokenListInfo getTokenListInfo')
		console.log(res);
		var size = res.length;
		var contractAddrss;
		var tokenDecimals;
		var tokenAmount;
		for(var i=0;i<size;i++){
		    contractAddrss = userTokenList[i];
		    tokenDecimals = tokenListObject[contractAddrss].decimals;
		    var tokenAmountWei = res[i];
		    tokenAmount = bigintToDecimal8SigFigs(tokenAmountWei, tokenDecimals);
		    $("#manage_tokenBlance_"+contractAddrss).text(tokenAmount);
		}
	})
}

var minSlippage = 0;
var simulateSwap = function (amountIn, _bestPath) {
  
    // 100 USDT (6 decimals)
	const amountOutMin = '0';
	const deadline = '1000000000000';
  
	// 编码函数调用
	const data = web3js.eth.abi.encodeFunctionCall({
		name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens4fee',
		type: 'function',
		inputs: [
		  {type: 'uint256', name: 'amountIn'},
		  {type: 'address[]', name: 'path'},
		  {type: 'address', name: 'to'},
		  {type: 'uint256', name: 'deadline'}
		]
	}, [amountIn.toString(), _bestPath, selectAddress, deadline]);
    console.log('=== 编码函数调用 ===');
    // console.log(data);
  // 模拟交易
	try {
	    var callObject = {
			from: selectAddress,
			to: swapRouterContract,
			data: data,
			gas: '0x1E8480',
			gasPrice: "0x1DCD6500"
		}
	    console.log('=== 模拟交易 ===');
		web3js.eth.call(callObject, (error, result) => {
		  if (error) {
		    console.error(error);
		  } else {
		    // 解码结果
		  //  console.log(result);
		    const amounts = web3js.eth.abi.decodeParameter('uint256[]', result);
		    
			console.log('=== 模拟结果s ===');
			console.log(amounts.length);
			console.log(amounts);
			var real_loss_rate = ((amounts[1]*1) * 0.1);
			if(real_loss_rate < 50){
			 //   tishi("滑点更新至"+(real_loss_rate.toFixed(1))+"");
			    if(customSlippageValue < real_loss_rate+0.3){
			        real_loss_rate = real_loss_rate +0.3;
        			customSlippageSeting(real_loss_rate.toFixed(1));
        			minSlippage = real_loss_rate;
			    }
			}else{
			    
			    tishi("风险代币,滑点超过50%");
			}
		  }
		});
	} catch (error) {
		console.error('模拟失败:', error);
		throw error;
	}
}


var simulateSwapBnb = function (amountIn, _bestPath) {
  
    // 100 USDT (6 decimals)
	const amountOutMin = '0';
	const deadline = '1000000000000';
  
	// 编码函数调用
	const data = web3js.eth.abi.encodeFunctionCall({
		name: 'swapExactETHForTokensSupportingFeeOnTransferTokens4fee',
		type: 'function',
		inputs: [
		  {type: 'address[]', name: 'path'},
		  {type: 'address', name: 'to'},
		  {type: 'uint256', name: 'deadline'}
		]
	}, [_bestPath, selectAddress, deadline]);
    console.log('=== BNB编码函数调用 ===');
    // console.log(data);
  // 模拟交易
	try {
	    var callObject = {
			from: selectAddress,
			to: swapRouterContract,
			data: data,
			gas: '0x1E8480',
			value:amountIn,
			gasPrice: "0x1DCD6500"
		}
	    console.log('=== 模拟BNB交易 ===');
		web3js.eth.call(callObject, (error, result) => {
		  if (error) {
		    console.error(error);
		  } else {
		    // 解码结果
		  //  console.log(result);
		    const amounts = web3js.eth.abi.decodeParameter('uint256[]', result);
		    
			console.log('=== 模拟BNB结果s ===');
			console.log(amounts.length);
			console.log(amounts);
			var real_loss_rate = ((amounts[1]*1) * 0.1);
			if(real_loss_rate < 50){
			 //   tishi("滑点更新至"+(real_loss_rate.toFixed(1))+"");
    			 if(customSlippageValue < real_loss_rate + 0.3){
    			     real_loss_rate = real_loss_rate +0.3;
        			customSlippageSeting(real_loss_rate.toFixed(1));
        			minSlippage = real_loss_rate;
    			 }
			}else{
			    tishi("风险代币,滑点超过50%");
			}
		  }
		});
	} catch (error) {
		console.error('BNB模拟失败:', error);
		throw error;
	}
}
