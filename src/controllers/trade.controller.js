import { asyncHandling } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Trade } from "../models/trade.model.js";
import csvtojson from "csvtojson";
import fs from "fs";

//Task -1 
const updloadcsvtomongodb = asyncHandling(async (req, res) => {

    const csvFilePath = req.file.path;

    if (!csvFilePath) {
      throw new ApiError(400, "Please upload a file");
    }

    const jsonArray = await csvtojson().fromFile(csvFilePath);

    if (!jsonArray) {
      throw new ApiError(500, "File not uploaded");
    }

    const tradeslist = jsonArray.map((trade)=>{
        const [baseCoin, quoteCoin] = trade.Market.split('/');
      return {
        utctime: new Date(trade.UTC_Time),
        operation: trade.Operation,
        basecoin:baseCoin,
        quotecoin:quoteCoin,
        amount: parseFloat(trade['Buy/Sell Amount']),
        price: parseFloat(trade.Price),
      };
    })

    const trades = await Trade.insertMany(tradeslist);

    if(!trades){
        throw new ApiError(500, "Error in saving data");
    }

    fs.unlinkSync(csvFilePath); 

    return res.json(new apiResponse(200, trades, "Data saved successfully"));
});

//Task -2
const getAssestBalancedata= asyncHandling(async (req, res) => {
  const { timestamp } = req.body;
  if (!timestamp) {
    throw new ApiError(400, "Please provide a timestamp");
  }
  const timestampDate = new Date(timestamp);
  const trades = await Trade.find({ utctime: { $lte: timestampDate } });

  if (!trades) {
    throw new ApiError(404, "No trades found");
  }
  // console.log(trades);

  const balanceMap = {};

  trades.forEach(trade => {
    const { basecoin, amount, operation } = trade;

    if (!balanceMap[basecoin]) {
      balanceMap[basecoin] = 0;
    }

    if (operation === 'Buy') {
      balanceMap[basecoin] += amount;
    } else if (operation === 'Sell') {
      balanceMap[basecoin] -= amount;
    }
    console.log(balanceMap );
  });

  Object.keys(balanceMap).forEach(key => {
    if (balanceMap[key] === 0) {
      delete balanceMap[key];
    }
  });

  if (Object.keys(balanceMap).length === 0) {
    throw new ApiError(404, "No asset balance found");
  }

  return res.json(new apiResponse(200, balanceMap, "Asset balance data fetched successfully"));
});
export { updloadcsvtomongodb, getAssestBalancedata};   