var nums=new Array();

$(function(){
	newGame();
});

//开始新游戏
function newGame(){
	//初始化页面
	init();

	//在随机的两个单元格中生成数字
	generateOneNumber();
	generateOneNumber();
}

//初始化页面
function init(){
	//初始化单元格的位置
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$('#grid-cell-'+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}

	//初始化数组
	for(var i=0;i<4;i++){
		nums[i]=new Array();
		for(var j=0;j<4;j++){
			nums[i][j]=0;
		}
	}

	//动态创建上层单元格并初始化，更新视图
	updateView();


}


//更新视图页面
function updateView(){
	//将所有上层单元格都清空，然后重新初始化
	$('.number-cell').remove();

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$(".grid-container").append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`);
			var numberCell=$(`#number-cell-${i}-${j}`);
			if(nums[i][j]!=0){
				numberCell.css('width','100px');
				numberCell.css('height','100px');
				numberCell.css('top',getPosTop(i,j));
				numberCell.css('left',getPosLeft(i,j));
				numberCell.css('background-color',getNumberBackgroundColor(nums[i][j]));
				numberCell.css('color',getNumberColor(nums[i][j]));
				numberCell.text(nums[i][j]);
			}else{
				numberCell.css('width','0px');
				numberCell.css('height','0px');
				numberCell.css('top',getPosTop(i,j)+50);
				numberCell.css('left',getPosLeft(i,j)+50);
			}
		}
	}
}

/**
 * 产生随机数(2或4)
 * 找到随机位置(空单元格)
 */
 function generateOneNumber(){
	//判断是否还有空间，如果没有空位置则游戏结果
	if(noSpace(nums)){
		return;
	}

	//找到随机位置
	var count=0;
	var array=new Array();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){
				array[count]=i*4+j; //i=2  j=1
				count++;
			}
		}
	}
	
	var n=Math.floor(Math.random()*count);
	var randX=Math.floor(array[n]/4); //2
	var randY=Math.floor(array[n]%4); //1

	//随机产生2或4
	var randNumber=Math.random()>0.5?2:4;
	nums[randX][randY]=randNumber;

	//在随机的位置上显示随机数字
	showNumberWithAnimation(randX,randY,randNumber);
}

/**
 * 实现键盘响应
 */
 $(document).keydown(function(event){
 	//alert(event.keyCode);
 	event.preventDefault();
 	switch(event.keyCode){
 		case 37://left
 		     if(canMoveLeft(nums)){
 		     	moveLeft();
 		     	setTimeout(generateOneNumber,210);
 		     }
             break;
        case 38://top
             if(canMoveTop(nums)){
 		     	moveTop();
 		     	setTimeout(generateOneNumber,210);
 		     }
             break;
        case 39://right
             if(canMoveRight(nums)){
 		     	moveRight();
 		     	setTimeout(generateOneNumber,210);
 		     }
             break;
        case 40://down
             if(canMoveDown(nums)){
 		     	moveDown();
 		     	setTimeout(generateOneNumber,210);
 		     }
             break;
 	}
 });

 /**
 * 向左移动
 * 需要对每个数字的左边进行判断，选择最佳落脚点，落脚点有两种情况：
 * 1.落脚点没有数字，并且在移动路径中没有障碍物
 * 2.落脚点数字和自己相等，并且在移动路径中没有障碍物
 */
 function moveLeft(){
 	for(var i=0;i<4;i++){
 		for(var j=1;j<4;j++){
 			if(nums[i][j]!=0){
 				for(var k=0;k<j;k++){//从最左边开始遍历左边所有的单元格，进行判断
 					if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)){//第i行的第k-j列之间是否有障碍物
                        //移动操作
                        showMoveAnimation(i,j,i,k);//显示移动的动画效果
                        nums[i][k]=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) ){
                        showMoveAnimation(i,j,i,k);//显示移动的动画效果
                        nums[i][k]+=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0                       
                        break;
 					}

 				}
 			}
 		}
 	}
    setTimeout(updateView,200);
 }

 function moveTop(){
 	for(var i=1;i<4;i++){
 		for(var j=0;j<4;j++){
 			if(nums[i][j]!=0){
 				for(var k=0;k<i;k++){//从最左边开始遍历左边所有的单元格，进行判断
 					if(nums[k][j]==0 && noBlockVertical(i,k,j,nums)){//第i行的第k-j列之间是否有障碍物
                        //移动操作
                        showMoveAnimation(i,j,k,j);//显示移动的动画效果
                        nums[k][j]=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}else if(nums[k][j]==nums[i][j] && noBlockVertical(i,k,j,nums)){
                        showMoveAnimation(i,j,k,j);//显示移动的动画效果
                        nums[k][j]+=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}
 				}
 			}
 		}
 	}
    setTimeout(updateView,200);
 }

 function moveRight(){
 	for(var i=0;i<4;i++){
 		for(var j=2;j>=0;j--){
 			if(nums[i][j]!=0){
 				for(var k=3;k>j;k--){//从最左边开始遍历左边所有的单元格，进行判断
 					if(nums[i][k]==0 && noBlockHorizontalRight(i,j,k,nums)){//第i行的第k-j列之间是否有障碍物
                        //移动操作
                        showMoveAnimation(i,j,i,k);//显示移动的动画效果
                        nums[i][k]=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}else if(nums[i][k]==nums[i][j] && noBlockHorizontalRight(i,j,k,nums)){
                        showMoveAnimation(i,j,i,k);//显示移动的动画效果
                        nums[i][k]+=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}
 				}
 			}
 		}
 	}
    setTimeout(updateView,200);
 }

 function moveDown(){
 	for(var i=2;i>=0;i--){
 		for(var j=0;j<4;j++){
 			if(nums[i][j]!=0){//for(var k=i+1;k<4;k++)
 				for(var k=3;k>i;k--){//从最左边开始遍历左边所有的单元格，进行判断
 					if(nums[k][j]==0 && noBlockVerticalDown(i,k,j,nums)){//第i行的第k-j列之间是否有障碍物
                        //移动操作
                        showMoveAnimation(i,j,k,j);//显示移动的动画效果
                        nums[k][j]=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}else if(nums[k][j]==nums[i][j] && noBlockVerticalDown(i,k,j,nums)){
                        showMoveAnimation(i,j,k,j);//显示移动的动画效果
                        nums[k][j]+=nums[i][j]; //从i,j移动到i,k
                        nums[i][j]=0; //将原来位置设置为0
                        break;
 					}
 				}
 			}
 		}
 	}
    setTimeout(updateView,200);
 }