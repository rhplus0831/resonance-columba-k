import { columbaCol } from "@/firebase/app";
import { GetPricesProducts, LbGetPricesProducts } from "@/interfaces/get-prices";
import { lowBandwidthResponse } from "@/utils/price-api-compressor";
import { convertFirebaseDataToGetPricesData } from "@/utils/price-api-utils";
import { json } from "node:stream/consumers";
import { CITIES_MAP, GOODS_MAP } from "resonance-data-columba-k/dist/columbabuild";
import { FirestoreProducts } from "@/interfaces/get-prices";

export const dynamic = "force-dynamic";
export const revalidate = 90;

let cache: LbGetPricesProducts | null = null;
let cacheTime = 0;

const updateInterval = 1000 * 60 * 10;
let updateTime = 0;

const buildResponse = (data: LbGetPricesProducts) => {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, s-max-age=${revalidate}`,
      "CDN-Cache-Control": `public, s-max-age=${revalidate}, stale-while-revalidate=0`,
      "Vercel-CDN-Cache-Control": `public, s-max-age=${revalidate}, stale-while-revalidate=0`,
    },
  });
};

interface StationData {
  id: number;
  code: string;
  last_update: string;
  data: string;
}

interface GoodsInfo {
    sell_price: {
        [itemId: string]: {
            name?: string;
            price: number;
            stock: number;
            trend: number;
            quota: number;
            trade_num: number;
            is_rise: number;
            ti?: number;
            not_num: number;
            is_rare?: number;
        };
    };
    buy_price: {
        [itemId: string]: {
            name?: string;
            price: number;
            trend: number;
            quota: number;
            trade_num: number;
            is_rise: number;
            ti?: number;
            not_num: number;
            is_rare?: number;
        };
    };
}

function processGoodsData(processed: FirestoreProducts, goodsInfo: GoodsInfo, stationId: string) {
  const cityId: string = CITIES_MAP[stationId] || stationId;
  const currentTime = Math.floor(Date.now() / 1000);

  if (goodsInfo.sell_price) {
      for (const [itemId, item] of Object.entries(goodsInfo.sell_price)) {
          const productName = GOODS_MAP[String(itemId)] || itemId;
          
          if (!processed[productName]) {
              processed[productName] = {
                  sell: {},
                  buy: {}
              };
          }

          const seconds = item.ti ? Math.floor(item.ti) : currentTime;
          const nanoseconds = item.ti ? Math.floor((item.ti % 1) * 1e9) : 0;

          processed[productName].buy[cityId] = {
              trend: item.trend > 0 ? "up" : "down",
              variation: Math.round(item.quota*100) || 100,
              time: {
                  _seconds: seconds,
                  _nanoseconds: nanoseconds
              },
              price: item.price
          };
      }
  }

  // buy_price 처리
  if (goodsInfo.buy_price) {
    for (const [itemId, item] of Object.entries(goodsInfo.buy_price)) {
      const productName = GOODS_MAP[String(itemId)] || itemId;
          
      if (!processed[productName]) {
          processed[productName] = {
              sell: {},
              buy: {}
          };
      }

      const seconds = item.ti ? Math.floor(item.ti) : currentTime;
      const nanoseconds = item.ti ? Math.floor((item.ti % 1) * 1e9) : 0;

      processed[productName].sell[cityId] = {
          trend: item.trend > 0 ? "up" : "down",
          variation: item.quota*100 || 100,
          time: {
              _seconds: seconds,
              _nanoseconds: nanoseconds
          },
          price: item.price
      };
    }
  }

  for (const [productName, product] of Object.entries(processed)) {
    if (!processed[productName]) {
        processed[productName] = {
            sell: {},
            buy: {}
        };
    }
    
    Object.assign(processed[productName].sell, product.sell);
    Object.assign(processed[productName].buy, product.buy);
  }

  return processed;
}

async function updateData() {
  const res = await fetch("https://res-price.mephistopheles.moe/api/station");
  var processed: FirestoreProducts = {};
  const data = await res.json() as StationData[];
  for (const station of data) {
    const goodsInfo = JSON.parse(station.data) as GoodsInfo;
    processed = processGoodsData(processed, goodsInfo, station.code);
  }
  const docRef = columbaCol.doc("productsV2");
  await docRef.set(processed);
  console.log("Updated data");
}

export async function GET() {
  if (Date.now() - updateTime > updateInterval) {
    updateTime = Date.now();
    console.log("Start updating data");
    updateData();
  }

  if (cache && Date.now() - cacheTime < revalidate * 1000) {
    console.log("Returning cached data cached at " + cacheTime);
    return buildResponse(cache);
  }

  try {
    console.log("Fetching data");

    const docRef = columbaCol.doc("productsV2");
    const docSnapshot = await docRef.get();
    const data = docSnapshot.data();
    if (!data) {
      throw new Error("no data");
    }

    const responseData: GetPricesProducts = convertFirebaseDataToGetPricesData(data);

    const lbResponseData: LbGetPricesProducts = lowBandwidthResponse(responseData);

    cache = lbResponseData;
    cacheTime = Date.now();
    console.log("Cached at " + cacheTime);

    // return Response.json({ data: lbResponseData });
    return buildResponse(lbResponseData);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "failed to load data" }); // todo: status code and interface
  }
}
