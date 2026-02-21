function GetCountryData(id) {
    debugger;
    $.ajax({
        url: '/Masters/GetCountrybyId/' + id,
        type: 'Get',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
            var obj = result;
            $('#vchCountryName').val(obj.vchCountryName);
            $('#vchAlphaCode2').val(obj.vchAlphaCode2);
            $('#vchAlphaCode3').val(obj.vchAlphaCode3);
            $('#vchUNCode').val(obj.vchUNCode);
            $('#intCountryId').val(obj.intCountryId);
            $('#enumIsActive').prop("checked", obj.enumIsActive);
            $('#btnSubmit').text('Update');
        },
        error: function () {
            alert("Somthing went wrong please try again");
        }
    });
}

function GetStateData(id) {
    $.ajax({
        url: '/Masters/GetStatebyId/' + id,
        type: 'Get',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
            var obj = result;
            $('#intStateId').val(obj.intStateId);
            $('#vchStateCode').val(obj.vchStateCode);
            $('#vchStateName').val(obj.vchStateName);
            $('#vchCountryName').val(obj.vchCountryName);
            $('#intCountryId').val(obj.intCountryId);
            $('#enumIsActive').prop("checked", obj.enumIsActive);
            $('#btnSubmit').text('Update');
        },
        error: function () {
            alert("Somthing went wrong please try again");
        }
    });
}

function GetDistrictData(id) {
    $.ajax({
        url: '/Masters/GetDistrictbyId/' + id,
        type: 'Get',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
            var obj = result;
            $('#intDistrictId').val(obj.intDistrictId);
            $('#vchDistrictName').val(obj.vchDistrictName);
            $('#vchStateName').val(obj.vchStateName);
            $('#intStateId').val(obj.intStateId);
            $('#vchCountryName').val(obj.vchCountryName);
            $('#intCountryId').val(obj.intCountryId);
            $('#enumIsActive').prop("checked", obj.enumIsActive);
            $('#btnSubmit').text('Update');
        },
        error: function () {
            alert("Somthing went wrong please try again");
        }
    });
}

function GetCityData(id) {
    $.ajax({
        url: '/Masters/GetCitybyId/' + id,
        type: 'Get',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
            var obj = result;
            $('#intCityId').val(obj.intCityId);
            $('#vchCityName').val(obj.vchCityName);
            $('#intDistrictId').val(obj.intDistrictId);
            $('#vchDistrictName').val(obj.vchDistrictName);
            $('#vchStateName').val(obj.vchStateName);
            $('#intStateId').val(obj.intStateId);
            $('#vchCountryName').val(obj.vchCountryName);
            $('#intCountryId').val(obj.intCountryId);
            $('#enumIsActive').prop("checked", obj.enumIsActive);
            $('#btnSubmit').text('Update');
        },
        error: function () {
            alert("Somthing went wrong please try again");
        }
    });
}