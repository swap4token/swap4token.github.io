// datetime-picker-module-complete.js - 完整修复版
(function() {
    'use strict';
    
    // 唯一命名空间前缀
    const PREFIX = 'dtp_';
    
    // 全局状态
    let currentDate = new Date();
    let selectedDate = new Date();
    let selectedHour = selectedDate.getHours();
    let selectedMinute = selectedDate.getMinutes();
    let selectedSecond = selectedDate.getSeconds();
    let isPickerOpen = false;
    
    // DOM元素引用
    let domRefs = {};
    
    // ==================== CSS样式 ====================
    const styles = `
        /* 输入框样式 */
        .${PREFIX}input {
            border: 1px solid #e6e0ff;
            border-radius: 10px;
            background-color: #fff;
            transition: all 0.3s ease;
        }
        .${PREFIX}input:focus {
            outline: none;
            border-color: #6c2bd9;
            box-shadow: 0 0 0 3px rgba(106, 43, 217, 0.15);
        }
        
        /* 自定义选择器面板 */
        #${PREFIX}custom_picker {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 92%;
            max-width: 360px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 15px 40px rgba(74, 43, 217, 0.22);
            z-index: 10001;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
        }
        #${PREFIX}custom_picker.active {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, -50%) scale(1);
        }
        
        /* 面板头部 */
        .${PREFIX}picker_header {
            padding: 20px 20px 16px;
            border-bottom: 1px solid #f0ecff;
            text-align: center;
            background: linear-gradient(135deg, #4a2380, #6c2bd9);
            color: white;
            border-radius: 12px 12px 0 0;
        }
        .${PREFIX}picker_title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
            color: rgba(255,255,255,0.95);
        }
        
        /* 内容区域 */
        .${PREFIX}picker_content {
            padding: 18px;
        }
        
        /* 选项卡 */
        .${PREFIX}tab_buttons {
            display: flex;
            background: #f5f3ff;
            border-radius: 10px;
            padding: 4px;
            margin-bottom: 20px;
        }
        .${PREFIX}tab_btn {
            flex: 1;
            padding: 10px;
            text-align: center;
            font-weight: 600;
            font-size: 12px;
            color: #777;
            border-radius: 8px;
            cursor: pointer;
            border: none;
            background: none;
            transition: all 0.3s;
        }
        .${PREFIX}tab_btn.active {
            background: white;
            color: #6c2bd9;
            box-shadow: 0 2px 8px rgba(106, 43, 217, 0.18);
        }
        
        /* 日期选择区 */
        .${PREFIX}month_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .${PREFIX}month_title {
            font-size: 14px;
            font-weight: 600;
            color: #4a2380;
        }
        .${PREFIX}nav_btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: none;
            background: #f5f3ff;
            color: #6c2bd9;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .${PREFIX}nav_btn:active {
            background: #e6e0ff;
            transform: scale(0.94);
        }
        
        /* 星期 */
        .${PREFIX}weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            margin-bottom: 12px;
            font-weight: 550;
            color: #6c2bd9;
            font-size: 12px;
        }
        .${PREFIX}weekdays span {
            padding: 6px 0;
        }
        
        /* 日期网格 */
        .${PREFIX}days_grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 6px;
        }
        .${PREFIX}day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            font-weight: 500;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            background: none;
            border: none;
            color: #333;
            position: relative;
        }
        .${PREFIX}day:active {
            background-color: #f5f3ff;
            transform: scale(0.96);
        }
        .${PREFIX}day.${PREFIX}other_month {
            color: #bbb;
        }
        
        /* 今日日期样式 - 修复：紫色文字，浅紫色背景 */
        .${PREFIX}day.${PREFIX}today {
            color: #9c4be9;
            font-weight: 600;
            background-color: #f0ecff;
        }
        
        /* 今日日期的小圆点标记 */
        .${PREFIX}day.${PREFIX}today::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background-color: #6c2bd9;
            border-radius: 50%;
        }
        
        /* 选中状态 - 渐变背景，白色文字，阴影 */
        .${PREFIX}day.${PREFIX}selected {
            background: linear-gradient(135deg, #4a2380, #6c2bd9);
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 10px rgba(106, 43, 217, 0.25);
        }
        
        /* 既是今日又被选中 */
        .${PREFIX}day.${PREFIX}today.${PREFIX}selected {
            background: linear-gradient(135deg, #4a2380, #6c2bd9);
            color: white;
        }
        
        /* 选中状态下的小圆点变为白色 */
        .${PREFIX}day.${PREFIX}today.${PREFIX}selected::after {
            background-color: white;
        }
        
        /* 时间选择区 */
        #${PREFIX}time_picker {
            padding-top: 10px;
        }
        .${PREFIX}time_slider {
            margin-bottom: 20px;
        }
        .${PREFIX}time_label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-weight: 600;
            color: #4a2380;
            font-size: 12px;
        }
        .${PREFIX}slider_container {
            position: relative;
            padding: 0 3px;
        }
        .${PREFIX}slider {
            width: 100%;
            height: 28px;
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            outline: none;
        }
        .${PREFIX}slider::-webkit-slider-runnable-track {
            width: 100%;
            height: 5px;
            background: linear-gradient(to right, #e6e0ff, #6c2bd9);
            border-radius: 3px;
        }
        .${PREFIX}slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 3px solid #6c2bd9;
            box-shadow: 0 3px 8px rgba(106, 43, 217, 0.25);
            margin-top: -8px;
            cursor: pointer;
        }
        .${PREFIX}time_value {
            text-align: center;
            font-size: 18px;
            font-weight: 650;
            color: #4a2380;
            margin: 16px 0 20px;
            letter-spacing: 1px;
            line-height: 1.4;
        }
        
        /* 操作按钮 */
        .${PREFIX}picker_actions {
            display: flex;
            gap: 12px;
            padding: 14px 16px 16px;
            border-top: 1px solid #f0ecff;
        }
        .${PREFIX}action_btn {
            flex: 1;
            padding: 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .${PREFIX}action_btn:active {
            transform: scale(0.97);
        }
        .${PREFIX}btn_cancel {
            background: #f5f3ff;
            color: #666;
        }
        .${PREFIX}btn_confirm {
            background: linear-gradient(135deg, #4a2380, #6c2bd9);
            color: white;
            box-shadow: 0 6px 16px rgba(106, 43, 217, 0.25);
        }
        
        /* 遮罩层 */
        #${PREFIX}overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(74, 35, 128, 0.5);
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }
        #${PREFIX}overlay.active {
            opacity: 1;
            visibility: visible;
        }
    `;
    
    // ==================== HTML结构 ====================
    const pickerHTML = `
        <div id="${PREFIX}custom_picker">
            <div class="${PREFIX}picker_header">
                <div class="${PREFIX}picker_title">选择日期时间</div>
            </div>
            <div class="${PREFIX}picker_content">
                <div class="${PREFIX}tab_buttons">
                    <button class="${PREFIX}tab_btn active" data-tab="date">📅 日期</button>
                    <button class="${PREFIX}tab_btn" data-tab="time">🕒 时间</button>
                </div>
                <div id="${PREFIX}date_picker" class="${PREFIX}tab_content">
                    <div class="${PREFIX}month_header">
                        <button class="${PREFIX}nav_btn ${PREFIX}prev_month">‹</button>
                        <div class="${PREFIX}month_title" id="${PREFIX}current_month">2023年12月</div>
                        <button class="${PREFIX}nav_btn ${PREFIX}next_month">›</button>
                    </div>
                    <div class="${PREFIX}weekdays">
                        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
                    </div>
                    <div class="${PREFIX}days_grid" id="${PREFIX}days_container"></div>
                </div>
                <div id="${PREFIX}time_picker" class="${PREFIX}tab_content" style="display:none;">
                    <div class="${PREFIX}time_slider">
                        <div class="${PREFIX}time_label">
                            <span>小时</span>
                            <span id="${PREFIX}hour_value">12</span>
                        </div>
                        <div class="${PREFIX}slider_container">
                            <input type="range" class="${PREFIX}slider" id="${PREFIX}hour_slider" min="0" max="23" value="12" step="1">
                        </div>
                    </div>
                    <div class="${PREFIX}time_slider">
                        <div class="${PREFIX}time_label">
                            <span>分钟</span>
                            <span id="${PREFIX}minute_value">00</span>
                        </div>
                        <div class="${PREFIX}slider_container">
                            <input type="range" class="${PREFIX}slider" id="${PREFIX}minute_slider" min="0" max="59" value="0" step="1">
                        </div>
                    </div>
                    <div class="${PREFIX}time_slider">
                        <div class="${PREFIX}time_label">
                            <span>秒</span>
                            <span id="${PREFIX}second_value">00</span>
                        </div>
                        <div class="${PREFIX}slider_container">
                            <input type="range" class="${PREFIX}slider" id="${PREFIX}second_slider" min="0" max="59" value="0" step="1">
                        </div>
                    </div>
                    <div class="${PREFIX}time_value" id="${PREFIX}time_display">2023年12月20日 12:00:00</div>
                </div>
            </div>
            <div class="${PREFIX}picker_actions">
                <button class="${PREFIX}action_btn ${PREFIX}btn_cancel" id="${PREFIX}cancel_btn">取消</button>
                <button class="${PREFIX}action_btn ${PREFIX}btn_confirm" id="${PREFIX}confirm_btn">确定</button>
            </div>
        </div>
        <div id="${PREFIX}overlay"></div>
    `;
    
    // ==================== 核心函数 ====================
    
    // 工具函数：比较两个日期是否为同一天
    function isSameDay(date1, date2) {
        if (!date1 || !date2) return false;
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    // 格式化日期为 YYYY-MM-DD HH:MM:SS
    function formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    
    // 格式化日期为中文显示
    function formatDateTimeChinese(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
    }
    
    // 初始化样式和DOM
    function initPickerDOM() {
        // 如果已经初始化过，直接返回
        if (document.getElementById(`${PREFIX}custom_picker`)) {
            return;
        }
        
        // 添加CSS样式
        const styleElement = document.createElement('style');
        styleElement.id = `${PREFIX}styles`;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        
        // 添加HTML结构
        const container = document.createElement('div');
        container.id = `${PREFIX}container`;
        container.style.cssText = 'position:fixed; left:0; top:0; width:100%; height:100%; pointer-events:none; z-index:9998;';
        container.innerHTML = pickerHTML;
        document.body.appendChild(container);
        
        // 缓存DOM引用
        domRefs = {
            customPicker: document.getElementById(`${PREFIX}custom_picker`),
            overlay: document.getElementById(`${PREFIX}overlay`),
            currentMonth: document.getElementById(`${PREFIX}current_month`),
            daysContainer: document.getElementById(`${PREFIX}days_container`),
            hourSlider: document.getElementById(`${PREFIX}hour_slider`),
            minuteSlider: document.getElementById(`${PREFIX}minute_slider`),
            secondSlider: document.getElementById(`${PREFIX}second_slider`),
            hourValue: document.getElementById(`${PREFIX}hour_value`),
            minuteValue: document.getElementById(`${PREFIX}minute_value`),
            secondValue: document.getElementById(`${PREFIX}second_value`),
            timeDisplay: document.getElementById(`${PREFIX}time_display`),
            tabButtons: document.querySelectorAll(`.${PREFIX}tab_btn`),
            tabContents: document.querySelectorAll(`.${PREFIX}tab_content`),
            prevMonthBtn: document.querySelector(`.${PREFIX}prev_month`),
            nextMonthBtn: document.querySelector(`.${PREFIX}next_month`),
            cancelBtn: document.getElementById(`${PREFIX}cancel_btn`),
            confirmBtn: document.getElementById(`${PREFIX}confirm_btn`)
        };
        
        // 初始化事件监听
        initEventListeners();
    }
    
    // 生成月份日历 - 修复今日高亮和选中状态
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();
        
        domRefs.currentMonth.textContent = `${year}年${month + 1}月`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayWeekday = firstDay.getDay();
        
        domRefs.daysContainer.innerHTML = '';
        
        // 添加上个月的最后几天
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayWeekday - 1; i >= 0; i--) {
            const day = document.createElement('button');
            day.className = `${PREFIX}day ${PREFIX}other_month`;
            const dayNumber = prevMonthLastDay - i;
            day.textContent = dayNumber;
            day.dataset.date = new Date(year, month - 1, dayNumber).toISOString().split('T')[0];
            domRefs.daysContainer.appendChild(day);
        }
        
        // 添加当月所有日期 - 修复今日和选中状态
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('button');
            const thisDay = new Date(year, month, i);
            
            // 判断是否是今天
            const isToday = thisDay.getDate() === today.getDate() && 
                           thisDay.getMonth() === today.getMonth() && 
                           thisDay.getFullYear() === today.getFullYear();
            
            // 判断是否被选中
            const isSelected = isSameDay(thisDay, selectedDate);
            
            // 设置类名
            day.className = `${PREFIX}day`;
            if (isToday) {
                day.classList.add(`${PREFIX}today`);
            }
            if (isSelected) {
                day.classList.add(`${PREFIX}selected`);
            }
            
            day.textContent = i;
            day.dataset.date = thisDay.toISOString().split('T')[0];
            
            // 日期点击事件 - 修复选中状态切换
            day.addEventListener('click', () => {
                // 移除之前选中的日期
                document.querySelectorAll(`.${PREFIX}day.${PREFIX}selected`).forEach(d => {
                    d.classList.remove(`${PREFIX}selected`);
                });
                
                // 标记当前选中的日期
                day.classList.add(`${PREFIX}selected`);
                
                // 更新选中的日期
                selectedDate = new Date(thisDay);
                selectedDate.setHours(selectedHour, selectedMinute, selectedSecond);
                
                updateDateTimeDisplayArea();
                switchTab('time');
            });
            
            domRefs.daysContainer.appendChild(day);
        }
        
        // 添加下个月的前几天
        const totalCells = 42;
        const cellsSoFar = firstDayWeekday + lastDay.getDate();
        for (let i = 1; i <= totalCells - cellsSoFar; i++) {
            const day = document.createElement('button');
            day.className = `${PREFIX}day ${PREFIX}other_month`;
            day.textContent = i;
            day.dataset.date = new Date(year, month + 1, i).toISOString().split('T')[0];
            domRefs.daysContainer.appendChild(day);
        }
    }
    
    // 更新时间显示区域
    function updateDateTimeDisplayArea() {
        domRefs.timeDisplay.textContent = formatDateTimeChinese(selectedDate);
    }
    
    // 切换选项卡
    function switchTab(tabName) {
        domRefs.tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        domRefs.tabContents.forEach(content => {
            if (content.id === `${PREFIX}${tabName}_picker`) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    // 初始化时间滑块
    function initTimeSliders() {
        function updateTime() {
            selectedHour = parseInt(domRefs.hourSlider.value);
            selectedMinute = parseInt(domRefs.minuteSlider.value);
            selectedSecond = parseInt(domRefs.secondSlider.value);
            
            domRefs.hourValue.textContent = String(selectedHour).padStart(2, '0');
            domRefs.minuteValue.textContent = String(selectedMinute).padStart(2, '0');
            domRefs.secondValue.textContent = String(selectedSecond).padStart(2, '0');
            
            selectedDate.setHours(selectedHour, selectedMinute, selectedSecond);
            updateDateTimeDisplayArea();
        }
        
        domRefs.hourSlider.addEventListener('input', updateTime);
        domRefs.minuteSlider.addEventListener('input', updateTime);
        domRefs.secondSlider.addEventListener('input', updateTime);
        
        const now = new Date();
        selectedHour = now.getHours();
        selectedMinute = now.getMinutes();
        selectedSecond = now.getSeconds();
        domRefs.hourSlider.value = selectedHour;
        domRefs.minuteSlider.value = selectedMinute;
        domRefs.secondSlider.value = selectedSecond;
        updateTime();
    }
    
    // 打开选择器 - 修复：确保打开时选中今日
    function openPicker(inputElement) {
        isPickerOpen = true;
        
        // 确保选择器在DOM最前面
        const container = document.getElementById(`${PREFIX}container`);
        if (container && container.parentNode === document.body) {
            document.body.appendChild(container);
        }
        
        // 如果没有选中日期或者选中的不是今天，则选中今天
        const today = new Date();
        if (!selectedDate || !isSameDay(selectedDate, today)) {
            selectedDate = new Date(today);
            selectedHour = today.getHours();
            selectedMinute = today.getMinutes();
            selectedSecond = today.getSeconds();
        }
        
        domRefs.customPicker.classList.add('active');
        domRefs.overlay.classList.add('active');
        
        currentDate = new Date(selectedDate);
        selectedHour = selectedDate.getHours();
        selectedMinute = selectedDate.getMinutes();
        selectedSecond = selectedDate.getSeconds();
        
        domRefs.hourSlider.value = selectedHour;
        domRefs.minuteSlider.value = selectedMinute;
        domRefs.secondSlider.value = selectedSecond;
        domRefs.hourValue.textContent = String(selectedHour).padStart(2, '0');
        domRefs.minuteValue.textContent = String(selectedMinute).padStart(2, '0');
        domRefs.secondValue.textContent = String(selectedSecond).padStart(2, '0');
        
        updateDateTimeDisplayArea();
        renderCalendar(); // 这会应用今日高亮和选中状态
        switchTab('date');
        
        // 保存当前输入框引用
        domRefs.currentInput = inputElement;
    }
    
    // 关闭选择器
    function closePicker() {
        isPickerOpen = false;
        domRefs.customPicker.classList.remove('active');
        domRefs.overlay.classList.remove('active');
    }
    
    // 初始化事件监听
    function initEventListeners() {
        domRefs.overlay.addEventListener('click', closePicker);
        
        domRefs.cancelBtn.addEventListener('click', closePicker);
        
        domRefs.confirmBtn.addEventListener('click', () => {
            if (domRefs.currentInput) {
                domRefs.currentInput.value = formatDateTime(selectedDate);
            }
            closePicker();
        });
        
        domRefs.prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        domRefs.nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        // 选项卡切换
        domRefs.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });
        
        // 键盘支持
        document.addEventListener('keydown', (e) => {
            if (!isPickerOpen) return;
            if (e.key === 'Escape') closePicker();
        });
    }
    
    // ==================== 公开API ====================
    
    window.DateTimePickerModule = {
        /**
         * 初始化日期时间选择器
         * @param {Object} options 配置选项
         * @param {string} options.inputId 输入框的ID
         * @param {Date} options.defaultDate 默认日期时间
         */
        init: function(options = {}) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this._init(options));
            } else {
                this._init(options);
            }
        },
        
        /**
         * 私有初始化方法
         */
        _init: function(options) {
            // 初始化DOM（只初始化一次）
            initPickerDOM();
            
            // 初始化时间滑块
            initTimeSliders();
            
            // 设置默认值
            if (options.defaultDate && options.defaultDate instanceof Date) {
                selectedDate = new Date(options.defaultDate);
                selectedHour = selectedDate.getHours();
                selectedMinute = selectedDate.getMinutes();
                selectedSecond = selectedDate.getSeconds();
            }
            
            updateDateTimeDisplayArea();
            
            // 绑定输入框
            if (options.inputId) {
                const inputElement = document.getElementById(options.inputId);
                if (inputElement) {
                    this.attachToInput(inputElement);
                }
            }
        },
        
        /**
         * 手动绑定输入框到选择器
         * @param {HTMLElement} inputElement 输入框元素
         */
        attachToInput: function(inputElement) {
            if (!inputElement) return;
            
            // 添加样式类
            inputElement.classList.add(`${PREFIX}input`);
            
            // 绑定点击事件
            inputElement.addEventListener('click', () => {
                openPicker(inputElement);
            });
            
            // 设置初始值
            if (!inputElement.value) {
                inputElement.value = formatDateTime(selectedDate);
            }
        },
        
        /**
         * 获取当前选择的日期时间
         * @returns {Date} 当前选择的日期时间
         */
        getSelectedDate: function() {
            return new Date(selectedDate);
        },
        
        /**
         * 设置日期时间
         * @param {Date} date 要设置的日期时间
         */
        setDate: function(date) {
            if (date instanceof Date) {
                selectedDate = new Date(date);
                selectedHour = selectedDate.getHours();
                selectedMinute = selectedDate.getMinutes();
                selectedSecond = selectedDate.getSeconds();
                updateDateTimeDisplayArea();
                
                if (domRefs.currentInput) {
                    domRefs.currentInput.value = formatDateTime(selectedDate);
                }
                
                // 重新渲染日历以更新选中状态
                if (isPickerOpen) {
                    renderCalendar();
                }
            }
        },
        
        /**
         * 销毁选择器，清理DOM和事件
         */
        destroy: function() {
            const container = document.getElementById(`${PREFIX}container`);
            const styles = document.getElementById(`${PREFIX}styles`);
            
            if (container) container.remove();
            if (styles) styles.remove();
            
            // 清理引用
            domRefs = {};
            window.DateTimePickerModule = undefined;
        },
        
        /**
         * 工具函数：格式化日期
         * @param {Date} date 要格式化的日期
         * @returns {string} 格式化后的字符串
         */
        formatDateTime: function(date) {
            return formatDateTime(date);
        }
    };
    
    // 自动初始化
    setTimeout(() => {
        const dtpInputs = document.querySelectorAll(`.${PREFIX}input`);
        if (dtpInputs.length > 0) {
            window.DateTimePickerModule._init({});
        }
    }, 100);
})();