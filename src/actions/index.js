import smalltalk from 'smalltalk'

import ProductsDb from '../databases/Products'
import OrdersDb from '../databases/Orders'

const productsDb = new ProductsDb();
const ordersDb = new OrdersDb();


/*******************************
 * REFILL **********************
 *******************************/

export const setRefillConfig = (refillVariable, refillValue) => ({
    'type': 'REFILL_SET_CONFIG',
    refillVariable,
    refillValue
})

export const deleteRefillConfig = (refillVariable) => ({
    'type': 'REFILL_DELETE_CONFIG',
    refillVariable
})

export function setOrUpdateRefillConfig(refillVariable, refillValue)
{
    return function (dispatch, getState) {
        dispatch(deleteRefillConfig(refillVariable));
        dispatch(setRefillConfig(refillVariable, refillValue));
    };
}

export function markLinesAdRefilled(orders, lines, successCallback)
{
    let eanList = [];
    for (let ean in lines) {
        eanList.push(ean)
    }

    orders.map((order) => {
        order.lines.map((line) => {
            if (!line.refilled && eanList.indexOf(line.ean) >= 0) {
                line.refilled = true;
            }
        });

        ordersDb.update(
            {_id: order._id},
            order,
            successCallback,
            (error) => { smalltalk.alert('Technical error', error) }
        );
    })
}

export function getAllProducts()
{
    return productsDb.searchSync();
}

export function getAllOrders()
{
    return ordersDb.searchSync();
}

/*******************************
 * CLOSING *********************
 *******************************/

export function getOrdersToClose()
{
    return ordersDb.searchSync({$not: {closed: true}});
}

export function markOrdersAsClosed(ordersList)
{
    ordersList.map((order) => {
        order.closed = true;
        console.log(order);
        ordersDb.update(
            {_id: order._id},
            order,
            () => {},
            (error) => { smalltalk.alert('Technical error', error) }
        );
    });
}

export function defineCashFund(callback)
{
    let actualCashFund = ordersDb.searchSync({
        $not: {closed: true},
        cashFund: {$exists: true}
    });

    actualCashFund.then((orders) => {
        if (orders.length > 0) {
            console.log(orders);
            let amount = orders[0].payments[0].amount;
            smalltalk.alert(
                'Fond de caisse',
                "Vous avez déjà un fond de caisse défini de <"+amount.toFixed(2)+"> € défini\n"+
                    "Pour en définir un nouveau, vous devez cloturer la caisse"
            );
        } else {
            smalltalk.prompt(
                'Fond de caisse',
                'Quel est le montant du fond de caisse ?'
            ).then(
                (amount) => {
                    if (isNaN(amount)) {
                        smalltalk.alert('Erreur', 'Format invalide');
                        return ;
                    }

                    return callback(saveCashFund(amount));
                },
                () => {}
            )
        }
    }).catch((error) => {
        console.log(error);
        smalltalk.alert('Technical error', error);
    });
}

export function saveCashFund(amount)
{
    ordersDb.create([], [{
        type: 'CASH_FUND',
        label: 'Fond de caisse',
        amount: parseFloat(amount)
    }]);

    return amount;
}

/*******************************
 * PRODUCTS ********************
 *******************************/

export const resetProductsLines = () => ({
    'type': 'RESET_PRODUCT_LINES'
})
export const setProductList = (productsList) => ({
    'type': 'PRODUCT_LIST_SET',
    productsList
})
export const addProductLine = (productLine) => ({
    'type': 'PRODUCT_LINE_ADD',
    productLine
})
export const updateProductLine = (productLine) => ({
    'type': 'PRODUCT_LINE_UPDATE',
    productLine
})
export const removeProductLine = (productId) => ({
    'type': 'PRODUCT_LINE_REMOVE',
    productId
})

export function refreshProductsList()
{
    return function (dispatch, getState) {
        dispatch(resetProductsLines());
        setTimeout(function() {
            dispatch(loadProductsList())
        }, 100)
    };
}

