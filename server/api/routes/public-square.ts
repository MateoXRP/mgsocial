import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/public-square/posts', async (req, res) => {
  const { xummAddress, cursor } = req.query;
  const { data } = await axios.get(
    `https://ps.mg.social/api/posts/account/${xummAddress}/?cursor=${cursor}`
  );
  return res.json(data);
});

export default router;
