class updateAddress {
  constructor( addresRepository ) {
    this.addresRepository = addresRepository;
  }

  async execute(data) {
    return this.addresRepository.updateAddress(data);
  }
}

module.exports = updateAddress;
  
  