export function loadProductsList(product)
{
    let products = [];
    return function (dispatch, getState) {
        productsDb.searchSync().then((products) => {
            dispatch(setProductList(products));
        }).catch((error) => {
            smalltalk.alert('Technical error', error);
        });
    };
}

export function saveNewProduct(product, successCallback, errorCallback, canUpdate = false)
{
    return function (dispatch, getState) {
        if (isNaN(product.price)) {
            errorCallback('Product price must be a valid numeric');
            return ;
        }
        if ('' == product.category) {
            errorCallback('Category is required');
            return ;
        }
        if ('' == product.name) {
            errorCallback('Name is required');
            return ;
        }

        product.shortcut = product.shortcut && (product.shortcut === true || product.shortcut == "true");
        product.price = parseFloat(product.price);

        if (canUpdate) {
            productsDb.updateOrInsert(product, function() {
                successCallback(product);
            }, errorCallback);
        } else {
            productsDb.create(product, function(product) {
                dispatch(addProductLine(product));
                successCallback(product);
            }, errorCallback);
        }
    };
}

export function saveUpdateProduct(product, successCallback, errorCallback)
{
    return function (dispatch, getState) {
        if (isNaN(product.price)) {
            errorCallback('Product price must be a valid numeric');
            return ;
        }
        if ('' == product.category) {
            errorCallback('Category is required');
            return ;
        }
        if ('' == product.name) {
            errorCallback('Name is required');
            return ;
        }

        productsDb.update(product, function() {
            dispatch(updateProductLine(product));
            successCallback(product);
        }, errorCallback);
    };
}

export function removeProduct(productId)
{
    return function (dispatch, getState)
    {
        smalltalk.confirm(
            'Suppression d\'un produit',
            'Êtes-vous sûrs de vouloir supprimer ce produit ?'
        ).then(
            () => {
                productsDb.remove(
                    {_id: productId},
                    function(filters) {
                        dispatch(removeProductLine(filters._id));
                    },
                    function() {
                        smalltakl.alert('Technical error', 'Erreur lors de la suppression du produit');
                    }
                );
            }
        );
    }
}

export function deleteAllProducts()
{
    return function (dispatch, getState)
    {
        smalltalk.confirm(
            'Suppression des produits',
            'Êtes-vous sûrs de vouloir supprimer TOUS les produits ?'
        ).then(
            () => {
                productsDb.clear(
                    function() {
                        dispatch(resetProductsLines());
                    },
                    function() {
                        smalltakl.alert('Technical error', 'Erreur lors de la suppression du produit');
                    }
                );
            }
        );
    }
}

/*******************************
 * ORDERS **********************
 *******************************/

export const resetOrdersListLines = (order) => ({
    'type': 'ORDERS_LIST_RESET',
    order
})
export const setOrdersList = (ordersList) => ({
    'type': 'ORDERS_LIST_SET',
    ordersList
})
export const addOrdersListLine = (order) => ({
    'type': 'ORDERS_LIST_LINES_ADD',
    order
})

export function saveInvoiceInformationsForOrder(order, successCallback, errorCallback)
{
    ordersDb.update(
        {_id: order._id},
        order,
        successCallback,
        errorCallback
    );
}

export function loadOrdersList()
{{
    return function (dispatch, getState)
    {
        ordersDb.searchSync().then((orders) => {
                dispatch(setOrdersList(orders));
            }).catch((error) => {
                smalltalk.alert('Technical error', error);
            });
        };
    }
}

export function deleteAllOrders()
{
    return function (dispatch, getState)
    {
        smalltalk.confirm(
            'Suppression des commandes',
            'Êtes-vous sûrs de vouloir supprimer TOUTES les commandes ?'
        ).then(
            () => {
                ordersDb.clear(
                    function() {
                        dispatch(resetOrdersListLines());
                    },
                    function() {
                        smalltalk.alert('Technical error', 'Erreur lors de la suppression de la commande');
                    }
                );
            }
        );
    }
}

