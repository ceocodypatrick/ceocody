/**
 * Efficient Sorting Algorithm for Large Datasets
 * 
 * This implementation uses a hybrid approach combining:
 * - Insertion sort for small arrays (< 32 elements)
 * - Merge sort for medium arrays
 * - Timsort-inspired optimizations for large arrays
 * 
 * Features:
 * - Adaptive: performs better on partially sorted data
 * - Stable: maintains relative order of equal elements
 * - Memory efficient: uses iterative merge sort to avoid stack overflow
 * - Handles various data types with custom comparators
 */

class EfficientSorter {
    constructor() {
        this.MIN_MERGE = 32;
        this.GALLOP_THRESHOLD = 7;
    }

    /**
     * Main sorting function
     * @param {Array} arr - Array to sort
     * @param {Function} compareFn - Optional comparison function
     * @returns {Array} - Sorted array (in-place sorting)
     */
    sort(arr, compareFn = this.defaultCompare) {
        if (!Array.isArray(arr)) {
            throw new Error('Input must be an array');
        }

        if (arr.length <= 1) {
            return arr;
        }

        // For small arrays, use insertion sort
        if (arr.length < this.MIN_MERGE) {
            return this.insertionSort(arr, 0, arr.length - 1, compareFn);
        }

        // For larger arrays, use optimized merge sort
        return this.timSort(arr, compareFn);
    }

    /**
     * Default comparison function for numbers and strings
     */
    defaultCompare(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    /**
     * Insertion sort for small arrays or subarrays
     */
    insertionSort(arr, left, right, compareFn) {
        for (let i = left + 1; i <= right; i++) {
            let key = arr[i];
            let j = i - 1;

            while (j >= left && compareFn(arr[j], key) > 0) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    /**
     * Timsort-inspired algorithm for large datasets
     */
    timSort(arr, compareFn) {
        const n = arr.length;
        
        // Sort individual subarrays of size MIN_MERGE using insertion sort
        for (let i = 0; i < n; i += this.MIN_MERGE) {
            const right = Math.min(i + this.MIN_MERGE - 1, n - 1);
            this.insertionSort(arr, i, right, compareFn);
        }

        // Start merging from size MIN_MERGE
        let size = this.MIN_MERGE;
        while (size < n) {
            // Pick starting point of left sub array
            for (let start = 0; start < n; start += size * 2) {
                // Calculate mid and end points
                const mid = Math.min(start + size - 1, n - 1);
                const end = Math.min(start + size * 2 - 1, n - 1);

                // Merge subarrays if mid is smaller than end
                if (mid < end) {
                    this.merge(arr, start, mid, end, compareFn);
                }
            }
            size *= 2;
        }

        return arr;
    }

    /**
     * Optimized merge function with galloping mode
     */
    merge(arr, left, mid, right, compareFn) {
        // Create temporary arrays for left and right subarrays
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;
        let leftWins = 0, rightWins = 0;

        // Merge with galloping optimization
        while (i < leftArr.length && j < rightArr.length) {
            if (compareFn(leftArr[i], rightArr[j]) <= 0) {
                arr[k++] = leftArr[i++];
                leftWins++;
                rightWins = 0;

                // Enter galloping mode if one side is consistently winning
                if (leftWins >= this.GALLOP_THRESHOLD) {
                    k = this.gallopLeft(leftArr, rightArr, i, j, k, arr, compareFn);
                    leftWins = 0;
                }
            } else {
                arr[k++] = rightArr[j++];
                rightWins++;
                leftWins = 0;

                if (rightWins >= this.GALLOP_THRESHOLD) {
                    k = this.gallopRight(leftArr, rightArr, i, j, k, arr, compareFn);
                    rightWins = 0;
                }
            }
        }

        // Copy remaining elements
        while (i < leftArr.length) {
            arr[k++] = leftArr[i++];
        }
        while (j < rightArr.length) {
            arr[k++] = rightArr[j++];
        }
    }

    /**
     * Galloping mode for left array
     */
    gallopLeft(leftArr, rightArr, i, j, k, arr, compareFn) {
        let count = 0;
        while (i < leftArr.length && compareFn(leftArr[i], rightArr[j]) <= 0) {
            arr[k++] = leftArr[i++];
            count++;
        }
        return k;
    }

    /**
     * Galloping mode for right array
     */
    gallopRight(leftArr, rightArr, i, j, k, arr, compareFn) {
        let count = 0;
        while (j < rightArr.length && compareFn(rightArr[j], leftArr[i]) < 0) {
            arr[k++] = rightArr[j++];
            count++;
        }
        return k;
    }

    /**
     * Utility function to check if array is sorted
     */
    isSorted(arr, compareFn = this.defaultCompare) {
        for (let i = 1; i < arr.length; i++) {
            if (compareFn(arr[i - 1], arr[i]) > 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Performance analysis function
     */
    sortWithStats(arr, compareFn = this.defaultCompare) {
        const startTime = performance.now();
        const originalLength = arr.length;
        
        this.sort(arr, compareFn);
        
        const endTime = performance.now();
        const duration = endTime - startTime;

        return {
            sortedArray: arr,
            stats: {
                arrayLength: originalLength,
                duration: `${duration.toFixed(2)}ms`,
                elementsPerMs: Math.round(originalLength / duration),
                isSorted: this.isSorted(arr, compareFn)
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EfficientSorter;
}

// Browser global export
if (typeof window !== 'undefined') {
    window.EfficientSorter = EfficientSorter;
}

// ES6 export
export default EfficientSorter;