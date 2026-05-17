package com.algo_viz.server;

import java.util.List;
import java.util.Map;

public record GraphStep(
    int activeLine,             
    Integer currentNode,        
    List<Integer> visitedNodes, 
    int[] activeEdge,
    Map<Integer, Integer> topoOrder // NEW: Tracks the red topo indices
) {}