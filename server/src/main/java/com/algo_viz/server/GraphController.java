package com.algo_viz.server;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @PostMapping("/api/graph/bfs")
    public List<GraphStep> getBfs() {
        // We will default to starting BFS from node 0 for now
        return graphService.getBfsSteps(0);
    }

    @PostMapping("/api/graph/dfs")
    public List<GraphStep> getDfs() {
        // Start DFS from node 0
        return graphService.getDfsSteps(0);
    }

    @PostMapping("/api/graph/topo")
    public List<GraphStep> getTopoSort() {
        return graphService.getTopoSteps();
    }
}