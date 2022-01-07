import { Item } from "../world/Item.js";
import { ItemFactory } from "../world/ItemFactory.js";

export class ItemLoader {

  async loadItems(uri, blocks) {
      let items = await this.loadJson(uri);
      let childs = "";

      let itemsObj = [];
      items.forEach(item => {
        if(item.block >= 0) {
          item.block = blocks.find(x => x.id == item.block);
        }
        itemsObj.push(new Item(item, item.stack));
        childs += '<div class="item tooltip" onclick="window.inventory.addToItems('+item.id+')"><img src="./common/items/'+item.preview+'"><span class="tooltiptext">'+item.name+'</span></div>'
      })
      ItemFactory.items = itemsObj;
      document.querySelector(".allItems").innerHTML = childs;
      return items;
  }

  loadImage(uri) {
      return new Promise((resolve, reject) => {
          let image = new Image();
          image.addEventListener('load', () => resolve(image));
          image.addEventListener('error', reject);
          image.src = uri;
      });
  }

  loadJson(uri) {
      return fetch(uri).then(response => response.json());
  }

}
