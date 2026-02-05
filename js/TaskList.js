var taskListElement = "<a class='task-card' href ='subpage/renwu/newTaskDetail.html?ref=RD_task_id'><div class='task-icon'><img loading='lazy' src='./img/app/douyin.png' alt='平台图标'></div><div class='task-content'><div class='task-title'>RD_task_title</div><div class='task-platform'><i class='fab fa-tiktok'></i> RD_task_platForm</div><div class='task-metrics'><div class='metric'><i class='fas fa-clock'></i> RD_task_yuJiTime</div><div class='metric'><i class='fas fa-user-check'></i> RD_task_AllUserCount人已完成</div></div></div><div class='task-reward'>RD_task_rewardAmount USDT</div></a>";

var getTaskList = function(){
    ajaxfunction("RDTasks/get",{},function(res){
        var json = eval("(" + res + ")");
		console.log(json)
		if(json.sucess || json.object){
		    var listData = json.object;
		    var size = listData.length;
		    if(size > 0){
		        var obj;
		        for(var i=0;i<size;i++){
		            console.log(listData[i])
		            obj = listData[i];
		            var newELE = taskListElement;
		            newELE = newELE.replace('RD_task_id',obj.id);
		            newELE = newELE.replace('RD_task_title',obj.description);
		            newELE = newELE.replace('RD_task_platForm',obj.platForm);
		            newELE = newELE.replace('RD_task_yuJiTime',obj.yuJiTime);
		            newELE = newELE.replace('RD_task_AllUserCount',obj.userCount + obj.adminUserCount);
		            newELE = newELE.replace('RD_task_rewardAmount',(obj.rewardAmount*1.0).toFixed(2));
		            $('#RdTaskListdata').append(newELE);
		        }
		    }
		}else{
		    tishi("没有数据")
		}
    })
}

getTaskList();


