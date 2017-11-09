# Armor64: safe, strict and stable textual encoding of byte streams

## Safety

Encoded streams rely only on ASCII printable characters and can be used unescaped in:
- URLs (paths, query strings, fragments, etc.);
- JSON with ASCII-based encoding, including UTF-8;
- Web form data over GET and POST;
- Strings in C, shell, etc.

## Strictness

There is only one Armor64 encoding for a given byte stream.  
If streams are equal, encoded streams are equal, and vice-versa.  
Encoders and decoders are required to enforce this rule.  
An encoded stream can be validated during decoding or in one pass.

## Stability

Armor64 is stable in two ways:
- Encoding preserves natural byte order, regardless of byte signedness.
- There are no variants and the specification will not be revised.


## FAQ

### Why not Base64?

Base64 is effectively not a specific encoding but rather [a family of encodings](https://en.wikipedia.org/wiki/Base64#Variants_summary_table).  
`=`-padding is often possible, sometimes required. Many libraries do not offer unpadded variants.  
Some variants allow newlines, some don't.  
Some variants use a URL-safe alphabet, some don't.  
Few variants specify a canonical encoding, fewer mandate that it be used.  
None of the variants use an alphabet that preserves natural byte order.

This can lead to ambiguity and confusion for developers, for example when picking implementations or documenting formats.

Armor64 uniquely identifies a specification for encoding and decoding bounded byte streams.  
[armor64.org](https://armor64.org) provides language-agnostic acceptance tests and community implementations for many languages.

### What about Postel's law?

> In general, an implementation should be conservative in its sending behavior, and liberal in its receiving behavior.

We could not better [Martin Thomson's 2015 Internet-Draft](https://tools.ietf.org/html/draft-thomson-postel-was-wrong-00) on the topic.

### Why reorder the base64url alphabet?

We want byte streams to be ordered like their encoding in the natural byte order.

As a result, situations where one side uses Armor64, the other Base64 are very unlikely to go unnoticed.  
Had the alphabets been shared, problems could have arisen too late.

We believe in failing fast and hard.

### Why are newlines forbidden?

We want the encoding of byte streams to be unique, and we want to avoid escaping in URLs, JSON-based protocols, etc.

Too often, most byte streams remain comparatively short during development and in test cases.  
In Base64, only long byte streams involve newlines.  
As a result, mishandling of newlines in transport or decoders can be discovered too late.

We believe in failing fast and hard.


## Specification DRAFT

### Encoding

Input streams are consumed from left to right in blocks of 6 bits.  
If fewer than 6 bits are left at the end of the input stream, they are right-padded with '0' bits to form the last block.  
Each block is converted to output a single byte according to the following table:

|              | **`....00`**          | **`....01`**          | **`....10`**          | **`....11`**          |
| ------------ | --------------------- | --------------------- | --------------------- | --------------------- |
| **`0000..`** | `000000` ↔ `-` (0x2D) | `000001` ↔ `0` (0x30) | `000010` ↔ `1` (0x31) | `000011` ↔ `2` (0x32) |
| **`0001..`** | `000100` ↔ `3` (0x33) | `000101` ↔ `4` (0x34) | `000110` ↔ `5` (0x35) | `000111` ↔ `6` (0x36) |
| **`0010..`** | `001000` ↔ `7` (0x37) | `001001` ↔ `8` (0x38) | `001010` ↔ `9` (0x39) | `001011` ↔ `A` (0x41) |
| **`0011..`** | `001100` ↔ `B` (0x42) | `001101` ↔ `C` (0x43) | `001110` ↔ `D` (0x44) | `001111` ↔ `E` (0x45) |
| **`0100..`** | `010000` ↔ `F` (0x46) | `010001` ↔ `G` (0x47) | `010010` ↔ `H` (0x48) | `010011` ↔ `I` (0x49) |
| **`0101..`** | `010100` ↔ `J` (0x4A) | `010101` ↔ `K` (0x4B) | `010110` ↔ `L` (0x4C) | `010111` ↔ `M` (0x4D) |
| **`0110..`** | `011000` ↔ `N` (0x4E) | `011001` ↔ `O` (0x4F) | `011010` ↔ `P` (0x50) | `011011` ↔ `Q` (0x51) |
| **`0111..`** | `011100` ↔ `R` (0x52) | `011101` ↔ `S` (0x53) | `011110` ↔ `T` (0x54) | `011111` ↔ `U` (0x55) |
| **`1000..`** | `100000` ↔ `V` (0x56) | `100001` ↔ `W` (0x57) | `100010` ↔ `X` (0x58) | `100011` ↔ `Y` (0x59) |
| **`1001..`** | `100100` ↔ `Z` (0x5A) | `100101` ↔ `_` (0x5F) | `100110` ↔ `a` (0x61) | `100111` ↔ `b` (0x62) |
| **`1010..`** | `101000` ↔ `c` (0x63) | `101001` ↔ `d` (0x64) | `101010` ↔ `e` (0x65) | `101011` ↔ `f` (0x66) |
| **`1011..`** | `101100` ↔ `g` (0x67) | `101101` ↔ `h` (0x68) | `101110` ↔ `i` (0x69) | `101111` ↔ `j` (0x6A) |
| **`1100..`** | `110000` ↔ `k` (0x6B) | `110001` ↔ `l` (0x6C) | `110010` ↔ `m` (0x6D) | `110011` ↔ `n` (0x6E) |
| **`1101..`** | `110100` ↔ `o` (0x6F) | `110101` ↔ `p` (0x70) | `110110` ↔ `q` (0x71) | `110111` ↔ `r` (0x72) |
| **`1110..`** | `111000` ↔ `s` (0x73) | `111001` ↔ `t` (0x74) | `111010` ↔ `u` (0x75) | `111011` ↔ `v` (0x76) |
| **`1111..`** | `111100` ↔ `w` (0x77) | `111101` ↔ `x` (0x78) | `111110` ↔ `y` (0x79) | `111111` ↔ `z` (0x7A) |


### Decoding

Input streams are consumed from left to right and each byte is turned into a block of 6 bits according to the previous table.  
When encountering a byte that do not appear in the conversion table, the input stream is rejected.  
Those blocks form a stream consumed from left to right to output a byte every 8 bits.  
At the end of the input stream, if any of the remaining bits are not '0', the input stream is rejected.