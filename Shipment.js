const AddressInfo = require('./AddressInfo');
const ShipmentPieceDetails = require('./ShipmentPieceDetails');

class Shipment {
  constructor({
    intShipmentId = -1,
    vchAWBNumber = "",
    intClientId = 0,
    vchShipmentType = "",
    serviceType = "",
    vchForwardingNumber = "",
    email = "",
    contact = "",
    isCSBVShipment = "",
    isCommercial = "",
    consignor = null,
    consignee = null,
    vchStatus = "",
    enumIsPickupRequested = false,
    vchVendor = "",
    intPieces = -1,
    fltActualWgt = 0,
    fltVolWgt = 0,
    fltChargeWgt = 0,
    fltVendorWgt = 0,
    vchWeightIn = "",
    dtBookingDate = null,
    dtShipDate = null,
    dtDeliveryDate = null,
    remarks = "",
    invoice = null,
    enumIsActive = true,
    intCreatedby = -1,
    vchIPAddress = "",
    dtCreatedDate = null,
    vchCreatedby = "",
    Piece = [], // array of ShipmentPieceDetails
    error = false
  } = {}) {
    this.intShipmentId = intShipmentId;
    this.vchAWBNumber = vchAWBNumber;
    this.intClientId = intClientId;
    this.vchShipmentType = vchShipmentType;
    this.serviceType = serviceType;
    this.vchForwardingNumber = vchForwardingNumber;
    this.email = email;
    this.contact = contact;
    this.isCSBVShipment = isCSBVShipment;
    this.isCommercial = isCommercial;
    this.consignor = consignor instanceof AddressInfo ? consignor : new AddressInfo(consignor || {});
    this.consignee = consignee instanceof AddressInfo ? consignee : new AddressInfo(consignee || {});
    this.vchStatus = vchStatus;
    this.enumIsPickupRequested = enumIsPickupRequested;
    this.vchVendor = vchVendor;
    this.intPieces = intPieces;
    this.fltActualWgt = fltActualWgt;
    this.fltVolWgt = fltVolWgt;
    this.fltChargeWgt = fltChargeWgt;
    this.fltVendorWgt = fltVendorWgt;
    this.vchWeightIn = vchWeightIn;
    this.dtBookingDate = dtBookingDate;
    this.dtShipDate = dtShipDate;
    this.dtDeliveryDate = dtDeliveryDate;
    this.remarks = remarks;
    this.invoice = invoice;
    this.enumIsActive = enumIsActive;
    this.intCreatedby = intCreatedby;
    this.vchIPAddress = vchIPAddress;
    this.dtCreatedDate = dtCreatedDate;
    this.vchCreatedby = vchCreatedby;
    // Ensure each piece is ShipmentPieceDetails instance
    this.Piece = Piece.map(p => (p instanceof ShipmentPieceDetails ? p : new ShipmentPieceDetails(p)));
    this.error = error;
  }

  // Method to return JSON-friendly object
  toJSON() {
    return {
      ...this,
      consignor: this.consignor,
      consignee: this.consignee,
      Piece: this.Piece
    };
  }
}

module.exports = Shipment;
