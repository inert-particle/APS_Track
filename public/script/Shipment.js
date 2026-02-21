function GenerateRows(noofPieces, element, listId) {
    var table = document.getElementById(element);
    var noofRows = table.children[1].rows.length;
    if (noofPieces > noofRows)
    {
        var htmlstring = "";
        for (var i = noofRows; i < noofPieces; i++) {
            htmlstring = htmlstring + "<tr>" + table.children[1].firstElementChild.innerHTML.replaceAll("value=\"1\"", "value=\"" + (i + 1) + "\"").replaceAll(listId + "_0", listId + "_" + i).replaceAll(listId + "[0]", listId + "[" + i + "]") + "</tr>";
        }
        table.children[1].insertAdjacentHTML("beforeend", htmlstring);
    }
    else if (noofPieces < noofRows)
    {
        for (var i = noofRows - 1; i >= noofPieces; i--)
        {
            table.children[1].deleteRow(i);
        }  
    }
}

function AppendValues(from, to) {
    if ($('#' + from)[0].type == "file") {
        $('#' + to)[0].files = ($('#' + from)[0].files);
    }
    else {
    $('#' + to)[0].value = ($('#' + from)[0].value);
    }
    var label = $('label[for="' + to + '"]');
    label.text($('#' + from)[0].value);
    if ($('#' + from)[0].type == 'select-one') {
        $('#' + from)[0].selectedIndex = 0;
    } else {
        $('#' + from)[0].value = null;
    }
}

function CreateRows(tr, count) {
    var tds = tr.children;
    for (var i = 0; i < tds.length; i++) {
        var td_childs = tds[i].children;
        for (var j = 0; j < td_childs.length; j++) {
            if (td_childs[j].tagName == "INPUT") {
                tr.children[i].children[j].id = td_childs[j].id.replaceAll('_0', '_' + (parseFloat(count) + 1));
                tr.children[i].children[j].name = td_childs[j].name.replaceAll('[0]', '[' + (parseFloat(count) + 1) + ']');
            }
            else if (td_childs[j].tagName == "LABEL") {
                tr.children[i].children[j].setAttribute('for', td_childs[j].getAttribute('for').replaceAll('_0', '_' + (parseFloat(count) + 1)));
            }
            else if (td_childs[j].tagName == "P") {
                tr.children[i].children[j].innerHTML=(parseFloat(count) + 1);
            }
        }
    }
    return tr;
}

function AddKycItems(forname) {
    var listId = document.getElementById('rel_kyc_' + forname).value;
    var table = document.getElementById('kyc_details_' + forname);
    var count = document.getElementById('count_kyc_' + forname).value;
    var childtr = table.getElementsByTagName('tr');
    if (parseFloat(count) <= 0) {
        childtr[1].setAttribute('style', 'display:none;');
    }

    AppendValues('count_kyc_' + forname, forname.toLowerCase() + '_info_KYC_' + listId + '__kycDetailsId_r');
    AppendValues('docType_' + forname, forname.toLowerCase() + '_info_KYC_' + listId + '__vchDocType');
    AppendValues('docName_' + forname, forname.toLowerCase() + '_info_KYC_' + listId + '__vchDocName');
    AppendValues('docNumber_' + forname, forname.toLowerCase() + '_info_KYC_' + listId + '__vchDocNumber');

    if (listId == 0) {
        var newtr = CreateRows(table.getElementsByTagName("tr")[2].cloneNode(true), count);
        
        document.getElementById('count_kyc_' + forname).value = parseFloat(count) + 1;
        //table.children[1].appendChild = newtr.setAttribute('style', 'display:block;');
        table.children[1].insertAdjacentHTML("beforeend", '<tr style="display:table-row;">' + newtr.innerHTML + '</tr>');
        //AppendValues(forname.toLowerCase() + '_info_KYC_0__doc', forname.toLowerCase() + '_info_KYC_' + parseFloat(count) + 1 + '__doc');
        AppendValues('docFile_' + forname, forname.toLowerCase() + '_info_KYC_' + (document.getElementById('count_kyc_' + forname).value) + '__doc_r');

    }
}

function AddPackets() {
    var listId = document.getElementById('rel_pkt').value;
    var table = document.getElementById('pkt_details');
    var count = document.getElementById('count_pkt').value;
    var childtr = table.getElementsByTagName('tr');
    if (parseFloat(count) <= 0) {
        childtr[2].setAttribute('style', 'display:none;');
    }

    document.getElementById('Piece_' + listId + '__intPiecesNo').value = count;
    AppendValues('length','Piece_' + listId + '__fltLength');
    AppendValues('breadth','Piece_' + listId + '__fltWidth');
    AppendValues('height','Piece_' + listId + '__fltHeight');
    AppendValues('a_weight','Piece_' + listId + '__fltActualWeight');
    AppendValues('v_weight','Piece_' + listId + '__fltVolumetricWeight');
    AppendValues('c_weight','Piece_' + listId + '__fltChargeableWeight');

    if (listId == 0) {
        var newtr = CreateRows(table.getElementsByTagName("tr")[3].cloneNode(true), count);

        document.getElementById('count_pkt').value = parseFloat(count) + 1;
        //table.children[1].appendChild = newtr.setAttribute('style', 'display:block;');
        table.children[1].insertAdjacentHTML("beforeend", '<tr style="display:table-row;">' + newtr.innerHTML + '</tr>');
    }

    let total_volWeight = 0;
    let total_actualWeight = 0;
    for (var i = parseFloat(count) + 1; i > 0; i--) {
        total_volWeight = total_volWeight + parseFloat(document.getElementById('Piece_' + i + '__fltVolumetricWeight').value);
        total_actualWeight = total_actualWeight + parseFloat(document.getElementById('Piece_' + i + '__fltActualWeight').value);
    }
    document.getElementById('fltActualWgt').value = total_actualWeight;
    document.getElementById('fltVolWgt').value = total_volWeight;
    document.getElementById('intPieces').value = parseFloat(count) + 1;
}

