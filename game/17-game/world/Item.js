export class Item {
  constructor(_item, _quantity = 0) {
    this.item = { ..._item };
    this.quantity = _quantity;
  }

  clone() {
    return { ...this };
  }
}
