/**
 * Interface for Composer
 */
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
        this.parentGroupId = parent;
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

    /**
     * @returns {object}
     */
    getChild(i) {
        return this.children[i];
    }

    /**
     * @returns {boolean}
     */
    hasChildren() {
        return this.children.length > 0;
    }

    /**
     * @returns {string}
     */
    hasParent() {
        return this.parentGroupId;
    }

    /**
     * show current filter
     * @returns {array}
     */
    show(){
        return [this.id];
    }

    /**
     * choose Group From Children
     * recursively traverse a (sub)tree
     * @param node
     * @returns {array || string}
     */
    chooseGroupFromChildren(node = this){

        if(!this.hasChildren()) {
            return `no child found for ${node.id}, parentGroupId is: ${this.parentGroupId}`;
        }

        for (let i = 0, len = node.children.length; i < len; i++) {
            this.selectedIds.push(node.getChild(i).id);
            this.chooseGroupFromChildren(node.getChild(i));
            if(i === len-1) {
                const arrCopy = this.appendToArray(this.selectedIds, {first: node.id});
                return (this.hasParent()) ? new Set([...arrCopy]) : this.selectedIds;
            }
        }
    }

    /**
     * get Ids of group or single filters
     * @param node
     * @returns {array}
     */
    select(node){
        if(node.children.length) {
            const arr = node.children.map((it) => it.id);
            return this.appendToArray(arr, {first: node.id});
        } else {
            // no child found for ${node.id}
            return [node.id];
        }
    }

    appendToArray(array, toAppend) {
        const arrayCopy = array.slice();
        if (toAppend.first) {
            arrayCopy.unshift(toAppend.first);
        }
        if (toAppend.last) {
            arrayCopy.push(toAppend.last);
        }
        return arrayCopy;
    }
}

const filters = new Filter("x Filters");
const group1 = new Filter("-x Filter group 1", filters.id);
const group1_inner1 = new Filter("--x Filter 1", group1.id);
const group1_inner2 = new Filter("--x Filter 2", group1.id);

const group2 = new Filter("-x Filter group 2", filters.id);
const group2_inner1 = new Filter("--x FilterGr2 1", group2.id);
const group2_inner2 = new Filter("--x FilterGr2 2", group2.id);

filters.add(group1);
filters.add(group2);
filters.remove(group2);  // note: remove
filters.add(group2);

group1.add(group1_inner1);
group1.add(group1_inner2);

group2.add(group2_inner1);
group2.add(group2_inner2);


//test
console.log( filters.select(group2_inner1) ); // => ['--x FilterGr2 1']
console.log( filters.select(group2) ); // => [ '-x Filter group 2', '--x FilterGr2 1', '--x FilterGr2 2' ]
console.log( group1_inner2.show() ); // => ['--x Filter 2']

//test extra 'choose'
console.log( group1_inner2.chooseGroupFromChildren() ); // => no child found for --x Filter 2, parentGroupId is: -x Filter group 1
console.log( group2.chooseGroupFromChildren() ); // => ["-x Filter group 2", "--x FilterGr2 1", "--x FilterGr2 2"]
console.log( group2.chooseGroupFromChildren() ); // => ["-x Filter group 2", "--x FilterGr2 1", "--x FilterGr2 2"]