function AddInvoice() {
    var listId = document.getElementById('rel_inv').value;
    var table = document.getElementById('inv_details');
    var count = document.getElementById('count_inv').value;
    var childtr = table.getElementsByTagName('tr');
    if (parseFloat(count) <= 0) {
        childtr[1].setAttribute('style', 'display:none;');
    }

    AppendValues('count_inv', 'invoice_details_' + listId + '__id');
    AppendValues('count_inv', 'invoice_details_' + listId + '__srNo');
    AppendValues('inv_pkt', 'invoice_details_' + listId + '__boxNo');
    AppendValues('hsn', 'invoice_details_' + listId + '__hsCode');
    AppendValues('desc', 'invoice_details_' + listId + '__description');
    $('label[for="invoice_details_' + listId + '__description"]').text('(' + $('#invoice_details_' + listId + '__hsCode')[0].value + ') ' + $('#invoice_details_' + listId + '__description')[0].value);
    AppendValues('unit', 'invoice_details_' + listId + '__unitType');
    AppendValues('weight', 'invoice_details_' + listId + '__unitWeight');
    AppendValues('rate', 'invoice_details_' + listId + '__unitPrice');
    AppendValues('quantity', 'invoice_details_' + listId + '__quantity');
    AppendValues('igst', 'invoice_details_' + listId + '__iGST');
    AppendValues('amount', 'invoice_details_' + listId + '__amount');

    if (listId == 0) {
        var newtr = CreateRows(table.getElementsByTagName("tr")[2].cloneNode(true), count);

        document.getElementById('count_inv').value = parseFloat(count) + 1;
        //table.children[1].appendChild = newtr.setAttribute('style', 'display:block;');
        table.children[1].insertAdjacentHTML("beforeend", '<tr style="display:table-row;">' + newtr.innerHTML + '</tr>');
    }
}

$(".undefined_a").click(function () {
    var ele = $(".undefined_a");
    var index = ele.index(this);
    var element = ele[index].parentElement.children[0].value;
    var listId = ele[index].parentElement.children[0].value;
    var count = document.getElementById(element).children[1].rows.length + 1;
    GenerateRows(count, element, listId);
});

$(document).ready(function () {
    var tbl = document.getElementsByClassName("undefined");
    var hdn = document.getElementsByClassName("undefined_hdn");
    var tagId = $(".undefined tr:first-child td:first-child input");

    for (var i = 0; i < tbl.length; i++) {
        tbl[i].id = tagId[i].id.substring(0, tagId[i].id.indexOf("_"));
        hdn[i].id = tagId[i].id.substring(0, tagId[i].id.indexOf("_")) + "_hdn";
        hdn[i].value=tagId[i].id.substring(0, tagId[i].id.indexOf("_"));
    }
});

function CalculateV_Weight() {
    let a_weight = parseFloat(document.getElementById('a_weight').value)
    let length = parseFloat(document.getElementById('length').value);
    let breadth = parseFloat(document.getElementById('breadth').value);
    let height = parseFloat(document.getElementById('height').value);
    let v_weight = parseFloat((length == null || length == "" ? 0 : length) * (breadth == null || breadth == "" ? 0 : breadth) * (height == null || height == "" ? 0 : height)) / parseFloat(5000);
    if (isNaN(length) || isNaN(breadth) || isNaN(height) || $('#vchShipmentType')[0].value == "DOCX") {
        document.getElementById('v_weight').value = a_weight;
        document.getElementById('c_weight').value = a_weight;
    } else {
        document.getElementById('v_weight').value = v_weight.toFixed(3);
        document.getElementById('c_weight').value = ((a_weight == null || a_weight == "" ? 0 : a_weight) > v_weight ? (a_weight == null || a_weight == "" ? 0 : a_weight) : v_weight).toFixed(3);
    }
}

function Inv_items_Amount() {
    let quantity = parseFloat(document.getElementById('quantity').value)
    let rate = parseFloat(document.getElementById('rate').value);
    let amount = parseFloat((quantity == null || quantity == "" ? 0 : quantity) * (rate == null || rate == "" ? 0 : rate));
    if (quantity == null || quantity == "") {
        document.getElementById('amount').value = rate.toFixed(2);
    }
    else if (rate == null || rate == "") {
        document.getElementById('amount').value = quantity.toFixed(2);
    }
    else {
        document.getElementById('amount').value = amount.toFixed(2);
    }
}

const consignor_ContactNumber = 'consignor_vchContactNumber';

function getTelInput(e) {
    return e.id == consignor_ContactNumber;
}

function ChangeTelCode(e) {
    const input = $('#' + e.id.split('_')[0] + '_vchContactNumber')[0];
    for (var i = 0; i < txtPhone.length; i++) {
        if (txtPhone[i].telInput.id == input.id) {
            txtPhone[i].setCountry(e.value.substring(0,2));
        }
    }
}

$('.file-anchor').click(function () {
    const _file = document.getElementById(this.previousElementSibling.getAttribute('for')).files;
    if (_file != null || _file == undefined) {
        document.getElementById('doc_frame').src = getBase64(_file);
    }
});

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        return reader.result;
    };
}

$('#vchShipmentType').blur(function () {
    if (this.value == 'DOCX') {
        $('#length')[0].value = '0';
        DisableElement($('#length')[0]);
        $('#breadth')[0].value = '0';
        DisableElement($('#breadth')[0]);
        $('#height')[0].value = '0';
        DisableElement($('#height')[0]);
    }
});