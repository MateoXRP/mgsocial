import { Router } from 'express';
import { Client } from 'xrpl';

const router = Router();

const PUBLIC_SERVER =
  process.env.RIPPLED_PUBLIC_WS_URL || 'wss://xrplcluster.com';
const client = new Client(PUBLIC_SERVER);

const MGS_ORIGIN_ADDRESS = 'rMgsw2NVqipZZhnVDN9xKuujLAWeL21qFi';

router.get('/ripple/get-trust-lines', async (req, res) => {
  const { address } = req.query;
  await client.connect();

  const {
    result: { lines },
  } = await client.request({
    command: 'account_lines',
    account: address as string,
    ledger_index: 'validated',
  });

  await client.disconnect();

  const specs = lines.map((line) => line);

  return res.json(specs);
});

router.get('/ripple/get-total-rewards', async (req, res) => {
  const { address } = req.query;
  await client.connect();

  const {
    result: { transactions },
  } = await client.request({
    command: 'account_tx',
    account: address as string,
  });

  const amount = transactions
    .map(({ tx }) => tx)
    .filter((tx) => tx && tx.TransactionType === 'Payment')
    .filter((payment) => payment && payment.Account === MGS_ORIGIN_ADDRESS)
    .filter(
      (payment) =>
        payment &&
        typeof payment === 'object' &&
        // @ts-expect-error: Missing types from module
        payment.Amount.currency === 'MGS'
    )
    .reduce(
      // @ts-expect-error: Missing types from module
      (previousValue, { Amount: { value: currentValue } }) =>
        previousValue + parseFloat(currentValue),
      0
    );

  // TODO: Disconnect client not working
  // await client.disconnect();

  return res.json({
    amount,
  });
});

export default router;
