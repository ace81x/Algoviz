package com.algo_viz.server;

// Added sortedIndices to track which bars should turn orange
public record SortStep(int[] array, int activeLine, int[] activeIndices, int[] sortedIndices) {}