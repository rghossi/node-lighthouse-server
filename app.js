const express = require('express');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const Report = require('./models/Report');
const setupMongoDB = require('./db/config');
const setupReportCron = require('./cron/runReport');

const app = express();
const PORT = process.env.PORT || 3001;

setupMongoDB();
setupReportCron('https://gupy.gupy.io/candidates');

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  const reports = (await Report.find().sort({ createdAt: 'asc' })) || [];
  res.render('index', { reports })
});

app.get('/:reportId', async (req, res) => {
  const report = (await Report.findOne({ _id: req.params.reportId })) || {};
  const html = ReportGenerator.generateReport(JSON.parse(report.json), 'html');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Magic happens at ${PORT}`);
});
