export const LANGUAGES = [
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    fileName: 'main.cpp',
    monacoId: 'cpp',
    version: 'GCC 13.2',
    color: '#00599C',
    bgColor: 'rgba(0, 89, 156, 0.15)',
    description: 'High-performance systems programming, algorithms, and competitive coding.',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CodeLab!";
    return 0;
}`,
  },
  {
    id: 'c',
    name: 'C',
    extension: '.c',
    fileName: 'main.c',
    monacoId: 'c',
    version: 'GCC 13.2',
    color: '#A8B9CC',
    bgColor: 'rgba(168, 185, 204, 0.15)',
    description: 'Foundational procedural language for low-level memory and hardware control.',
    starterCode: `#include <stdio.h>

int main() {
    printf("Hello, CodeLab!");
    return 0;
}`,
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    fileName: 'Main.java',
    monacoId: 'java',
    version: 'OpenJDK 21',
    color: '#EA2D2E',
    bgColor: 'rgba(234, 45, 46, 0.15)',
    description: 'Robust, object-oriented enterprise runtime with cross-platform support.',
    starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeLab!");
    }
}`,
  },
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    fileName: 'main.py',
    monacoId: 'python',
    version: 'Python 3.12',
    color: '#3776AB',
    bgColor: 'rgba(55, 118, 171, 0.15)',
    description: 'Expressive, versatile syntax ideal for scripting, AI, and data processing.',
    starterCode: `print("Hello, CodeLab!")`,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    fileName: 'index.js',
    monacoId: 'javascript',
    version: 'Node.js 20',
    color: '#F7DF1E',
    bgColor: 'rgba(247, 223, 30, 0.15)',
    description: 'The language of the modern web with rich asynchronous runtime APIs.',
    starterCode: `console.log("Hello, CodeLab!");`,
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]; // C++
