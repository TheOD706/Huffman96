/**Huffman compress method to 96 based printable alphabet
* in constructor set alphabet
* for compress use Huffman algorithm
* zero step - calculate number chars of alphabete inside data
* first step write lengths of dictionary's element
* second step write dictionary
*dictionary in format x^n[0]+(1-x)^n[1]...![+...] where n = vector of alphabet elements length, a = vector of codes each alphabet element, x = a[0].length % 2, n[0] != a[0].length => n[0] = (a[0].length + 1) / 2, a[0].length = n[0] * 2 - 1 ; n[i] = a[i].length, i >= 1
* third step - length of message in 15th base
*4th digit sequence transform to int ___ if next item is 1111 then it is end of sequence
* 4th step - code all data in message
**/
using System.Collections.Generic;

namespace oid.algorithm {
class Huffman96{
    const string alphabetLong = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_";
    const string alphabetShort = "`abcdefghijklmnopqrstuvwxyz{|}~\t";
    byte[] incomeAlphabet;

    public Huffman96(){
        incomeAlphabet = new byte[256];
        for(int i0 = 0; i0 < 256; i0++) incomeAlphabet[i0] = (byte)i0;
    }

    public Huffman96(string alph){
        List<byte> l0 = new List<byte>();
        for(int i0 = 0; i0 < alph.Length; i0++){
            if(!l0.Contains((byte)alph[i0])) l0.Add((byte)alph[i0]);
        }
        incomeAlphabet = l0.ToArray();
    }

    public Huffman96(byte[] alph){
        List<byte> l0 = new List<byte>();
        for(int i0 = 0; i0 < alph.Length; i0++){
            if(!l0.Contains(alph[i0])) l0.Add(alph[i0]);
        }
        incomeAlphabet = l0.ToArray();
    }

    public string Encode(string data){
        return Encode(System.Text.Encoding.UTF8.GetBytes(data));
    }

    public string Encode(byte[] data){
        //zero step
        var scorer = new Dictionary<byte, Node>();
        foreach(byte c0 in incomeAlphabet){
            scorer.Add(c0, new Node(c0));
        }
        foreach(byte c0 in data){
            scorer[c0].value += 1;
        }
        var sorter = new SortedList<double, Node>();
        foreach(KeyValuePair<byte, Node> c0 in scorer){
            while(sorter.ContainsKey(c0.Value.value)) c0.Value.value += 0.00001;
            sorter.Add(c0.Value.value, c0.Value);
        }
        //Haffman collapse
        while(sorter.Count > 1){
            var q0 = new List<Node>();
            foreach(KeyValuePair<double, Node> k0 in sorter){
                q0.Add(k0.Value);
                if(q0.Count >= 2) break;
            }
            sorter.Remove(q0[0].value);
            sorter.Remove(q0[1].value);
            var q1 = new Node(0);
            q1.high = q0[0];
            q1.low = q0[1];
            q1.value = System.Math.Floor(q0[0].value) + System.Math.Floor(q0[1].value);
            while(sorter.ContainsKey(q1.value)) q1.value += 0.00001;
            sorter.Add(q1.value, q1);
        }
        Node q2 = null;
        foreach(KeyValuePair<double, Node> k0 in sorter)q2 = k0.Value;
        //Haffman uncollapse
        var dict = new Dictionary<byte, string>();
        q2.CodeSetup("", dict);
        //first step
        string temp0 = "";
        int x0 = dict[incomeAlphabet[0]].Length % 2;
        for(int i0 = (dict[incomeAlphabet[0]].Length + 1) / 2; i0 > 0; i0--){
            temp0 += x0.ToString();
        }
        for(int i0 = 1; i0 < incomeAlphabet.Length; i0++){
            x0 = 1 - x0;
            for(int i1 = dict[incomeAlphabet[i0]].Length; i1 > 0; i1--) temp0 += x0.ToString();
        }
        x0 = 1 - x0;
        temp0 += x0.ToString();
        //second step
        for(int i0 = 0; i0 < incomeAlphabet.Length; i0++){
            temp0 += dict[incomeAlphabet[i0]];
          }
        //third step
        string temp1 = "1111";//length of message will need be here and add from start
        x0 = data.Length;
        while(x0 > 0){
            int j0 = x0 % 15;
            x0 /= 15;
            for(int i0 = 0; i0 < 4; i0++){
                temp1 = ((j0 % 2 == 1) ? "1" : "0") + temp1;
                j0 /= 2;
            }
        }
        temp0 += temp1;
        //fourth step
        var output0 = new System.Text.StringBuilder();
        for(int i0 = 0; i0 < data.Length; i0++){
            temp0 += dict[data[i0]];
            while(temp0.Length > 6){
                if(temp0.StartsWith("0")){
                    int j0 = 0;
                    for(int i1 = 0; i1 < 5; i1++){
                        j0 = j0 * 2 + (temp0[1 + i1] == '1' ? 1 : 0);
                    }
                    temp0 = temp0.Substring(6);
                    output0.Append(alphabetShort.Substring(j0, 1));
                }
                else{
                    int j0 = 0;
                    for(int i1 = 0; i1 < 6; i1++){
                        j0 = j0 * 2 + (temp0[1 + i1] == '1' ? 1 : 0);
                    }
                    temp0 = temp0.Substring(7);
                    output0.Append(alphabetLong.Substring(j0, 1));
                }
            }
        }
        temp0 += "10000000000";
        //if(temp0.Length == 7) temp0 += "0000000";
        //next loop copyed from 2 line up
        while(temp0.Length > 6){
            if(temp0.StartsWith("0")){
                int j0 = 0;
                for(int i1 = 0; i1 < 5; i1++){
                    j0 = j0 * 2 + (temp0[1 + i1] == '1' ? 1 : 0);
                }
                temp0 = temp0.Substring(6);
                output0.Append(alphabetShort.Substring(j0, 1));
            }
            if(temp0.StartsWith("1")){
                int j0 = 0;
                for(int i1 = 0; i1 < 6; i1++){
                    j0 = j0 * 2 + (temp0[1 + i1] == '1' ? 1 : 0);
                }
                temp0 = temp0.Substring(7);
                output0.Append(alphabetLong.Substring(j0, 1));
            }
        }
        return output0.ToString();
    }

