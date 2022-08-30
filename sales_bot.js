const solanaWeb3 = require('@solana/web3.js');
const { Connection, programs, utils } = require('@metaplex/js');
const axios = require('axios');
const fs = require("fs");

require('dotenv').config();

//const Twitter = require('twitter');
const { TwitterApi } = require('twitter-api-v2');
//const { Twit } = require('twit');

const { exit } = require('process');
const https = require('https');


solPrice = 103.72;

// new Promise(async (resolve, reject) => {
//     try {
//       response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=USD', {
//         headers: {
//           'X-CMC_PRO_API_KEY': '9182eb06-d770-42cc-8c3f-bd63c2cc4268',
//         },
//       });
//     } catch(ex) {
//       response = null;
//       // error
//       console.log(ex);
//       reject(ex);
//     }
//     if (response) {
//       // success
//       const json = response.data;
//       console.log(json);
//       resolve(json);
//     }
//   });

//return;
// const twitterConfig = {
// 	consumer_key: process.env.TWITTER_API_KEY,
// 	consumer_secret: process.env.TWITTER_API_SECRET,
// 	access_token: process.env.TWITTER_ACCESS_TOKEN,
// 	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// };
// var client = new Twit(twitterConfig);

const twitterConfig = {
	appKey: process.env.TWITTER_API_KEY,
	appSecret: process.env.TWITTER_API_SECRET,
	accessToken: process.env.TWITTER_ACCESS_TOKEN,
	accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};
var client = new TwitterApi(twitterConfig);
const rwClient = client.readWrite;

//const client = new TwitterApi(process.env.TWITTER_BEARER);



let Project_Address = "HPdKnG7NMATv2M6k2JuRuCQqgait88QCFdMpQWqZD2wA"

if (!Project_Address){ //|| !process.env.DISCORD_URL) {
    console.log("Please set project address and discord URL.");
    return;
}

const projectPubKey = new solanaWeb3.PublicKey(Project_Address);
const url = solanaWeb3.clusterApiUrl('mainnet-beta');
const solanaConnection = new solanaWeb3.Connection(url, 'confirmed');
const metaplexConnection = new Connection('mainnet-beta');
//const metadata = programs;
const { metadata:  Metadata } = programs;
const pollingInterval = 2000; // ms
const marketplaceMap = {
    "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8": "Magic Eden",
    "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K": "Magic Eden2",
    //"HZaWndaNWHFDd9Dhk5pqUUtsmoBCqzb1MLu3NAh1VX6B": "Alpha Art",
    //"617jbWo616ggkDxvW1Le8pV38XLbVSyWY8ae6QUmGBAU": "Solsea",
    //"CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz": "Solanart",
    //"A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7": "Digital Eyes",
    //"AmK5g2XcyptVLCFESBCJqoSfwV3znGoVYQnqEnaAZKWn": "Exchange Art",
};



