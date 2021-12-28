export class Inventory {
  
  constructor() {
    this.otherItems = new Array(27).fill(null);
    this.selectionItems = new Array(9).fill(null);
    this.selectedIndex = 0;
    this.openedInventory = false;
    this.changeSelectedIndex(0);
  }

  getSelectedItem() {

  }

  changeSelectedIndex(ind) {
    let elements = document.getElementsByClassName('selected');
    while(elements.length > 0) {
      elements[0].classList.remove('selected');
    }
    this.selectedIndex = ind;
    document.querySelector('.selectionItem'+ind).classList.add('selected');
  }

  toggleInventory() {
    if(this.openedInventory) {
      document.querySelector('.overlay').classList.add('hidden');
      document.querySelector("canvas").requestPointerLock();
    } else {
      document.querySelector('.overlay').classList.remove('hidden');
      document.exitPointerLock();
    }
    this.openedInventory = !this.openedInventory;
  }



}