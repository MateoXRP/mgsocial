import { Router } from 'express';
import { Client } from 'xrpl';

const router = Router();

const PUBLIC_SERVER =
  process.env.RIPPLED_PUBLIC_WS_URL || 'wss://xrplcluster.com';
const client = new Client(PUBLIC_SERVER);

router.get('/ripple/get-trust-lines', async (req, res) => {
  const { address } = req.query;
  await client.connect();

  const data = await client.request({
    command: 'account_lines',
    account: address as string,
    ledger_index: 'validated',
  });

  await client.disconnect();
  const specs = data.result.lines.map((line) => line);

  return res.json(specs);
});

export default router;
