class createCart {
  constructor({ cartItemRepository }) {
    this.cartItemRepository = cartItemRepository;
  }

  async execute(cartId, itemId, qty) {
    return this.cartItemRepository.addCartItem(cartId, itemId, qty);
  }
}

module.exports = createCart;
  