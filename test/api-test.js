var graph = require('../');
var ir = require('cfg-ir');

describe('CFG Graph', function() {
  it('should construct graph', function() {
    var g = graph.create();

    var b = g.block([ 'b2', 'b3' ]);

    var cond = b.add('cond');
    b.add('branch', [ cond ]);

    var b = g.block('b2');
    b.add('ret', g.js(1));

    var b = g.block('b3');
    b.add('ret', g.js(2));

    console.log(g.toJSON());
    console.log(ir.stringify(g.toJSON()));
  });
});
