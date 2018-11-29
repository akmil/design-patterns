class IComposer {
    select(id) {
        throw new Error(`You must implement *select* method`);
    }

    show() {
        throw new Error(`You must implement *show* method`);
    }
}

class Filter extends IComposer{

    constructor(id, parent) {
        super();
        this.children = [];
        this.parentGroup = parent;
        this.id = id;
        this.selectedIds = [];
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            if (this.children[i] === child) {
                this.children.splice(i, 1);
                return;
            }
        }
    }

    getChild(i) {
        return this.children[i];
    }

    hasChildren() {
        return this.children.length > 0;
    }

    show(){
        return this.id
    }

    // recursively traverse a (sub)tree
    select(node = this, indent = 1){
        indent++;
        for (var i = 0, len = node.children.length; i < len; i++) {
            this.selectedIds.push(node.getChild(i).id);
            this.select(node.getChild(i), indent);
            if(i === len-1) {
                return this.selectedIds;
            }
        }
    }
}



const filters = new Filter("x Filters");
const group1 = new Filter("-x Filter group 1");
const group1_inner1 = new Filter("--x Filter 1", group1);
const group1_inner2 = new Filter("--x Filter 2", group1);

const group2 = new Filter("-x Filter group 2");
const group2_inner1 = new Filter("--x FilterGr2 1", group2);
const group2_inner2 = new Filter("--x FilterGr2 2", group2);

filters.add(group1);
filters.add(group2);
filters.remove(group2);  // note: remove
filters.add(group2);

group1.add(group1_inner1);
group1.add(group1_inner2);

group2.add(group2_inner1);
group2.add(group2_inner2);


//test
console.log(  group1_inner2.show() ); // => --x Filter 2
console.log(group2.select()); // => ["--x FilterGr2 1", "--x FilterGr2 2"]
