import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/api', async (req, res) => {
    const postedData = req.body;

    console.log('posted data is', postedData);

    const authData = {
        "grant_type": "client_credentials",
        "client_id": "7b630d9c-e7c3-4e3e-81aa-0d563c52e59a",
        "client_secret": "H668Q~6J24neA_9nw~uc1WLzxbbbvDBuFG1xYcxR",
        "resource": "api://7b630d9c-e7c3-4e3e-81aa-0d563c52e59a"
    };

    var formBody = [];
    for (var property in authData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(authData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    try {
        const tokenResponse = await fetch('https://login.windows.net/6285e18b-e740-4114-8649-2d299e642afc/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        
        // Function to calculate the total quantity of line items
        function getTotalQuantity(data) {
            return data.line_items.reduce((total, item) => total + item.quantity, 0);
        }

        const totalQuantity = getTotalQuantity(postedData);
        console.log("test:", totalQuantity);

        const tourSaleData = postedData.line_items.map(item => ({
            "name": postedData.name,
            "emailaddress": postedData.email,
            "source": postedData.source_name,
            "number": totalQuantity,
            "walkingRouteShortName": item.sku,
            "idealDetails": "WWqHTVbf2V",
            "date": postedData.created_at,
            "amountPaid": postedData.current_subtotal_price,
            "currency": postedData.currency,
            "language": postedData.customer_locale,
            "isAffiliate": false,
            "affiliateCode": "ABQEU",
        }));

        await fetch('https://positivebytes-pg-routes-api-prd.azurewebsites.net/positivebytes/pocketguide/tours/sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
                'X-TrackingId': postedData.id
            },
            body: JSON.stringify(tourSaleData)
        });

        // const campaignData = postedData.line_items.map(item => ({
        //     "tour": item.sku,
        //     "emailaddress": postedData.email,
        //     "camp": "kXatzmsi",
        //     "source": postedData.source_name,
        //     "code": "35519725aa4442929ec920c12b39afd9",
        //     "serialnumber": "cGAHrGRC",
        //     "language": postedData.customer_locale
        // }));

        // await fetch('https://positivebytes-pg-routes-api-prd.azurewebsites.net/positivebytes/pocketguide/tours/campaign', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + accessToken,
        //         'X-TrackingId': postedData.id
        //     },
        //     body: JSON.stringify(campaignData)
        // });

        // const affiliateData = postedData.line_items.map(item => ({
        //     "tour": item.sku,
        //     "affcode": "ABQEU",
        //     "source": postedData.source_name,
        //     "code": "9103738e9e1d4b2c9aacd4c4d4960ebd",
        //     "serialnumber": "iHGbINla"
        // }));

        // await fetch('https://positivebytes-pg-routes-api-prd.azurewebsites.net/positivebytes/pocketguide/tours/affiliate', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + accessToken,
        //         'X-TrackingId': postedData.id
        //     },
        //     body: JSON.stringify(affiliateData)
        // });

        // await fetch('https://positivebytes-pg-routes-api-prd.azurewebsites.net/positivebytes/pocketguide/tours/count', {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': 'Bearer ' + accessToken,
        //         'X-TrackingId': postedData.id
        //     }
        // });

        // const transactionData = {
        //     "transactionId": "c4c9841f-f8aa-4b38-a422-8ba880e9aee9"
        // };

        // await fetch('https://aois-tmg-dev.azurewebsites.net/api/OrdersCollector/transform', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + accessToken
        //     },
        //     body: JSON.stringify(transactionData)
        // });

        // res.status(200).send("Requests successfully completed");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("An error occurred while processing requests.");
    }
});

export default router;
