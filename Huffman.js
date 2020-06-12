/**
 *code message from byte array to printable symbol string
 * in constructor set alphabet
 * for compress use Huffman algorithm
 * zero step - calculate number chars of alphabete inside data
 * first step write lengths of dictionary's element
 * second step write dictionary
 *dictionary in format x^n[0]+(1-x)^n[1]...![+...] where n = vector of alphabet elements length, a = vector of codes each alphabet element, x = a[0].length % 2, n[0] != a[0].length => n[0] = (a[0].length + x) / 2, a[0].length = n[0] * 2 - x ; n[i] = a[i].length, i >= 1
 * third step - length of message in 15th base
 *4th digit sequence transform to int ___ if next item is 1111 then it is end of sequence
 * 4th step - code all data in message
 **/
window.Huffman96 = function(a) {
  this.incomeAlphabet = undefined;
  this.alphabetLong = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_";
  this.alphabetShort = "`abcdefghijklmnopqrstuvwxyz{|}~\t";
  switch (typeof a) {
    case "undefined":
      this.incomeAlphabet = [];
      for (var i0 = 0; i0 < 256; i0++) this.incomeAlphabet.push(i0);
      break;
    case "string":
      this.incomeAlphabet = [];
      for (var i0 = 0; i0 < a.length; i0++)
        if (!this.incomeAlphabet.includes(a.charCodeAt(i0)))
          this.incomeAlphabet.push(a.charCodeAt(i0));
      break;
    case "object":
      if (a.__proto__.constructor.name == "Uint8Array") {
        this.incomeAlphabet = [];
        for (var i0 = 0; i0 < a.length; i0++)
          if (!this.incomeAlphabet.includes(a[i0]))
            this.incomeAlphabet.push(a[i0]);
      }
      if (a.__proto__.constructor.name == "Array") {
        this.incomeAlphabet = a;
      }
      //console.log(a.__proto__.constructor.name);
      break;
    default:
      console.log(typeof a);
      break;
  }

  this.CNode = function(smb) {
    this.upper = undefined;
    this.lower = undefined;
    this.symb = smb;
    this.code = "";
    this.count = 0;

    this.Inc = function() {
      this.count++;
    };

    this.Codize = function(c, d) {
      this.code = c;
      if (this.upper == undefined && this.lower == undefined) {
        d[this.symb] = this.code;
      } else {
        d = this.upper.Codize(this.code + "1", d);
        d = this.lower.Codize(this.code + "0", d);
      }
      return d;
    };

    this.Insert = function(u, l) {
      this.upper = u;
      this.lower = l;
      this.count = u.count + l.count;
      return this;
    };
  };

  this.Encode = function(msg) {
    //count of each content element
    var tree0 = {};
    for (var i0 = 0; i0 < this.incomeAlphabet.length; i0++) tree0[i0] = new this.CNode(this.incomeAlphabet[i0]);
    switch (msg.__proto__.constructor.name) {
      case "String":
        var msgt = [];
        for (var i0 = 0; i0 < msg.length; i0++) {
          var j0 = this.incomeAlphabet.indexOf(msg.charCodeAt(i0));
          msgt.push(msg.charCodeAt(i0));
          tree0[j0].Inc();
        }
        msg = msgt;
        break;
      case "Array":
        var j1 = 0;
        var msgt = [];
        for (var i0 = 0; i0 < msg.length; i0++) {
          var j0 = this.incomeAlphabet.indexOf(msg[i0]);
          if (j0 < 0) {
            msg[i0] = undefined;
            if (i0 - 1 > j1) {
              msgt = msgt.concat(msg.slice(j1, i0));
            }
            j1 = i0 + 1;
          } else {
            tree0[j0].Inc();
          }
        }
        if (j1 > 0) {
          if (msg.length - 1 > j1) {
            msgt = msgt.concat(msg.slice(j1, msg.length));
          }
          msg = msgt;
        }
        break;
      default:
        console.log("Incorrect type of income message!");
        return "";
    }
    //collapse
    var keys0 = Object.keys(tree0);
    var j0 = -1;
    while (keys0.length > 1 && keys0.length < 260) {
      var last2elem = [];
      for (var i0 = 0; i0 < keys0.length; i0++) {
        if (last2elem.length == 0) {
          last2elem.push(tree0[keys0[i0]]);
        } else {
          if (last2elem.length == 1) {
            if (last2elem[0].count > tree0[keys0[i0]].count) {
              last2elem.unshift(tree0[keys0[i0]]);
            } else {
              last2elem.push(tree0[keys0[i0]]);
            }
          } else {
            if (tree0[keys0[i0]].count < last2elem[1].count) {
              if (tree0[keys0[i0]].count < last2elem[0].count) {
                last2elem.pop();
                last2elem.unshift(tree0[keys0[i0]]);
              } else {
                last2elem.pop();
                last2elem.push(tree0[keys0[i0]]);
              }
            }
          }
        }
      }
      tree0[j0] = (new this.CNode(j0)).Insert(last2elem[1], last2elem[0]);
      j0--;
      var j1 = this.incomeAlphabet.indexOf(last2elem[0].symb);
      if (j1 > -1) delete tree0[j1];
      else delete tree0[last2elem[0].symb];
      j1 = this.incomeAlphabet.indexOf(last2elem[1].symb);
      if (j1 > -1) delete tree0[j1];
      else delete tree0[last2elem[1].symb];
      keys0 = Object.keys(tree0);
    }
    //decollapse tree
    var dict0 = tree0[keys0[0]].Codize("", {});
    tree0 = null;
    var buf0 = "";
    //write alphabet
    var x = dict0[this.incomeAlphabet[0]].length % 2;
    j0 = Math.floor((dict0[this.incomeAlphabet[0]].length + x) / 2);
    for (var i0 = 0; i0 < j0; i0++) buf0 += x.toString();
    x = 1 - x;
    for (var i0 = 1; i0 < this.incomeAlphabet.length; i0++) {
      j0 = dict0[this.incomeAlphabet[i0]].length;
      for (var i1 = 0; i1 < j0; i1++) buf0 += x.toString();
      x = 1 - x;
    }
    buf0 += x.toString();
    for (var i0 = 0; i0 < this.incomeAlphabet.length; i0++) {
      buf0 += dict0[this.incomeAlphabet[i0]];
    }
    //write msg length
    x = "1111";
    j0 = msg.length;
    while (j0 > 0) {
      var j1 = j0 % 15;
      for (var i0 = 0; i0 < 4; i0++) {
        x = (j1 % 2).toString() + x;
        j1 = Math.floor(j1 / 2);
      }
      j0 = Math.floor(j0 / 15);
    }
    buf0 += x;
    //same msg coding
    var res0 = {
      out: "",
      buf: buf0
    };
    for (var i0 = 0; i0 < msg.length; i0++) {
      res0.buf += dict0[msg[i0]];
      res0 = this.Unbinarize(res0);
    }
    while (res0.buf.length < 16) res0.buf += "0";
    res0 = this.Unbinarize(res0);
    return res0.out;
  };

  this.Decode = function(msg) {
    if (typeof msg != "string") {
      console.log("incorrect input data!");
      return [];
    }
    var buf0 = this.Binarize(msg.charAt(0));
    var j0 = 1; // index of message
    var j1 = 0; // index of begin sequence
    var j2 = 1; // index of end sequence
    //detect codes length
    var x = buf0.startsWith("1");
    var lng0 = [];
    var j3 = -1;
    for (var i0 = 0; i0 < this.incomeAlphabet.length; i0++) {
      while (buf0[j1] == buf0[j2]) {
        j2++;
        while (j2 + 1 >= buf0.length) {
          buf0 += this.Binarize(msg.charAt(j0));
          j0++;
        }
      }
      j3 = j2 - j1;
      if (i0 == 0) {
        lng0.push(j3 * 2 - ((x) ? 1 : 0));
      } else {
        lng0.push(j3);
      }
      j1 = j2;
      j2++;
    }
    while (j2 + 1 >= buf0.length) {
      buf0 += this.Binarize(msg.charAt(j0));
      j0++;
    }
    buf0 = buf0.substring(j2);
    //fill dictionary by lengths & find max length
    j1 = 0; //max
    var dict0 = {};
    for (var i0 = 0; i0 < lng0.length; i0++) {
      while (buf0.length <= lng0[i0]) {
        buf0 += this.Binarize(msg.charAt(j0));
        j0++;
      }
      dict0[buf0.substring(0, lng0[i0])] = this.incomeAlphabet[i0];
      buf0 = buf0.substring(lng0[i0]);
      if (lng0[i0] > j1) {
        j1 = lng0[i0];
      }
    }
    //detect message length
    j3 = 0; //leength value here
    while (true) {
      while (buf0.length <= 4) {
        buf0 += this.Binarize(msg.charAt(j0));
        j0++;
      }
      if (buf0.substring(0, 4) == "1111") {
        buf0 = buf0.substring(4);
        break;
      } else {
        j3 *= 15;
        j2 = 0;
        for (var i0 = 0; i0 < 4; i0++) {
          j2 *= 2;
          if (buf0.charAt(i0) == "1") j2++;
        }
        buf0 = buf0.substring(4);
        j3 += j2;
      }
    }
    //same message decode
    var res0 = [];
    while (j3 > 0) {
      while (buf0.length < j1) {
        buf0 += this.Binarize(msg.charAt(j0));
        j0++;
      }
      j2 = j1;
      while (j2 > 0) {
        if (dict0.hasOwnProperty(buf0.substring(0, j2))) {
          res0.push(dict0[buf0.substring(0, j2)]);
          buf0 = buf0.substring(j2);
          j3--;
          break;
        }
        j2--;
        if (j2 == 0) {
          console.log("Some error on decode");
          break;
        }
      }
    }
    return res0;
  };

  this.Unbinarize = function(x) {
    while (x.buf.length > 7) {
      var j0 = 0;
      if (x.buf.startsWith("1")) {
        for (var i0 = 1; i0 < 7; i0++) {
          j0 *= 2;
          if (x.buf.charAt(i0) == "1") j0++;
        }
        x.out += this.alphabetLong.charAt(j0);
        x.buf = x.buf.substring(7);
      } else { //"0"
        for (var i0 = 1; i0 < 6; i0++) {
          j0 *= 2;
          if (x.buf.charAt(i0) == "1") j0++;
        }
        x.out += this.alphabetShort.charAt(j0);
        x.buf = x.buf.substring(6);
      }
    }
    return x;
  };

  this.Binarize = function(x) {
    if (this.alphabetLong.includes(x)) {
      var j0 = this.alphabetLong.indexOf(x);
      var s0 = "";
      for (var i0 = 0; i0 < 6; i0++) {
        s0 = (j0 % 2).toString() + s0;
        j0 = Math.floor(j0 / 2);
      }
      return "1" + s0;
    }
    if (this.alphabetShort.includes(x)) {
      var j0 = this.alphabetShort.indexOf(x);
      var s0 = "";
      for (var i0 = 0; i0 < 5; i0++) {
        s0 = (j0 % 2).toString() + s0;
        j0 = Math.floor(j0 / 2);
      }
      return "0" + s0;
    }
  };
};
