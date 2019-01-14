$(function(){

var isNewelement=false;
var gameScore=0;
var maxScore=0;

gameInit();

function getRandom(min, max)
{
    return min + Math.floor(Math.random() * (max - min + 1));
}
function newList()
{
	var newArr=[2,2,4];
	var newNum=newArr[getRandom(0,2)];
	console.log('newNum:'+newNum);
	var emptyItems=$('.emptyItem');
	var newRndSite = getRandom(0, emptyItems.length - 1);
	emptyItems.eq(newRndSite).html(newNum).removeClass('emptyItem').addClass('nonEmptyItem');
}

function refreshColor()
{
	var items=$('.body .list');
	for (var i = 0;i <items.length ; i++) {
		switch (items.eq(i).html()) {
                case '':
                    items.eq(i).css('background', '');
                    break;
                case '2':
                    items.eq(i).css('background', 'rgb(250, 225, 188)');
                    break;
                case '4':
                    items.eq(i).css('background', 'rgb(202, 240, 240)');
                    break;
                case '8':
                    items.eq(i).css('background', 'rgb(117, 231, 193)');
                    break;
                case '16':
                    items.eq(i).css('background', 'rgb(240, 132, 132)');
                    break;
                case '32':
                    items.eq(i).css('background', 'rgb(181, 240, 181)');
                    break;
                case '64':
                    items.eq(i).css('background', 'rgb(182, 210, 246)');
                    break;
                case '128':
                    items.eq(i).css('background', 'rgb(255, 207, 126)');
                    break;
                case '256':
                    items.eq(i).css('background', 'rgb(250, 216, 216)');
                    break;
                case '512':
                    items.eq(i).css('background', 'rgb(124, 183, 231)');
                    break;
                case '1024':
                    items.eq(i).css('background', 'rgb(225, 219, 215)');
                    break;
                case '2048':
                    items.eq(i).css('background', 'rgb(221, 160, 221)');
                    break;
                case '4096':
                    items.eq(i).css('background', 'rgb(250, 139, 176)');
                    break;
            }
	}
}

function refreshGame()
{
	var list=$('.list');
	for (var i = 0; i<list.length; i++) {
		list.eq(i).html('').removeClass('nonEmptyItem').addClass('emptyItem');
	}
	gameScore=0;
	$('#grameScore').html(gameScore);
	newList();
	newList();
	refreshColor();
}

function gameInit()
{
	if (localStorage.maxScore) {
        maxScore = localStorage.maxScore - 0;
    } else {
        maxScore = 0;
    }
	$('#grameScore').html(gameScore);
	$('#maxScore').html(maxScore);
	$('.refreshBtn').click(refreshGame);
	newList();
	newList();
	refreshColor();
}

function getSideItem(currentItem,direction)
{
	var currentItemX=currentItem.attr('x');
	var currentItemY=currentItem.attr('y');
	switch(direction)
	{
		case 'left':
		var sideItemX=currentItemX;
		var sideItemY=currentItemY-1;
		break;
		case 'right':
		var sideItemX=currentItemX;
		var sideItemY=parseInt(currentItemY)+1;
		break;
		case 'up':
		var sideItemX=currentItemX-1;
		var sideItemY=currentItemY;
		break;
		case 'down':
		var sideItemX=parseInt(currentItemX)+1;
		var sideItemY=currentItemY;
		break;
	}
	var sideItem=$('.x'+sideItemX+'y'+sideItemY);
	return sideItem;
}

function itemMove(currentItem,direction)
{
	var sideItem=getSideItem(currentItem,direction);
	if (sideItem.length==0) {
	}
	else if (sideItem.html()=='') {
		sideItem.html(currentItem.html()).removeClass('emptyItem').addClass('nonEmptyItem');
		currentItem.html('').removeClass('nonEmptyItem').addClass('emptyItem');
		itemMove(sideItem,direction);
		isNewelement=true;
	}
	else if (sideItem.html()!=currentItem.html()) {  }
	else{
		sideItem.html(sideItem.html()*2);
		currentItem.html('').removeClass('nonEmptyItem').addClass('emptyItem');
		gameScore+=sideItem.text()*10;
		$('#grameScore').html(gameScore);
		maxScore=maxScore<gameScore?gameScore:maxScore;
		localStorage.maxScore=maxScore;
		$('#maxScore').html(maxScore);
		isNewelement=true;
		return;
	}
}

function isGameOver()
{
	var items = $('.list');
	var nonEmptyItems=$('.nonEmptyItem');
	if (items.length==nonEmptyItems.length) 
	{
		for(var i =0;i<nonEmptyItems.length;i++){
			var currentItem=nonEmptyItems.eq(i);
                if (getSideItem(currentItem, 'up').length != 0 && currentItem.html() == getSideItem(currentItem, 'up').html()) {
                    //上边元素存在 且 当前元素中的内容等于上边元素中的内容
                    return;
                } else if (getSideItem(currentItem, 'down').length != 0 && currentItem.html() == getSideItem(currentItem, 'down').html()) {
                    //下边元素存在 且 当前元素中的内容等于下边元素中的内容
                    return;
                } else if (getSideItem(currentItem, 'left').length != 0 && currentItem.html() == getSideItem(currentItem, 'left').html()) {
                    //左边元素存在 且 当前元素中的内容等于左边元素中的内容
                    return;
                } else if (getSideItem(currentItem, 'right').length != 0 && currentItem.html() == getSideItem(currentItem, 'right').html()) {
                    //右边元素存在 且 当前元素中的内容等于右边元素中的内容
                    return;
                }
		}	 
	}else
	{
		return;
	}
	$('#gameOverModal').modal('show');

}

function move(direction)
{
	var nonEmptyItem=$('.body .row .nonEmptyItem');
	if (direction=='left'||direction=='up') {
		for (var i = 0; i<nonEmptyItem.length; i++) {
			var currentItem=nonEmptyItem.eq(i);
			itemMove(currentItem,direction);
		}
	}else if (direction=='right'||direction=='down') {
		for(var i=nonEmptyItem.length-1;i>=0;i--){
			var currentItem=nonEmptyItem.eq(i);
			itemMove(currentItem,direction);	
		}
	}

	if (isNewelement) {
		newList();
		refreshColor();
	}
}

$('body').keydown(function (e){
	 switch (e.keyCode) {
            case 37:
                // left
                console.log('left');
                isNewelement = false;
                move('left');
                isGameOver();
                break;
            case 38:
                // up
                console.log('up');
                isNewelement = false;
                move('up');
                isGameOver();
                break;
            case 39:
                // right
                console.log('right');
                isNewelement = false;
                move('right');
                isGameOver();
                break;
            case 40:
                // down
                console.log('down');
                isNewelement = false;
                move('down');
                isGameOver();
                break;
        }
});

});