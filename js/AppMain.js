var SystemObjct
var initSystemObjct = function(){
	var SystemObjctStr = localStorage.getItem("SystemObjct");
	if(SystemObjctStr){
		SystemObjct = JSON.parse(SystemObjctStr);
	}else{
		SystemObjct = new Object();
	}
}

initSystemObjct();

var updateSystemObjct = function(name,value){
	SystemObjct[name] = value;
	var SystemObjctStr = JSON.stringify(SystemObjct);
	console.log(SystemObjct)
	console.log(SystemObjctStr)
	localStorage.setItem("SystemObjct", SystemObjctStr);
}

var getSystemInfo = function(name){
	var SystemObjctStr = localStorage.getItem("SystemObjct");
	if(SystemObjctStr){
		SystemObjct = JSON.parse(SystemObjctStr);
		return SystemObjct[name];
	}else{
		return null;
	}
}

var ISLOGIN;
var UserData;
var checkLogin = function(){
    var _id = getSystemInfo("account");
    var _password = getSystemInfo("passwrod");
    if(_id && _password){
        var userObject = {
            id : _id,
            password : _password
        };
        ajaxfunction(
        "RDUser/get",
        userObject,
        function(res){
    		var json = eval("(" + res + ")");
    		console.log(json)
    		if(json.sucess){
    		    initUserData(json.object);
    		    
    		}else{
    		    if(ISLOGIN){}else{
        	        window.location.href = path+'login.html';
        	    }
    		}
    	})
    }else{
        if(ISLOGIN){}else{
	        window.location.href = path+'login.html';
	    }
    }
}

var loginOut = function(){
    updateSystemObjct("account","");
    updateSystemObjct("passwrod","");
    window.location.href = 'login.html';
}


var register = function(_account,_passwrod,_telcode,_shareCode){
	if(_account && _passwrod){
	    var userObject = {
	        id : _account,
	        password : _passwrod,
	        telCode : _telcode,
	        parentCode : _shareCode
	    };
	    console.log(userObject)
		ajaxfunction(
	    "RDUser/reg",
	    userObject,
	    function(res){
    		var json = eval("(" + res + ")");
    		console.log(json)
    		if(json.sucess){
    			tishi("注册成功");
    		}else{
    			tishi(json.msg);
    		}
    	})
	}else{
		tishi("用户名密码不能为空");
	}
}

var login = function(_account,_passwrod){
	if(_account && _passwrod){
	    var userObject = {
	        id : _account,
	        password : _passwrod
	    };
	    ajaxfunction(
	    "RDUser/get",
	    userObject,
	    function(res){
    		var json = eval("(" + res + ")");
    		console.log(json)
    		if(json.sucess){
    			//tishi("链上运行，请稍等");
    			updateSystemObjct("account",_account);
    			updateSystemObjct("passwrod",_passwrod);
    			window.location.href = 'index.html';
    			updateSystemObjct("login",true);
    		}else{
    			tishi(json.msg);
    		}
    	})
		
	}else{
		tishi("用户名密码不能为空");
	}
}

var updatePassword = function(_oldPassWord, _newPassWord){
    var _account = getSystemInfo("account");
	if(_account && _oldPassWord && _newPassWord ){
	    var userObject = {
	        id : _account,
	        oldPassWord : _oldPassWord, 
	        newPassWord : _newPassWord
	    };
	    ajaxfunction(
	    "RDUser/updatePassword",
	    userObject,
	    function(res){
    		var json = eval("(" + res + ")");
    		console.log(json)
    		if(json.sucess){
    			//tishi("链上运行，请稍等");
    			updateSystemObjct("account",_account);
    			updateSystemObjct("passwrod",json.object.password);
    			updateSystemObjct("login",true);
    		}else{
    			tishi(json.msg);
    		}
    	})
		
	}else{
		tishi("用户名密码不能为空");
	}
}


var updateWallet = function(_trc20, _bep20){
    var _id = getSystemInfo("account");
    var _password = getSystemInfo("passwrod");
	if(_id && _password && _trc20 && _bep20){
	    var userObject = {
	        id : _id,
	        password : _password, 
	        walletAddressTrc20 : _trc20,
	        walletAddressBep20 : _bep20
	    };
	    ajaxfunction(
	    "RDUser/updateWallet",
	    userObject,
	    function(res){
    		var json = eval("(" + res + ")");
    		console.log(json)
    		if(json.sucess){
    		    updateSystemObjct("walletAddressTrc20",_trc20);
    		    updateSystemObjct("walletAddressBep20",_bep20);
    			updateSystemObjct("login",true);
    		}
    		if(json.msg){
    		  tishi(json.msg);  
    		}
    		
    	})
		
	}else{
		tishi("用户名密码不能为空");
	}
}

var update = function(_userName,_avatar){
	var userObject = {
        id : getSystemInfo("account"),
        password : getSystemInfo("passwrod")
    };
    if(_userName){
        userObject["userName"] = _userName;
    }
    if(_avatar){
        userObject["avatar"] = _avatar;
    }
    console.log(userObject)
	ajaxfunction(
    "RDUser/update",
    userObject,
    function(res){
		var json = eval("(" + res + ")");
		console.log(json)
		if(json.sucess){
			initUserData(json.object);
		}else{
			tishi(json.msg);
		}
	})
}


var initUserData = function(_UserData){
    var _id = getSystemInfo("account");
    var telSimply = _id.slice(0,3)+"****"+_id.slice(7,11);
    $("#telSimply").text(telSimply);
    UserData = _UserData;
    updateSystemObjct("userLevel",UserData.level);
	$("#userLevel").text(UserData.level);
	
	if(UserData.userName){
	    $(".userName").text(UserData.userName);
	    $("#nicknameInput").val(UserData.userName);
	    var FistChar = UserData.userName[0];
	    $(".FistChar").text(FistChar);
	}
	
	$(".shareCode").text(UserData.shareCode);
	updateSystemObjct("shareCode",UserData.shareCode);
	
	if(UserData.avatar && path){
	    $(".avatar").attr("src", path+"img/tx/"+UserData.avatar);
	}
}

checkLogin();
