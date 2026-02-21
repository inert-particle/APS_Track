const GetMovementTrack = async (objAwb) => {
    try {
        const response = await fetch(`/api/callAPI/${objAwb}`);
        const data = await response.json(); // ✅ call it
        if (data) {
            document.getElementById("sec-trackingDetails").removeAttribute("style")
            const shipment = data.shipment;
            const consignee = shipment.consignee;
            const consignor = shipment.consignor;
            if (consignee.vchPersonName !== '')
                document.getElementById("custInfo").removeAttribute("style");
            document.getElementById("consignor_vchPersonName").innerText = consignor.vchPersonName;
            document.getElementById("consignor_vchCountry").innerText = consignor.vchCountry;
            document.getElementById("consignor_vchState").innerText = consignor.vchState;
            document.getElementById("consignor_vchCity").innerText = consignor.vchCity;
            document.getElementById("dtShipDate").innerText = formatDate(shipment.dtShipDate);
            document.getElementById("consignee_vchPersonName").innerText = consignee.vchPersonName;
            document.getElementById("consignee_vchCountry").innerText = consignee.vchCountry;
            document.getElementById("consignee_vchState").innerText = consignee.vchState;
            document.getElementById("consignee_vchCity").innerText = consignee.vchCity;
            document.getElementById("dtDeliveryDate").innerText = formatDate(shipment.dtDeliveryDate);
            document.getElementById("vchAWBNumber").innerText = shipment.vchAWBNumber;
            document.getElementById("vchStatus").innerText = shipment.vchStatus;
            document.getElementById("vchForwardingNumber").innerText = shipment.vchForwardingNumber;
            document.getElementById("div_movement").innerHTML = data.movementLiteral;
        }

    } catch (error) {
        console.error(error);
    }
}

function CheckAWB() {
    if ($('#P_ShipmntId').val() == 0 || $('#P_ShipmntId').val() == null || $('#P_ShipmntId').val() == "") {
        alert("AWB Number is not correct.")
        return false;
    }
    else {
        $('#P_ShipmntId').val($('#P_ShipmntId').val());
    }
    return true;
}

const formatDate = (isoString) => {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");

    const month = date.toLocaleString("en-US", { month: "short" });

    return `${year}, ${day} ${month}`;
};

//GetMovementTrack("12631179307");