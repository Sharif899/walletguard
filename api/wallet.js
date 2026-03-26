// api/wallet.js
// =============
// Vercel Serverless Function — runs on the SERVER, not the browser.
// This calls Etherscan on behalf of the website and sends data back.
// This completely solves the CORS problem.

export default async function handler(req, res) {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { address } = req.query;

  // Validate address
  if (!address || !address.startsWith("0x") || address.length !== 42) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const API_KEY = "4T17JPVZ2MZKACBYNT2IWBXAX33ZM372QZ";
  const BASE    = "https://api.etherscan.io/api";

  try {
    // Fetch last 100 transactions for this wallet
    const url = `${BASE}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data     = await response.json();

    if (data.status !== "1") {
      return res.status(200).json({ transactions: [] });
    }

    return res.status(200).json({ transactions: data.result });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch from Etherscan" });
  }
}
