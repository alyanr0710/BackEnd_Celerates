class createAddress {
  constructor( addresRepository ) {
    this.addresRepository = addresRepository;
  }

  async execute(data) {
    return this.addresRepository.createAddress(data);
  }
}

module.exports = createAddress;