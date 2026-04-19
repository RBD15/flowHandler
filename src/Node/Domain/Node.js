class Node{

    _id
    _data
    _type
    
    constructor(id,data){
        this._id = id
        this._data = data
    }

    getId(){
        return this._id
    }

    getData(){
        return this._data
    }
    
    getType(){
        return this._type
    }

    setData(data){
        this._data = data
    }

    log(){
        console.log(this._type);
    }

    async execute(variables){
        return await this.run(null,variables)
    }

    async run(edges,variables){
        
    }

}

module.exports = Node