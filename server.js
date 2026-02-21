const express = require("express");
const fs = require("fs").promises;
// const cors = require('cors');
// const axios = require('axios');
const Shipment = require('./Shipment');
const AddressInfo = require('./AddressInfo');
const ShipmentPieceDetails = require('./ShipmentPieceDetails');
const KYCDetails = require('./KYCDetails');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static("public"));


async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const json = JSON.parse(data);
        return json;
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}

async function flightGo(id) {
    if (!id) {
        throw new Error('ID is required');
    }
    const apiLinks = await readJSONFile("apiLinks.json");
    const flightGoUrl = (apiLinks.flightGo).replace("$customer_code$", id.substring(0, 4)).replace("$tracking_no$", id)
    const res = await fetch(flightGoUrl);

    if (!res.ok) {
        throw new Error(`External API failed with status ${res.status}`);
    }

    const ndata = await res.json();
    const data = ndata[0];
    const docket_info = data?.docket_info;
    const shipment = new Shipment({
        error: !!data?.errors ?? null,
        vchAWBNumber: data?.tracking_no ?? null,
        fltChargeWgt: data?.chargeable_weight ?? null,
        vchForwardingNumber: data?.forwarding_no ?? null,
        intPieces: data?.pcs ?? null,
        dtBookingDate: myDate(flightGoDocketinfo(docket_info, "Booking Date")),
        vchStatus: flightGoDocketinfo(docket_info, "Status"),
        dtDeliveryDate: myDate(flightGoDocketinfo(data?.docket_info, "Delivery Date and Time")),
        serviceType: flightGoDocketinfo(data?.docket_info, "Service Name"),
        dtShipDate: myDate(data?.inscan_date[0] ?? null),
        consignor: new AddressInfo({
            vchPersonName: flightGoDocketinfo(docket_info, "Shipper Name"),
            vchCity: flightGoDocketinfo(docket_info, "Shipper City"),
            vchState: flightGoDocketinfo(docket_info, "Shipper State"),
            vchCountry: flightGoDocketinfo(docket_info, "Shipper Country"),
            vchCompanyName: flightGoDocketinfo(docket_info, "Shipper Company")
        }),
        consignee: new AddressInfo({
            vchPersonName: flightGoDocketinfo(docket_info, "Consignee Name"),
            vchCity: flightGoDocketinfo(docket_info, "Consignee City"),
            vchState: flightGoDocketinfo(docket_info, "Consignee State"),
            vchCountry: flightGoDocketinfo(docket_info, "Consignee Country"),
            vchCompanyName: flightGoDocketinfo(docket_info, "Consignee Company")
        }),
    });

    const movementDetails = data?.docket_events;
    movementDetails.forEach(movementDetail => {
        const movement = new Movement({
            dtMovementDate: myDate(movementDetail?.event_at),
            vchStatusDesc: movementDetail?.event_description,
            vchLocation: movementDetail?.event_location,
            vchStatus: movementDetail?.event_state
        });
        movements.push(movement);
    });

    const movementLiteral = movementHTML(movements);

    const response = {
        shipment,
        movementLiteral
    };

    return await response;
}

async function skyNet(id) {
    if (!id) {
        throw new Error('ID is required');
    }
    const skynetString = await readJSONFile("skynet.json");
    skynetString.ShipmentOrderID = id;
    const apiLinks = await readJSONFile("apiLinks.json");
    const res = await fetch(apiLinks.skyNet, {
        method: 'POST',                  // POST request
        headers: {
            'Content-Type': 'application/json' // tell server it's JSON
        }, body: JSON.stringify(skynetString)
    });
    const data = await res.json();
    const shipmentDetailsToken = data?.ShipmentDetails?.[0] ?? null;
    const StatusDetailsToken = data?.StatusDetails?.[0] ?? null;
    const shipment = new Shipment({
        vchAWBNumber: shipmentDetailsToken?.AirwayBillNo ?? null,
        dtBookingDate: myDate(shipmentDetailsToken?.AwbDate),
        dtShipDate: myDate(shipmentDetailsToken?.AwbDate),
        vchForwardingNumber: shipmentDetailsToken?.ForwarderNo ?? null,
        fltChargeWgt: shipmentDetailsToken?.Weight ?? null,
        dtDeliveryDate: myDate(shipmentDetailsToken?.DeliveryDate),
        vchStatus: shipmentDetailsToken?.Status ?? null
    });

    const movementDetails = data?.ShipmentHistory;
    movementDetails.forEach(movementDetail => {
        const movement = new Movement({
            dtMovementDate: myDate(movementDetail?.Date + " " + ((movementDetail?.Time.match(/:/g) || []).length == 1 ? movementDetail?.Time + ":00" : movementDetail?.Time)),
            vchStatusDesc: movementDetail?.ShipmentDetails,
            vchLocation: movementDetail?.Location,
            vchStatus: movementDetail?.ShipmentStatus
        });
        movements.push(movement);
    });

    const movementLiteral = movementHTML(movements);

    const response = {
        shipment,
        movementLiteral
    };

    if (!res.ok) {
        throw new Error(`External API failed with status ${res.status}`);
    }

    return await response;
}


