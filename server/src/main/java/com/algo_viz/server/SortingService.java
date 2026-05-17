package com.algo_viz.server;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class SortingService {

    // --- BUBBLE SORT ---
    public List<SortStep> getBubbleSortSteps(int[] input) {
        List<SortStep> steps = new ArrayList<>();
        List<Integer> sorted = new ArrayList<>();
        
        steps.add(new SortStep(input.clone(), 1, new int[0], sorted.stream().mapToInt(i->i).toArray()));
        
        boolean swapped;
        int n = input.length;
        do {
            swapped = false;
            steps.add(new SortStep(input.clone(), 2, new int[0], sorted.stream().mapToInt(i->i).toArray()));
            
            for (int i = 0; i < n - 1; i++) {
                int[] active = new int[]{i, i + 1};
                int[] sortedArr = sorted.stream().mapToInt(x->x).toArray();
                
                steps.add(new SortStep(input.clone(), 3, active, sortedArr)); 
                steps.add(new SortStep(input.clone(), 4, active, sortedArr)); 
                
                if (input[i] > input[i + 1]) {
                    int temp = input[i];
                    input[i] = input[i + 1];
                    input[i + 1] = temp;
                    
                    steps.add(new SortStep(input.clone(), 5, active, sortedArr)); 
                    swapped = true;
                    steps.add(new SortStep(input.clone(), 6, active, sortedArr)); 
                }
            }
            steps.add(new SortStep(input.clone(), 7, new int[0], sorted.stream().mapToInt(x->x).toArray())); 
            n--;
            sorted.add(n); // The last evaluated element is now in its final sorted position
            
        } while (swapped);
        
        // When finished, mark all remaining elements as sorted
        for (int i = 0; i < n; i++) {
            if (!sorted.contains(i)) sorted.add(i);
        }
        steps.add(new SortStep(input.clone(), 7, new int[0], sorted.stream().mapToInt(x->x).toArray()));

        return steps;
    }

    // --- SELECTION SORT ---
    public List<SortStep> getSelectionSortSteps(int[] input) {
        List<SortStep> steps = new ArrayList<>();
        List<Integer> sorted = new ArrayList<>();
        int n = input.length;
        
        steps.add(new SortStep(input.clone(), 1, new int[0], sorted.stream().mapToInt(x->x).toArray())); 
        
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            int[] sortedArr = sorted.stream().mapToInt(x->x).toArray();
            
            steps.add(new SortStep(input.clone(), 2, new int[]{i}, sortedArr)); 
            
            for (int j = i + 1; j < n; j++) {
                steps.add(new SortStep(input.clone(), 3, new int[]{minIdx, j}, sortedArr)); 
                steps.add(new SortStep(input.clone(), 4, new int[]{minIdx, j}, sortedArr)); 
                
                if (input[j] < input[minIdx]) {
                    minIdx = j;
                    steps.add(new SortStep(input.clone(), 5, new int[]{minIdx}, sortedArr)); 
                }
            }
            
            int temp = input[minIdx];
            input[minIdx] = input[i];
            input[i] = temp;
            
            steps.add(new SortStep(input.clone(), 6, new int[]{i, minIdx}, sortedArr)); 
            sorted.add(i); // This index is now permanently sorted
        }
        sorted.add(n - 1); // Mark the final element as sorted
        steps.add(new SortStep(input.clone(), 6, new int[0], sorted.stream().mapToInt(x->x).toArray()));
        
        return steps;
    }

    // --- INSERTION SORT ---
    public List<SortStep> getInsertionSortSteps(int[] input) {
        List<SortStep> steps = new ArrayList<>();
        List<Integer> sorted = new ArrayList<>();
        int n = input.length;
        
        sorted.add(0); // first element is inherently sorted initially
        steps.add(new SortStep(input.clone(), 1, new int[]{0}, sorted.stream().mapToInt(x->x).toArray())); 
        
        for (int i = 1; i < n; i++) {
            int[] sortedArr = sorted.stream().mapToInt(x->x).toArray();
            steps.add(new SortStep(input.clone(), 2, new int[]{i}, sortedArr)); 
            
            int key = input[i];
            int j = i - 1;
            
            steps.add(new SortStep(input.clone(), 3, new int[]{i}, sortedArr)); 
            steps.add(new SortStep(input.clone(), 4, new int[]{j}, sortedArr)); 
            
            while (j >= 0 && input[j] > key) {
                steps.add(new SortStep(input.clone(), 5, new int[]{j, j + 1}, sortedArr)); 
                input[j + 1] = input[j];
                steps.add(new SortStep(input.clone(), 6, new int[]{j, j + 1}, sortedArr)); 
                j = j - 1;
                
                if (j >= 0) {
                   steps.add(new SortStep(input.clone(), 4, new int[]{j}, sortedArr)); 
                }
            }
            
            input[j + 1] = key;
            sorted.add(i); // Array up to i is now sorted
            steps.add(new SortStep(input.clone(), 7, new int[]{j + 1}, sorted.stream().mapToInt(x->x).toArray())); 
        }
        return steps;
    }
}