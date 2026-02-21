function GetStyleofElementbyId(id) {
    var element = document.getElementById(id);
    if (element == undefined) {
        element = (document.getElementsByClassName(id))[0];
    }
    return getComputedStyle(element);
}

function fltElementPropertyVal(id, property) {
    var elem_style = GetStyleofElementbyId(id);
    var propertyVal = elem_style.getPropertyValue(property);
    return parseFloat(propertyVal.substring(0, propertyVal.length - 2));
}

function Hide_items_listed() {
    var itemsList = $(".menu .items-list");

    for (var counter = 0; counter < itemsList.length; counter++) {
        if (counter != 0)
            $(itemsList[counter]).slideUp();
    }
}

$("#nav_menuItems .item").click(function () {
    $.each($(this).parent().children(), function (i, item) {
        item.classList.remove("active");
    })
    $(this).addClass("active");
    ActiveAccordian();
});

function ActiveAccordian() {
    $.each($(".collapsable"), function (i, item) {
        if (item.classList.contains("active"))
            $(item.children[1]).slideDown();
        else
            $(item.children[1]).slideUp();
    })
}

$(document).ready(function () {
    var h_nav = fltElementPropertyVal("nav", "height");
    var h_navLogo = fltElementPropertyVal("navLogo", "height");
    var h_navProfile = fltElementPropertyVal("navProfile", "height");
    var h_menuSeprator = fltElementPropertyVal("menu-seperator", "height");
    var navPadding = fltElementPropertyVal("nav", "padding-top") + fltElementPropertyVal("nav", "padding-bottom");

    var nav_menuItems = document.getElementById("nav_menuItems");
    nav_menuItems.style.height = (h_nav - h_navLogo - h_navProfile - (2 * h_menuSeprator) - navPadding) + "px";

    var main_sec = document.getElementById("main");
    main_sec.style.width = (fltElementPropertyVal("body", "width") - fltElementPropertyVal("nav", "width")) + "px";

    var content_sec = document.getElementById("page-section");
    content_sec.style.height = (fltElementPropertyVal("main", "height") - fltElementPropertyVal("main_header", "height")) + "px";

    Hide_items_listed();
    SetInitialCountry();
});

$('.modal').click(function (event) {
    if (event.target == $(this)[0]) {
        $(this).removeClass('active');
    }
});

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function openModalFrame(modalId, src) {
    document.getElementById("doc_frame").src = src;
    var modal = document.getElementById(modalId);
    modal.classList.add('active');
}

$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        var modals = $('.modal');
        for (var m = 0; m < modals.length; m++) {
            if (modals[m].classList.contains('active')) {
                modals[m].classList.remove('active');
            }
        }

    }
});

function AutoComplete(ID, Type, contextKey, contextKey2) {
    $("#" + ID).autocomplete({
        // autoFocus: true,
        minLength: 1,
        source: function (request, response) {
            $.ajax({
                url: "/AutoComplete/Index",
                type: "POST",
                dataType: "json",
                data: {
                    strTerm: request.term
                    , strType: Type
                    , intCountryId: $("#" + contextKey) === undefined ? null : $("#" + contextKey).val()
                    , intStateId: $("#" + contextKey2) === undefined ? null : $("#" + contextKey2).val()
                },
                success: function (data) {
                    response(data);
                },
                error: function (xhr, err) {
                    var responseTitle = $(xhr.responseText).filter('title').get(0);
                    alert($(responseTitle).text() + "\n" + AjaxError(xhr, err));
                }
            });
        },
        messages: {
            noResults: '',
            results: function (resultsCount) { }
        }
    });
}

function GetId(txtElement, Type, hdnid) {
    $.ajax({
        url: "/AutoComplete/GetID",
        type: "POST",
        dataType: "json",
        data: {
            strTerm: txtElement.value
            , strType: Type
        },
        success: function (data) {
            var obj = data;
            $("#" + hdnid).val(obj[0]);
        },
        error: function () {
            if (txtElement.value != "") {
                txtElement.value = "";
                alert(txtElement.labels[0].innerHTML +" is not in correct format. Please try again.");
            }
        }
    });
}

