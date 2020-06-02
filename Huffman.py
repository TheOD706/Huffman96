#code message from byte array to printable symbol string
# in constructor set alphabet
# for compress use Huffman algorithm
# zero step - calculate number chars of alphabete inside data
# first step write lengths of dictionary's element
# second step write dictionary
#dictionary in format x^n[0]+(1-x)^n[1]...![+...] where n = vector of alphabet elements length, a = vector of codes each alphabet element, x = a[0].length % 2, n[0] != a[0].length => n[0] = (a[0].length + 1) / 2, a[0].length = n[0] * 2 - 1 ; n[i] = a[i].length, i >= 1
# third step - length of message in 15th base
#4th digit sequence transform to int ___ if next item is 1111 then it is end of sequence
# 4th step - code all data in message
import io
from collections import deque
class Huffman96(object):
    incomeAlphabet = None
    alphabetLong = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_";
    alphabetShort = "`abcdefghijklmnopqrstuvwxyz{|}~\t";

    def __init__(self, iA):
        t0 = str(type(iA))
        self.incomeAlphabet = []
        if t0 == "<class 'NoneType'>":
            for i0 in range(256):
                self.incomeAlphabet.append(i0)
        elif t0 == "<class 'str'>":
            for i0 in iA:
                self.incomeAlphabet.append(ord(i0))
        elif t0 == "<class 'list'>":
            incomeAlphabet = iA.copy()
        elif t0 == "<class 'bytes'>":
            for i0 in iA:
                self.incomeAlphabet.append(int(i0))
        elif t0 == "<class 'bytearray'>":
            for i0 in iA:
                self.incomeAlphabet.append(int(i0))
        else:
            print("bad format of income alphabet")
            incomeAlphabet = None
        pass

    def Encode(self, msg):
        if type(msg) == type(""):
            msg = bytearray(msg, encoding = 'utf8')
        else:
            msg = bytearray(msg)
        tree0 = []  #tree of Node fill all possible in order of incomeAlphabet
        for i0 in self.incomeAlphabet:
            tree0.append(Node(i0))
        #count all element from message
        for i0 in msg:
            tree0[self.incomeAlphabet.index(i0)].inc()
        #colapse tree
        while len(tree0) > 1:
            last2elem = []
            for i0 in tree0:
                if len(last2elem) == 0:
                    last2elem.append(i0)
                elif len(last2elem) == 1:
                    if last2elem[0].number > i0.number:
                        last2elem.append(last2elem[0])
                        last2elem[0] = i0
                    else:
                        last2elem.append(i0)
                else:
                    if i0.number < last2elem[0].number:
                        last2elem[1] = last2elem[0]
                        last2elem[0] = i0
                    elif i0.number < last2elem[1].number:
                        last2elem[1] = i0
            tree0.append(Node(-1).Insert(last2elem[1], last2elem[0]))
            tree0.remove(last2elem[1])
            tree0.remove(last2elem[0])
        #decolapse tree
        dict0 = tree0[0].Codize("", {})
        res0 = io.StringIO()
        buf0 = deque([], None)
        #code legend
        x = (len(dict0[self.incomeAlphabet[0]]) % 2) == 1
        n0 = (len(dict0[self.incomeAlphabet[0]]) + 1) // 2
        while n0 > 0:
            buf0.append(x)
            n0 -= 1
        for i0 in range(1, len(self.incomeAlphabet)):
            x = not x
            n0 = len(dict0[self.incomeAlphabet[i0]])
            while n0 > 0:
                buf0.append(x)
                n0 -= 1
        x = not x
        buf0.append(x)
        for i0 in range(len(self.incomeAlphabet)):
            for i1 in dict0[self.incomeAlphabet[i0]]:
                buf0.append(i1 == "1") 
        #code length of message
        x = len(msg)
        buf1 = deque([True, True, True, True], None) 
        while x > 0:
            j0 = x % 15
            x //= 15
            for i0 in range(4):
                buf1.appendleft(j0 % 2 == 1)
                j0 //= 2
        buf0.extend(buf1)
        #same encode message
        for i0 in msg:
            for i1 in dict0[i0]:
                buf0.append(i1 == "1")
            while len(buf0) > 6:
                if buf0.popleft():
                    n0 = 6
                    j0 = 0
                    while n0 > 0:
                        j0 *= 2
                        if buf0.popleft():
                            j0 += 1
                        n0 -= 1
                    res0.write(self.alphabetLong[j0])
                else:
                    n0 = 5
                    j0 = 0
                    while n0 > 0:
                        j0 *= 2
                        if buf0.popleft():
                            j0 += 1
                        n0 -= 1
                    res0.write(self.alphabetShort[j0])
        buf0.append(True)
        for i0 in range(10):
            buf0.append(False)
        while len(buf0) > 6:
            if buf0.popleft():
                n0 = 6
                j0 = 0
                while n0 > 0:
                    j0 *= 2
                    if buf0.popleft():
                        j0 += 1
                    n0 -= 1
                res0.write(self.alphabetLong[j0])
            else:
                n0 = 5
                j0 = 0
                while n0 > 0:
                    j0 *= 2
                    if buf0.popleft():
                        j0 += 1
                    n0 -= 1
                res0.write(self.alphabetShort[j0])
        return res0.getvalue()

    def Binarize(self, smb):
        if smb in self.alphabetLong:
            n0 = self.alphabetLong.index(smb)
            res0 = ""
            n1 = 6
            while n1 > 0:
                res0 = ("1" if n0 % 2 == 1 else "0") + res0
                n0 //= 2
                n1 -= 1
            return "1" + res0
        else:
            n0 = self.alphabetShort.index(smb)
            res0 = ""
            n1 = 5
            while n1 > 0:
                res0 = ("1" if n0 % 2 == 1 else "0") + res0
                n0 //= 2
                n1 -= 1
            return "0" + res0

    def Decode(self, msg):
        j0 = 0
        buf0 = self.Binarize(msg[j0])
        j0 += 1
        j1 = 0 #index of begin seqence 
        j2 = 1 #index of end sequence
        #detect codes lengths
        x = buf0[0:1] == "1"
        lng0 = []
        for i0 in range(len(self.incomeAlphabet)):
            while buf0[j1] == buf0[j2]:
                j2 += 1
                while j2 + 1 >= len(buf0):
                    buf0 += self.Binarize(msg[j0])
                    j0 += 1
            j3 = j2 - j1
            if i0 == 0:
                lng0.append(j3 * 2 - 1 + (0 if x else 1))
            else:
                lng0.append(j3)
            j1 = j2
            j2 = j1 + 1
        while j2 + 1 >= len(buf0):
            buf0 += self.Binarize(msg[j0])
            j0 += 1
        buf0 = buf0[j2:]
        #fill dictionary of codes & find max length
        j1 = 0  #max
        dict0 = {}
        for i0 in range(len(lng0)):
            while len(buf0) <= lng0[i0]:
                buf0 += self.Binarize(msg[j0])
                j0 += 1
            dict0[buf0[0:lng0[i0]]] = chr(self.incomeAlphabet[i0])
            buf0 = buf0[lng0[i0]:]
            if lng0[i0] > j1:
                j1 = lng0[i0]
        # detect message length
        j3 = 0
        while True:
            while len(buf0) <= 4:
                buf0 += self.Binarize(msg[j0])
                j0 += 1
            if buf0[0:4] == "1111":
                buf0 = buf0[4:]
                break
            else:
                j3 *= 15
                j2 = 0
                for i0 in range(4):
                    j2 *= 2
                    j2 += (1 if buf0[i0:i0 + 1] == "1" else 0)
                buf0 = buf0[4:]
                j3 += j2
        # same message decode
        res0 = io.StringIO()
        while j0 < len(msg) and j3 > 0:
            while len(buf0) <= j1:
                buf0 += self.Binarize(msg[j0])
                j0 += 1
            j2 = j1
            while j2 > 0:
                if buf0[0:j2] in dict0:
                    res0.write(dict0[buf0[0:j2]])
                    buf0 = buf0[j2:]
                    j3 -= 1
                    break
                j2 -= 1
            if j2 == 0:
                break
        return res0.getvalue()

class Node(object):
    def __init__(self, symb):
        self.upper = None   #upper branch get append 1 on collapse tree
        self.lower = None   #lower branch get append 0 on collapse tree
        self.symbol = int(symb) #same symbol
        self.code = ""      #string of 0 and 1 's that put in output instead his symbol
        self.number = 0     #count how much his symbol in message

    def inc(self):
        self.number += 1
        return None

    def Codize(self, code, dict):
        self.code = code
        if self.upper == None and self.lower == None:
            dict[self.symbol] = self.code
        else:
            dict = self.upper.Codize(self.code + "1", dict)
            dict = self.lower.Codize(self.code + "0", dict)
        return dict

    def Insert(self, up, down):
        self.upper = up
        self.lower = down
        self.number = up.number + down.number
        return self
