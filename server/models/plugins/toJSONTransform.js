
/**
 * Function normalizes the name of the id field on the toJSON response.
 */
function normalizeId(doc, ret) {
    ret.id =doc._id;
    delete ret._id;
}

/**
 * Function removes the version (__v) field from the toJSON response.
 */
 function removeVersion(doc, ret) {
    delete ret.__v;
}

/**
 * Function transforms ObjectID fields to an more detailed reference object, containing both _id and type.
 * The rationale for this, is to make it easier to find referenced documents when using the API.
 * 
 * For example, the isser field on an instrument would be transformed as per below:
 *  
 *  {
 *      ...,
 *      "issuer": "6041563aa1985b38dc6445b5"
 *  }
 * 
 *  ==>
 * 
 *  {
 *      ...,
 *      "issuer": {
 *          "_id": "6041563aa1985b38dc6445b5",
            "type": "Party"
 *      }
 *  }
 */
function transformReferences(doc, ret) {
    for(var path in doc.constructor.schema.obj) {
        if(doc.constructor.schema.paths[path].instance == 'ObjectID' && doc[path].constructor.name == 'ObjectID') {
            ret[path] = {'id': doc[path], 'type': doc.constructor.schema.obj[path].ref};
        }
    }
}

module.exports = function(schema) {
    schema.set('toJSON', {transform: function(doc, ret) {

        normalizeId(doc, ret);
        removeVersion(doc, ret);
        transformReferences(doc, ret);

        return ret;
    }});
}