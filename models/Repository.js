
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        objectsName = objectsName.toLowerCase();
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly2
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    getAllSortById() {

        let list = this.objectsList;

        list.sort(function(a, b) {
            return a.Id - b.Id
        });

        return list;
    }
    get(id){
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }
    getByName(array){
        let list = [];

        if(array)
            list = array;
        else
            list = this.objectsList;

        list.sort(function(a, b) {
            a = a.Name.toLowerCase();
            b = b.Name.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
        });

        return list;
    }
    getByCategory(array){
        let list = [];

        if(array)
            list = array;
        else
            list = this.objectsList;


        list.sort(function(a, b) {
            a = a.Category.toLowerCase();
            b = b.Category.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
        });

        return list;
    }
    getByPrefix(prefix, array){
        let list = [];
        let newArray = [];
        if(array)
            newArray = array;
        else
            newArray = this.objectsList;

        for(let object of newArray){
            if(object.Name.toLowerCase().startsWith(prefix)) {
                list.push(object);
            }
        }
        
        return list;
    }
    getByNameEqual(name, array){
        let list = [];
        let newArray = [];
        if(array)
            newArray = array;
        else
            newArray = this.objectsList;

        for(let object of newArray){
            if(object.Name.toLowerCase() === name) {
                list.push(object);
            }
        }
        
        return list;
    }
    getByCategoryName(category, array){
        let list = [];
        let newArray = [];

        if(array)
            newArray = array;
        else
            newArray = this.objectsList;

        for(let object of newArray){
            if(object.Category.toLowerCase() === category.toLowerCase()) {
                list.push(object);
            }
        }
        
        return list;
    }
    remove(id) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    update(objectToModify) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
}