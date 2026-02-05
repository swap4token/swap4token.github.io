var bnbContract = "0x0000000000000000000000000000000000000000";
var wbnbContract = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const defaultPools = [
            {
                pair: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
                token0: "0x55d398326f99059ff775485246999027b3197955",
                token1: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                token0symbol: "USDT",
                token1symbol: "BNB",
                token0decimals: 18,
                token1decimals: 18
            },
            {
                pair: "0x531FEbfeb9a61D948c384ACFBe6dCc51057AEa7e",
                token0: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
                token1: "0x55d398326f99059ff775485246999027b3197955",
                token0symbol: "ETH",
                token1symbol: "USDT",
                token0decimals: 18,
                token1decimals: 18
            },
            {
                pair: "0x3F803EC2b816Ea7F06EC76aA2B6f2532F9892d62",
                token0: "0x55d398326f99059ff775485246999027b3197955",
                token1: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
                token0symbol: "USDT",
                token1symbol: "BTCB",
                token0decimals: 18,
                token1decimals: 18
            },
            {
                pair: "0x813f6850561c0194af014fda281a570ee7550214",
                token0: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                token1: "0xd0dfc951cd7787859f0ed61966bc243038888888",
                token0symbol: "BNB",
                token1symbol: "FROG",
                token0decimals: 18,
                token1decimals: 18
            }
];

// 主对象，存储所有代币信息
let pairListObject = [];
// 更新localStorage
function updatePairLocalStorage() {
    localStorage.setItem('pairListObject', JSON.stringify(pairListObject));
}
// 初始化：从localStorage加载或使用默认代币
function pairListInit() {
    const storedPairs = localStorage.getItem('pairListObject');
    if (storedPairs) {
        try {
            pairListObject = JSON.parse(storedPairs);
        } catch (e) {
            console.error('解析存储的代币数据失败，使用默认代币:', e);
            pairListObject = defaultPools;
        }
    } else {
        pairListObject = defaultPools;
    }
    updatePairLocalStorage();
}

pairListInit();

// 接口：返回Pair合约地址数组
function getPairContractAddresses() {
    return pairListObject.map(pool => pool.pair);
}

// 检查 LP 是否已存在（两个地址都相同）
function lpExists(_pair) {
    return pairListObject.some(lp => 
        (lp.pair === _pair)
    );
}
        
// 添加代币
function userAddPairToken(_pair, _token0, _token1, _token0symbol, _token1symbol, _token0decimals, _token1decimals) {            
    // 验证输入
    if (!_pair || !_token0 || !_token1 || !_token0symbol  || !_token1symbol  || !_token0decimals  || !_token1decimals) {
        console.log('请填写所有字段', 'error');
        return;
    }
    
    // 简单的地址格式验证（以太坊地址格式）
    if (!_pair.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.log('请输入有效的合约地址（0x开头，42位字符）', 'error');
        return;
    }
    
    // 检查是否已存在
    if (lpExists(_pair)) {
        console.log('该合约地址已存在', 'error');
        return;
    }
    
    const newPair = {
        pair: _pair,
        token0: _token0,
        token1: _token1,
        token0symbol: _token0symbol,
        token1symbol: _token1symbol,
        token0decimals: _token0decimals,
        token1decimals: _token1decimals
    };

    pairListObject.push(newPair);
    updatePairLocalStorage();
    
    console.log('资金池添加成功！', 'success');
}

