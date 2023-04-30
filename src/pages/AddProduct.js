import React, { useState, useEffect } from "react";
import {Button, Grid} from "@mui/material";
import axios from 'axios';
import {stylingObject} from "../css/Styles";
import {Link, useNavigate} from "react-router-dom"
import * as CONSTANTS from "../Consts";

function search(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].id == nameKey) {
            return myArray[i];
        }
    }
}

function AddProduct() {
    const navigate = useNavigate()

    const [types, setTypes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [variantsValues, setVariantsValues] = useState([]);
    const [formError, setFormError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        if (!name || !sku || !price || !selectedType || !variantsValues.length) {
            setFormError('Please, submit required data');
        } else {
            setFormError('');

            axios.post(`${CONSTANTS.BASE_URL}addProduct`,
                {
                    'sku': sku,
                    'name': name,
                    'price': price,
                    'type': selectedType.alias,
                    'product_type_id': selectedType.id,
                    'options': variantsValues
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    if (response.data.success == true) {
                        navigate('/')
                    } else {
                        setFormError(response.data.msg);
                    }
                })
        }
    }

    const handleVariants = function (name, value) {
        let variant = {variant_id: name, value: value};
        let filteredArr = variantsValues.filter(obj => obj.variant_id != variant.variant_id);
        setVariantsValues(filteredArr.concat(variant));
    }

    useEffect(() => {
    }, [variantsValues]);


    useEffect(() => {
        axios.get(`${CONSTANTS.BASE_URL}getProductTypes`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setTypes(response.data.data))
    }, []);

    const selectType = (e) => {
        let selectedType = search(e.target.value, types);
        setSelectedType(selectedType);
        setVariants([]);
        setVariantsValues([]);
        axios.get(`${CONSTANTS.BASE_URL}getProductTypeVariants/${e.target.value}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => setVariants(response.data.data))

    }

    return (
        <Grid container style={stylingObject.mt_20}>
            <Grid item xs={12}>
                <div style={stylingObject.header}>
                    <h2 style={stylingObject.title}>Product Add</h2>
                    <div>
                        <Button onClick={handleSubmit} variant="outlined" color="success" style={stylingObject.buttons}>Save</Button>
                        <Button  component={Link} to="/"  variant="outlined" color="error" style={stylingObject.buttons} >Cancel</Button>
                    </div>
                </div>
            </Grid>
            <div style={stylingObject.horizontalLine}></div>
            <Grid container rowSpacing={4} columnSpacing={{xs: 4}} style={stylingObject.gridContainer}>
                        <div className="form">
                            <form  id={'product_form'}>
                                <div style={stylingObject.inputContainer}>
                                    <label>SKU </label>
                                    <input  id={'sku'}  style={stylingObject.input} placeholder={'#sku'} type="text" name="sku" required onChange={(event) => setSku(event.target.value)} value={sku}/>
                                </div>
                                <div style={stylingObject.inputContainer}>
                                    <label>Name </label>
                                    <input  id={'name'} style={stylingObject.input} placeholder={'#name'} type="text" name="name" required onChange={(event) => setName(event.target.value)} value={name}/>
                                </div>
                                <div style={stylingObject.inputContainer}>
                                    <label>Price ($) </label>
                                    <input  id={'price'} style={stylingObject.input} placeholder={'#price'} type="number" name="price" required onChange={(event) => setPrice(event.target.value)} value={price}/>
                                </div>
                                <div style={stylingObject.inputContainer}>
                                    <label>Type Switcher</label>
                                    <select id="productType" onChange={selectType}>
                                        <option value={null}>Select Product Type</option>
                                        {types.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {
                                    variants.map((item, key) => {
                                      return (
                                          <div style={stylingObject.inputContainer} key={key}>
                                              <label>{item.variant_name} ({selectedType.unit})</label>
                                              <input id={item.variant_alias} style={stylingObject.input} placeholder={item.variant_name} type={'number'} name={item.variant_id} required onChange={(event) => handleVariants(event.target.name, event.target.value)}/>
                                          </div>
                                      )
                                    })
                                }
                                {formError && <p style={stylingObject.errorMessage}>{formError}</p>}
                            </form>
                    </div>
            </Grid>
            <p style={stylingObject.centerDescription}>
                {selectedType ? selectedType.description: null}
            </p>
            <div style={stylingObject.horizontalLine}></div>
            <h4 style={stylingObject.footerContainer} >Scandiweb Test assignment</h4>
        </Grid>
    );
}

export default AddProduct;
