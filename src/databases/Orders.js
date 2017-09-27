import Nedb from 'nedb';
import electron from 'electron';
import smalltalk from 'smalltalk'

class Orders
{
    constructor()
    {
        const electronApp = electron.remote.app;
        this.db = new Nedb({
            filename: electronApp.getPath('userData')+'/database/order.nedb',
            autoload: true
        });
        this.db.loadDatabase();
        this.db.persistence.setAutocompactionInterval(5);
    }

    create(orderLines, orderPaymentsLines, successCallback = (p) => {}, errorCallback = (p) => {})
    {
        let total = 0;
        orderLines.forEach((line) => {
            total += parseFloat(line.price);
        });

        let order = {
            date: new Date(),
            lines: orderLines,
            payments: orderPaymentsLines,
            total: total
        }

        if (orderPaymentsLines.length == 1 && orderPaymentsLines[0].type === 'CASH_FUND') {
            order.cashFund = 1;
        }

        this.db.insert([order], function (err, newDoc) {
            if (null === err) {
                successCallback(order);
            } else {
                errorCallback(err.message);
            }
        });
    }

    update(where, order, successCallback = (p) => {}, errorCallback = (p) => {})
    {
        this.db.update(
            where,
            order,
            {multi: false},
            function (err, numReplaced) {
                if (null == err) {
                    successCallback();
                } else {
                    errorCallback(err.message);
                }
            }
        );
    }

    select(callback)
    {
        this.db.find({}).sort({ date: 1 }).exec(function(err, docs) {
            docs.map((item, index) => {
                return callback(item);
            });
        });
    }

    search(filters, callback)
    {
        this.db.find(filters).sort({'date': 1}).exec(function(err, docs) {
            docs.map((item, index) => {
                return callback(item);
            });
        });
    }

    searchSync(filters)
    {
        let promise = new Promise((resolve, reject) => {
            this.db.find(filters).sort({'date': 1}).exec(function(err, docs) {
                if (null === err) {
                    resolve(docs);
                } else {
                    reject(err.message);
                }
            });
        });

        return promise;
    }

    remove(filters, callback)
    {
        this.db.remove(filters, { multi: true }, function (err, numRemoved) {
            smalltalk.alert('Commandes', numRemoved+' commandes supprimées');
            callback();
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

export default Orders;
