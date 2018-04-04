import Nedb from 'nedb';
import electron from 'electron';
import smalltalk from 'smalltalk'

class Products
{
    constructor()
    {
        const electronApp = electron.remote.app;
        this.db = new Nedb({
            filename: electronApp.getPath('userData')+'/database/product.nedb',
            autoload: true
        });
        this.db.loadDatabase();
        this.db.persistence.setAutocompactionInterval(5);
        this.db.ensureIndex({
            fieldName: 'ean',
            unique: true
        });
    }

    filterProduct(product, errorCallback = (p) => {})
    {
        let origin = JSON.parse(JSON.stringify(product));
        if (!isNaN(product.ean)) {
            product.ean = parseInt(product.ean);
        }
        if (isNaN(product.ean)) {
            product.ean = '9' + Math.floor(Math.random() * Math.floor(99999999999999));
            errorCallback('Product <'+origin.ean+'> is not a valid EAN - Auto generated EAN : <'+product.ean+'>');
        }

        return product;
    }

    create(product, successCallback = (p) => {}, errorCallback = (p) => {})
    {
        product = this.filterProduct(product, errorCallback);

        this.db.insert(product, function (err, newDoc) {
            if (null == err) {
                successCallback(newDoc);
            } else {
                errorCallback(err.message);
            }
        });
    }

    update(product, successCallback = (p) => {}, errorCallback = (p) => {})
    {
        product = this.filterProduct(product, errorCallback);

        this.db.update(
            {_id: product._id},
            product,
            {multi: false},
            function (err, numReplaced) {
                if (null == err) {
                    successCallback(product);
                } else {
                    errorCallback(err.message);
                }
            }
        );
    }

    updateOrInsert(product, successCallback = (p) => {}, errorCallback = (p) => {})
    {
        product = this.filterProduct(product, errorCallback);

        this.db.update(
            {ean: product.ean},
            product,
            {upsert: true},
            function (err, numReplaced, upsert) {
                if (null == err) {
                    successCallback(product);
                } else {
                    errorCallback(err.message);
                }
            }
        );
    }

    select(callback)
    {
        this.db.find({}).sort({ category: 1, name: 1 }).exec(function(err, docs) {
            docs.map((item, index) => {
                return callback(item);
            });
        });
    }

    searchByEan(filters, callback)
    {
        if (!isNaN(filters.ean)) {
            filters.ean = parseInt(filters.ean);
        }

        this.db.find({ean: filters.ean}).exec(function(err, docs) {
            if (docs.length === 0) {
                smalltalk.alert('Recherche produit', 'Produit EAN <'+filters.ean+'> non trouvé');
            } else {
                docs.map((item, index) => {
                    return callback(item);
                });
            }
        });
    }

    searchSync(filters)
    {
        let promise = new Promise((resolve, reject) => {
            this.db.find(filters).exec(function(err, docs) {
                if (null === err) {
                    resolve(docs);
                } else {
                    reject(err.message);
                }
            });
        });

        return promise;
    }

    remove(filters, successCallback, errorCallback)
    {
        this.db.remove(filters, { multi: false }, function (err, numRemoved) {
            if (null == err) {
                successCallback(filters);
            } else {
                errorCallback();
            }
        });
    }

    clear(successCallback, errorCallback)
    {
        this.db.remove({}, { multi: true }, function (err, numRemoved) {
            if (null == err) {
                successCallback();
            } else {
                errorCallback();
            }
        });
    }
}

export default Products;
