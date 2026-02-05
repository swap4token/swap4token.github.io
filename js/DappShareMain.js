var selectAddress;
var linkMyWallet=function(){if(ethereum){web3Provider=ethereum;try{ethereum.enable();}catch(error){tishi("user cancel");return;}}else if(web3){web3Provider=web3.currentProvider;console.log("web3.currentProvider:");}else{web3Provider=new Web3.providers.HttpProvider('http://localhost:8545');console.log("https://http-testnet.hecochain.com");}web3js=new Web3(web3Provider);}
var web3jsInit=function(){var Inval=setInterval(function(){linkMyWallet();if(web3js){web3js.eth.getAccounts(function(error,result){if(!error){selectAddress=result[0];$('#selectAddress').text(getSimpleAddress(selectAddress));contractInstanceInit();window.clearInterval(Inval);}});}},2000);}
web3jsInit();
var gasPrice='50000000';

var controlContractInstance;
var contractInstanceInit=function(){
	controlContractInstance=new web3js.eth.Contract(controlAbi,controlContract,{from:selectAddress,gasPrice:'0'});
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
var baseUrl = "https://swap.bpmweb3.com/user.html?ref=";
var depositDataInit = function(){
	$('#myshareLink').val(baseUrl+selectAddress);
	controlContractInstance.methods.getUserParent(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserParent getUserParent')
		console.log(res);
		
		var parentAddress = res;
		if(parentAddress != "0x0000000000000000000000000000000000000000"){
			haveParentAddress = true;
			$('#parentAddress').val(getSimpleAddress(parentAddress));
			$('#parentAddress').attr("readonly","readonly");
			$('#parentAddress').attr("disabled","true");
			$('#parentAddress').css('color', '#151515');
			mdui.mutation();
		}else{
			var linkParentAddress = getQueryVariable('ref');
			if(linkParentAddress){
				$('#parentAddress').val(linkParentAddress);
			}
		}
	})
	
	controlContractInstance.methods.getUserData(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserData getUserData')
		console.log(res);
		
		var parentAddress = res[0];
		if(parentAddress != "0x0000000000000000000000000000000000000000"){
			haveParentAddress = true;
			$('#parentAddress').val(getSimpleAddress(parentAddress));
			$('#parentAddress').attr("readonly","readonly");
			$('#parentAddress').attr("disabled","true");
			$('#parentAddress').css('color', '#151515');
			mdui.mutation();
		}else{
			var linkParentAddress = getQueryVariable('ref');
			if(linkParentAddress){
				$('#parentAddress').val(linkParentAddress);
			}
		}
		
		var dataList = res[1];
		
		var haveBnbAmount = web3js.utils.fromWei(dataList[0])*1;
		$('#haveBnbAmount').text((haveBnbAmount).toFixed(4));
		nodeBnbPrice = dataList[1] +"";
		sellNodeSize = dataList[2]*1;
		sellNodeSize = sellNodeSize + 421;
		var sellNodeSizeWidth = sellNodeSize * 100 / 666;
		$('#sellNodeSize').text((sellNodeSize).toFixed(0));
		$('#sellNodeSizeRate').text((sellNodeSizeWidth).toFixed(2));
		if(sellNodeSizeWidth < 3){sellNodeSizeWidth=3;}
		$('#sellNodeSizeWidth').css("width", sellNodeSizeWidth+"%");
		
		userDepositAmount = dataList[3]*1;
		var userActiveSunNumber = dataList[4]*1;
		if(userDepositAmount > 0){
		    $('#userStatus').text("节点");
		    $('#statusBadge').hide();
		    //$('#statusBadge').text("有效直推"+userActiveSunNumber+"个");
		    
		}
		shareShipRes = dataList[10]*1;
		userBnbRes = dataList[11]*1;
	})
	
	controlContractInstance.methods.getUserShareList(selectAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
		console.log('getUserShareList getUserShareList')
		console.log(res);
		var sunList = res[0];
		var BuyResList = res[1];
		var ShareList = res[2];
		var size = sunList.length;
		var activeSun = 0;
		
		if(size > 0){
			$('#havedata').html("");
			var sunNumber;
			var BuyRes;
			for(var i=0;i<size;i++){
				var newEle;
				BuyRes = BuyResList[i]*1;
				if(BuyRes > 0){
					newEle = recordEle1;
				}else{
					newEle = recordEle2;
				}
				sunNumber = ShareList[i]*1;
				newEle = newEle.replace('sunAddress',getSimpleAddress(sunList[i]));
				newEle = newEle.replace('sunNumber',sunNumber.toFixed(0));
				$('#havedata').append(newEle);
			}
			
		}else{
		    
			//$('#havedata').hide();
		}
	})
}


var recordEle1 = "<div class='flex border-b-2 border-gray-800 py-3'><div class='flex-twice py-1 font-bold'>sunAddress</div><div class='flex-sub py-1 font-bold text-center'><span class='px-2 py-1 bg-green-500 text-white rounded text-xs font-bold'>是</span></div><div class='flex-sub py-1 font-bold text-right'>sunNumber</div></div>";
var recordEle2 = "<div class='flex border-b-2 border-gray-800 py-3'><div class='flex-twice py-1 font-bold'>sunAddress</div><div class='flex-sub py-1 font-bold text-center'><span class='px-2 py-1 bg-red-500 text-white rounded text-xs font-bold'>否</span></div><div class='flex-sub py-1 font-bold text-right'>sunNumber</div></div>";



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


var pageDataInit = function(){
	depositDataInit();
}

//绑定推荐关系
var haveParentAddress = false;
var shareShip = function(_parentAddress){
	tishi('链上下发成功，稍等执行');
	closeShareWindow();
	controlContractInstance.methods.shareShip(_parentAddress).send({from:selectAddress,gasPrice: gasPrice}).then(function(res){
		console.log(res)
		tishi('完成');
		sharePageDataInit();
		setTimeout(function(){ sharePageDataInit(); }, 2000 )
	});
}

var getParentIsJion = function(_parentAddress){
	controlContractInstance.methods.getParentIsJion(_parentAddress).call({from:selectAddress,gasPrice: '0'}).then(function(res){
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