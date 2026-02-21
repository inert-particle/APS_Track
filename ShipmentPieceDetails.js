class ShipmentPieceDetails {
  constructor({
    intPiecesNo = 0,
    fltHeight = 0,
    fltWidth = 0,
    fltLength = 0,
    fltActualWeight = 0,
    fltVolumetricWeight = 0,
    fltChargeableWeight = 0
  } = {}) {
    this.intPiecesNo = intPiecesNo;
    this.fltHeight = fltHeight;
    this.fltWidth = fltWidth;
    this.fltLength = fltLength;
    this.fltActualWeight = fltActualWeight;
    this.fltVolumetricWeight = fltVolumetricWeight;
    this.fltChargeableWeight = fltChargeableWeight;
  }
}

module.exports = ShipmentPieceDetails;