app.get('/api/callAPI/:id', async (req, res) => {
    try {
        const awb = req.params.id;
        const flightGoCodes = await readJSONFile('flightGo.json');

        if (flightGoCodes.includes(awb.substring(0, 4).toUpperCase())) {
            const data = await flightGo(awb);
            res.json(data);
        }
        else {
            const data = await skyNet(awb);
            res.json(data);
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

function formatDate(date) {
    const d = new Date(date);

    if (isNaN(d)) return null;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
}

function formatDateWithSuffix(date) {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d)) return "";

    // Month abbreviation
    const month = d.toLocaleString("en-US", { month: "short" });

    // Day with leading zero
    const day = String(d.getDate()).padStart(2, "0");

    // Determine ordinal suffix
    let suffix = "th";
    if (!(day.endsWith("11") || day.endsWith("12") || day.endsWith("13"))) {
        const lastDigit = day.slice(-1);
        if (lastDigit === "1") suffix = "st";
        else if (lastDigit === "2") suffix = "nd";
        else if (lastDigit === "3") suffix = "rd";
    }

    return `${month}, ${day}<sup>${suffix}</sup>`;
}

const movementHTML = (movements) => {
    const sbhtml = [];
    const dates = [
        ...new Set(
            movements
                .map(m => formatDate(m?.dtMovementDate))
                .filter(Boolean) // removes null values
        )
    ];
    let lastDate = "";
    let stCount = 0;
    dates.forEach(date => {
        if (lastDate != date && lastDate != "") {
            sbhtml.push("<div class=\"st-blank\"></div>");
        }

        const filteredMovements = movements
            .map(m => ({
                vchLocation: m.vchLocation,
                vchMovementTime: m.vchMovementTime,
                vchStatus: m.vchStatus,
                vchStatusDesc: m.vchStatusDesc,
                dtMovementDate: m.dtMovementDate
            }))
            .filter(m => formatDate(m.dtMovementDate) === date);

        filteredMovements.forEach(m => {
            if (lastDate != date)
                stCount = 1;

            sbhtml.push("<div class=\"st-details " + (stCount % 2 == 0 ? "st-even" : "st-odd") + " " + (m.vchLocation == "" ? "st-no-loc" : "") + "\">");
            sbhtml.push("<div class=\"rb-date-time\">");
            sbhtml.push("<div>");
            sbhtml.push("<div>");
            if (lastDate != date)
                sbhtml.push("<span>" + formatDateWithSuffix(m.dtMovementDate) + "</span>");
            else
                sbhtml.push("<span>&nbsp;</span>");
            sbhtml.push("</div>");
            sbhtml.push("</div>");
            sbhtml.push("</div>");
            sbhtml.push("<div class=\"status-container\">");
            sbhtml.push("<div class=\"status-card\">");
            sbhtml.push("<div class=\"status\">");
            sbhtml.push(m.vchStatus.toUpperCase().replace(/_/g, ' '));
            sbhtml.push("</div>");
            sbhtml.push("<div class=\"desc\">");
            sbhtml.push(m.vchStatusDesc);
            sbhtml.push("</div>");
            if (m.vchLocation != "") {
                sbhtml.push("<div style=\"line-height: 10px;\">&nbsp;</div>");
                sbhtml.push("<div class=\"loc\">" + m.vchLocation + "</div>");
            }
            sbhtml.push("</div>");
            sbhtml.push("</div>");
            sbhtml.push("<div class=\"rb-date-time\">");
            sbhtml.push("<div>");
            sbhtml.push("<div>");
            const time = (new Date(m.dtMovementDate)).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
            sbhtml.push("<span>" + time + "</span>");
            sbhtml.push("</div>");
            sbhtml.push("</div>");
            sbhtml.push("</div>");
            sbhtml.push("</div>");
            lastDate = date;
            stCount++;
        });
    });
    return sbhtml.join("");
}

const myDate = (dateStr, timeStr) => {
    if (!dateStr || dateStr.trim() === "") return null;

    let date;

    // Handle ISO-like input: "YYYY-MM-DD" or "YYYY-MM-DD HH:mm:ss"
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}:\d{2}:\d{2}))?/);
    if (isoMatch) {
        const [year, month, day, timePart] = isoMatch.slice(1);
        date = new Date(timePart ? `${year}-${month}-${day}T${timePart}` : `${year}-${month}-${day}T00:00:00`);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().slice(0, 19);
    }

    // Handle "DD-MMM-YYYY" or "DD-MMM-YYYY HH:mm:ss"
    const dmyMatch = dateStr.match(/^(\d{1,2})-([a-zA-Z]{3})-(\d{4})(?:\s+(\d{2}:\d{2}:\d{2}))?/);
    if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const monthStr = dmyMatch[2].toLowerCase();
        const year = parseInt(dmyMatch[3], 10);
        const timePart = dmyMatch[4] || "00:00:00";

        const months = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };
        const month = months[monthStr];
        if (month === undefined) return null;

        date = new Date(year, month, day);
        // Apply time if provided
        const [hh, mm, ss] = timePart.split(":").map(Number);
        date.setHours(hh, mm, ss);

        return date.toISOString().slice(0, 19);
    }

    return null; // could not parse
};

const flightGoDocketinfo = (docket_info, item) => {
    return docket_info.find(innerArray => innerArray.includes(item))[1];
}

class Movement {
    constructor({
        intMovementId = null,
        intShipmentId,
        vchAWBNumber,
        vchStatus,
        dtMovementDate = null,
        vchMovementTime = null,
        vchStatusDesc,
        vchLocation,
        intCreatedby,
        vchIPAddress = null
    }) {
        this.intMovementId = intMovementId;
        this.intShipmentId = intShipmentId;
        this.vchAWBNumber = vchAWBNumber;
        this.vchStatus = vchStatus;
        this.dtMovementDate = dtMovementDate;
        this.vchMovementTime = vchMovementTime;
        this.vchStatusDesc = vchStatusDesc;
        this.vchLocation = vchLocation;
        this.intCreatedby = intCreatedby;
        this.vchIPAddress = vchIPAddress;
    }
}

const movements = [];


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
