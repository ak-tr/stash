// Checks language detection against typical snippets: node src/helpers/detect.check.mjs
import assert from "node:assert/strict";
import { detect } from "./detect.ts";

// [expected syntax key ("" is plain text), snippet]
const samples = [
  // Java without System.out, which highlight.js alone calls Kotlin
  ["java", `@RestController
public class UserController {
    private final UserService service;
}`],
  ["json", `{ "name": "stash", "private": true, "tags": [1, 2] }`],
  ["typescript", `interface User { id: number; name: string }
export const getUser = async (id: number): Promise<User | null> => {
  const res = await fetch(\`/users/\${id}\`);
  return res.ok ? (res.json() as Promise<User>) : null;
};`],
  ["javascript", `const button = document.querySelector("button");
button.addEventListener("click", () => {
  console.log("clicked");
  fetch("/api").then((res) => res.json()).then(render);
});`],
  ["python", `import os

def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

if __name__ == "__main__":
    print([fib(i) for i in range(10)])`],
  ["go", `package main

import "fmt"

func main() {
	names := []string{"a", "b"}
	for _, n := range names {
		fmt.Println(n)
	}
}`],
  ["java", `public class Main {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("stash");
        System.out.println(names);
    }
}`],
  ["kotlin", `fun main() {
    val names = listOf("a", "b")
    names.forEach { println(it) }
    data class User(val id: Int, val name: String?)
}`],
  ["c", `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *buf = malloc(16);
    printf("%s\\n", buf);
    free(buf);
    return 0;
}`],
  ["cpp", `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v{1, 2, 3};
    for (auto& x : v) std::cout << x << std::endl;
    return 0;
}`],
  ["csharp", `using System;
using System.Linq;

namespace Stash {
    public class Program {
        public static void Main(string[] args) {
            var names = new[] { "a", "b" }.Where(n => n != null);
            Console.WriteLine(string.Join(", ", names));
        }
    }
}`],
  ["scala", `object Main extends App {
  case class User(id: Int, name: String)
  val users = List(User(1, "a"), User(2, "b"))
  users.foreach(u => println(s"\${u.id}: \${u.name}"))
}`],
  ["", `Remember to buy milk and call the plumber on Thursday.`],
];

const wrong = samples
  .map(([expected, text]) => [expected, detect(text)])
  .filter(([expected, got]) => expected !== got);

assert.deepEqual(wrong, [], `misdetected [expected, got]: ${JSON.stringify(wrong)}`);
console.log("detect ok");
