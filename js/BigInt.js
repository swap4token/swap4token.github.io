/**
 * BigInt精度转换插件
 * @param {bigint|string} bigNumber - 大数字，可以是bigint或字符串
 * @param {number} precision - 精度（小数点位置）
 * @returns {string} 转换后的小数字符串
 */
function bigintToDecimal(bigNumber, precision) {
    // 验证参数
    if (typeof bigNumber !== 'bigint' && typeof bigNumber !== 'string') {
        throw new TypeError('第一个参数必须是bigint或数字字符串');
    }
    
    if (typeof precision !== 'number' || !Number.isInteger(precision) || precision < 0) {
        throw new TypeError('第二个参数必须是正整数');
    }
    
    // 转换为字符串
    const numStr = typeof bigNumber === 'bigint' 
        ? bigNumber.toString() 
        : String(bigNumber).trim();
    
    // 移除可能的符号，最后再加回去
    const sign = numStr.startsWith('-') ? '-' : '';
    const absNumStr = sign ? numStr.substring(1) : numStr;
    
    // 验证输入是否为有效数字
    if (!/^\d+$/.test(absNumStr)) {
        throw new TypeError('输入必须是有效的数字');
    }
    
    // 验证长度（1-64位）
    if (absNumStr.length === 0 || absNumStr.length > 64) {
        throw new RangeError('数字长度必须在1-64位之间');
    }
    
    const length = absNumStr.length;
    
    // 处理特殊情况
    if (precision === 0) {
        // 精度为0，直接返回原数
        return sign + absNumStr;
    }
    
    if (precision >= length) {
        // 精度大于等于数字长度，需要在前面补0
        const decimalPart = absNumStr.padStart(precision, '0');
        const result = '0.' + decimalPart;
        // 移除小数部分末尾的0
        return sign + result.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    } else {
        // 精度小于数字长度，需要插入小数点
        const integerPart = absNumStr.substring(0, length - precision);
        const decimalPart = absNumStr.substring(length - precision);
        
        // 组合结果
        let result = integerPart;
        if (decimalPart.length > 0) {
            // 移除小数部分末尾的0
            const trimmedDecimal = decimalPart.replace(/0+$/, '');
            if (trimmedDecimal.length > 0) {
                result += '.' + trimmedDecimal;
            }
        }
        
        return sign + result || '0';
    }
}

/**
 * BigInt精度转换插件 - 返回8位有效数字，只在小数部分超过8位时截断，不四舍五入
 * @param {bigint|string} bigNumber - 大数字，可以是bigint或字符串
 * @param {number} precision - 精度（小数点位置）
 * @returns {string} 转换后的小数字符串，保留8位有效数字
 */
function bigintToDecimal8SigFigs(bigNumber, precision) {
    if(bigNumber == 0){return '0.0';}
    // 验证参数
    if (typeof bigNumber !== 'bigint' && typeof bigNumber !== 'string') {
        throw new TypeError('第一个参数必须是bigint或数字字符串');
    }
    precision = parseInt(precision+"");
    if (typeof precision !== 'number' || !Number.isInteger(precision) || precision < 0) {
        throw new TypeError('第二个参数必须是正整数');
    }
    
    // 转换为字符串
    const numStr = typeof bigNumber === 'bigint'? bigNumber.toString() : String(bigNumber).trim();
    
    // 移除可能的符号，最后再加回去
    const sign = numStr.startsWith('-') ? '-' : '';
    const absNumStr = sign ? numStr.substring(1) : numStr;
    
    // 验证输入是否为有效数字
    if (!/^\d+$/.test(absNumStr)) {
        throw new TypeError('输入必须是有效的数字');
    }
    
    // 验证长度（1-64位）
    if (absNumStr.length === 0 || absNumStr.length > 80) {
        throw new RangeError('数字长度必须在1-80位之间');
    }
    
    const length = absNumStr.length;
    if(length >= 8+precision){
        const intLength = length - precision;
        return absNumStr.substring(0, intLength);
    }
    
    // 处理特殊情况：精度为0
    if (precision === 0) {
        const result = absNumStr;
        return sign + formatTo8SignificantFiguresNoRounding(result, 0);
    }
    
    // 获取完整的小数表示
    let decimalStr;
    if (precision >= length) {
        // 精度大于等于数字长度，需要在前面补0
        const decimalPart = absNumStr.padStart(precision, '0');
        decimalStr = '0.' + decimalPart;
    } else {
        // 精度小于数字长度，需要插入小数点
        const integerPart = absNumStr.substring(0, length - precision);
        const decimalPart = absNumStr.substring(length - precision);
        decimalStr = integerPart + '.' + decimalPart;
    }
    
    // 格式化为8位有效数字（不四舍五入）
    return sign + formatTo8SignificantFiguresNoRounding(decimalStr, precision);
}

/**
 * 将数字字符串格式化为8位有效数字（不四舍五入，只在小数部分超过8位时截断）
 * @param {string} numberStr - 数字字符串
 * @param {number} originalPrecision - 原始精度
 * @returns {string} 8位有效数字的字符串
 */
