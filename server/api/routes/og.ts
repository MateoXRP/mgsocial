import { Router } from 'express';
import getUrls from 'get-urls';
import ogs from 'open-graph-scraper';

const router = Router();

const userAgent = 'Googlebot/2.1 (+http://www.google.com/bot.html)';

router.get('/open-graph-scraper', async (req, res) => {
  const { url, content } = req.query;

  if (url) {
    const options = {
      url: url as string,
      // Adding user agent let's us scrape twitter images
      headers: {
        'user-agent': userAgent,
      },
    };
    const { result } = await ogs(options);
    return res.json(result);
  }

  if (content) {
    const urls = getUrls(content as string, {
      requireSchemeOrWww: true,
    });

    // Return if there are no urls in text
    if (!urls.size) {
      return res.json({
        success: false,
        message: 'No url found',
      });
    }

    // Retrieve first URL in text - urls are already normalized
    const url = urls.values().next().value;
    const options = {
      url,
      // Adding user agent let's us scrape twitter images
      headers: {
        'user-agent': userAgent,
      },
    };

    try {
      const { result } = await ogs(options);
      return res.json(result);
    } catch (e) {
      return res.json({
        success: false,
        message: 'Server error',
      });
    }
  }
});

export default router;
