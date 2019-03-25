var separatorAdded = false;
//var start, end, pagesCutOff = 5;

function getPagelist(total, page, pagesize, maxvisible) {
    var totalPage = (total + pagesize - 1) / pagesize;

    $('#TotalPage').val(totalPage);

    $('#pagination').empty();

    var strAppendData = '';
    strAppendData += '<li><a href="javascript:previous();">&laquo;</a></li>';
    for (i = 1; i <= totalPage; i++) {
        if (i == page) {
            strAppendData += '<li data-val=' + i + '  class ="active"><a href="javascript:go_to_page(' + (i) + ')">' + i + '</a></li>';
        } else {
            if (isPageInRange(page, i, totalPage, 2, 2, maxvisible)) {
                strAppendData += '<li data-val=' + i + '><a  href="javascript:go_to_page(' + (i) + ')">' + i + '</a></li>';
                separatorAdded = false;
            } else {
                if (!separatorAdded) {
                    strAppendData += '<li class="disabled" ><a  href="javascript:void(0)">...</a></li>';
                    separatorAdded = true;
                }
            }
        }
    }
    strAppendData += '<li><a href="javascript:next();">&raquo;</a></li>';

    $('#pagination').append(strAppendData);

    var htm_ = "[ " + page + " Of " + Math.floor(totalPage) + " Page ]";
    $('#show_paginator').append(htm_);


}

function isPageInRange(curPage, index, maxPages, pageBefore, pageAfter, maxvisible) {
    if (index <= 2) {
        return true;
    }
    if (index >= maxPages - 2) {
        return true;
    }
    if (index >= curPage - pageBefore && index <= curPage + pageAfter) {
        return true;
    }
}

function previous() {

    new_page = parseInt($('#CurrentPage').val()) - 1;
    //if there is an item before the current active link run the function
    if ((new_page - 1) >= 0) {
        go_to_page(new_page - 1);
    }

}

function next() {
    new_page = parseInt($('#CurrentPage').val()) + 1;
    var maxpage = parseInt($('#TotalPage').val());
    //if there is an item after the current active link run the function
    if (new_page <= maxpage) {
        go_to_page(new_page - 1);
    }
}