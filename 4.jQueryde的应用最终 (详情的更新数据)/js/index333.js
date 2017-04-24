/**
 * Created by Administrator on 2017/3/8.
 */
$(function(){
    /*设置吸顶效果*/
    var off_top = $('.nav').offset().top;
    $(window).on('scroll',function(){
        var scroll_top = $(window).scrollTop();
        if(scroll_top >= off_top){
            $('.nav').css({'position':'fixed','top':0});
            $('.nav img').css({'opacity':1});
        }else {
            $('.nav').css({'position':'absolute','top':off_top});
            $('.nav img').css({'opacity':0});
        }
    })
    /*设置小火箭的出现和消失*/
    $(window).on('scroll',function(){
        var scroll_top = $(window).scrollTop();
        if (scroll_top >= off_top){
            $('.back_top').fadeIn(200);
        }else {
            $('.back_top').fadeOut(200);
        }
    })
    /*点击小火箭返回顶部*/
    $('.back_top').click(function(){
        $('html body').animate({'scrollTop':0})
    })
    /*添加li*/
    var itemArray;
    itemArray = store.get('itemArray')||[];
    render_view;
    $('input[type=submit]').on('click',function(event){
        event.stopPropagation();
        var input_content = $('input[type=text]').val();
        if ($.trim(input_content) == ''){
            alert('请输入内容');
            return;
        }else {
            var item = {
                title:'',
                content:'',
                isCheck:false,
                remind_time:'',
                is_notice:false
            }
            item.title = input_content;
            itemArray.push(item);
            render_view();

        }
    })
    function render_view(){
        store.set('itemArray',itemArray);
        $('.task').empty();
        $('.finish_task').empty();
        for(var i = 0;i < itemArray.length;i++){
            var obj = itemArray[i];
            if (obj == undefined ||!obj){
                continue;
            }
            var tag = '<li data-index='+ i +' >'+
                '<input type="checkbox"'+(obj.isCheck?'checked':'')+' >'+
                '<span class="item_title">'+ obj.title +' </span>'+
                '<span class="del">删除</span>'+
                '<span class="detail">详情</span>'+
                '</li>';
            if (obj.isCheck){
                $('.finish_task').prepend(tag);
            }else {
                $('.task').prepend(tag);
            }
        }
    }
    /*tab切换*/
    $('.header li').click(function(){
        $(this).addClass('curr').siblings().removeClass('curr');
        var index = $(this).index();
        $('.body').eq(index).addClass('active').siblings().removeClass('active');
    })
    /*点击删除按钮删除对应的li*/
    $('body').on('click','.del',function(){
        var item = $(this).parent();
        var index = item.data('index');
        if (index == undefined || !itemArray[index])return;
        delete itemArray[index];
        item.slideUp(200,function(){
            item.remove();
        })
        store.set('itemArray',itemArray);
    })
    /*点击待办事项,让其变成完成事项*/
    $('body').on('click','input[type=checkbox]',function(){
        var item = $(this).parent();
        var index = item.data('index');
        if (index == undefined || !itemArray[index])return;
        var obj = itemArray[index];
        obj.isCheck = $(this).is(':checked');
        itemArray[index] = obj;
        render_view();
    })
    /*点击详情按钮的处理*/
    var cur_index = 0;
    $('body').on('click','.detail',function(){
        $('.mask').fadeIn();
        var item = $(this).parent();
        var index = item.data('index');
        cur_index = index;
        var obj = itemArray[index];
        $('.detail_header .title').text(obj.title);
        $('.detail_body textarea').val(obj.content);
        $('.detail_body input[type=text]').val(obj.remind_time);
    })
    /*点击mask等的处理*/
    $('.mask').click(function(){
        $(this).fadeOut();
    })
    $('.close').click(function(){
        $('.mask').fadeOut();
    })
    $('.detail_content').on('click',function(event){
        event.stopPropagation();
    })
    $.datetimepicker.setLocale('ch');
    $('#date_time').datetimepicker();
    /*点击更新相关处理*/
    $('.detail_body button').click(function(){
        var item = itemArray[cur_index]
        item.title = $('.detail_body textarea').val();
        item.remind_time = $('.detail_body input[type=text]').val();
        item.is_notice = false;
        itemArray[cur_index] = item;
        store.set('itemArray',itemArray);
        render_view();
        $('.mask').fadeOut();
    })
    /*设置提醒设置*/
    setInterval(function(){
        var cur_time = (new Date()).getTime();
        for(var i = 0;i < itemArray.length;i++){
            var item = itemArray[i];
            if(item == undefined ||!item ||item.remind_time.length<1||item.is_notice){continue};
            var rem_time = (new Date(item.remind_time)).getTime();
            if (cur_time - rem_time>1){
                $('video').get(0).play();
                $('video').get(0).currentTime = 0;
                item.is_notice = true;
                itemArray[i] = item;
                store.set('itemArray',itemArray);
            }

        }
    },2000)
})