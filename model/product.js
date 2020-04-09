
const product = {

    fakeDb : [],

    setFakeDb(){
        this.fakeDb.push({
            title : `Dell XPS13 Laptop, Intel Core I5-8265U, 256GB SSD, 8GB RAM`,
            price : `1349.99`,
            cate : `laptop`,
            productImg : `img/xps13.jpg`,
            best : true
        });
        this.fakeDb.push({
            title : `Dell XPS15 Laptop, 9th Gen Intel Core i7-9750H, 256GB SSD, 16GB RAM, NVIDIA GeForce 1650 4GB`,
            price : `2415.99`,
            cate : `laptop`,
            productImg : `img/xps15.jpg`,
            best : true
        });
        this.fakeDb.push({
            title : `NASA - Backpack Roll Top Built Up Laptop Bag`,
            price : `109.95`,
            cate : `laptop-bag`,
            productImg : `img/NASA-bag.jpg`,
            best : true
        });
        this.fakeDb.push({
            title : `Laptop Backpack`,
            price : `32.99`,
            cate : `laptop-bag`,
            productImg : `img/laptop-bag.jpg`,
            best : false
        });
        this.fakeDb.push({
            title : `Nestle Kitkat Matcha Green Tea Boutique Bag`,
            price : `5.99`,
            cate : `chocolate`,
            productImg : `img/matcha-choco.jpg`,
            best : true
        });
        this.fakeDb.push({
            title : `KIT KAT White Chocolatey Wafer Minis`,
            price : `2.97`,
            cate : `chocolate`,
            productImg : `img/white-choco.jpg`,
            best : false
        });
        this.fakeDb.push({
            title : `Midori MD Notebook - A5`,
            price : `15.33`,
            cate : `notebook`,
            productImg : `img/A5-notebook.jpg`,
            best : false
        });
    },

    getAllProduct(){
        return this.fakeDb;
    },
/*
    getAllBest(){
        var best = [];
        this.fakeDb.forEach(element => {
            if(element.best == true)
                best.push(element);
        });
        return best;
        
    },
*/
    getCategory(){
        var category = [];
        var collect = {};
        var cate;
        var count;
        for(let i=0; i<this.fakeDb.length; i++){
            cate = this.fakeDb[i].cate;
            count = collect[cate] || 0;
            collect[cate] = count + 1;
            if(count == 0)
                category.push(this.fakeDb[i]);
        }

        return category;
    }


}

product.setFakeDb();



module.exports = product;