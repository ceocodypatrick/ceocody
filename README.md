<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Efficient Sorting Algorithm & AI Studio App

This project contains an efficient sorting algorithm for large datasets and an AI Studio app.

## 🚀 Efficient Sorting Algorithm

A high-performance hybrid sorting algorithm designed for handling large datasets efficiently. Features include:

- **Adaptive Performance**: Optimizes for partially sorted data
- **Stable Sorting**: Maintains relative order of equal elements  
- **Memory Efficient**: Uses iterative approach to avoid stack overflow
- **Hybrid Approach**: Combines insertion sort, merge sort, and Timsort optimizations
- **Custom Comparators**: Supports sorting any data type
- **Performance Analytics**: Built-in benchmarking and statistics

### Quick Start

```javascript
import EfficientSorter from './src/sorting/efficientSort.js';

const sorter = new EfficientSorter();

// Basic usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
sorter.sort(numbers);
console.log(numbers); // [11, 12, 22, 25, 34, 64, 90]

// With performance stats
const result = sorter.sortWithStats(largeArray);
console.log(`Sorted ${result.stats.arrayLength} elements in ${result.stats.duration}`);

// Custom comparator for objects
const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
sorter.sort(people, (a, b) => a.age - b.age);
```

### Performance Features

- **Small Arrays (< 32 elements)**: Uses optimized insertion sort
- **Medium Arrays**: Uses hybrid merge sort with binary insertion
- **Large Arrays**: Uses Timsort-inspired algorithm with run detection
- **Galloping Mode**: Optimizes merging when one side consistently wins
- **Natural Run Detection**: Leverages existing order in data

### Benchmarking

```javascript
import SortingBenchmark from './src/sorting/sortingBenchmark.js';

const benchmark = new SortingBenchmark();

// Run comprehensive benchmarks
benchmark.runAllTests();

// Compare with native sort
benchmark.compareWithNativeSort(100000);

// Test different data patterns
const results = benchmark.runBenchmark();
```

### Files Structure

- `src/sorting/efficientSort.js` - Main sorting algorithm implementation
- `src/sorting/sortingBenchmark.js` - Comprehensive benchmarking suite
- `src/sorting/examples.js` - Usage examples and demonstrations

## 🤖 AI Studio App

View your app in AI Studio: https://ai.studio/apps/drive/1oQe9ln4cPFjArzxSXEsPNaq7riLAOhqW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Testing the Sorting Algorithm

```bash
# Run the examples
node src/sorting/examples.js

# Or import in your own code
import { sorter, performanceTest } from './src/sorting/examples.js';

// Test with 1 million elements
const result = performanceTest(1000000);
console.log(result.stats);
```

## Algorithm Complexity

- **Time Complexity**: 
  - Best Case: O(n) for already sorted data
  - Average Case: O(n log n)
  - Worst Case: O(n log n)
- **Space Complexity**: O(n) auxiliary space
- **Stability**: Yes, maintains relative order of equal elements
- **Adaptive**: Yes, performs better on partially sorted data