/**
 * Minimal syntax highlighting for the rendering-lab snippets.
 *
 * The four snippets are C# and HLSL. A real highlighter would be a dependency,
 * and colouring these four by hand is a few dozen lines, so this tokenises
 * them directly. It is a pure function over a string — same output on the
 * server and the client, so nothing to reconcile at hydration.
 *
 * Deliberately shallow: it knows strings, comments, numbers, a keyword list,
 * anything called like a function, and PascalCase as a type. It is not a
 * parser and does not need to be.
 */

const KEYWORDS = new Set([
  // C#
  "new", "var", "return", "if", "else", "for", "foreach", "while", "public",
  "private", "protected", "internal", "static", "readonly", "const", "override",
  "virtual", "class", "struct", "void", "int", "uint", "bool", "string", "true",
  "false", "null", "this", "base", "using", "namespace", "out", "ref", "in",
  // HLSL / ShaderLab
  "float", "float2", "float3", "float4", "half", "half2", "half3", "half4",
  "fixed", "fixed4", "sampler2D", "samplerCUBE", "inout", "uniform", "cbuffer",
  "Texture2D", "SamplerState", "TEXTURE2D", "SAMPLER",
]);

// Order matters: comments and strings first so their contents are never
// re-tokenised, then numbers, then words.
const TOKEN = new RegExp(
  [
    "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)", // 1 comment
    '("(?:[^"\\\\\\n]|\\\\.)*")', //             2 string
    "\\b(\\d+(?:\\.\\d+)?[fFuUlL]?)\\b", //      3 number
    "([A-Za-z_][A-Za-z0-9_]*)(?=\\s*\\()", //    4 call
    "([A-Za-z_][A-Za-z0-9_]*)", //               5 word (keyword / type / plain)
  ].join("|"),
  "g",
);

type Piece = { text: string; kind: string | null };

function tokenize(source: string): Piece[] {
  const pieces: Piece[] = [];
  let last = 0;

  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) pieces.push({ text: source.slice(last, index), kind: null });

    const [whole, comment, str, num, call, word] = match;
    if (comment) pieces.push({ text: whole, kind: "comment" });
    else if (str) pieces.push({ text: whole, kind: "string" });
    else if (num) pieces.push({ text: whole, kind: "number" });
    else if (call) {
      // A call site: `saturate(`, `AddBlitPass(`. PascalCase ones are usually
      // constructors or engine APIs, which read better as types.
      pieces.push({ text: whole, kind: KEYWORDS.has(call) ? "keyword" : "call" });
    } else if (word) {
      if (KEYWORDS.has(word)) pieces.push({ text: whole, kind: "keyword" });
      else if (/^[A-Z]/.test(word)) pieces.push({ text: whole, kind: "type" });
      else pieces.push({ text: whole, kind: null });
    }

    last = index + whole.length;
  }

  if (last < source.length) pieces.push({ text: source.slice(last), kind: null });
  return pieces;
}

export function CodeSnippet({ source }: { source: string }) {
  return (
    <code>
      {tokenize(source).map((piece, index) =>
        piece.kind ? (
          <span className={`tok-${piece.kind}`} key={index}>
            {piece.text}
          </span>
        ) : (
          piece.text
        ),
      )}
    </code>
  );
}