/*******************************
 * CHECKOUT ********************
 *******************************/

export const updateOrder = (action, data) => ({
    'type': action,
    data
})
export const orderAddLine = (productLine) => ({
    'type': 'ORDER_LINES_ADD',
    productLine
})
export const orderRemoveLine = (productLine) => ({
    'type': 'ORDER_LINES_REMOVE',
    productLine
})
export const updateOrderStatus = (status) => ({
    'type': 'ORDER_STATE_UPDATE',
    status
})
export const paymentAddLine = (paymentLine) => ({
    'type': 'PAYMENT_LINES_ADD',
    paymentLine
})
export const paymentRemoveLine = (paymentLine) => ({
    'type': 'PAYMENT_LINES_REMOVE',
    paymentLine
})
export const resetOrder = () => ({
    'type': 'RESET_ORDER'
})

export function saveCurrentOrder()
{
    return function (dispatch, getState) {
        let state = getState();
        dispatch(saveOrder(
            state.orderLines,
            state.orderPayments,
        ));
    };
}

export function saveOrder(orderLines, orderPayments)
{
    return function (dispatch, getState) {
        ordersDb.create(
            orderLines,
            orderPayments,
            function (order) {
                if (getState().ordersListLines.length > 0) {
                    dispatch(addOrdersListLine(order));
                }
                dispatch(resetOrder());
            },
            function (errorMessage) {
                smalltalk.alert('Technical error', errorMessage);
            }
        );
    };
}

export function orderReturn()
{
    smalltalk.confirm(
        'Retour',
        'Êtes-vous sûr de vouloir éffectuer un retour ?'
    ).then(
        () => {
            return function (dispatch, getState) {
                let orderLines = getState().orderLines;
                let total      = 0;
                orderLines.map((item) => {
                    total += item.price;
                    item.return = 1;
                    item.price = item.price * -1;
                });

                smalltalk.alert(
                    'Retour',
                    'Vous devez éffectuer un remboursement de '+total.toFixed(2)+' € en espèces'
                );

                let orderPayments = [{
                    'type': 'RETURN',
                    'label': 'Retour produit en espèces (Rendu : '+parseFloat(total).toFixed(2)+' €)',
                    'amount': total
                }];

                dispatch(saveOrder(
                    orderLines,
                    orderPayments,
                ));
            };
        }
    );
}

export function orderAddLineFromEan(ean)
{
    return function (dispatch, getState) {
        productsDb.searchByEan({ean: ean}, function (productLine) {
            dispatch(orderAddLine(productLine));
        });
    };
}

export function orderAddSpecialDiscountEuro()
{
    return function (dispatch, getState) {
        smalltalk.prompt(
            'Remise',
            'Montant de la remise (en €)'
        ).then(
            (amount) => {
                if (isNaN(amount)) {
                    smalltalk.alert('Erreur', 'Format saisi invalide');
                    return ;
                }

                let discount = getDiscount(parseFloat(amount), amount+' €');
                dispatch(orderAddLine(discount));
            },
            () => {}
        );
    };
}

export function orderAddSpecialDiscountPercent()
{
    return function (dispatch, getState) {
        smalltalk.prompt(
            'Remise',
            'Montant de la remise (en %)'
        ).then(
            (percent) => {
                if (isNaN(percent)) {
                    smalltalk.alert('Erreur', 'Format saisi invalide');
                    return ;
                }

                let orderLines = getState().orderLines;
                let total = 0;
                orderLines.forEach((line) => { total += line.price });
                let amount = (total * parseFloat(percent) / 100).toFixed(2);
                let discount = getDiscount(parseFloat(amount), percent+' % de '+parseFloat(total).toFixed(2)+' €');
                dispatch(orderAddLine(discount));
            },
            () => {}
        );
    };
}

function getDiscount(amount, info)
{
    return {
        ean: 'DISCOUNT',
        name: 'Remise ('+info+')',
        price: (Math.abs(amount) * -1),
        category: 'DISCOUNT'
    };
}
