import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk';

import reducers from '../reducers'
import Navbar from './Navbar'
import Checkout from './Checkout/Checkout'
import ProductsList from './Products/ProductsList'
import OrdersList from './Orders/OrdersList'
import Stats from './Stats/Stats'
import Closing from './Closing/Closing'
import Refill from './Refill/Refill'

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
)

const browserHistory = createHistory()

const App = () => (
    <Provider store={store}>
        <Router history={browserHistory}>
            <div>
                <Navbar />
                <Route exact path="/" component={Checkout} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/products" component={ProductsList} />
                <Route path="/orders" component={OrdersList} />
                <Route path="/stats" component={Stats} />
                <Route path="/closing" component={Closing} />
                <Route path="/refill" component={Refill} />
            </div>
        </Router>
    </Provider>
)

export default App
