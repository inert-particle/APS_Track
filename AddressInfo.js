const KYCDetails = require('./KYCDetails');

class AddressInfo {
  constructor({
    intInfoId = 0,
    vchCode = "",
    vchPersonName = "",
    vchCompanyName = "",
    vchAddressLine1 = "",
    vchAddressLine2 = "",
    vchAddressLine3 = "",
    vchContactNumber = "",
    vchEmail = "",
    vchCountry = "",
    intCountryId = -1,
    vchState = "",
    intStateId = -1,
    vchDistrict = "",
    intDistrictId = -1,
    vchCity = "",
    intCityId = -1,
    vchPincode = "",
    vchZone = "",
    isActive = true,
    createdby = 0,
    ipAddress = "",
    info_KYC = [] // array of KYCDetails
  } = {}) {
    this.intInfoId = intInfoId;
    this.vchCode = vchCode;
    this.vchPersonName = vchPersonName;
    this.vchCompanyName = vchCompanyName;
    this.vchAddressLine1 = vchAddressLine1;
    this.vchAddressLine2 = vchAddressLine2;
    this.vchAddressLine3 = vchAddressLine3;
    this.vchContactNumber = vchContactNumber;
    this.vchEmail = vchEmail;
    this.vchCountry = vchCountry;
    this.intCountryId = intCountryId;
    this.vchState = vchState;
    this.intStateId = intStateId;
    this.vchDistrict = vchDistrict;
    this.intDistrictId = intDistrictId;
    this.vchCity = vchCity;
    this.intCityId = intCityId;
    this.vchPincode = vchPincode;
    this.vchZone = vchZone;
    this.isActive = isActive;
    this.createdby = createdby;
    this.ipAddress = ipAddress;
    // Ensure each item is a KYCDetails instance
    this.info_KYC = info_KYC.map(k => (k instanceof KYCDetails ? k : new KYCDetails(k)));
  }
}

module.exports = AddressInfo;
