let list = ["Bubble Wrap",
"Corrugated fiber board",
"Jute bags",
"Packing peanuts",
"Paper Packing",
"Wooden Crates",
"Foam",
"Plastic Pallet",
"Rigid boxes",
"Plastic boxes"];

//let input = document.getElementById("txtPackaging");

//input.addEventListener("keyup", (e) => {
//    removeElements();
//    for(let i of list){
        
//        if(i.toLowerCase().startsWith(input.value.toLowerCase()) && input.value != ""){
//            let listitem = document.createElement("li");
//            listitem.classList.add("list-item");
//            listitem.style.cursor="pointer";
//            listitem.setAttribute("onclick", "displayNames('" + i + "')");

//            let word = "<b>" + i.substring(0,input.value.length) + "</b>";

//            word += i.substring(input.value.length);
//            listitem.innerHTML = word;
//            document.querySelector(".packaging-list").appendChild(listitem);
//        }
//    }
//});

//function displayNames(value) {
//    input.value = value;
//    removeElements();
//}

//function removeElements() {
//    let items = document.querySelectorAll(".list-item");
//    items.forEach((item) => {
//        item.remove();
//    });
//}

//function AutoComplete(ID) {
//    $("#" + ID).autocomplete({
//        // autoFocus: true,
//        minLength: 1,
//        source: list,
//        messages: {
//            noResults: '',
//            results: function (resultsCount) { }
//        }
//    });
//}

function PostQuoteRequest() {
    var formdata = new Object();
    formdata.vchName = $('#txtName').val();
    formdata.vchEmail = $('#txtEmail').val();
    formdata.vchPhone = $('#txtPhone').val();
    formdata.vchPackageType = $('#txtPackaging').val();
    formdata.vchWeight = $('#txtWeight').val();
    formdata.vchOrgCity = $('#txtCityFrom').val();
    formdata.vchDestCity = $('#txtCityTo').val();
    formdata.vchWidth = $('#txtWidth').val();
    formdata.vchLength = $('#txtLength').val();
    formdata.vchHeight = $('#txtHeight').val();
    formdata.vchMessage = $('#txtMessage').val();

    if ($('#txtName').val().trim() == "" || $('#txtEmail').val().trim() == "" || $('#txtPhone').val().trim() == "") {
        var Msg = "";
        if ($('#txtName').val().trim() == "") {
            Msg += "\n Name";
        }
        if ($('#txtEmail').val().trim() == "") {
            Msg += "\n Email";
        }
        if ($('#txtPhone').val().trim() == "") {
            Msg += "\n Phone";
        }
        alert("Mandatory fields:" + Msg);
    }
    else {
        $.ajax({
            url: '/Home/Contact',
            type: 'Post',
            data: formdata,
            //dataType: 'json',
            //contentType: 'application/json;charset=utf-8;',
            success: function (result, status, xhr) {
                var obj = result;
                alert("Thanks for contacting us, we will get back to you soon.");
                window.location.reload();
            },
            error: function () {
                alert("Somthing went wrong please try again");
                window.location.reload();
            }
        });
    }
}