    string UnBase(string smb){
        int j0 = alphabetLong.IndexOf(smb);
        string s0 = "";
        if(j0 < 0) {
            j0 = alphabetShort.IndexOf(smb);
            for(int i0 = 0; i0 < 5; i0++){
                s0 = (j0 % 2).ToString() + s0;
                j0 /= 2;
            }
            return "0" + s0;
        }
        for(int i0 = 0; i0 < 6; i0++){
            s0 = (j0 % 2).ToString() + s0;
            j0 /= 2;
        }
        return "1" + s0;
    }

    public byte[] Decode(string data){
        string temp0 = UnBase(data.Substring(0, 1));
        int x0 = temp0.StartsWith("1") ? 1 : 0;
        int j0 = 0, j1 = 1, j2 = 0, j3 = 1;
        int[] a0 = new int[incomeAlphabet.Length]; //vector of codes length
        while(j2 < incomeAlphabet.Length){
            while(temp0[j0] == temp0[j1]) {
                j1++;
                if(j1 >= temp0.Length) {
                    temp0 += UnBase(data.Substring(j3, 1));
                    j3++;
                }
            }
            if(j2 == 0) a0[j2] = (j1 - j0) * 2 - x0;
            else a0[j2] = j1 - j0;
            j2++;
            j0 = j1;
        }
        temp0 = temp0.Substring(j1);
        if(1 >= temp0.Length) {
            temp0 += UnBase(data.Substring(j3, 1));
            j3++;
        }
        temp0 = temp0.Substring(1);
        j2 = 0; // max length of code
        var dict = new Dictionary<string, byte>(); //<code, char of alphabete>
        for(int i0 = 0; i0 < a0.Length; i0++){
            while(temp0.Length <= a0[i0]){
                temp0 += UnBase(data.Substring(j3, 1));
                j3++;
            }
            dict.Add(temp0.Substring(0, a0[i0]), incomeAlphabet[i0]);
            temp0 = temp0.Substring(a0[i0]);
            if(a0[i0] > j2) j2 = a0[i0];
        }
        j1 = 0;
        while(true){
            while(temp0.Length <= 4){
                temp0 += UnBase(data.Substring(j3, 1));
                j3++;
            }
            if(temp0.StartsWith("1111")){
                temp0 = temp0.Substring(4);
                break;
            }
            else{
                j1 *= 15;
                j0 = 0;
                for(int i0 = 0; i0 < 4; i0++){
                    j0 *= 2;
                    if(temp0[i0] == '1') j0++;
                }
                temp0 = temp0.Substring(4);
                j1 += j0;
            }
        }
        var rdata = new List<byte>();
        while(j1 > 0){
            while(temp0.Length < j2 && j3 < data.Length){
                temp0 += UnBase(data.Substring(j3, 1));
                j3++;
            }
            bool isNotMakedProgress = true;
            for(int i0 = System.Math.Min(j2, temp0.Length); i0 > 0; i0--){
                string s0 = temp0.Substring(0, i0);
                if(dict.ContainsKey(s0)){
                    isNotMakedProgress = false;
                    rdata.Add(dict[s0]);
                    j1--;
                    temp0 = temp0.Substring(s0.Length);
                    break;
                }
            }
            if(isNotMakedProgress) {
                return rdata.ToArray();
            }
        }
        return rdata.ToArray();
    }

    class Node {
      public Node high, low;
      public byte code;
      public double value;
      public string chyphre;

      public Node(byte c){
        code = c;
        value = 0.0;
      }

      public void CodeSetup(string incode, Dictionary<byte, string> dict){
        chyphre = incode;
        if(high == null && low == null) dict.Add(this.code, incode);
        else {
          high.CodeSetup(incode + "1", dict);
          low.CodeSetup(incode + "0", dict);
        }
      }
    }
  }
}