// 渲染资金池列表
function renderAllPairTokens() {
    const userPoolList = document.getElementById('userPoolList');
    userPoolList.innerHTML = '';
    var pairAddNumber= 0;
    pairListObject.forEach(pairToken => {
        const poolItem = document.createElement('div');
        poolItem.className = 'pool-item';
        // poolItem.onclick = () => selectToken(address);
        poolItem.innerHTML = `
            <div class="pool-summary">
                <div class="pool-tokens">
                    <div class="token-icon"><img class="" src="img/token/${pairToken.token0}.png" onerror="this.src='./img/none.png';"></div>
                    <div class="token-icon secondary pool-tokens-secondary "><img class="" src="img/token/${pairToken.token1}.png" onerror="this.src='./img/none.png';"></div>
                    <div class="pool-name">${pairToken.token0symbol}/${pairToken.token1symbol}</div>
                </div>
                <div id="pairUserRate_${pairToken.pair}" class="pool-apy">0%</div>
            </div>
            <div class="pool-details">
                <div class="pool-detail-row">
                    <div class="pool-detail-label">总流动性</div>
                    <div id="pairTotalAmount_${pairToken.pair}" class="pool-detail-value">0</div>
                </div>
                <div class="pool-detail-row">
                    <div class="pool-detail-label">您的流动性</div>
                    <div id="pairUserAmount_${pairToken.pair}" class="pool-detail-value">0</div>
                </div>
                <div class="pool-detail-row">
                    <div class="pool-detail-label">${pairToken.token0symbol}份额</div>
                    <div id="pairUserToken0Amount_${pairToken.pair}" class="pool-detail-value">0</div>
                </div>
                <div class="pool-detail-row">
                    <div class="pool-detail-label">${pairToken.token1symbol}份额</div>
                    <div id="pairUserToken1Amount_${pairToken.pair}" class="pool-detail-value">0</div>
                </div>
                <div class="pool-actions-row">
                    <button class="pool-action-btn primary add-liquidity">增加流动性</button>
                    <button class="pool-action-btn remove-liquidity">撤出流动性</button>
                </div>
            </div>
        `;
        pairAddNumber = pairAddNumber + 1;
        poolItem.addEventListener('click', (e) => {
            // 如果点击的是按钮，不触发展开/收起
            if (e.target.classList.contains('pool-action-btn')) {
                return;
            }
            // 关闭其他展开的卡片
            document.querySelectorAll('.pool-item.expanded').forEach(item => {
                if (item !== poolItem) {
                    item.classList.remove('expanded');
                }
            });
            poolItem.classList.toggle('expanded');
        });
        const addBtn = poolItem.querySelector('.add-liquidity');
        const removeBtn = poolItem.querySelector('.remove-liquidity');
        addBtn.addEventListener('click', () => openAddLiquidity(pairToken));
        removeBtn.addEventListener('click', () => openDelLiquidity(pairToken));
        userPoolList.appendChild(poolItem);
    });
    if(pairAddNumber > 0){
        document.getElementById('emptyState').style.display = 'none';
    }
}


function formatAddress(address) {
    if (!address) return '';
    return address.substring(0, 6) + '…' + address.substring(address.length - 6);
}
// 渲染资金池列表
function renderPairList2Manage() {
    const userPoolList = document.getElementById('lpList');
    if(pairListObject && pairListObject.length > 0){
        userPoolList.innerHTML = '';
        pairListObject.forEach(pairToken => {
            const lpItem = document.createElement('div');
            lpItem.className = 'lp-item';
            lpItem.innerHTML = `
                <div class="lp-logo">
                    <div class="token-logo"><img class="" src="img/token/${pairToken.token0}.png" onerror="this.src='./img/none.png';"></div>
                    <div class="token-logo"><img class="" src="img/token/${pairToken.token1}.png" onerror="this.src='./img/none.png';"></div>
                </div>
                <div class="lp-info">
                    <div class="lp-tokens">${pairToken.token0symbol} / ${pairToken.token1symbol}</div>
                    <div class="lp-address">${formatAddress(pairToken.pair)}</div>
                </div>
                <div class="lp-balance"><span id="manage_tokenBlance_${pairToken.pair}">0</span></div>
            `;
            // 点击 LP 打开详情
            lpItem.addEventListener('click', () => openDetailModal(pairToken));
            userPoolList.appendChild(lpItem);
        });
    }
}

function removePool(pairAddress) {
    const initialLength = pairListObject.length;
    pairListObject = pairListObject.filter(pool => 
        pool.pair.toLowerCase() !== pairAddress.toLowerCase()
    );
    updatePairLocalStorage();
    return pairListObject.length < initialLength;
}

		