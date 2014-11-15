function Constructor(options) {
  this.instruction = {
    id: 0
  };
  this._block = {
    id: 0,
    list: [],
    map: {}
  };
}
module.exports = Constructor;

Constructor.create = function create(options) {
  return new Constructor(options);
};

Constructor.prototype.toJSON = function toJSON() {
  return this._block.list.map(function(block) {
    return block.toJSON();
  });
};

Constructor.prototype.block = function block(id, succ) {
  if (Array.isArray(id)) {
    succ = id;
    id = undefined;
  }

  if (!succ)
    succ = [];
  else if (!Array.isArray(succ))
    succ = [ succ ];

  if (id === undefined)
    id = 'b' + this._block.id++;

  var b = new Block(this, id);
  this._block.map[id] = b;
  this._block.list.push(b);

  b.successors = succ.map(function(succ) {
    if (succ instanceof Block)
      return succ.id;
    else
      return succ;
  });

  return b;
};

Constructor.prototype.js = function js(value) {
  return new JS(value);
};

function Block(graph, id) {
  this.graph = graph;
  this.id = id;

  this.instructions = [];
  this.successors = [];
}

Block.prototype.toJSON = function toJSON() {
  return {
    id: this.id,
    instructions: this.instructions,
    successors: this.successors
  };
};

Block.prototype.go = function go(block) {
  this.successors.push(block instanceof Block ? block.id : block);
};

Block.prototype.add = function add(type, inputs) {
  if (!inputs)
    inputs = [];
  else if (!Array.isArray(inputs))
    inputs = [ inputs ];
  var id = 'b' + this.graph.instruction.id++;

  var instr = new Instruction(id, type);
  instr.inputs = inputs.map(function(input) {
    if (input instanceof Instruction)
      return { type: 'instruction', id: input.id };
    else if (input instanceof JS)
      return { type: 'js', value: input.value };
    else
      return input;
  });

  this.instructions.push(instr);

  return instr;
};

function Instruction(id, type) {
  this.id = id;
  this.type = type;
  this.inputs = [];
}

function JS(value) {
  this.value = value;
}
