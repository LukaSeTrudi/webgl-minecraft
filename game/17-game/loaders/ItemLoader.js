export class ItemLoader {

  async loadItems(uri, blocks) {
      let items = await this.loadJson(uri);
      let childs = "";
      items.forEach(item => {
        // if(item.preview) {
        //   this.loadImage("/common/items/"+item.preview).then((x) => item.preview = x);
        // }
        if(item.block >= 0) {
          item.block = blocks.find(x => x.id == item.block);
        }
        childs += '<div class="item"><img src="./common/items/'+item.preview+'"></div>'
      })
      console.log(childs);
      document.querySelector(".items").innerHTML = childs;
      console.log(items);
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
