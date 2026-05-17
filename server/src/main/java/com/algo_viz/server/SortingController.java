package com.algo_viz.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") 
public class SortingController {

    @Autowired
    private SortingService sortingService;

    @PostMapping("/api/sort/bubble")
    public List<SortStep> getBubbleSort(@RequestBody int[] customArray) {
        return sortingService.getBubbleSortSteps(customArray); // Now returns objects!
    }

    @PostMapping("/api/sort/selection")
    public List<SortStep> getSelectionSort(@RequestBody int[] customArray) {
        return sortingService.getSelectionSortSteps(customArray);
    }

    // NEW Insertion Sort Endpoint
    @PostMapping("/api/sort/insertion")
    public List<SortStep> getInsertionSort(@RequestBody int[] customArray) {
        return sortingService.getInsertionSortSteps(customArray);
    }
}

