import React from 'react'
import { useEffect, useState } from 'react'
function Producttest() {
    const [product, setproduct] = useState([])
    useEffect(() => {
        fecth("https://dummyjson.com/products")
            .then((res) => res.json())
            .then((data) => setproduct(products.data))
            .then((err) => console.log(err))
    })
    return (
        <><div style={{ paddingTop: '30' }}>
            {product.map((item) => (
                <>
                    <div>
                        {item.title}
                    </div>
                    <div>
                        {item.images}
                    </div>
                    <div>
                        {item.thambnail}
                    </div>
                </>
            ))}
        </div>
        </>
    )
}

export default Producttest