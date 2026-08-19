require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testCompiler() {
  console.log("Testing Python missing input...");
  try {
    const res = await compilerService.executeCode({
      language: 'python',
      code: 'x = input()\nprint(x)'
    });
    console.log("Python Result:", res);
  } catch(e) {
    console.error("Python Error:", e);
  }

  console.log("\nTesting C++ missing input...");
  try {
    const res = await compilerService.executeCode({
      language: 'cpp',
      code: `#include <iostream>
int main() {
    int x;
    std::cin >> x;
    std::cout << x;
    return 0;
}`
    });
    console.log("C++ Result:", res);
  } catch(e) {
    console.error("C++ Error:", e);
  }
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(sc.nextLine());
    }
}`
    });
    console.log("Java Result:", res);
  } catch(e) {
    console.error("Java Error:", e);
  }
}
testCompiler();
