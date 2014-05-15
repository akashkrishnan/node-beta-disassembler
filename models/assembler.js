var Config = require('../config.js');

var optable = [
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  'LD', 'ST', null, 'JMP', 'BEQ', 'BNE', null, 'LDR',
  'ADD', 'SUB', 'MUL', 'DIV', 'CMPEQ', 'CMPLT', 'CMPLE', null,
  'AND', 'OR', 'XOR', 'XNOR', 'SHL', 'SHR', 'SRA', null,
  'ADDC', 'SUBC', 'MULC', 'DIVC', 'CMPEQC', 'CMPLTC', 'CMPLEC', null,
  'ANDC', 'ORC', 'XORC', 'XNORC', 'SHLC', 'SHRC', 'SRAC', null
];

module.exports = {
  disassemble: disassemble
};

function disassemble(output, done) {
  var assembly = '';
  if (output) {

    var instructions = output.replace(/\s+/g, ' ').split(' ');
    for (var i = 0; i < instructions.length; i++) {

      var instruction = parseInt(instructions[i], 16);
      if (instruction >= 0) {

        var opclass = instruction >>> 30;
        var opcode = extract(instruction, 31, 26);
        var op = optable[opcode];

        var Rc = reg(extract(instruction, 25, 21));
        var Ra = reg(extract(instruction, 20, 16));
        var Rb = reg(extract(instruction, 15, 11));
        var literal = '0x' + hex(extract(instruction, 15, 0));

        var args = '0x' + hex(instruction);
        if (op) {
          if (opclass == 1) {
            args = Ra + ',' + literal + ',' + Rc;
            if (op === 'ST') args = Rc + ',' + literal + ',' + Ra;
            else if (op === 'JMP') args = Ra + ',' + Rc;
            else if (op === 'LDR') args = literal + ',' + Rc;
          }
          else if (opclass == 2) args = Ra + ',' + Rb + ',' + Rc;
          else if (opclass == 3) args = Ra + ',' + literal + ',' + Rc;
        }

        assembly += (op ? op : 'LONG') + '(' + args + ')\n';

      }

    }

  }
  done(undefined, assembly);
}

function extract(instruction, max, min) {
  return (instruction << (31 - max)) >>> (31 - max + min);
}

function reg(r) {
  return 'R' + r;
}

function hex(d) {
  return (d < 0 ? (0xFFFFFFFF + d + 1) : d).toString(16);
}
