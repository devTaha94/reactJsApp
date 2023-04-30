import React from 'react';
import {Button, Grid} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "axios";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import * as CONSTANTS from '../Consts';
import {stylingObject} from "../css/Styles";

function ProductList() {

    const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState(true);
    const [products, setProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);

    useEffect(() => {
        deletedProducts.length ? setIsDeleteAllDisabled(false) : setIsDeleteAllDisabled(true);
    }, [deletedProducts])

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCheckbox = (productId) => {
        if (!deletedProducts.includes(productId)) {
            setDeletedProducts(deletedProducts.concat(productId));
        } else {
            setDeletedProducts((deletedProducts) => {
                return deletedProducts.filter((item) => item !== productId);
            })
        }
    }

    const fetchProducts = () => {
        axios.get(`${CONSTANTS.BASE_URL}getProducts`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setProducts(response.data.data))
    }

    const deleteAll = () => {
        axios.post(`${CONSTANTS.BASE_URL}deleteProducts`,
            {
                'productIds' : deletedProducts
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => fetchProducts())
    }

    return (
        <Grid container style={stylingObject.mt_20}>
            <Grid item xs={12}>
                <div style={stylingObject.header}>
                    <h2 style={stylingObject.title}>Product List</h2>
                    <div>
                        <Button component={Link} to="/add-product" variant="outlined" color="success" style={stylingObject.buttons}>ADD</Button>
                        <Button
                            id={'delete-product-btn'}
                            variant="outlined"
                            color="error"
                            style={stylingObject.buttons}
                            onClick={() => deleteAll()}>
                            MASS DELETE
                        </Button>
                    </div>
                </div>
            </Grid>
            <div style={stylingObject.horizontalLine}></div>
            <Grid container rowSpacing={4} columnSpacing={{xs: 4}} style={stylingObject.productsContainer}>
                {products.map((product , key) => (
                    <Grid key={key} item xs={3} style={stylingObject.item}>
                        <Card variant="outlined" style={stylingObject.height_250}>
                                <CardContent>
                                    <input type="checkbox" className='delete-checkbox' value={product.id} onClick={() => handleCheckbox(product.id)}/>
                                    <div style={stylingObject.productCard}>
                                        <Typography style={stylingObject.alignCenter}>
                                            {product.sku}
                                        </Typography>
                                        <Typography style={stylingObject.alignCenter}>
                                            {product.name}
                                        </Typography>
                                        <Typography style={stylingObject.alignCenter}>
                                            {product.price} $
                                        </Typography>
                                        <Typography style={stylingObject.alignCenter}>
                                            {product.option_unit}: {product.option_value}
                                        </Typography>
                                    </div>
                                </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div style={stylingObject.horizontalLine}></div>
            <h4 style={stylingObject.footerContainer} >Scandiweb Test assignment</h4>
        </Grid>
    );
}
export default ProductList;
