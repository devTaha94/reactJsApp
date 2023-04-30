import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<ProductList/>}></Route>
                <Route exact path="/add-product" element={<AddProduct/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
