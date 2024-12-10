class createCart {
  constructor({ cartRepository }) {
    this.cartRepository = cartRepository;
  }

  async execute(userId) {
    return this.cartRepository.createCart(userId);
  }
}

module.exports = createCart;