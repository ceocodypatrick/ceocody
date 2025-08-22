/**
 * Usage Examples for Efficient Sorting Algorithm
 */

import EfficientSorter from './efficientSort.js';
import SortingBenchmark from './sortingBenchmark.js';

// Initialize the sorter
const sorter = new EfficientSorter();

console.log('🎯 Efficient Sorting Algorithm - Usage Examples\n');

// Example 1: Basic number sorting
console.log('📝 Example 1: Basic Number Sorting');
const numbers = [64, 34, 25, 12, 22, 11, 90, 5, 77, 30];
console.log('Original:', numbers);
const sortedNumbers = [...numbers];
sorter.sort(sortedNumbers);
console.log('Sorted:  ', sortedNumbers);
console.log('');

// Example 2: String sorting
console.log('📝 Example 2: String Sorting');
const fruits = ['banana', 'apple', 'cherry', 'date', 'elderberry', 'fig'];
console.log('Original:', fruits);
const sortedFruits = [...fruits];
sorter.sort(sortedFruits);
console.log('Sorted:  ', sortedFruits);
console.log('');

// Example 3: Object sorting with custom comparator
console.log('📝 Example 3: Object Sorting (by age)');
const people = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
    { name: 'Diana', age: 28 }
];
console.log('Original:', people);
const sortedPeople = [...people];
sorter.sort(sortedPeople, (a, b) => a.age - b.age);
console.log('Sorted by age:', sortedPeople);
console.log('');

// Example 4: Large dataset with performance stats
console.log('📝 Example 4: Large Dataset Performance');
const largeArray = Array.from({ length: 50000 }, () => Math.floor(Math.random() * 100000));
const result = sorter.sortWithStats([...largeArray]);
console.log('Array size:', result.stats.arrayLength.toLocaleString());
console.log('Sort time:', result.stats.duration);
console.log('Performance:', result.stats.elementsPerMs.toLocaleString(), 'elements/ms');
console.log('Verification:', result.stats.isSorted ? '✅ Correctly sorted' : '❌ Sort failed');
console.log('');

// Example 5: Sorting different data patterns
console.log('📝 Example 5: Different Data Patterns');
const benchmark = new SortingBenchmark();

const patterns = ['random', 'sorted', 'reverse', 'nearly_sorted', 'duplicates'];
patterns.forEach(pattern => {
    const testData = benchmark.generateTestData(10000, pattern);
    const result = sorter.sortWithStats([...testData]);
    console.log(`${pattern.padEnd(15)}: ${result.stats.duration.padEnd(8)} (${result.stats.efficiency})`);
});
console.log('');

// Example 6: Batch sorting multiple arrays
console.log('📝 Example 6: Batch Sorting');
const arrays = [
    [5, 2, 8, 1, 9],
    ['zebra', 'apple', 'banana'],
    [100, 50, 75, 25, 125],
    [3.14, 2.71, 1.41, 1.73]
];
const batchResult = sorter.sortBatch(arrays);
console.log('Batch results:');
batchResult.results.forEach((result, index) => {
    console.log(`Array ${index + 1}:`, result.sortedArray);
});
console.log('Batch stats:', batchResult.batchStats);
console.log('');

// Example 7: Custom comparator for complex sorting
console.log('📝 Example 7: Multi-level Sorting');
const students = [
    { name: 'Alice', grade: 'A', score: 95 },
    { name: 'Bob', grade: 'B', score: 87 },
    { name: 'Charlie', grade: 'A', score: 92 },
    { name: 'Diana', grade: 'B', score: 89 }
];

// Sort by grade first, then by score (descending)
const multiLevelSort = [...students];
sorter.sort(multiLevelSort, (a, b) => {
    if (a.grade !== b.grade) {
        return a.grade.localeCompare(b.grade);
    }
    return b.score - a.score; // Descending score within same grade
});

console.log('Multi-level sorted (grade, then score desc):');
multiLevelSort.forEach(student => {
    console.log(`  ${student.name}: ${student.grade} (${student.score})`);
});
console.log('');

// Example 8: Stability test demonstration
console.log('📝 Example 8: Stability Demonstration');
const stableTestData = [
    { value: 3, id: 'first-3' },
    { value: 1, id: 'only-1' },
    { value: 3, id: 'second-3' },
    { value: 2, id: 'only-2' },
    { value: 3, id: 'third-3' }
];

console.log('Before sorting:');
stableTestData.forEach(item => console.log(`  ${item.value}: ${item.id}`));

const stableSorted = [...stableTestData];
sorter.sort(stableSorted, (a, b) => a.value - b.value);

console.log('After stable sorting:');
stableSorted.forEach(item => console.log(`  ${item.value}: ${item.id}`));
console.log('Notice: Items with same value maintain their relative order');
console.log('');

// Example 9: Performance comparison
console.log('📝 Example 9: Performance Comparison');
const comparisonSize = 100000;
const comparisonData = Array.from({ length: comparisonSize }, () => Math.floor(Math.random() * comparisonSize));

// Our algorithm
const ourData = [...comparisonData];
const ourStart = performance.now();
sorter.sort(ourData);
const ourTime = performance.now() - ourStart;

// Native sort
const nativeData = [...comparisonData];
const nativeStart = performance.now();
nativeData.sort((a, b) => a - b);
const nativeTime = performance.now() - nativeStart;

console.log(`Dataset size: ${comparisonSize.toLocaleString()} elements`);
console.log(`Our algorithm: ${ourTime.toFixed(2)}ms`);
console.log(`Native sort:   ${nativeTime.toFixed(2)}ms`);
console.log(`Ratio:         ${(ourTime / nativeTime).toFixed(2)}x`);
console.log(`Winner:        ${ourTime < nativeTime ? '🏆 Our Algorithm' : '🏆 Native Sort'}`);

console.log('\n✨ Examples completed! The algorithm is ready for production use.');

// Export examples for use in other files
export {
    sorter,
    benchmark,
    // Example functions
    basicNumberSort: () => sorter.sort([64, 34, 25, 12, 22, 11, 90]),
    stringSort: () => sorter.sort(['banana', 'apple', 'cherry']),
    objectSort: (objects, compareFn) => sorter.sort(objects, compareFn),
    performanceTest: (size) => sorter.sortWithStats(Array.from({ length: size }, () => Math.random())),
    batchSort: (arrays) => sorter.sortBatch(arrays)
};