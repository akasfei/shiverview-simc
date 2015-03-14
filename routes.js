var exec = require('child_process').exec;
var fs = require('fs');

var baseconf = 'threads=' + require('os').cpus().length + '\ncalculate_scale_factors=1\n';

module.exports = [
  {
    url: '/',
    method: 'get',
    handler: function (req, res, srv) {
      for (var t in req.session.simc) {
        if (typeof req.session.simc[t].href === 'undefined') {
          try {
            fs.statSync(process.cwd() + req.session.simc[t].tmp);
            req.session.simc[t].href = req.session.simc[t].tmp;
          }
          catch (e) {}
        }
      }
      res.send(req.session.simc);
    }
  },
  {
    url: '/',
    method: 'put',
    handler: function (req, res, srv) {
      if (typeof req.body.region === 'undefined' || typeof req.body.realm === 'undefined' || typeof req.body.character === 'undefined')
        return res.status(400).send();
      var conf = 'armory=' + req.body.region.toLowerCase() + ',' + req.body.realm + ',' + req.body.character + '\n' + baseconf;
      var time = new Date().getTime();
      if (time - req.session.lastsimc < 60 * 1000) return res.status(429).send();
      req.session.lastsimc = time;

      var file = req.body.character + '-' + req.body.realm + '-' + req.body.region + '-' + time + '.html';
      var output = process.cwd() + '/usercontent/simc/' + file;
      output = output.replace(/\\/g, '/');
      fs.writeFileSync(output + '.simc', conf);
      var cmd = srv.config.bin + ' ' + output + '.simc html=' + output + (req.body.spec? ' spec=' + req.body.spec : '');
      if (typeof req.session.simc === 'undefined') req.session.simc = {};
      req.session.simc[time] = req.body;
      req.session.simc[time].time = new Date(time);
      req.session.simc[time].tmp = '/usercontent/simc/' + file;
      var child = exec(cmd, {cwd: srv.config.cwd}, function (err, stdout, stderr) { });
      res.send();
    }
  }
]
