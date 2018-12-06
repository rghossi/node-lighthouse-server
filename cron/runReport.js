const CronJob = require('cron').CronJob;
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const Report = require('../models/Report');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const saveResults = async (results) => {
  const report = {
    perfScore: results.categories.performance.score,
    firstContentfulPaint: results.audits['first-contentful-paint'].rawValue,
    speedIndex: results.audits['speed-index'].rawValue,
    timeToInteractive: results.audits.interactive.rawValue,
    json: JSON.stringify(results),
  }

  return new Report(report).save();
}

module.exports = function setupReportCron(url) {
  const opts = {
    chromeFlags: ['--show-paint-rects', '--headless']
  };

  const reportJob = new CronJob('0 0 * * * *', async () => {
    const results = await launchChromeAndRunLighthouse(url, opts);
    await saveResults(results);
  }, null, true, 'America/Sao_Paulo');

  reportJob.start();
}
