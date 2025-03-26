class Node{

    _id
    _data
    _type
    
    constructor(id,data){
        this._id = id
        this._data = data
    }

    // getId(){
    //     return this.#id
    // }
    
    getType(){
        return this._type
    }

    setData(data){
        this._data = data
    }

    run(edges,variables){
        
    }

}

module.exports = Node