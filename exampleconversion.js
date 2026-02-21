const Shipment = require('./Shipment');
const AddressInfo = require('./AddressInfo');
const ShipmentPieceDetails = require('./ShipmentPieceDetails');
const KYCDetails = require('./KYCDetails');

const shipment = new Shipment({
  intShipmentId: 101,
  vchAWBNumber: "AWB12345",
  consignor: new AddressInfo({
    vchPersonName: "John Doe",
    vchAddressLine1: "123 Street",
    info_KYC: [new KYCDetails({ vchDocType: "Passport", vchDocNumber: "A123456" })]
  }),
  consignee: new AddressInfo({
    vchPersonName: "Alice Smith",
    vchAddressLine1: "456 Avenue"
  }),
  Piece: [
    new ShipmentPieceDetails({ intPiecesNo: 1, fltActualWeight: 2 }),
    new ShipmentPieceDetails({ intPiecesNo: 2, fltActualWeight: 5 })
  ]
});

console.log(JSON.stringify(shipment, null, 2));