function formatTo8SignificantFiguresNoRounding(numberStr, originalPrecision) {
    // 移除开头的正负号（已经在外部处理）
    let str = numberStr;
    
    // 分离整数部分和小数部分
    const parts = str.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';
    
    // 处理0的情况
    if (integerPart === '0' && /^0+$/.test(decimalPart || '0')) {
        return '0';
    }
    
    // 统计有效数字：从第一个非零数字开始
    let allDigits = integerPart + decimalPart;
    
    // 找到第一个非零数字的位置
    let firstNonZeroIndex = -1;
    for (let i = 0; i < allDigits.length; i++) {
        if (allDigits[i] !== '0') {
            firstNonZeroIndex = i;
            break;
        }
    }
    
    // 如果全是0，返回0
    if (firstNonZeroIndex === -1) {
        return '0';
    }
    
    // 计算有效数字总数（从第一个非零数字开始的所有数字）
    let significantDigitsCount = allDigits.length - firstNonZeroIndex;
    
    // 如果总有效数字不超过8位，直接返回原字符串（清理末尾的0）
    if (significantDigitsCount <= 8) {
        // 清理整数部分开头的0（除了0本身）
        if (integerPart.length > 1) {
            integerPart = integerPart.replace(/^0+/, '') || '0';
        }
        
        // 清理小数部分末尾的0
        if (decimalPart.length > 0) {
            decimalPart = decimalPart.replace(/0+$/, '');
        }
        
        // 组合结果
        if (decimalPart.length > 0) {
            return integerPart + '.' + decimalPart;
        } else {
            return integerPart;
        }
    }
    
    // 如果总有效数字超过8位，我们需要截断
    // 计算需要保留多少位整数部分和小数部分
    
    let resultIntegerPart = '';
    let resultDecimalPart = '';
    
    // 情况1：整数部分长度大于等于8
    // 这意味着不需要显示小数部分，整数部分已经超过8位有效数字
    if (integerPart.replace(/^0+/, '').length >= 8) {
        // 取整数部分的前8位（注意要跳过开头的0）
        const nonZeroIntegerPart = integerPart.replace(/^0+/, '');
        resultIntegerPart = nonZeroIntegerPart.substring(0, 8);
        // 不需要小数部分
        resultDecimalPart = '';
    }
    // 情况2：整数部分有数字，但不足8位
    else if (integerPart !== '0' && integerPart.replace(/^0+/, '').length > 0) {
        const nonZeroIntegerPart = integerPart.replace(/^0+/, '');
        const integerDigitsCount = nonZeroIntegerPart.length;
        const remainingDigitsNeeded = 8 - integerDigitsCount;
        
        resultIntegerPart = nonZeroIntegerPart;
        
        // 从小数部分取剩余需要的位数
        if (remainingDigitsNeeded > 0 && decimalPart.length > 0) {
            resultDecimalPart = decimalPart.substring(0, remainingDigitsNeeded);
            // 清理小数部分末尾的0
            resultDecimalPart = resultDecimalPart.replace(/0+$/, '');
        }
    }
    // 情况3：纯小数（整数部分为0）
    else {
        // 纯小数，整数部分为0
        resultIntegerPart = '0';
        
        // 找到第一个非零数字之后，需要8位有效数字
        // firstNonZeroIndex 是在 allDigits 中的位置，allDigits = "0" + decimalPart
        // 对于纯小数，第一个非零数字在 decimalPart 中的位置是 firstNonZeroIndex - 1
        const firstNonZeroInDecimal = firstNonZeroIndex - 1;
        
        // 从第一个非零数字开始取8位
        if (firstNonZeroInDecimal >= 0) {
            // 第一个非零数字之前可能有0，这些0需要保留
            const leadingZeros = decimalPart.substring(0, firstNonZeroInDecimal);
            const significantDigits = decimalPart.substring(
                firstNonZeroInDecimal, 
                firstNonZeroInDecimal + 8
            );
            
            resultDecimalPart = leadingZeros + significantDigits;
            // 清理小数部分末尾的0
            resultDecimalPart = resultDecimalPart.replace(/0+$/, '');
        }
    }
    
    // 组合结果
    if (resultDecimalPart.length > 0) {
        return resultIntegerPart + '.' + resultDecimalPart;
    } else {
        return resultIntegerPart;
    }
}




// 更简洁的版本
function decimalToBigInteger(num, precision) {
    let str = num.toString();
    const isNegative = str.startsWith('-');
    if (isNegative) str = str.substring(1);
    
    // 添加足够的0
    str += '0'.repeat(precision);
    
    // 找到小数点位置
    const dotIndex = str.indexOf('.');
    
    if (dotIndex === -1) {
        // 没有小数点
        return (isNegative ? '-' : '') + str;
    }
    
    // 有小数点
    const beforeDot = str.substring(0, dotIndex);
    const afterDot = str.substring(dotIndex + 1);
    
    // 取前precision位小数
    const decimalDigits = afterDot.substring(0, precision);
    
    // 组合结果
    const intPart = beforeDot.replace(/^0+/, '') || '0';
    let result;
    
    if (intPart === '0') {
        result = decimalDigits.replace(/^0+/, '') || '0';
    } else {
        result = intPart + decimalDigits;
    }
    
    return (isNegative && result !== '0') ? '-' + result : result;
}


// 格式化余额为 6 位有效数字
function formatBalance(balance) {
    if (!balance) return '0';

    let num = parseFloat(balance);
    if (num === 0) return '0';

    let result = num.toPrecision(6);
    result = result.replace(/\.?0*$/, '');

    return result;
}

var getMultiplier = function (_num) {
    let multiplier = 1;
    let times = 0;
    while (_num < 1) {
        _num *= 10;
        multiplier *= 10;
        times += 1;
    }
    return { multiplier: multiplier, zeroCount: times };
}

function getDivisor(_num) {
    let divisor = 1;
    let times = 0;
    while (_num >= 10000) {
        _num /= 10;
        divisor *= 10;
        times += 1;
    }
    return {divisor:divisor, zeroCount: times };
}


function multiplyDecimals(a, b) {
  const factor = Math.max(a.toString().split('.')[1]?.length || 0, b.toString().split('.')[1]?.length || 0);
  const multiplier = Math.pow(10, factor);
  const result = (Math.round(a * multiplier) * Math.round(b * multiplier)) / (multiplier * multiplier);
  return result.toFixed(factor);
}
	