const runSalesBot = async () => {
    console.log("starting up bot.");
    //console.log(process.env.TWITTER_API_KEY);
    // const filePic = fs.createWriteStream("pic1.jpg")
    // https.get('https://7l6llsf25kzsudnula7k7pq6yma5fk64bbq67oxfcztdf4v5k6xq.arweave.net/-vy1yLrqsyoNtFg-r74ewwHSq9wIYe-65RZmMvK9V68/?ext=jpg', response =>{
    //     response.pipe(filePic);
    // });
    // const mediaID = await client.v2.uploadMedia("pic1.jpg");
    
    // const {media_ids: mediaID } = await client.v1.uploadMedia("pic1.jpg");//, {media:{media_ids: mediaID}});
    // const {data: createdTweet } = await client.v2.tweet("Test2");//, {media:{media_ids: mediaID}});
    // console.log('Tweet', createdTweet.id, ':', createdTweet.text);

    // var procURL = "https://7l6llsf25kzsudnula7k7pq6yma5fk64bbq67oxfcztdf4v5k6xq.arweave.net/-vy1yLrqsyoNtFg-r74ewwHSq9wIYe-65RZmMvK9V68/?ext=jpg";
    // const procIMG = axios.get(procURL, { responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'binary').toString('base64'));

    // client.post('media/upload', { media_data: procIMG }, (err, data, response) => {
    //     if (!err) {
    //         const mediaIdStr = data.media_id_string;
    //         const altText = ''
    //         const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
            
    //         client.post('media/metadata/create', meta_params, function (err, data, response) {
    //             if (!err) {
    //                 const tweet = { status: "TESTING 01", media_ids: [mediaIdStr]};
                
    //                 client.post('statuses/update', tweet, function (err, data, response) {
    //                     if (!err) {
    //                         console.log(`Successfully tweeted: ${tweetText}`);
    //                     } else {
    //                         console.error(err);
    //                     }
    //                 })
    //             } else {
    //                 console.log(err);
    //             }
    //         })
    //     } else {
    //         console.log(err);
    //     }
    // });
    // client.post('statuses/update', {status: "TESTING"}, function(error, tweet, response){
    //     if(!error)
    //     {
    //         console.log(tweet);
    //     }
    //     else
    //     {
    //         console.log(error);
    //     }
    // });

    //const metadata = await Metadata.load(metaplexConnection, '5jpthLoN11TaXmiFhYRwC8YA8kU5v5WqH2gHZCbk5XZk')
    var lastPosted;
    console.log("Attempting to read history.txt");

    let signatures;
    let lastKnownSignature = fs.readFileSync("history.txt").toString();

    fs.readFile("history.txt", function(err, lastPosted){
       
        console.log(lastPosted.toString());
    })
    console.log("check:");
    console.log(lastKnownSignature);

    const options = {until : lastKnownSignature};
    while (true) {
        
        try {
            signatures = await solanaConnection.getSignaturesForAddress(projectPubKey, options);
            if (!signatures.length) {
                console.log("polling...")
                await timer(pollingInterval);
                continue;
            }
        } catch (err) {
            console.log("error fetching signatures: ", err);
            continue;
        }

        for (let i = signatures.length - 1; i >= 0; i--) {
            console.log(i);
            try {
                let { signature } = signatures[i];
                const txn = await solanaConnection.getTransaction(signature);
                if (txn.meta && txn.meta.err != null) { continue; }

                const dateString = new Date(txn.blockTime * 1000).toLocaleString();
                const price = Math.abs((txn.meta.preBalances[0] - txn.meta.postBalances[0])) / solanaWeb3.LAMPORTS_PER_SOL;
                const accounts = txn.transaction.message.accountKeys;
                const marketplaceAccount = accounts[accounts.length - 1].toString();

                //if (marketplaceMap[marketplaceAccount]) {
                    const metadata = await getMetadata(txn.meta.postTokenBalances[0].mint);
                    if (!metadata) {
                        console.log("Metadata Unavailable");
                        continue;
                    }

                    printSalesInfo(dateString, price, signature, metadata.name, marketplaceMap[marketplaceAccount], metadata.image);
                    await postSaleToDiscord(metadata.name, price.toFixed(2), dateString, signature, metadata.image, metadata.collection, metadata.attributes)
                    //await postSaleToTwitter(metadata.results.title, price.toFixed(3), dateString, signature, metadata.results.img, metadata.results.collectionTitle)
                    webURL = "https://magiceden.io/item-details/" + txn.meta.postTokenBalances[0].mint;
                    const {data: createdTweet } = await client.v2.tweet(`Gigi Sale!\n\n${metadata.name}\n\nPrice: ${price.toFixed(2)} SOL, ≈ ${(price*solPrice).toFixed(2)} USD\n\nRole${metadata.attributes[7].value}\nDate: ${dateString} ${webURL}`);
                    console.log('Tweet', createdTweet.id, ':', createdTweet.text);
                //} else {
                //    console.log("Not a supported marketplace sale");
                //}
            } catch (err) {
                console.log("Error while going through signatures: ", err);
                continue;
            }
            lastKnownSignature = signatures[i].signature;
            fs.writeFile("history.txt", lastKnownSignature, (err) => {
                if (err) console.log(err);
                console.log("Successfully saved transaction to file.");
            });
        }

        lastKnownSignature = signatures[0].signature;
        if (lastKnownSignature) {
            options.until = lastKnownSignature;

        }
    }
}
runSalesBot();

const printSalesInfo = (date, price, signature, title, marketplace, imageURL) => {
    console.log("-------------------------------------------")
    console.log("Gigi Sale!")
    console.log(`Sale at ${date} ---> ${price} SOL`)
    console.log("Signature: ", signature)
    console.log("Name: ", title)
    console.log("Image: ", imageURL)
    console.log("Marketplace: ", marketplace)
}

const timer = ms => new Promise(res => setTimeout(res, ms))

const getMetadata = async (tokenPubKey) => {
    try {
        console.log(tokenPubKey);
        // const addr = await Metadata.getPDA(tokenPubKey);
        // const resp = await Metadata.load(metaplexConnection, addr);
        // const { data } = await axios.get(resp.data.data.uri);
        let newUrl = 'https://api-mainnet.magiceden.dev/v2/tokens/' + tokenPubKey;
        const { data } = await axios.get(newUrl);
        console.log(data);
        return data;
    } catch (error) {
        console.log("error fetching metadata: ", error)
    }
}

const postSaleToDiscord = (title, price, date, signature, imageURL, collection, role) => {
    console.log(role);
    axios.post(process.env.DISCORD_URL,
        {
            "embeds": [
                {
                    "color": 0x00FF00,
                    "title": `Gigi Sale!`,
                    "description": `${title}`,
                    "fields": [
                        {
                            "name": "Price",
                            "value": `${price} SOL, ≈ ${(price*solPrice).toFixed(2)} USD`,
                            "inline": false
                        },
                        {
                            "name": "Date",
                            "value": `${date}`,
                            "inline": false
                        },
                        {
                            "name": "Role",
                            "value": `${role[7].value}`,
                            "inline": false
                        }
                        // {
                        //     "name": "Explorer",
                        //     "value": `https://explorer.solana.com/tx/${signature}`
                        // }
                    ],
                    "image": {
                        "url": `${imageURL}`,
                    }
                }
            ]
        }
    )
    console.log("Posted to discord")
}
