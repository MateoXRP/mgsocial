import { Router } from 'express';
import { XummSdk, XummTypes } from 'xumm-sdk';

const router = Router();

const Sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

interface Payload {
  protocol: string;
  host: string;
  userToken?: string;
  destination: string;
  identifier: string;
  senderId: string;
  receiverId: string;
  postId: string;
  currency: string;
  issuer?: string;
  amount: string;
}

const createPayload = ({
  protocol,
  host,
  userToken,
  destination,
  identifier,
  senderId,
  receiverId,
  postId,
  currency,
  issuer = '',
  amount,
}: Payload) => {
  const newPayload: XummTypes.CreatePayload = {
    user_token: userToken,
    txjson: {
      TransactionType: 'Payment',
      Destination: destination,
      Amount:
        currency === 'XRP'
          ? (Number(amount) * 1000000).toString()
          : {
              currency,
              issuer,
              value: amount,
            },
    },
    custom_meta: {
      identifier,
      blob: {
        TransactionType: 'Payment',
        sender_guid: senderId,
        received_guid: receiverId,
        post_guid: postId,
        amount,
        currency,
        issuer,
      },
    },
    options: {
      submit: true,
      multisign: false,
      return_url: {
        web:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : `${protocol}://${host}`,
      },
    },
  };

  return newPayload;
};

router.post('/xumm/payment', async (req, res) => {
  const {
    destination,
    senderId,
    receiverId,
    postId,
    currency,
    issuer,
    amount,
    userToken,
  } = req.body;

  const newPayload = createPayload({
    protocol: req.protocol,
    host: req.get('host')!,
    userToken,
    destination,
    identifier: Date.now() + '_' + senderId,
    senderId,
    receiverId,
    postId,
    currency,
    issuer,
    amount,
  });

  const result = await Sdk.payload.create(newPayload);

  if (result) {
    return res.json({
      success: true,
      result,
    });
  }

  return res.json({
    success: false,
  });
});

router.post('/xumm/signin', async (req, res) => {
  const { userId } = req.body;
  const result = await Sdk.payload.create({
    txjson: {
      TransactionType: 'SignIn',
    },
    options: {
      submit: true,
    },
    custom_meta: {
      identifier: Date.now() + '_' + userId,
      blob: {
        TransactionType: 'SignIn',
        userId,
      },
    },
  });

  return res.json(result);
});

router.get('/xumm/signin', async (req, res) => {
  const { userId } = req.query;
  const result = await Sdk.payload.create({
    txjson: {
      TransactionType: 'SignIn',
    },
    options: {
      submit: true,
    },
    custom_meta: {
      identifier: Date.now() + '_' + userId,
      blob: {
        TransactionType: 'SignIn',
        userId,
      },
    },
  });

  return res.json(result);
});

router.post('/xumm/public-square', async (req, res) => {
  const { text } = req.body;

  const result = await Sdk.payload.create({
    txjson: {
      TransactionType: 'Payment',
      Destination: 'r9pRgEJnRvYsTg3hxGScPx4WTapj2KYLRp',
      DestinationTag: 99,
      Amount: {
        currency: 'MGS',
        value: '1',
        issuer: 'rHP4bHzghBdzskqcaPciL5WRGkHosB5zYx',
      },
      Memos: [
        {
          Memo: {
            MemoData: Buffer.from(text).toString('hex'),
          },
        },
      ],
    },
    options: {
      submit: true,
    },
  });

  if (result) {
    return res.json({
      success: true,
      result,
    });
  }

  return res.json({
    success: false,
  });
});

export default router;
