/**
 * Created by Administrator on 2017/3/6.
 */
$(function () {
    /*一.设置吸顶效果*/
    /*1.0获取nav距离顶部的间距*/
    var off_top = $('.nav').offset().top;
  
    /*1.1监听滚动，设置对应的样式*/
    $(window).on('scroll',function () {
        /*1.2获取滚动的距离*/
        var scr_top = $(window).scrollTop();
      
        /*1.3判断比较设置样式*/
        if(scr_top>=off_top){
            $('.nav').css({
                'position':'fixed',
                'top':0,
                // 'box-shadow':'0 1px 3px rgab(0,0,0,0.4)'
            });
            /*1.31设置图片的透明度，让图片出来*/
            $('.nav img').css({
                'opacity':1
            })
        }else {
            $('.nav').css({
                'position':'absolute',
                top:off_top,
                
            });
            $('.nav img').css({
                'opacity':0
            })
        }
    })
    
    /*二.设置返回顶部*/
    $(window).on('scroll',function () {
        var scr_top = $(window).scrollTop();
        //2.1判断
        if(scr_top >=off_top ){
            $('.back_top').fadeIn(200);
        }else {
            $('.back_top').fadeOut(200);
        }
    })
    
    /*2.2点击back_top返回顶部*/
    $('.back_top').on('click',function () {
        //2.21让回到顶部
        $('html body').animate({
            scrollTop:0
        })
    })
    
    /*三.添加li*/
    /*3.0使用数组来记录事项*/
    var itemArray ;
    
    /*当界面加载进来的时候，就去从从存储的数据中拿出对应的数据，如果没有才去加载*/
    itemArray = store.get('itemArray')||[];
    
    /*渲染界面*/
    render_view();
    
    $('input[type=submit]').on('click',function (event) {
        /*3.0去掉默认行为*/
        event.preventDefault();
        
        /*3.1获取input中内容，判断*/
        var inp_content = $('input[type=text]').val();
        if ($.trim(inp_content) == ''){
            alert('请输入内容');
            return;
            
        }else {
            /*3.2创建事项*/
            var item = {
                title:'',
                content:'',
                isCheck:false,
                remind_time:'',
                is_notice:false
            }
            
            /*3.2设置事项的相关属性*/
            item.title = inp_content;
            /*3.3添加到数组中中保存起来*/
            itemArray.push(item);
            
            /*3.4根据数组的长度，添加节点而且把节点显示出来/
            render_view();

            /*3.5存储数据*/
            
        }
    })
    
    function render_view() {
        /*0.存储数据，第一个参数用来表示存储的数据的标示，任何值都可以，只是用这个值来取出数据
        * 第二个参数表示要存储的数据*/
        store.set('itemArray',itemArray);
        /*把上一次的内容清空*/
        $('.task').empty();
        /*注意：为了让对应的checkBox点击的时候，让对应的不同的事项中添加不同的li
        * 所以我们需要改造渲染方法*/
        $('.finish_task').empty();
        /*3.41根据数组中的个数。来添加节点*/
        for(var i = 0;i < itemArray.length;i ++){
            var obj = itemArray[i];
            if (obj == undefined ||!obj){//为了规范和严格要进行元素的判定
                continue;
                
            }
            /*3.42创建li*/
            // data-index:用来给li绑定索引
            var tag = '<li data-index='+ i +' >'+
                '<input type="checkbox"'+(obj.isCheck?'checked':'')+' >'+
                '<span class="item_title">'+ obj.title +' </span>'+
                '<span class="del">删除</span>'+
                '<span class="detail">详情</span>'+
                '</li>';
            
            /*3.43添加li*/
            /*根据是否检查过，来确定添加到待选事件还是完成事件*/
            if(obj.isCheck){
                $('.finish_task').prepend(tag);
            }else {
                $('.task').prepend(tag);
            }
          
          
        }
        
        
    }
    
    /*四.切换tab*/
    /*4.1点击li切换tab*/
    $('.header li').click(function () {
        $(this).addClass('curr').siblings().removeClass('curr');
        
        /*4.2获取点击的索引值*/
        var index = $(this).index();
        /*4.3切换下面的div*/
        $('.body').eq(index).addClass('active').siblings().removeClass('active');
    });
    /*五，点击删除按钮删除对应的li*/
    $('body').on('click','.del',function () {
        /*5.1获取del所在的li*/
       var item = $(this).parent();
        /*5.2获取li对应的索引值*/
        var index = item.data('index');

        /*5.3为了代码严格，我们可以回索引进行判断*/
        if (index == undefined || !itemArray[index])return;
        /*5.4删除数组中的元素*/
        delete itemArray[index];
        /*5.5删除节点*/
        item.slideUp(200,function () {
            item.remove();
        })
        
        /*5.6存储数据*/
        store.set('itemArray',itemArray);

    })
    
    /*六.点击待办事项，让对应的事项有待办变为已经完成*/
    $('body').on('click','input[type=checkbox]',function () {
        
        /*6.1确定点击的索引*/
        var item = $(this).parent();
        var index = item.data('index');
        if (index == undefined || !itemArray[index])return;
        /*6.2拿出index中对应的数组中的元素*/
        var obj = itemArray[index];
        /*6.3设置isCheck为选中*/
        obj.isCheck = $(this).is(':checked');
        
        /*用obj替换原来位置的元素*/
        itemArray[index] = obj;
        /*6.4进行界面设置*/
        
        render_view();
        /*6.5存储数据*/

    });
    /*七.点击详情按钮的处理*/
    
    /*设置一个值用来表示当前点击的是哪一个*/
    var cur_index = 0;
    $('body').on('click','.detail',function () {
        /*7.1设置让对应mask出来*/
        $('.mask').fadeIn();
        
        /*7.2获取点击详情按钮的索引*/
        var item = $(this).parent();
        var index = item.data('index');
        /*7.21设置curr_index的值*/
        cur_index = index;
        /*7.3根据索引值获取数组中对应的元素*/
        var obj = itemArray[index];
        /*7.4根据对应的事项设置我们具体的内容*/
        /*7.41设置标题*/
        $('.detail_header .title').text(obj.title);
        /*7.42设置内容*/
        $('.detail_body textarea').val(obj.content);
        /*7.43设置提醒时间*/
        $('.detail_body input[type =text]').val(obj.remind_time);

    });
    /*八.处理事件的相关点击*/
    $('.mask').click(function () {
        $(this).fadeOut();
    });
    $('.close').click(function () {
        $('.mask').fadeOut();
    })
    /*8.1点击内容阻止冒泡*/
    $('.detail_content').click(function (event) {
        /*8.11阻止冒泡*/
        event.stopPropagation();
        
    })
    
    /*8.2设置当光标移动到input中设置时间的时候，让对应的时间的选择器展示出来*/
    /*8.21设置本地化时间(设置中国时间)*/
    $.datetimepicker.setLocale('ch');
    /*8.22给对应的标签设置对应时间选择器*/
    $('#date_time').datetimepicker();
    
    /*九.更新数据和界面*/
    $('.detail_body button').click(function () {        /*9.1获取点击详细按钮对应的索引值*/
        /*9.2根据索引值获取对应数组中的元素*/
        var item = itemArray[cur_index];
        /*9.3设置元素的数据*/
        item.title = $('.detail_body textarea').val();
        item.remind_time = $('.detail_body input[type=text]').val();
        // alert(item.remind_time);
       
        /*is_notice：表示有没有提醒去做对应事项*/
        item.is_notice = false;
        /*9.4赋值回原来的位置*/
        itemArray[cur_index] = item;
        /*9.5存储数据*/
        store.set('itemArray',itemArray);
        
        /*9.6更新界面*/
        render_view();
        /*9.7让当前的mask消失*/
        $('.mask').fadeOut();
        
        
    });
    /*十.提醒设置*/
    /*10.1我们需要时时刻刻比较当前的时间和设置的时间，所以要使用定时器*/
    setInterval(function () {
        var cur_time = (new Date()).getTime();
        /*10.2获取每一元素的的提醒时间，和当前时间比较，需要使用遍历*/
        for(var i = 0;i < itemArray.length;i++){
            var item = itemArray[i];
             if(item == undefined ||!item ||item.remind_time.length<1||item.is_notice){continue};
            /*10.3判断当前的时间是否大于提醒时间*/
            /*10.31获取每一提醒时间的毫秒数*/
            var rem_time = (new Date(item.remind_time)).getTime();
            if(cur_time - rem_time >1){
                //需要提醒，让对应铃声响起
                /*获取的对象是jQuery对象我们需要转化成js对象*/
                $('video').get(0).play();
                $('video').get(0).currentTime = 0;

                /*10.4当铃声响起后，表示已经提醒过了，我们要设置提醒为true*/
                item.is_notice = true;
                /*10.5重新赋值*/
                itemArray[i] = item;
                /*10.6数据变化，就要存储数据*/
                store.set('itemArray',itemArray);

            }
        }


    },2000)


})