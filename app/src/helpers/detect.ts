// Guesses a syntax key from code. Imported on demand, so highlight.js only loads when Detect is pressed.
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import kotlin from "highlight.js/lib/languages/kotlin";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import scala from "highlight.js/lib/languages/scala";

// Registered under the same keys as helpers/highlighters.ts, so a match is a syntax key
const languages = { typescript, javascript, python, go, java, kotlin, c, cpp, csharp, scala };
for (const [name, language] of Object.entries(languages)) hljs.registerLanguage(name, language);

// ponytail: threshold picked from detect.check.mjs samples; short snippets and prose score below it
const minRelevance = 5;

// highlight.js scores close relatives almost the same (JS/TS, C/C++, Java vs TS and C#),
// so those are settled by features only one side has
// ponytail: regex tie-breaks, swap for a trained model (@vscode/vscode-languagedetection) if they misfire often
const javaOnly = /\bSystem\.(out|err)\.|\bpublic static void main\b|^import java\.|\b(public|private|protected)\s+(static\s+)?final\b/m;
const cppOnly = /\bstd::|#include <(iostream|vector|string|map|memory|algorithm)>|\btemplate\s*<|\bcout\b|\bclass\s+\w+\s*[:{]/;
const tsOnly = /\binterface\s+\w|\btype\s+\w+\s*=|\benum\s+\w|:\s*(string|number|boolean|any|void|unknown|never)\b|\bas\s+(const\b|[A-Z])|\w<[A-Z]\w*>/;

const refine = (language: string, text: string) => {
  if (javaOnly.test(text)) return "java";
  if (language === "c" || language === "cpp") return cppOnly.test(text) ? "cpp" : "c";
  if (language === "typescript" && !tsOnly.test(text)) return "javascript";
  return language;
};

// A syntax key, or "" (plain text) when nothing is a confident match
export const detect = (text: string): string => {
  const trimmed = text.trim();
  if (/^[[{]/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {}
  }
  const { language, relevance } = hljs.highlightAuto(trimmed, Object.keys(languages));
  return language && relevance >= minRelevance ? refine(language, trimmed) : "";
};
