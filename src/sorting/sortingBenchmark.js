/**
 * Benchmarking and Testing Suite for Efficient Sorting Algorithm
 */

import EfficientSorter from './efficientSort.js';

class SortingBenchmark {
    constructor() {
        this.sorter = new EfficientSorter();
    }

    /**
     * Generate test data of various types and patterns
     */
    generateTestData(size, type = 'random') {
        const data = [];
        
        switch (type) {
            case 'random':
                for (let i = 0; i < size; i++) {
                    data.push(Math.floor(Math.random() * size));
                }
                break;
                
            case 'sorted':
                for (let i = 0; i < size; i++) {
                    data.push(i);
                }
                break;
                
            case 'reverse':
                for (let i = size; i > 0; i--) {
                    data.push(i);
                }
                break;
                
            case 'nearly_sorted':
                for (let i = 0; i < size; i++) {
                    data.push(i);
                }
                // Shuffle 5% of elements
                const shuffleCount = Math.floor(size * 0.05);
                for (let i = 0; i < shuffleCount; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [data[idx1], data[idx2]] = [data[idx2], data[idx1]];
                }
                break;
                
            case 'duplicates':
                const uniqueValues = Math.floor(size / 10);
                for (let i = 0; i < size; i++) {
                    data.push(Math.floor(Math.random() * uniqueValues));
                }
                break;
                
            case 'strings':
                const chars = 'abcdefghijklmnopqrstuvwxyz';
                for (let i = 0; i < size; i++) {
                    let str = '';
                    const length = Math.floor(Math.random() * 10) + 1;
                    for (let j = 0; j < length; j++) {
                        str += chars[Math.floor(Math.random() * chars.length)];
                    }
                    data.push(str);
                }
                break;
                
            case 'objects':
                for (let i = 0; i < size; i++) {
                    data.push({
                        id: i,
                        value: Math.floor(Math.random() * size),
                        name: `item_${i}`
                    });
                }
                break;
        }
        
        return data;
    }

    /**
     * Run comprehensive benchmark tests
     */
    runBenchmark() {
        console.log('🚀 Starting Efficient Sorting Algorithm Benchmark\n');
        
        const testSizes = [100, 1000, 10000, 100000, 500000];
        const testTypes = ['random', 'sorted', 'reverse', 'nearly_sorted', 'duplicates'];
        
        const results = [];

        testSizes.forEach(size => {
            console.log(`📊 Testing with ${size.toLocaleString()} elements:`);
            
            testTypes.forEach(type => {
                const testData = this.generateTestData(size, type);
                const result = this.sorter.sortWithStats([...testData]);
                
                results.push({
                    size,
                    type,
                    ...result.stats
                });
                
                console.log(`  ${type.padEnd(15)}: ${result.stats.duration.padEnd(10)} (${result.stats.elementsPerMs.toLocaleString()} elem/ms)`);
            });
            
            console.log('');
        });

        return results;
    }

    /**
     * Compare with native JavaScript sort
     */
    compareWithNativeSort(size = 100000) {
        console.log(`🔄 Comparing with native sort (${size.toLocaleString()} elements):\n`);
        
        const testData = this.generateTestData(size, 'random');
        
        // Test our algorithm
        const ourData = [...testData];
        const ourStart = performance.now();
        this.sorter.sort(ourData);
        const ourTime = performance.now() - ourStart;
        
        // Test native sort
        const nativeData = [...testData];
        const nativeStart = performance.now();
        nativeData.sort((a, b) => a - b);
        const nativeTime = performance.now() - nativeStart;
        
        console.log(`Our Algorithm:    ${ourTime.toFixed(2)}ms`);
        console.log(`Native Sort:      ${nativeTime.toFixed(2)}ms`);
        console.log(`Performance:      ${ourTime < nativeTime ? '✅ Faster' : '⚠️ Slower'} by ${Math.abs(ourTime - nativeTime).toFixed(2)}ms`);
        console.log(`Ratio:            ${(ourTime / nativeTime).toFixed(2)}x\n`);
        
        return {
            ourTime,
            nativeTime,
            ratio: ourTime / nativeTime
        };
    }

    /**
     * Test sorting stability
     */
    testStability() {
        console.log('🔒 Testing sorting stability:\n');
        
        const testData = [
            { value: 3, id: 'a' },
            { value: 1, id: 'b' },
            { value: 3, id: 'c' },
            { value: 2, id: 'd' },
            { value: 3, id: 'e' }
        ];
        
        const sorted = [...testData];
        this.sorter.sort(sorted, (a, b) => a.value - b.value);
        
        console.log('Original order for value 3:', testData.filter(x => x.value === 3).map(x => x.id));
        console.log('Sorted order for value 3:  ', sorted.filter(x => x.value === 3).map(x => x.id));
        
        const isStable = JSON.stringify(testData.filter(x => x.value === 3)) === 
                        JSON.stringify(sorted.filter(x => x.value === 3));
        
        console.log(`Stability test: ${isStable ? '✅ PASSED' : '❌ FAILED'}\n`);
        
        return isStable;
    }

    /**
     * Memory usage test
     */
    testMemoryUsage(size = 100000) {
        console.log(`💾 Testing memory efficiency (${size.toLocaleString()} elements):\n`);
        
        const testData = this.generateTestData(size, 'random');
        
        // Measure memory before
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memBefore = process.memoryUsage();
            
            this.sorter.sort([...testData]);
            
            const memAfter = process.memoryUsage();
            const heapDiff = memAfter.heapUsed - memBefore.heapUsed;
            
            console.log(`Heap usage change: ${(heapDiff / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Memory per element: ${(heapDiff / size).toFixed(2)} bytes\n`);
            
            return heapDiff;
        } else {
            console.log('Memory usage testing not available in this environment\n');
            return null;
        }
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('=' .repeat(60));
        console.log('EFFICIENT SORTING ALGORITHM - COMPREHENSIVE TEST SUITE');
        console.log('=' .repeat(60) + '\n');
        
        // Benchmark tests
        const benchmarkResults = this.runBenchmark();
        
        // Comparison with native sort
        const comparisonResults = this.compareWithNativeSort();
        
        // Stability test
        const stabilityResult = this.testStability();
        
        // Memory usage test
        const memoryResult = this.testMemoryUsage();
        
        // Summary
        console.log('📋 TEST SUMMARY:');
        console.log('=' .repeat(40));
        console.log(`✅ Benchmark tests completed: ${benchmarkResults.length} test cases`);
        console.log(`${comparisonResults.ratio < 1.2 ? '✅' : '⚠️'} Performance vs native: ${comparisonResults.ratio.toFixed(2)}x`);
        console.log(`${stabilityResult ? '✅' : '❌'} Stability test: ${stabilityResult ? 'PASSED' : 'FAILED'}`);
        console.log(`${memoryResult !== null ? '✅' : '⚠️'} Memory test: ${memoryResult !== null ? 'COMPLETED' : 'SKIPPED'}`);
        
        return {
            benchmark: benchmarkResults,
            comparison: comparisonResults,
            stability: stabilityResult,
            memory: memoryResult
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingBenchmark;
}

export default SortingBenchmark;