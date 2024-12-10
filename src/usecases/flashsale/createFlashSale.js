class CreateFlashSale {
  constructor(flashSaleRepository) {
    this.flashSaleRepository = flashSaleRepository;
  }

  async execute(flashSale) {
    return this.flashSaleRepository.create(flashSale);
  }
}

module.exports = CreateFlashSale;