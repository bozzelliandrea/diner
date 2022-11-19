const core = require('core');

const fakeMongo = new Map();

function Category(request) {
    this.id = request.id;
    this.description = request.description;
    this.color = request.color;
    this.name = request.name;
    this.isCreatable = () => {
        if(!this.name) {
            this._status = "Required field missing: Name is not defined!"
            return false;
        }
    
        return true;
    }
    this.isUpgradeable = () => {
        if(!this.id) {
            this._status = "Required field missing: Id is not defined!"
            return false;
        } 
    
        return this.isCreatable();
    }

    this.getStatus = () => this._status;
}

async function create(category) {

    if(!category.isCreatable()) {
        throw new core.appError(core.httpCode.BAD_REQUEST, "Failed to save category", category.getStatus());
    }

    fakeMongo.set(category.name, category);

    return new core.appResponse(core.httpCode.CREATED, {name: category.name}, null);
}

async function update(category) {

    if(!category.isUpgradeable()) {
        throw new core.appError(core.httpCode.BAD_REQUEST, "Failed to save category", category.getStatus());
    }

    fakeMongo.set(category.name, category);

    return new core.appResponse(core.httpCode.OK, {name: category.name}, null);
}

async function find() {
    //TODO: to implement.
}

async function getById(id) {

    if(!id) {
        throw new core.appError(core.httpCode.BAD_REQUEST, "Failed to save category", "Required field missing: Id is not defined!");
    }

    return new core.appResponse(core.httpCode.OK, {category: fakeMongo.get(id)}, null);
}

async function deleteById(id) {

    if(!id) {
        throw new core.appError(core.httpCode.BAD_REQUEST, "Failed to save category", "Required field missing: Id is not defined!");
    }

    fakeMongo.delete(id)

    return new core.appResponse(core.httpCode.DELETED, {}, null);
}


module.exports = {
    Category,
    getById,
    find,
    deleteById,
    create,
    update
}