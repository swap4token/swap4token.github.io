var BNBCONTRACT = "0x0000000000000000000000000000000000000000";
var WBNBCONTRACT = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
var defaultTokens = {
	"0x0000000000000000000000000000000000000000":{name:"BNB",symbol:"BNB",decimals:18,isDefault: true},
	"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c":{name:"Wrapped BNB",symbol:"WBNB",decimals:18,isDefault: true},
	"0x55d398326f99059ff775485246999027b3197955":{name:"Tether USD",symbol:"USDT",decimals:18,isDefault: true},
	"0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82":{name:"PancakeSwap Token",symbol:"CAKE",decimals:18,isDefault: true},
	"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d":{name:"USD Coin",symbol:"USDC",decimals:18,isDefault: true},
	"0xe9e7cea3dedca5984780bafc599bd69add087d56":{name:"BUSD Token",symbol:"BUSD",decimals:18,isDefault: true},
	"0x2170ed0880ac9a755fd29b2688956bd959f933f8":{name:"Ethereum Token",symbol:"ETH",decimals:18,isDefault: true},
	"0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c":{name:"BTCB Token",symbol:"BTCB",decimals:18,isDefault: true}
}

// 主对象，存储所有代币信息
let tokenListObject = {};
// 更新localStorage
function updateLocalStorage() {
    localStorage.setItem('tokenListObject', JSON.stringify(tokenListObject));
}
// 初始化：从localStorage加载或使用默认代币
function tokenListInit() {
    const storedTokens = localStorage.getItem('tokenListObject');
    
    if (storedTokens) {
        try {
            tokenListObject = JSON.parse(storedTokens);
            
            // 确保默认代币始终存在（防止用户删除默认代币）
            for (const [address, token] of Object.entries(defaultTokens)) {
                if (!tokenListObject[address]) {
                    tokenListObject[address] = { ...token };
                } else {
                    // 确保默认代币的isDefault标志正确
                    tokenListObject[address].isDefault = true;
                }
            }
        } catch (e) {
            console.error('解析存储的代币数据失败，使用默认代币:', e);
            tokenListObject = { ...defaultTokens };
        }
    } else {
        tokenListObject = { ...defaultTokens };
    }
    updateLocalStorage();
}

tokenListInit();

// 接口：返回合约地址数组
function getContractAddresses() {
    return Object.keys(tokenListObject);
}

// 添加代币
function userDelToken(address) {
    if(defaultTokens[address]){
        return '系统默认，不能删除';
    }else{
        delete tokenListObject[address];
        updateLocalStorage();
        return '删除成功';
    }
}


// 添加代币
function userAddToken(address,fullName,shortName,decimals) {            
    // 验证输入
    if (!address || !fullName || !shortName || !decimals) {
        console.log('请填写所有字段', 'error');
        return;
    }
    
    // 简单的地址格式验证（以太坊地址格式）
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.log('请输入有效的合约地址（0x开头，42位字符）', 'error');
        return;
    }
    
    // 检查是否已存在
    if (tokenListObject[address]) {
        console.log('该合约地址已存在', 'error');
        return;
    }
    // 添加新代币
    tokenListObject[address.toLowerCase()] = {
        name: fullName,
        symbol: shortName,
        decimals: parseInt(decimals),
        isDefault: false
    };
    
    updateLocalStorage();
    console.log('代币添加成功！', 'success');
}

// 渲染代币列表
function renderAllTokens() {
    const swapTokenList = document.getElementById('swapTokenList');
    swapTokenList.innerHTML = '';
    const addresses = getContractAddresses();
    addresses.forEach(address => {
        const token = tokenListObject[address];
		
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';
        tokenItem.onclick = () => selectToken(address);
        
        tokenItem.innerHTML = `
                    <div class="token-item-icon"><img class="" src="img/token/${address}.png" onerror="this.src='./img/none.png';"></div>
                    <div class="token-item-info">
                        <div class="token-item-symbol">${token.symbol}</div>
                        <div class="token-item-name">${token.name}</div>
                    </div>
                    <div id="token_balance_${address}" class="token-item-balance">${token.balance?token.balance:0}</div>
                `;
        
        swapTokenList.appendChild(tokenItem);
    });
}

// 渲染代币列表
function renderTokensBySymbol(_searchTerm) {
    const swapTokenList = document.getElementById('swapTokenList');
    swapTokenList.innerHTML = '';
    
    const addresses = getContractAddresses();
    addresses.forEach(address => {
        const token = tokenListObject[address];
		if(token.symbol.toLowerCase().includes(_searchTerm) || token.name.toLowerCase().includes(_searchTerm)){
			const tokenItem = document.createElement('div');
            tokenItem.className = 'token-item';
			tokenItem.onclick = () => selectToken(address);
			
			tokenItem.innerHTML = `
                    <div class="token-item-icon"><img class="" src="img/token/${address}.png" onerror="this.src='./img/none.png';"></div>
                    <div class="token-item-info">
                        <div class="token-item-symbol">${token.symbol}</div>
                        <div class="token-item-name">${token.name}</div>
                    </div>
                    <div id="manage_tokenBlance_${address}" class="token-item-balance">0/div>
                `;
			swapTokenList.appendChild(tokenItem);
		}
    });
}

// 渲染代币列表
function formatAddress(address) {
    if (!address) return '';
    return address.substring(0, 6) + '…' + address.substring(address.length - 6);
}
function renderAllTokens2manage() {
    const swapTokenList = document.getElementById('manageSwapTokenList');
    swapTokenList.innerHTML = '';
    const addresses = getContractAddresses();
    addresses.forEach(address => {
        const token = tokenListObject[address];
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';
        tokenItem.onclick = () => openDetailModal(address);
        tokenItem.innerHTML = `
            <div class="token-logo"><img class="" src="img/token/${address}.png" onerror="this.src='./img/none.png';"></div>
            <div class="token-info">
                <div class="token-name">${token.name}</div>
                <div class="token-symbol">${token.symbol}</div>
                <div class="token-address">${BNBCONTRACT==address?'':formatAddress(address)}</div>
            </div>
            <div class="token-balance"><span id="manage_tokenBlance_${address}">0</span></div>
        `;
        swapTokenList.appendChild(tokenItem);
    });
}
		