function CheckSubmit() {
    var msg = "";
    var obj = document.getElementById("btnSubmit").form;
    for (let index = 0; index < obj.elements.length; index++) {
        if (obj.elements[index].classList.contains("required") && obj.elements[index].type == "text" && obj.elements[index].value == "") {
            msg += obj.elements[index].labels[0].innerHTML + "\n";
        }
    }

    if (msg != "") {
        alert(msg);
        for (let index = 0; index < obj.elements.length; index++) {
            if (obj.elements[index].classList.contains("required") && obj.elements[index].type == "text" && obj.elements[index].value == "") {
                obj.elements[index].focus();
                break;
            }
        }
        return false;
    }
    else {
        return true;
    }
}

function GetGrid(Id) {
    var formdata = new Object();
    if (Id == "btnRefresh") {
        $('#txtSearchFor').val("");
        $('#drpCriteria').val(0);
    }
    formdata.strSearchFor = $('#txtSearchFor').val().trim();
    formdata.intSearchCriteria = $('#drpCriteria').val();
    switch (Id) {
        case "btnFirst":
            formdata.CurrentPage = 1;
            break;
        case "btnPrevious":
            formdata.CurrentPage = $('#drpPage').val() == 1 ? $('#drpPage').val() : $('#drpPage').val() - 1;
            break;
        case "btnNext":
            formdata.CurrentPage = $('#drpPage').val() == $('#drpPage option:last-child').val() ? $('#drpPage').val() : $('#drpPage').val() + 1;
            break;
        case "btnLast":
            formdata.CurrentPage = $('#drpPage option:last-child').val();
            break;
        case "drpPage":
            formdata.CurrentPage = $('#drpPage').val();
            break;
        default:
            formdata.CurrentPage = 1;
            break;
    }
    formdata.PageSize = $('#drpPageSize').val() === undefined ? 30 : $('#drpPageSize').val();
    $.ajax({
        url: $('#hdnGridRoute').val(),
        type: 'Post',
        data: formdata,
        //dataType: 'json',
        //contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
            var obj = result;
            $('#div-Grid').html(obj);
            $('#drpPage').val(formdata.CurrentPage);
            $('#drpPageSize').val(formdata.PageSize);
        },
        error: function () {
            alert("Somthing went wrong please try again");
        }
    });
}

$(".allow-num-w-decimal").on("keypress keyup blur", function (event) {
    //this.value = this.value.replace(/[^0-9\.]/g,'');
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$(".allow-num").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$('.table-remove').click(function () {
    $(this).parents('tr').detach();
});

//$(".txt-Phone").intlTelInput({
//    initialCountry: "in",
//    showSelectedDialCode: true,
//    utilsScript: "../intl-tel-input/utils.js",
//});

const txtPhone = [];
function SetInitialCountry() {
    var input = $(".txt-Phone");
    input.each(function (i,e) {
        txtPhone.push(window.intlTelInput(e, {
            initialCountry: "in",
            //showSelectedDialCode: true,
            utilsScript: "../intl-tel-input/utils.js",
        }))
    });
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function ObjecttoUrl(fileid) {
    var _file = document.getElementById(fileid).files[0];
    var encodedString = Base64.getEncoder().encodeToString(_file);
    var arrrayBuffer = base64ToArrayBuffer(encodedString); //data is the base64 encoded string
    var blob = new Blob([arrrayBuffer], { type: "application/pdf" });
    var link = window.URL.createObjectURL(blob);
    return link;
}

function previewFile() {
    const preview = document.querySelector("img");
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            // convert image file to base64 string
            preview.src = reader.result;
        },
        false,
    );

    if (file) {
        reader.readAsDataURL(file);
    }
}

function DisableElement(obj) {
    obj.setAttribute('disabled', 'disabled');
    obj.classList.add('element-disabled');
}

function EnableElement(obj) {
    obj.removeAttribute('disabled');
    obj.classList.remove('element-disabled');
}