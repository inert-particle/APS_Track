class KYCDetails {
  constructor({
    kycDetailsId_r = 0,
    vchDocType = "",
    vchDocNumber = "",
    vchDocName = "",
    doc_r = null, // file buffer or path
    docPath = ""
  } = {}) {
    this.kycDetailsId_r = kycDetailsId_r;
    this.vchDocType = vchDocType;
    this.vchDocNumber = vchDocNumber;
    this.vchDocName = vchDocName;
    this.doc_r = doc_r;
    this.docPath = docPath;
  }
}

module.exports = KYCDetails;