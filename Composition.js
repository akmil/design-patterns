class IComposer {
    select(id) {
        console.log(this);
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
        const length = this.children.length;
        for (let i = 0; i < length; i++) {
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

    hasParent() {
        return this.parentGroup;
    }

    show(){
        return this.id
    }

    // recursively traverse a (sub)tree
    select(node = this){

        if(!node.children.length) {
            return `no chield found for ${node.id}, parentGroup is:${this.parentGroup.id}`;
        }

        for (let i = 0, len = node.children.length; i < len; i++) {
            this.selectedIds.push(node.getChild(i).id);
            this.select(node.getChild(i));
            if(i === len-1) {
                let arr = this.selectedIds;
                this.selectedIds.unshift(this.parentGroup.id);
                return (this.hasParent()) ? arr : this.selectedIds;
            }
        }
    }
}

const filters = new Filter("x Filters");
const group1 = new Filter("-x Filter group 1", filters);
const group1_inner1 = new Filter("--x Filter 1", group1);
const group1_inner2 = new Filter("--x Filter 2", group1);

const group2 = new Filter("-x Filter group 2", filters);
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
console.log( group1_inner2.show()); // => --x Filter 2
console.log(group2.select()); // => ["--x FilterGr2 1", "--x FilterGr2 2"]
console.log(group1_inner2.select()); // => no chield found for--x Filter 2, parentGroup is:-x Filter group 1
