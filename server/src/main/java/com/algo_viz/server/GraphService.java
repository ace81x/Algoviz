package com.algo_viz.server;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GraphService {

    private final Map<Integer, List<Integer>> adjList = Map.of(
        0, List.of(1, 2, 3), 1, List.of(3, 4),
        2, List.of(4), 3, List.of(4), 4, List.of()
    );

    // --- BFS ---
    public List<GraphStep> getBfsSteps(int startNode) {
        List<GraphStep> steps = new ArrayList<>();
        List<Integer> visited = new ArrayList<>();
        Queue<Integer> queue = new LinkedList<>();

        queue.add(startNode);
        visited.add(startNode);
        steps.add(new GraphStep(1, startNode, new ArrayList<>(visited), null, new HashMap<>()));

        while (!queue.isEmpty()) {
            int u = queue.poll();
            steps.add(new GraphStep(2, u, new ArrayList<>(visited), null, new HashMap<>()));
            steps.add(new GraphStep(3, u, new ArrayList<>(visited), null, new HashMap<>()));
            
            for (int v : adjList.getOrDefault(u, new ArrayList<>())) {
                steps.add(new GraphStep(3, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>()));
                steps.add(new GraphStep(4, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>()));
                
                if (!visited.contains(v)) {
                    visited.add(v);
                    queue.add(v);
                    steps.add(new GraphStep(5, v, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>()));
                }
            }
        }
        steps.add(new GraphStep(6, -1, new ArrayList<>(visited), null, new HashMap<>()));
        return steps;
    }

    // --- DFS ---
    public List<GraphStep> getDfsSteps(int startNode) {
        List<GraphStep> steps = new ArrayList<>();
        List<Integer> visited = new ArrayList<>();
        dfsRecursive(startNode, visited, steps);
        steps.add(new GraphStep(6, -1, new ArrayList<>(visited), null, new HashMap<>()));
        return steps;
    }

    private void dfsRecursive(int u, List<Integer> visited, List<GraphStep> steps) {
        steps.add(new GraphStep(1, u, new ArrayList<>(visited), null, new HashMap<>()));
        visited.add(u);
        steps.add(new GraphStep(2, u, new ArrayList<>(visited), null, new HashMap<>()));
        steps.add(new GraphStep(3, u, new ArrayList<>(visited), null, new HashMap<>()));

        for (int v : adjList.getOrDefault(u, new ArrayList<>())) {
            steps.add(new GraphStep(3, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>()));
            steps.add(new GraphStep(4, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>()));

            if (!visited.contains(v)) {
                steps.add(new GraphStep(5, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>()));
                dfsRecursive(v, visited, steps);
                steps.add(new GraphStep(3, u, new ArrayList<>(visited), null, new HashMap<>()));
            }
        }
    }

    // --- TOPOLOGICAL SORT ---
    public List<GraphStep> getTopoSteps() {
        List<GraphStep> steps = new ArrayList<>();
        List<Integer> visited = new ArrayList<>();
        Map<Integer, Integer> topoOrder = new HashMap<>();
        int[] nextIndex = {4}; // Start at 4 and count down to 0
        
        steps.add(new GraphStep(1, -1, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));

        for (int i = 0; i < 5; i++) {
            steps.add(new GraphStep(2, i, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
            steps.add(new GraphStep(3, i, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
            if (!visited.contains(i)) {
                topoDfsRecursive(i, visited, steps, topoOrder, nextIndex);
            }
        }
        steps.add(new GraphStep(0, -1, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
        return steps;
    }

    private void topoDfsRecursive(int u, List<Integer> visited, List<GraphStep> steps, Map<Integer, Integer> topoOrder, int[] nextIndex) {
        visited.add(u);
        steps.add(new GraphStep(4, u, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
        steps.add(new GraphStep(5, u, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
        
        for (int v : adjList.getOrDefault(u, new ArrayList<>())) {
            steps.add(new GraphStep(5, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>(topoOrder)));
            steps.add(new GraphStep(6, u, new ArrayList<>(visited), new int[]{u, v}, new HashMap<>(topoOrder)));
            
            if (!visited.contains(v)) {
                topoDfsRecursive(v, visited, steps, topoOrder, nextIndex);
                steps.add(new GraphStep(5, u, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
            }
        }
        
        // Lock in the red number!
        topoOrder.put(u, nextIndex[0]);
        nextIndex[0]--; 
        steps.add(new GraphStep(7, u, new ArrayList<>(visited), null, new HashMap<>(topoOrder)));
    }
}